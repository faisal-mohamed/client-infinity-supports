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

    const assignment = await prisma.staffFormAssignment.findUnique({
      where: { id: assignmentIdNum },
      include: {
        form: {
          select: {
            id: true,
            formKey: true,
            title: true,
            version: true,
            requiresSignature: true,
          },
        },
        staff: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            email: true,
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(assignment);
  } catch (error: any) {
    console.error("Error fetching staff form assignment:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignment", details: error.message },
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
    // Step 1: Fetch assignment details with form information to get formKey
    const assignment = await prisma.staffFormAssignment.findUnique({
      where: { id: assignmentIdNum },
      include: {
        form: {
          select: {
            formKey: true,
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    const { staffId, formId, formVersion } = assignment;
    const formKey = assignment.form?.formKey;

    // Step 2: Fetch submission ID (if exists)
    // Note: StaffFormSubmission uses staffId_formKey as unique constraint, not staffId_formId_formVersion
    const submission = formKey ? await prisma.staffFormSubmission.findUnique({
      where: {
        staffId_formKey: {
          staffId,
          formKey: formKey,
        },
      },
      select: { id: true },
    }) : null;

    // Step 3: Build transaction
    const transactionSteps = [];

    if (submission) {
      const submissionId = submission.id;

      transactionSteps.push(
        prisma.staffSubmissionNotification.deleteMany({
          where: { formSubmissionId: submissionId },
        }),
        prisma.staffSignatureBatchForm.deleteMany({
          where: { formSubmissionId: submissionId },
        }),
        prisma.staffFormSubmission.delete({
          where: { id: submissionId },
        })
      );
    }

    transactionSteps.push(
      prisma.staffFormProgress.deleteMany({
        where: { staffId, formId, formVersion },
      }),
      prisma.staffFormAssignment.delete({
        where: { id: assignmentIdNum },
      })
    );

    // Step 4: Execute transaction
    await prisma.$transaction(transactionSteps);

    return NextResponse.json({
      success: true,
      message: "Form assignment deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting staff form assignment:", error);
    return NextResponse.json(
      { error: "Failed to delete assignment", details: error.message },
      { status: 500 }
    );
  }
}

