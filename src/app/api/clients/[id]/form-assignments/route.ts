import { NextRequest, NextResponse } from "next/server";
import { getClientById } from "@/lib/db/client";
import { getClientAssignments, getSubmission } from "@/lib/db/forms";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });

    const client = await getClientById(id);
    if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    const assignments = await getClientAssignments(id);

    // For each assignment, check if FormSubmission exists
    const assignmentsWithSubmissionStatus = await Promise.all(
      assignments.map(async (assignment) => {
        const submission = await getSubmission(
          assignment.clientId,
          assignment.formId,
          assignment.formVersion,
          assignment.instanceNumber
        );

        return {
          ...assignment,
          form: {
            id: assignment.formId,
            formKey: assignment.formKey,
            title: assignment.formTitle,
            version: assignment.formVersion,
            requiresSignature: assignment.requiresSignature,
          },
          hasSubmission: !!submission,
          submissionId: submission?.id,
          filledByAdmin: submission?.filledByAdmin || false,
          adminFilledAt: submission?.adminFilledAt,
          clientSignature: submission?.clientSignature,
          clientSignedAt: submission?.clientSignedAt,
          formData: submission?.data,
          isCompleted: assignment.isCompleted,
        };
      })
    );

    return NextResponse.json({
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        commonFields: client.commonFields || null,
      },
      assignments: assignmentsWithSubmissionStatus,
    });
  } catch (error: any) {
    console.error("Error fetching client form assignments:", error);
    return NextResponse.json({ error: "Failed to fetch client form assignments", details: error.message }, { status: 500 });
  }
}
