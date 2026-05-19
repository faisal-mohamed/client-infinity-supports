import { NextRequest, NextResponse } from "next/server";
import { getSubmissionById, updateSubmission, getClientAssignments, updateAssignmentStatus } from "@/lib/db/forms";
import { getFormConfig } from "@/app/forms/registry";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { formKey } = await request.json();

    if (!id || !formKey) {
      return NextResponse.json({ error: "Missing submissionId or formKey" }, { status: 400 });
    }

    const formSubmission = await getSubmissionById(id);
    if (!formSubmission) {
      return NextResponse.json({ error: "Form submission not found" }, { status: 404 });
    }

    // Find related assignment
    const assignments = await getClientAssignments(formSubmission.clientId);
    const formAssignment = assignments.find(
      (a) => a.formId === formSubmission.formId && a.formVersion === formSubmission.formVersion && a.instanceNumber === formSubmission.instanceNumber
    );

    if (!formAssignment) {
      return NextResponse.json({ error: "Related form assignment not found" }, { status: 404 });
    }

    const formConfig = getFormConfig(formKey);
    if (!formConfig || !formConfig.signatures) {
      return NextResponse.json({ error: "Form configuration not found or no signatures defined" }, { status: 400 });
    }

    const formData = { ...formSubmission.data };
    let signaturesCleared = 0;
    const clearedSignatures: string[] = [];

    formConfig.signatures.forEach((signature: any) => {
      const fieldKey = signature.dataKey || signature.id;
      if (formData && formData[fieldKey]) {
        delete formData[fieldKey];
        signaturesCleared++;
        clearedSignatures.push(signature.id);
      }
    });

    // Update submission
    await updateSubmission(id, formSubmission.clientId, formSubmission.formId, formSubmission.formVersion, formSubmission.instanceNumber, {
      data: formData,
      clientSignature: "false",
      clientSignedAt: undefined,
      isSubmitted: false,
      submittedAt: undefined,
    });

    // Update assignment status
    await updateAssignmentStatus(formSubmission.clientId, formAssignment.id, "in_progress", formAssignment.currentStatus);

    return NextResponse.json({
      success: true,
      message: `Cleared ${signaturesCleared} signature(s) from form`,
      signaturesCleared,
      clearedSignatures,
      formTitle: formAssignment.formTitle,
    });
  } catch (error) {
    console.error("Error clearing form signatures:", error);
    return NextResponse.json({ error: "Failed to clear form signatures" }, { status: 500 });
  }
}
