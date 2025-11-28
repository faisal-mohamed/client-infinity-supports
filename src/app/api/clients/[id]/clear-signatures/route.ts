import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFormConfig } from "@/app/forms/registry";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clientId = parseInt(id || "0");

    if (clientId === 0) {
      return NextResponse.json(
        { error: "Invalid client ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { type } = body; // 'common-fields' or 'form-edit'

    if (type === 'common-fields') {
      // Clear signatures from all forms for this client
      const formSubmissions : any = await prisma.formSubmission.findMany({
        where: { clientId },
        include: { form: true }
      });

      console.log("formSubmissions: ", formSubmissions);

      // Track forms that had signatures cleared and require status update
      const clearedFormsWithSignatures = [];
      const statusUpdatedAssignments = [];

      for (const submission of formSubmissions) {
        const formConfig = getFormConfig(submission.form.formKey);
        const signatures = formConfig?.signatures || [];
        
        if (signatures.length > 0) {
          // This form requires signatures
          const requiredSignatures = signatures.filter(sig => sig.required);
          
          // Clear signature data from form data
          const submissionData = submission.data;
          let updatedData: Record<string, any> = {};
          if (submissionData && typeof submissionData === 'object' && !Array.isArray(submissionData)) {
            updatedData = Object.assign({}, submissionData as Record<string, any>);
          }
          let hadSignatures = false;
          
          signatures.forEach(sig => {
            const dataKey = sig.dataKey || sig.id;
            if (updatedData[dataKey]) {
              updatedData[dataKey] = null;
              hadSignatures = true;
            }
          });
          
          // Update the submission
          await prisma.formSubmission.update({
            where: { id: submission.id },
            data: {
              data: updatedData,
              clientSignature: null,
              clientSignedAt: null
            }
          });

          // 🎯 UPDATE FORM ASSIGNMENT STATUS TO IN_PROGRESS
          // Find the corresponding FormAssignment
          const formAssignment = await prisma.formAssignment.findFirst({
            where: {
              clientId: clientId,
              formId: submission.formId,
              formVersion: submission.formVersion
            }
          });

          if (formAssignment && requiredSignatures.length > 0) {
            // Only update status if form has required signatures
            await prisma.formAssignment.update({
              where: { id: formAssignment.id },
              data: {
                currentStatus: "in_progress", // Reset to in_progress since signatures cleared
                isCompleted: false // Keep legacy field in sync
              }
            });

            statusUpdatedAssignments.push({
              assignmentId: formAssignment.id,
              formTitle: submission.form.title,
              formKey: submission.form.formKey,
              requiredSignatures: requiredSignatures.length
            });

            console.log(`🎯 Updated FormAssignment ${formAssignment.id} status to "in_progress" (signatures cleared)`);
          }

          clearedFormsWithSignatures.push({
            formId: submission.formId,
            formKey: submission.form.formKey,
            formTitle: submission.form.title,
            formVersion: submission.formVersion,
            requiredSignatures: requiredSignatures.length,
            hadSignatures: hadSignatures
          });
        }
      }

      return NextResponse.json({ 
        success: true, 
        message: "All client signatures cleared",
        clearedForms: formSubmissions.length,
        clearedFormsWithSignatures: clearedFormsWithSignatures.length,
        statusUpdatedAssignments: statusUpdatedAssignments.length,
        details: {
          clearedForms: clearedFormsWithSignatures,
          statusUpdates: statusUpdatedAssignments
        }
      });
    }

    return NextResponse.json(
      { error: "Invalid type parameter" },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("Error clearing signatures:", error);
    return NextResponse.json(
      { error: "Failed to clear signatures", details: error.message },
      { status: 500 }
    );
  }
}
