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
      const formSubmissions = await prisma.formSubmission.findMany({
        where: { clientId },
        include: { form: true }
      });

      for (const submission of formSubmissions) {
        const formConfig = getFormConfig(submission.form.formKey);
        const signatures = formConfig?.signatures || [];
        
        if (signatures.length > 0) {
          // Clear signature data from form data
          const updatedData = { ...submission.data };
          signatures.forEach(sig => {
            const dataKey = sig.dataKey || sig.id;
            if (updatedData[dataKey]) {
              updatedData[dataKey] = null;
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
        }
      }

      return NextResponse.json({ 
        success: true, 
        message: "All client signatures cleared",
        clearedForms: formSubmissions.length
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
