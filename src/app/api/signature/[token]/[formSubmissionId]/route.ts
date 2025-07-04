import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch individual form for signature
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string; formSubmissionId: string }> }
) {
  try {
    const { token, formSubmissionId } = await params;
    const formSubmissionIdNum = parseInt(formSubmissionId);

    if (!token || isNaN(formSubmissionIdNum)) {
      return NextResponse.json(
        { error: "Invalid token or form submission ID" },
        { status: 400 }
      );
    }

    // Find the signature batch and verify the form belongs to it
    const batch = await prisma.formBatch.findUnique({
      where: { 
        batchToken: token,
        isSignatureOnly: true,
      },
      include: {
        client: {
          select: {
            name: true,
            email: true,
          },
        },
        signatureForms: {
          where: {
            formSubmissionId: formSubmissionIdNum,
          },
          include: {
            formSubmission: {
              include: {
                form: {
                  select: {
                    formKey: true,
                    title: true,
                    schema: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!batch) {
      return NextResponse.json(
        { error: "Signature link not found" },
        { status: 404 }
      );
    }

    // Check if batch has expired
    if (batch.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "This signature link has expired" },
        { status: 410 }
      );
    }

    // Check if the form submission is part of this batch
    if (batch.signatureForms.length === 0) {
      return NextResponse.json(
        { error: "Form not found in this signature batch" },
        { status: 404 }
      );
    }

    const signatureForm = batch.signatureForms[0];

    return NextResponse.json({
      formSubmission: signatureForm.formSubmission,
      client: batch.client,
      batchToken: batch.batchToken,
      isExpired: batch.expiresAt < new Date(),
    });

  } catch (error: any) {
    console.error("Error fetching form for signature:", error);
    return NextResponse.json(
      { error: "Failed to fetch form data", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Submit signature for form
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string; formSubmissionId: string }> }
) {
  try {
    const { token, formSubmissionId } = await params;
    const formSubmissionIdNum = parseInt(formSubmissionId);
    const body = await req.json();
    const { signature } = body;

    if (!token || isNaN(formSubmissionIdNum) || !signature) {
      return NextResponse.json(
        { error: "Invalid token, form submission ID, or signature data" },
        { status: 400 }
      );
    }

    // Verify the signature batch and form
    const batch = await prisma.formBatch.findUnique({
      where: { 
        batchToken: token,
        isSignatureOnly: true,
      },
      include: {
        signatureForms: {
          where: {
            formSubmissionId: formSubmissionIdNum,
          },
        },
      },
    });

    if (!batch) {
      return NextResponse.json(
        { error: "Signature link not found" },
        { status: 404 }
      );
    }

    // Check if batch has expired
    if (batch.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "This signature link has expired" },
        { status: 410 }
      );
    }

    // Check if the form submission is part of this batch
    if (batch.signatureForms.length === 0) {
      return NextResponse.json(
        { error: "Form not found in this signature batch" },
        { status: 404 }
      );
    }

    // Update the FormSubmission with the client signature
    const updatedSubmission = await prisma.formSubmission.update({
      where: { id: formSubmissionIdNum },
      data: {
        clientSignature: signature,
        clientSignedAt: new Date(),
      },
    });

    // Log the signature activity
    await prisma.formActivityLog.create({
      data: {
        clientId: batch.clientId,
        logType: 'CLIENT',
        action: 'Form Signed',
        metadata: {
          formSubmissionId: formSubmissionIdNum,
          batchToken: token,
          signedAt: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Signature submitted successfully',
      signedAt: updatedSubmission.clientSignedAt,
    });

  } catch (error: any) {
    console.error("Error submitting signature:", error);
    return NextResponse.json(
      { error: "Failed to submit signature", details: error.message },
      { status: 500 }
    );
  }
}
