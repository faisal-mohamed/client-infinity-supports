import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFormConfig } from "@/app/forms/registry";
import { validateFormSignatures } from "@/lib/signatureValidation";

export async function GET(
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

    // Get all form submissions for this client
    const formSubmissions : any = await prisma.formSubmission.findMany({
      where: {
        clientId,
        OR: [
          { clientSignature: "true" },
          { clientSignature: "partial" }
        ]
      },
      include: {
        form: true
      }
    });

    // Filter to only include forms that actually have signature data
    const actuallySignedForms = [];
    
    for (const submission of formSubmissions) {
      const formConfig = getFormConfig(submission.form.formKey);
      const signatures = formConfig?.signatures || [];
      
      if (signatures.length > 0) {
        const validation = validateFormSignatures(submission.form.formKey, submission.data);
        if (validation.completedCount > 0) {
          actuallySignedForms.push({
            id: submission.form.id,
            title: submission.form.title,
            version: submission.form.version,
            formKey: submission.form.formKey,
            submissionId: submission.id
          });
        }
      }
    }
    
    return NextResponse.json({
      hasSignedForms: actuallySignedForms.length > 0,
      signedForms: actuallySignedForms
    });

  } catch (error: any) {
    console.error("Error checking signed forms:", error);
    return NextResponse.json(
      { error: "Failed to check signed forms", details: error.message },
      { status: 500 }
    );
  }
}
