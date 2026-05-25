import { NextRequest, NextResponse } from "next/server";
import { getClientById, updateClient, archiveClient } from "@/lib/db/client";
import { getClientSubmissions, updateSubmission, getClientAssignments, updateAssignmentStatus } from "@/lib/db/forms";
import { getAdminById } from "@/lib/db/admin";
import { getTenantContext, isTenantError } from "@/lib/tenant-context";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });

    const client = await getClientById(id);
    if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    // Ownership check: ensure client belongs to this org
    if (tenant.organizationId && client.organizationId && client.organizationId !== tenant.organizationId) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Fetch createdBy admin info if available
    let createdBy = null;
    if (client.createdById) {
      const admin = await getAdminById(client.createdById);
      if (admin) createdBy = { id: admin.id, name: admin.name, email: admin.email };
    }

    return NextResponse.json({
      ...client,
      commonFields: client.commonFields || null,
      createdBy,
    });
  } catch (error: any) {
    console.error("Error fetching client:", error);
    return NextResponse.json({ error: "Failed to fetch client", details: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });

    const body = await req.json();
    const { name, email, phone, commonFields } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const existing = await getClientById(id);
    if (!existing) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    // Ownership check
    if (tenant.organizationId && existing.organizationId && existing.organizationId !== tenant.organizationId) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Update client + common fields
    const updatedClient = await updateClient(id, { name, email, phone }, commonFields || undefined);

    // If common fields were updated, clear signatures from affected forms
    if (commonFields) {
      const { getFormConfig } = await import("@/app/forms/registry");
      const submissions = await getClientSubmissions(id);

      for (const submission of submissions) {
        const formConfig = getFormConfig(submission.formKey);
        const signatures = formConfig?.signatures || [];

        if (signatures.length > 0) {
          const updatedData = { ...submission.data };
          let hadSignatures = false;

          // Clear all signature fields from form data
          signatures.forEach((sig: any) => {
            const dataKey = sig.dataKey || sig.id;
            if (updatedData[dataKey]) {
              updatedData[dataKey] = null;
              hadSignatures = true;
            }
          });

          // Form-specific field clearing
          const formKey = submission.formKey;
          const clearFields: Record<string, string[]> = {
            home_visit_risk_assessment: ["designation", "signature"],
            sa_delivery_of_supports: ["participantName", "participantSignatureDate", "nomineeName", "nomineeSignatureDate", "providerName", "providerSignatureDate"],
            schedule_of_supports: ["participantName", "participantSignatureDate", "nomineeName", "nomineeSignatureDate", "representativeSignature", "representativeSignatureDate", "representativeName"],
            participant_risk_assessment: ["signature", "signatureDate", "guardianSignature", "guardianDate"],
            emergency_drill: ["supportWorkerSignature", "signatureDate", "supervisorSignature", "supervisorSignatureDate"],
            individual_risk_assessment: ["assessorSignature", "assessorSignatureDate", "assessorName"],
            welcome_form: ["signature", "date"],
            support_action_plan: ["authorSignature", "authorDate", "participantSignature", "participantDate"],
          };

          if (clearFields[formKey]) {
            clearFields[formKey].forEach((field) => {
              if (updatedData[field]) updatedData[field] = null;
            });
          }

          // Update submission: clear signatures
          await updateSubmission(
            submission.id,
            submission.clientId,
            submission.formId,
            submission.formVersion,
            submission.instanceNumber,
            { data: updatedData, clientSignature: undefined, clientSignedAt: undefined }
          );

          // Update assignment status to in_progress
          const assignments = await getClientAssignments(id);
          const matchingAssignment = assignments.find(
            (a) => a.formId === submission.formId && a.formVersion === submission.formVersion && a.instanceNumber === submission.instanceNumber
          );

          if (matchingAssignment && signatures.length > 0) {
            await updateAssignmentStatus(id, matchingAssignment.id, "in_progress", matchingAssignment.currentStatus);
          }
        }
      }
    }

    return NextResponse.json(updatedClient);
  } catch (error: any) {
    console.error("Error updating client:", error);
    return NextResponse.json({ error: "Failed to update client", details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });

    const existing = await getClientById(id);
    if (!existing) return NextResponse.json({ error: "Client not found" }, { status: 404 });
    if (existing.archivedAt) return NextResponse.json({ error: "Client is already archived" }, { status: 409 });

    // Ownership check
    if (tenant.organizationId && existing.organizationId && existing.organizationId !== tenant.organizationId) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    await archiveClient(id, tenant.adminId);

    return NextResponse.json({ success: true, message: "Client and all related data deleted successfully" });
  } catch (error: any) {
    console.error("Error archiving client:", error);
    return NextResponse.json({ error: "Failed to delete client", details: error.message }, { status: 500 });
  }
}
