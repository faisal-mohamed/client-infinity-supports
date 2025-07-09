import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getFormConfig } from '@/app/forms/registry';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submissionId = parseInt(params.id);
    const { formKey } = await request.json();

    if (!submissionId || !formKey) {
      return NextResponse.json(
        { error: 'Missing submissionId or formKey' },
        { status: 400 }
      );
    }

    // Get the form submission
    const formSubmission = await prisma.formSubmission.findUnique({
      where: { id: submissionId },
      include: {
        formAssignment: {
          include: {
            form: true
          }
        }
      }
    });

    if (!formSubmission) {
      return NextResponse.json(
        { error: 'Form submission not found' },
        { status: 404 }
      );
    }

    // Get form configuration to identify signature fields
    const formConfig = getFormConfig(formKey);
    if (!formConfig || !formConfig.signatures) {
      return NextResponse.json(
        { error: 'Form configuration not found or no signatures defined' },
        { status: 400 }
      );
    }

    // Parse existing form data
    let formData;
    try {
      formData = JSON.parse(formSubmission.formData);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid form data format' },
        { status: 400 }
      );
    }

    // Clear signature fields from form data
    let signaturesCleared = 0;
    const clearedSignatures: string[] = [];

    formConfig.signatures.forEach(signature => {
      const fieldKey = signature.dataKey || signature.id;
      if (formData[fieldKey]) {
        delete formData[fieldKey];
        signaturesCleared++;
        clearedSignatures.push(signature.id);
      }
    });

    // Update the form submission in database
    const updatedSubmission = await prisma.formSubmission.update({
      where: { id: submissionId },
      data: {
        formData: JSON.stringify(formData),
        clientSignature: "false", // Reset signature status
        clientSignedAt: null,     // Clear signature timestamp
      }
    });

    // Also update the form assignment status
    await prisma.formAssignment.update({
      where: { id: formSubmission.formAssignmentId },
      data: {
        clientSignature: "false",
        clientSignedAt: null,
      }
    });

    return NextResponse.json({
      success: true,
      message: `Cleared ${signaturesCleared} signature(s) from form`,
      signaturesCleared,
      clearedSignatures,
      formTitle: formSubmission.formAssignment.form.title
    });

  } catch (error) {
    console.error('Error clearing form signatures:', error);
    return NextResponse.json(
      { error: 'Failed to clear form signatures' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
