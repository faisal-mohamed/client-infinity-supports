import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params;
    const assignmentIdNum = parseInt(assignmentId);

    if (isNaN(assignmentIdNum)) {
      return NextResponse.json(
        { error: "Invalid assignment ID" },
        { status: 400 }
      );
    }

    // Get form assignment with related data
    const assignment = await prisma.formAssignment.findUnique({
      where: { id: assignmentIdNum },
      include: {
        form: {
          select: {
            id: true, // Include form ID for PDF generation
            formKey: true,
            title: true,
            version: true,
            schema: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
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

    // Get existing FormSubmission if it exists
    const existingSubmission = await prisma.formSubmission.findUnique({
      where: {
        clientId_formId_formVersion: {
          clientId: assignment.clientId,
          formId: assignment.formId,
          formVersion: assignment.formVersion,
        },
      },
      select: {
        id: true, // Include submission ID for PDF generation
        data: true,
        filledByAdmin: true,
        adminFilledAt: true,
        clientSignature: true,
        clientSignedAt: true,
      },
    });

    // Get client's common fields
    const commonFields = await prisma.commonField.findUnique({
      where: { clientId: assignment.clientId },
    });

    return NextResponse.json({
      assignment: {
        ...assignment,
        submissionData: existingSubmission?.data,
        submissionId: existingSubmission?.id, // Add submission ID for PDF generation
        clientSignature: existingSubmission?.clientSignature,
        clientSignedAt: existingSubmission?.clientSignedAt,
      },
      existingData: existingSubmission?.data || {},
      commonFields: commonFields || {},
    });

  } catch (error: any) {
    console.error("Error fetching form assignment:", error);
    return NextResponse.json(
      { error: "Failed to fetch form assignment", details: error.message },
      { status: 500 }
    );
  }
}




export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  const { assignmentId } = await params;
  const assignmentIdNum = parseInt(assignmentId);

  if (isNaN(assignmentIdNum)) {
    return NextResponse.json({ error: "Invalid assignment ID" }, { status: 400 });
  }

  try {
    // Step 1: Fetch assignment details
    const assignment = await prisma.formAssignment.findUnique({
      where: { id: assignmentIdNum },
      select: {
        clientId: true,
        formId: true,
        formVersion: true,
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    const { clientId, formId, formVersion } = assignment;

    // Step 2: Fetch formSubmission ID (if exists)
    const submission = await prisma.formSubmission.findUnique({
      where: {
        clientId_formId_formVersion: {
          clientId,
          formId,
          formVersion,
        },
      },
      select: { id: true },
    });

    // Step 3: Build transaction
    const transactionSteps = [];

    if (submission) {
      const submissionId = submission.id;

      transactionSteps.push(
        prisma.formSubmissionNotification.deleteMany({
          where: { formSubmissionId: submissionId },
        }),
        prisma.signatureBatchForm.deleteMany({
          where: { formSubmissionId: submissionId },
        }),
        prisma.formSubmission.delete({
          where: { id: submissionId },
        })
      );
    }

    transactionSteps.push(
      prisma.formProgress.deleteMany({
        where: { clientId, formId, formVersion },
      }),
      prisma.formAssignment.delete({
        where: { id: assignmentIdNum },
      })
    );

    // Step 4: Execute transaction
    await prisma.$transaction(transactionSteps);

    return NextResponse.json({
      success: true,
      message: "Form assignment and all linked data deleted",
    });
  } catch (error: any) {
    console.error("Error in DELETE assignment transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete form assignment", details: error.message },
      { status: 500 }
    );
  }
}
