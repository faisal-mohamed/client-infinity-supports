import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch specific form for signature
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string; formSubmissionId: string }> }
) {
  try {
    const { token, formSubmissionId } = await params;
    const formSubmissionIdInt = parseInt(formSubmissionId);

    if (!token || !formSubmissionIdInt) {
      return NextResponse.json(
        { error: "Token and form submission ID are required" },
        { status: 400 }
      );
    }

    // Find the signature batch and verify access
    const batch = await prisma.formBatch.findUnique({
      where: { 
        batchToken: token,
        isSignatureOnly: true,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        signatureForms: {
          where: {
            formSubmissionId: formSubmissionIdInt,
          },
          include: {
            formSubmission: {
              include: {
                form: {
                  select: {
                    id: true, // Include form ID for PDF generation
                    formKey: true,
                    title: true,
                    version: true,
                    schema: true,
                    requiresSignature: true,
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
        { error: "Signature link not found or form not accessible" },
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

    // Check if form exists in this batch
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

// POST - Submit signature for specific form
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string; formSubmissionId: string }> }
) {
  try {
    const { token, formSubmissionId } = await params;
    const formSubmissionIdInt = parseInt(formSubmissionId);
    const { signature } = await req.json();

    if (!token || !formSubmissionIdInt || !signature) {
      return NextResponse.json(
        { error: "Token, form submission ID, and signature are required" },
        { status: 400 }
      );
    }

    // Find and verify the signature batch
    const batch = await prisma.formBatch.findUnique({
      where: { 
        batchToken: token,
        isSignatureOnly: true,
      },
      include: {
        signatureForms: {
          include: {
            formSubmission: {
              include: {
                form: {
                  select: {
                    requiresSignature: true,
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

    // Verify the form exists in this batch
    const signatureForm = batch.signatureForms.find(
      sf => sf.formSubmissionId === formSubmissionIdInt
    );

    if (!signatureForm) {
      return NextResponse.json(
        { error: "Form not found in this signature batch" },
        { status: 404 }
      );
    }

    // Update the form submission with signature
    await prisma.formSubmission.update({
      where: { id: formSubmissionIdInt },
      data: {
        clientSignature: signature,
        clientSignedAt: new Date(),
      },
    });

    // Check if all required signatures in this batch are now complete
    const updatedBatch = await prisma.formBatch.findUnique({
      where: { id: batch.id },
      include: {
        signatureForms: {
          include: {
            formSubmission: {
              include: {
                form: {
                  select: {
                    requiresSignature: true,
                  },
                },
              },
            },
          },
        },
        client: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (updatedBatch) {
      // Check completion status
      const formsRequiringSignature = updatedBatch.signatureForms.filter(
        sf => sf.formSubmission.form.requiresSignature === true
      );
      
      const signedForms = formsRequiringSignature.filter(
        sf => sf.formSubmission.clientSignature !== null
      );

      const isNowComplete = formsRequiringSignature.length === signedForms.length && formsRequiringSignature.length > 0;

      // If batch is now complete and wasn't before, update it
      if (isNowComplete && !updatedBatch.isCompleted) {
        await prisma.formBatch.update({
          where: { id: batch.id },
          data: {
            isCompleted: true,
            completedAt: new Date(),
          },
        });

        // Log the completion activity
        await prisma.formActivityLog.create({
          data: {
            clientId: updatedBatch.clientId,
            logType: 'CLIENT',
            action: 'Signature Batch Completed',
            metadata: {
              batchId: batch.id,
              batchToken: batch.batchToken,
              clientName: updatedBatch.client.name,
              totalForms: formsRequiringSignature.length,
              completedAt: new Date().toISOString(),
            },
          },
        });

        // TODO: Here you can add email notification logic
        // await sendAdminNotification(updatedBatch);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Signature submitted successfully",
    });

  } catch (error: any) {
    console.error("Error submitting signature:", error);
    return NextResponse.json(
      { error: "Failed to submit signature", details: error.message },
      { status: 500 }
    );
  }
}

// Helper function for future email notifications
async function sendAdminNotification(batch: any) {
  // This will be implemented when you add email service
  console.log(`Batch ${batch.batchToken} completed for client ${batch.client.name}`);
  
  // Future implementation:
  // - Send email to admin
  // - Create in-app notification
  // - Update dashboard counters
}
