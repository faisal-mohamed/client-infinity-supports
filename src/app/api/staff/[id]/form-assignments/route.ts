import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Type for the assignment with included form data
type StaffAssignmentWithForm = {
  id: number;
  staffId: number;
  formId: number;
  formVersion: number;
  isCompleted: boolean;
  displayOrder: number | null;
  assignedAt: Date;
  assignedById: number | null;
  currentStatus: string;
  form: {
    id: number;
    formKey: string;
    title: string;
    version: number;
    requiresSignature: boolean | null;
  };
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staffId = parseInt(id);

    if (isNaN(staffId)) {
      return NextResponse.json(
        { error: "Invalid staff ID" },
        { status: 400 }
      );
    }

    // Get staff info
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: {
        id: true,
        firstName: true,
        surname: true,
        email: true,
        phone: true,
        commonFields: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            email: true,
            phone: true,
            address: true,
          }
        }
      },
    });

    if (!staff) {
      return NextResponse.json(
        { error: "Staff not found" },
        { status: 404 }
      );
    }

    // Get form assignments with related data
    const assignments = await prisma.staffFormAssignment.findMany({
      where: { staffId },
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
      },
      orderBy: [
        { displayOrder: 'asc' },
        { assignedAt: 'asc' },
      ],
    });

    // For each assignment, check if StaffFormSubmission exists
    // Note: StaffFormSubmission uses formKey, not formId/formVersion as unique constraint
    const assignmentsWithSubmissionStatus = await Promise.all(
      assignments.map(async (assignment: any) => {
        // Try to find submission by formKey (matching the form's formKey)
        const formKey = assignment.form?.formKey;
        const submission = formKey ? await prisma.staffFormSubmission.findUnique({
          where: {
            staffId_formKey: {
              staffId: staffId, // Use the staffId from the request, not from assignment
              formKey: formKey,
            },
          },
          select: {
            id: true,
            data: true,
            filledByAdmin: true,
            adminFilledAt: true,
            staffSignature: true,
            staffSignedAt: true,
          },
        }) : null;

        return {
          id: assignment.id,
          formId: assignment.formId,
          formVersion: assignment.formVersion,
          assignedAt: assignment.assignedAt.toISOString(),
          displayOrder: assignment.displayOrder ?? 0,
          isCompleted: assignment.isCompleted,
          form: {
            id: assignment.form.id,
            formKey: assignment.form.formKey,
            title: assignment.form.title,
            version: assignment.form.version,
            requiresSignature: assignment.form.requiresSignature ?? false,
          },
          hasSubmission: !!submission,
          submissionId: submission?.id,
          filledByAdmin: submission?.filledByAdmin || false,
          adminFilledAt: submission?.adminFilledAt?.toISOString(),
          staffSignature: submission?.staffSignature,
          staffSignedAt: submission?.staffSignedAt?.toISOString(),
          formData: submission?.data,
          currentStatus: assignment.currentStatus || 'not_started',
        };
      })
    );

    return NextResponse.json({
      staff,
      assignments: assignmentsWithSubmissionStatus,
    });

  } catch (error: any) {
    console.error("Error fetching staff form assignments:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error details:", error);
    return NextResponse.json(
      { error: "Failed to fetch staff form assignments", details: errorMessage, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined },
      { status: 500 }
    );
  }
}

