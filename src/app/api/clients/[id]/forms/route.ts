import { NextRequest, NextResponse } from "next/server";
import { getClientAssignments, getClientSubmissions } from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const [formAssignments, formSubmissions] = await Promise.all([
      getClientAssignments(id),
      getClientSubmissions(id),
    ]);

    const assignedForms = formAssignments.map((assignment) => {
      const submission = formSubmissions.find(
        (sub) => sub.formId === assignment.formId
      );

      return {
        id: assignment.id,
        clientId: assignment.clientId,
        formId: assignment.formId,
        formVersion: assignment.formVersion,
        isSubmitted: submission?.isSubmitted || false,
        createdAt: assignment.assignedAt,
        form: {
          id: assignment.formId,
          formKey: assignment.formKey,
          title: assignment.formTitle,
          version: assignment.formVersion,
          requiresSignature: assignment.requiresSignature,
        },
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
