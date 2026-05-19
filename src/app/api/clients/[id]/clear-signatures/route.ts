import { NextRequest, NextResponse } from "next/server";
import { getClientSubmissions, getClientAssignments, updateSubmission, updateAssignmentStatus } from "@/lib/db";
import { getFormConfig } from "@/app/forms/registry";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Invalid client ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { type } = body;

    if (type === 'common-fields') {
      const [formSubmissions, assignments] = await Promise.all([
        getClientSubmissions(id),
        getClientAssignments(id),
      ]);

      const clearedFormsWithSignatures: any[] = [];
      const statusUpdatedAssignments: any[] = [];

      for (const submission of formSubmissions) {
        const formConfig = getFormConfig(submission.formKey);
        const signatures = formConfig?.signatures || [];

        if (signatures.length > 0) {
          const requiredSignatures = signatures.filter((sig: any) => sig.required);
          const updatedData = { ...submission.data };
          let hadSignatures = false;

          signatures.forEach((sig: any) => {
            const dataKey = sig.dataKey || sig.id;
            if (updatedData[dataKey]) {
              updatedData[dataKey] = null;
              hadSignatures = true;
            }
          });

          await updateSubmission(
            submission.id,
            id,
            submission.formId,
            submission.formVersion,
            submission.instanceNumber,
            { data: updatedData, clientSignature: undefined, clientSignedAt: undefined }
          );

          // Find corresponding assignment
          const formAssignment = assignments.find(
            (a) => a.formId === submission.formId && a.formVersion === submission.formVersion
          );

          if (formAssignment && requiredSignatures.length > 0) {
            await updateAssignmentStatus(id, formAssignment.id, "in_progress", formAssignment.currentStatus);

            statusUpdatedAssignments.push({
              assignmentId: formAssignment.id,
              formTitle: submission.formTitle,
              formKey: submission.formKey,
              requiredSignatures: requiredSignatures.length,
            });
          }

          clearedFormsWithSignatures.push({
            formId: submission.formId,
            formKey: submission.formKey,
            formTitle: submission.formTitle,
            formVersion: submission.formVersion,
            requiredSignatures: requiredSignatures.length,
            hadSignatures,
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
          statusUpdates: statusUpdatedAssignments,
        },
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
