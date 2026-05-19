import { NextRequest, NextResponse } from "next/server";
import { getClientSubmissions } from "@/lib/db";
import { getFormConfig } from "@/app/forms/registry";
import { validateFormSignatures } from "@/lib/signatureValidation";

export async function GET(
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

    const formSubmissions = await getClientSubmissions(id);

    // Filter to submissions with client signature
    const signedSubmissions = formSubmissions.filter(
      (s) => s.clientSignature === "true" || s.clientSignature === "partial"
    );

    const actuallySignedForms = [];

    for (const submission of signedSubmissions) {
      const formConfig = getFormConfig(submission.formKey);
      const signatures = formConfig?.signatures || [];

      if (signatures.length > 0) {
        const validation = validateFormSignatures(submission.formKey, submission.data);
        if (validation.completedCount > 0) {
          actuallySignedForms.push({
            id: submission.formId,
            title: submission.formTitle,
            version: submission.formVersion,
            formKey: submission.formKey,
            submissionId: submission.id,
          });
        }
      }
    }

    return NextResponse.json({
      hasSignedForms: actuallySignedForms.length > 0,
      signedForms: actuallySignedForms,
    });
  } catch (error: any) {
    console.error("Error checking signed forms:", error);
    return NextResponse.json(
      { error: "Failed to check signed forms", details: error.message },
      { status: 500 }
    );
  }
}
