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
            id: true,
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
        id: true,
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
