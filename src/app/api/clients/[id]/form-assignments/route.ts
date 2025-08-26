import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Type for the assignment with included form data
type AssignmentWithForm = {
  id: number;
  clientId: number;
  formId: number;
  formVersion: number;
  isCompleted: boolean;
  displayOrder: number | null;
  assignedAt: Date;
  assignedById: number | null;
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
    const clientId = parseInt(id);

    if (isNaN(clientId)) {
      return NextResponse.json(
        { error: "Invalid client ID" },
        { status: 400 }
      );
    }

    // Get client info with common fields
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        commonFields: {
          select: {
            id: true,
            name: true,
            age: true,
            email: true,
            sex: true,
            street: true,
            state: true,
            postCode: true,
            dob: true,
            ndis: true,
            disability: true,
            address: true,
            phone: true,
            surname: true
          }
        }
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Get form assignments with related data
    const assignments = await prisma.formAssignment.findMany({
      where: { clientId },
      include: {
        form: {
          select: {
            id: true,
            formKey: true,
            title: true,
            version: true,
            requiresSignature: true, // Include signature requirement from database
          },
        },
      },
      orderBy: [
        { displayOrder: 'asc' },
        { assignedAt: 'asc' },
      ],
    });

    // For each assignment, check if FormSubmission exists
    const assignmentsWithSubmissionStatus = await Promise.all(
      assignments.map(async (assignment: AssignmentWithForm) => {
        const submission = await prisma.formSubmission.findUnique({
          where: {
            clientId_formId_formVersion: {
              clientId: assignment.clientId,
              formId: assignment.formId,
              formVersion: assignment.formVersion,
            },
          },
          select: {
            id: true,
            data: true, // Include form data for signature validation
            filledByAdmin: true,
            adminFilledAt: true,
            clientSignature: true,
            clientSignedAt: true,
          },
        });

        return {
          ...assignment,
          hasSubmission: !!submission,
          submissionId: submission?.id,
          filledByAdmin: submission?.filledByAdmin || false,
          adminFilledAt: submission?.adminFilledAt,
          clientSignature: submission?.clientSignature,
          clientSignedAt: submission?.clientSignedAt,
          formData: submission?.data, // Include form data for signature validation
          // Include isCompleted from FormAssignment
          isCompleted: assignment.isCompleted,
        };
      })
    );

    return NextResponse.json({
      client,
      assignments: assignmentsWithSubmissionStatus,
    });

  } catch (error) {
    console.error("Error fetching client form assignments:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to fetch client form assignments", details: errorMessage },
      { status: 500 }
    );
  }
}
