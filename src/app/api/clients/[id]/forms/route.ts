import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }  // params is now a Promise
) {
  try {
    const { id } = await context.params;  // await params here
    const clientId = parseInt(id || "0");

    // Get all form assignments for this client
    const formAssignments = await prisma.formAssignment.findMany({
      where: {
        clientId,
      },
      include: {
        form: true,
      },
      orderBy: {
        assignedAt: "desc",
      },
    });

    // Get form submissions for this client
    const formSubmissions = await prisma.formSubmission.findMany({
      where: {
        clientId,
      },
    });

    // Combine assignments with submission status
    const assignedForms = formAssignments.map((assignment: any) => {
      const submission = formSubmissions.find(
        (sub: any) => sub.formId === assignment.formId
      );

      return {
        id: assignment.id,
        clientId: assignment.clientId,
        formId: assignment.formId,
        formVersion: assignment.formVersion,
        isSubmitted: submission?.isSubmitted || false,
        createdAt: assignment.assignedAt,
        //updatedAt: assignment.updatedAt,
        form: assignment.form,
      };
    });

    return NextResponse.json(assignedForms);
  } catch (error) {
    console.error("Error fetching client forms:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to fetch client forms", details: errorMessage },
      { status: 500 }
    );
  }
}
