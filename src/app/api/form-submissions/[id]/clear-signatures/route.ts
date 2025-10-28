import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getFormConfig } from '@/app/forms/registry';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const submissionId = parseInt(id);
    const { formKey } = await request.json();

    if (!submissionId || !formKey) {
      return NextResponse.json(
        { error: 'Missing submissionId or formKey' },
        { status: 400 }
      );
    }

    // 1. Get the form submission first
    const formSubmission = await prisma.formSubmission.findUnique({
      where: { id: submissionId },
      // NO formAssignment include here, as it doesn't exist
    });

    if (!formSubmission) {
      return NextResponse.json(
        { error: 'Form submission not found' },
        { status: 404 }
      );
    }

    // 2. Then, find the related FormAssignment using the submission's details
    // Assuming there's a unique assignment for this client, form, and version
    const formAssignment = await prisma.formAssignment.findUnique({
      where: {
        clientId_formId_formVersion: { // Using the unique composite key
          clientId: formSubmission.clientId,
          formId: formSubmission.formId,
          formVersion: formSubmission.formVersion,
        }
      },
      include: {
        form: true // Include the MasterForm details
      }
    });

    if (!formAssignment) {
        return NextResponse.json(
            { error: 'Related form assignment not found' },
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

    // Parse existing form data (assuming 'data' field is used for form data)
    let formData : any;
    try {
      formData = formSubmission.data; // Use 'data' field, not 'formData'
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
      if (formData && typeof formData === 'object' && formData[fieldKey]) { // Added safety checks
        delete formData[fieldKey];
        signaturesCleared++;
        clearedSignatures.push(signature.id);
      }
    });

    // Update the form submission in database
    const updatedSubmission = await prisma.formSubmission.update({
      where: { id: submissionId },
      data: {
        data: formData, // Update the 'data' field
        clientSignature: "false", // Reset signature status
        clientSignedAt: null,     // Clear signature timestamp
      }
    });

    // Also update the form assignment status
    await prisma.formAssignment.update({
      where: { id: formAssignment.id }, // Use the ID of the found assignment
      data: {
        isCompleted: false, // Assuming clearing signatures means it's no longer completed
        // clientSignature: "false", // These fields don't exist on FormAssignment model based on your schema
        // clientSignedAt: null,     // These fields don't exist on FormAssignment model based on your schema
      }
    });

    return NextResponse.json({
      success: true,
      message: `Cleared ${signaturesCleared} signature(s) from form`,
      signaturesCleared,
      clearedSignatures,
      formTitle: formAssignment.form.title // Use formAssignment.form.title
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
