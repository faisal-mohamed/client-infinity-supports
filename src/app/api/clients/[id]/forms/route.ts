import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = parseInt(params.id || "0");

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
    const assignedForms = formAssignments.map((assignment) => {
      const submission = formSubmissions.find(
        (sub) => sub.formId === assignment.formId
      );
      
      return {
        id: assignment.id,
        clientId: assignment.clientId,
        formId: assignment.formId,
        formVersion: assignment.formVersion,
        expiresAt: assignment.expiresAt,
        isSubmitted: submission?.isSubmitted || false,
        createdAt: assignment.assignedAt,
        //updatedAt: assignment.updatedAt,
        form: assignment.form,
      };
    });

    return NextResponse.json(assignedForms);
  } catch (error: any) {
    console.error("Error fetching client forms:", error);
    return NextResponse.json(
      { error: "Failed to fetch client forms", details: error.message },
      { status: 500 }
    );
  }
}
