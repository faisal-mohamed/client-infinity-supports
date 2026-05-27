import { NextRequest, NextResponse } from "next/server";
import { findAssignmentById, getSubmission, upsertSubmission, updateAssignmentStatus } from "@/lib/db/forms";
import { updateCommonFields, getClientById } from "@/lib/db/client";
import { validateFormSignatures } from "@/lib/signatureValidation";
import { getFormSignatures } from "@/app/forms/registry";
import { getTenantContext, isTenantError } from "@/lib/tenant-context";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const { assignmentId } = await params;
    if (!assignmentId) return NextResponse.json({ error: "Invalid assignment ID" }, { status: 400 });

    const body = await req.json();
    const { formData, commonFieldsData } = body;

    const assignment = await findAssignmentById(assignmentId);
    if (!assignment) return NextResponse.json({ error: "Form assignment not found" }, { status: 404 });

    // Ownership check
    if (tenant.organizationId && assignment.clientId) {
      const client = await getClientById(assignment.clientId);
      if (client?.organizationId && client.organizationId !== tenant.organizationId) {
        return NextResponse.json({ error: "Form assignment not found" }, { status: 404 });
      }
    }

    const formKey = assignment.formKey;

    // Check existing submission for signature state
    const existingSubmission = await getSubmission(
      assignment.clientId, assignment.formId, assignment.formVersion, assignment.instanceNumber
    );

    // Validate signatures
    const signatureValidation = validateFormSignatures(formKey, formData);
    const hasAllSignatures = signatureValidation.isComplete;

    let clientSignature: string | undefined = undefined;
    let clientSignedAt: string | undefined = undefined;

    // Clear signatures if form was previously completed (re-edit scenario)
    if (assignment.currentStatus === "completed") {
      const signatureConfigs = getFormSignatures(formKey) || [];
      const signatureFields = signatureConfigs.map((sig: any) => sig.dataKey).filter(Boolean);
      const signedAtFields = signatureConfigs.map((sig: any) => sig.signedAtKey).filter(Boolean);

      signatureFields.forEach((key: any) => { if (key in formData) delete formData[key]; });
      signedAtFields.forEach((key: any) => { if (key in formData) delete formData[key]; });

      clientSignature = undefined;
      clientSignedAt = undefined;
    } else if (hasAllSignatures) {
      clientSignature = "true";
      clientSignedAt = new Date().toISOString();
    }

    // Cleanup conditional fields for support_action_plan
    if (formKey === "support_action_plan") {
      if (formData.capacityAssessmentRequired !== "Yes") formData.capacityActions = "";
      if (formData.additionalAssessment1 !== "Yes") formData.assessmentActions1 = "";
      if (formData.additionalAssessment2 !== "Yes") formData.assessmentActions2 = "";
    }

    // Upsert submission
    const formSubmission = await upsertSubmission({
      clientId: assignment.clientId,
      formId: assignment.formId,
      formVersion: assignment.formVersion,
      instanceNumber: assignment.instanceNumber,
      data: formData,
      filledByAdmin: true,
      adminFilledAt: new Date().toISOString(),
      isSubmitted: false,
      clientSignature,
      clientSignedAt,
      formKey: assignment.formKey,
      formTitle: assignment.formTitle,
    });

    // Update common fields if provided
    if (commonFieldsData && Object.keys(commonFieldsData).length > 0) {
      const allowedCommonFields = ["name", "age", "email", "sex", "street", "state", "postCode", "dob", "ndis", "disability", "address", "phone"];
      const filtered = Object.keys(commonFieldsData)
        .filter((key) => allowedCommonFields.includes(key))
        .reduce((obj, key) => { obj[key] = commonFieldsData[key]; return obj; }, {} as any);

      if (Object.keys(filtered).length > 0) {
        await updateCommonFields(assignment.clientId, filtered);
      }
    }

    // Always set status to in_progress on save
    const oldStatus = assignment.currentStatus;
    if (oldStatus !== "in_progress") {
      await updateAssignmentStatus(assignment.clientId, assignmentId, "in_progress", oldStatus);
    }

    return NextResponse.json({
      success: true,
      submissionId: formSubmission.id,
      currentStatus: "in_progress",
      signatureStatus: {
        isComplete: signatureValidation.isComplete,
        completedCount: signatureValidation.completedCount,
        totalRequired: signatureValidation.totalRequired,
        completedSignatures: signatureValidation.completedSignatures,
        missingSignatures: signatureValidation.missingSignatures,
      },
      message: hasAllSignatures
        ? `Form completed with all ${signatureValidation.totalRequired} signature(s)`
        : signatureValidation.totalRequired > 0
          ? `Form saved - ${signatureValidation.missingSignatures.length} signature(s) remaining`
          : "Form saved successfully",
    });
  } catch (error: any) {
    console.error("Error saving form data:", error);
    return NextResponse.json({ error: "Failed to save form data", details: error.message }, { status: 500 });
  }
}
