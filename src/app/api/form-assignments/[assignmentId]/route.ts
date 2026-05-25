import { NextRequest, NextResponse } from "next/server";
import { findAssignmentById, getSubmission, archiveAssignment } from "@/lib/db/forms";
import { getClientById } from "@/lib/db/client";
import { getTenantContext, isTenantError } from "@/lib/tenant-context";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const { assignmentId } = await params;
    if (!assignmentId) return NextResponse.json({ error: "Invalid assignment ID" }, { status: 400 });

    const assignment = await findAssignmentById(assignmentId);
    if (!assignment) return NextResponse.json({ error: "Form assignment not found" }, { status: 404 });

    // Ownership check via client
    if (tenant.organizationId && assignment.clientId) {
      const client = await getClientById(assignment.clientId);
      if (client?.organizationId && client.organizationId !== tenant.organizationId) {
        return NextResponse.json({ error: "Form assignment not found" }, { status: 404 });
      }
    }

    // Get existing submission
    const existingSubmission = await getSubmission(
      assignment.clientId,
      assignment.formId,
      assignment.formVersion,
      assignment.instanceNumber
    );

    // Get client info
    const client = await getClientById(assignment.clientId);

    return NextResponse.json({
      assignment: {
        ...assignment,
        form: {
          id: assignment.formId,
          formKey: assignment.formKey,
          title: assignment.formTitle,
          version: assignment.formVersion,
          schema: null, // Schema fetched separately via /api/forms/[id]
        },
        client: client ? { id: client.id, name: client.name, email: client.email } : null,
        hasSubmission: !!existingSubmission,
        filledByAdmin: existingSubmission?.filledByAdmin || false,
        submissionData: existingSubmission?.data,
        submissionId: existingSubmission?.id,
        clientSignature: existingSubmission?.clientSignature,
        clientSignedAt: existingSubmission?.clientSignedAt,
      },
      existingData: existingSubmission?.data || {},
      commonFields: client?.commonFields || {},
    });
  } catch (error: any) {
    console.error("Error fetching form assignment:", error);
    return NextResponse.json({ error: "Failed to fetch form assignment", details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params;
    if (!assignmentId) return NextResponse.json({ error: "Invalid assignment ID" }, { status: 400 });

    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const assignment = await findAssignmentById(assignmentId);
    if (!assignment) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    if (assignment.archivedAt) return NextResponse.json({ error: "Assignment is already archived" }, { status: 409 });

    // Ownership check
    if (tenant.organizationId && assignment.clientId) {
      const client = await getClientById(assignment.clientId);
      if (client?.organizationId && client.organizationId !== tenant.organizationId) {
        return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
      }
    }

    await archiveAssignment(assignment.clientId, assignmentId, tenant.adminId);

    return NextResponse.json({ success: true, message: "Form assignment and all linked data deleted" });
  } catch (error: any) {
    console.error("Error archiving form assignment:", error);
    return NextResponse.json({ error: "Failed to delete form assignment", details: error.message }, { status: 500 });
  }
}
