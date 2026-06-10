import { NextRequest, NextResponse } from "next/server";
import { getBatchByToken, getSignatureBatchForms, getSubmissionById, getFormById } from "@/lib/db/forms";
import { getClientById } from "@/lib/db/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    const batch = await getBatchByToken(token);

    if (!batch || !batch.isSignatureOnly) {
      return NextResponse.json(
        { error: "Signature link not found" },
        { status: 404 }
      );
    }

    if (new Date(batch.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "This signature link has expired" },
        { status: 410 }
      );
    }

    const client = await getClientById(batch.clientId);
    const signatureForms = await getSignatureBatchForms(batch.id);

    // Enrich signature forms with submission and form data
    const enrichedForms = await Promise.all(
      signatureForms.map(async (sf: any) => {
        const formSubmission = await getSubmissionById(sf.formSubmissionId);
        let form = null;
        if (formSubmission) {
          form = await getFormById(formSubmission.formId);
        }
        return {
          ...sf,
          formSubmission: formSubmission ? {
            ...formSubmission,
            form: form ? {
              id: form.id,
              formKey: form.formKey,
              title: form.title,
              version: form.version,
              requiresSignature: form.requiresSignature,
            } : null,
          } : null,
        };
      })
    );

    const formsRequiringSignature = enrichedForms.filter(
      sf => sf.formSubmission?.form?.requiresSignature === true
    );

    const formsNotRequiringSignature = enrichedForms.filter(
      sf => sf.formSubmission?.form?.requiresSignature !== true
    );

    const signedForms = formsRequiringSignature.filter(
      sf => sf.formSubmission?.clientSignature === "true"
    );

    const completionStatus = {
      totalForms: enrichedForms.length,
      formsRequiringSignature: formsRequiringSignature.length,
      formsNotRequiringSignature: formsNotRequiringSignature.length,
      signedForms: signedForms.length,
      isComplete: formsRequiringSignature.length > 0 && signedForms.length === formsRequiringSignature.length,
    };

    return NextResponse.json({
      id: batch.id,
      batchToken: batch.batchToken,
      expiresAt: new Date(batch.expiresAt).toISOString(),
      isCompleted: batch.isCompleted,
      completedAt: batch.completedAt ? new Date(batch.completedAt).toISOString() : null,
      client: client ? { id: client.id, name: client.name, email: client.email } : null,
      signatureForms: enrichedForms,
      formsRequiringSignature,
      formsNotRequiringSignature,
      completionStatus,
    });

  } catch (error: any) {
    console.error("Error fetching signature batch:", error);
    return NextResponse.json(
      { error: "Failed to fetch signature batch", details: error.message },
      { status: 500 }
    );
  }
}
