import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    // Find the signature batch
    const batch = await prisma.formBatch.findUnique({
      where: { 
        batchToken: token,
        isSignatureOnly: true, // Ensure this is a signature-only batch
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
          include: {
            formSubmission: {
              include: {
                form: {
                  select: {
                    id: true, // Include form ID for PDF generation
                    formKey: true,
                    title: true,
                    version: true,
                    requiresSignature: true, // Include signature requirement
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'asc', // Maintain consistent order
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
        { status: 410 } // Gone
      );
    }

    // Separate forms by signature requirement
    const formsRequiringSignature = batch.signatureForms.filter(
      sf => sf.formSubmission.form.requiresSignature === true
    );
    
    const formsNotRequiringSignature = batch.signatureForms.filter(
      sf => sf.formSubmission.form.requiresSignature !== true
    );

    // Calculate completion status
    const signedForms = formsRequiringSignature.filter(
      sf => sf.formSubmission.clientSignature !== null
    );

    const completionStatus = {
      totalForms: batch.signatureForms.length,
      formsRequiringSignature: formsRequiringSignature.length,
      formsNotRequiringSignature: formsNotRequiringSignature.length,
      signedForms: signedForms.length,
      isComplete: formsRequiringSignature.length > 0 && signedForms.length === formsRequiringSignature.length,
    };

    // Return batch data with enhanced information
    return NextResponse.json({
      id: batch.id,
      batchToken: batch.batchToken,
      expiresAt: batch.expiresAt.toISOString(),
      isCompleted: batch.isCompleted,
      completedAt: batch.completedAt?.toISOString(),
      client: batch.client,
      signatureForms: batch.signatureForms,
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
