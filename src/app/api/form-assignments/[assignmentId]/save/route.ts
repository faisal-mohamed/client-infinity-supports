import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateFormSignatures } from "@/lib/signatureValidation";
import { getFormSignatures } from "@/app/forms/registry"; // Adjust this import path based on your project structure

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params;
    const assignmentIdNum = parseInt(assignmentId);
    const body = await req.json();
    const { formData, commonFieldsData } = body;

    if (isNaN(assignmentIdNum)) {
      return NextResponse.json(
        { error: "Invalid assignment ID" },
        { status: 400 }
      );
    }

    // Get form assignment with form details
    const assignment = await prisma.formAssignment.findUnique({
      where: { id: assignmentIdNum },
      include: {
        form: {
          select: {
            id: true,
            formKey: true,
            title: true,
            version: true,
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Form assignment not found" },
        { status: 404 }
      );
    }

    // Fetch existing submission to check if it was already signed
    const existingSubmission = await prisma.formSubmission.findUnique({
      where: {
        clientId_formId_formVersion: {
          clientId: assignment.clientId,
          formId: assignment.formId,
          formVersion: assignment.formVersion,
        },
      },
    });

    const formKey = assignment.form.formKey;

    // Validate signature status based on new formData
    const signatureValidation = validateFormSignatures(formKey, formData);
    const hasAllSignatures = signatureValidation.isComplete;

    let clientSignature = null;
    let clientSignedAt = null;

    // ✅ Reset signature if form was already signed
    if (existingSubmission?.clientSignature === "true") {
      // Get all signature dataKeys from form registry
      const signatureFields = getFormSignatures(formKey)
        .map((sig : any)  => sig.dataKey)
        .filter(Boolean);

      // Remove signature fields from formData
      signatureFields.forEach((key : any) => {
        if (key in formData) {
          formData[key] = null; // Or use: delete formData[key]
        }
      });

      clientSignature = null;
      clientSignedAt = null;
    } else if (hasAllSignatures) {
      clientSignature = "true";
      clientSignedAt = new Date();
    }

    const newStatus = "in_progress"; // Always in_progress for saves

    // Upsert form submission
    const formSubmission = await prisma.formSubmission.upsert({
      where: {
        clientId_formId_formVersion: {
          clientId: assignment.clientId,
          formId: assignment.formId,
          formVersion: assignment.formVersion,
        },
      },
      create: {
        clientId: assignment.clientId,
        formId: assignment.formId,
        formVersion: assignment.formVersion,
        data: formData,
        filledByAdmin: true,
        adminFilledAt: new Date(),
        isSubmitted: false,
        submittedAt: null,
        clientSignature,
        clientSignedAt,
      },
      update: {
        data: formData,
        filledByAdmin: true,
        adminFilledAt: new Date(),
        isSubmitted: false,
        submittedAt: null,
        updatedAt: new Date(),
        clientSignature,
        clientSignedAt,
      },
    });

    // Update common fields (only valid ones)
    if (commonFieldsData && Object.keys(commonFieldsData).length > 0) {
      const allowedCommonFields = [
        'name', 'age', 'email', 'sex', 'street', 'state', 'postCode',
        'dob', 'ndis', 'disability', 'address', 'phone'
      ];

      const filteredCommonFields = Object.keys(commonFieldsData)
        .filter(key => allowedCommonFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = commonFieldsData[key];
          return obj;
        }, {} as any);

      if (Object.keys(filteredCommonFields).length > 0) {
        await prisma.commonField.upsert({
          where: { clientId: assignment.clientId },
          create: {
            clientId: assignment.clientId,
            ...filteredCommonFields,
          },
          update: {
            ...filteredCommonFields,
            updatedAt: new Date(),
          },
        });
      }
    }

    // Update FormAssignment status
    await prisma.formAssignment.update({
      where: { id: assignmentIdNum },
      data: {
        currentStatus: newStatus,
        isCompleted: false,
      },
    });

    return NextResponse.json({
      success: true,
      submissionId: formSubmission.id,
      currentStatus: newStatus,
      signatureStatus: {
        isComplete: signatureValidation.isComplete,
        completedCount: signatureValidation.completedCount,
        totalRequired: signatureValidation.totalRequired,
        completedSignatures: signatureValidation.completedSignatures,
        missingSignatures: signatureValidation.missingSignatures,
      },
      message: hasAllSignatures
        ? `Form completed with all ${signatureValidation.totalRequired} signature(s)`
        : signatureValidation.totalRequired > 0
          ? `Form saved - ${signatureValidation.missingSignatures.length} signature(s) remaining`
          : 'Form saved successfully',
    });

  } catch (error: any) {
    console.error("Error saving form data:", error);
    return NextResponse.json(
      { error: "Failed to save form data", details: error.message },
      { status: 500 }
    );
  }
}
