import { NextRequest, NextResponse } from "next/server";
import { findAssignmentById, getSubmission, upsertSubmission, updateAssignmentStatus, getBatchAssignments, updateBatch, getFormById } from "@/lib/db/forms";
import { getClientById, updateCommonFields } from "@/lib/db/client";
import { getAllAdmins } from "@/lib/db/admin";
import { createNotification } from "@/lib/db/notifications";
import { createActivityLog } from "@/lib/db/audit";
import { validateFormSignatures } from "@/lib/signatureValidation";
import { generatePDFBuffer } from "@/lib/pdf-buffer";
import { uploadBatchToDrive } from "@/lib/google-drive";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params;
    if (!assignmentId) return NextResponse.json({ error: "Invalid assignment ID" }, { status: 400 });

    const body = await req.json();
    const { formData, commonFieldsData } = body;

    const assignment = await findAssignmentById(assignmentId);
    if (!assignment) return NextResponse.json({ error: "Form assignment not found" }, { status: 404 });

    const previousStatus = assignment.currentStatus;
    const adminId = assignment.assignedById;

    // Validate signatures
    const signatureValidation = validateFormSignatures(assignment.formKey, formData);
    const hasAllSignatures = signatureValidation.isComplete;

    let clientSignature: string | undefined = undefined;
    let clientSignedAt: string | undefined = undefined;

    if (hasAllSignatures) {
      clientSignature = "true";
      clientSignedAt = new Date().toISOString();
    }

    // Determine submit status
    let newStatus = "completed";
    let canSubmit = true;
    let submitMessage = "Form submitted successfully!";

    if (signatureValidation.totalRequired > 0 && !hasAllSignatures) {
      const adminSigIds = ["manager_signature", "supervisor_signature", "admin_signature"];
      const missingAdminSigs = signatureValidation.missingSignatures.filter((id: string) =>
        adminSigIds.some((aid) => id.includes(aid))
      );
      const missingNonAdminSigs = signatureValidation.missingSignatures.filter((id: string) =>
        !adminSigIds.some((aid) => id.includes(aid))
      );

      if (missingNonAdminSigs.length === 0 && missingAdminSigs.length > 0) {
        newStatus = "pending_admin_review";
        canSubmit = true;
        submitMessage = "Form submitted! Awaiting administrator review.";
      } else {
        newStatus = "in_progress";
        canSubmit = false;
        submitMessage = `${signatureValidation.missingSignatures.length} signature(s) still required`;
      }
    }

    // Cleanup conditional fields
    if (assignment.formKey === "support_action_plan") {
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
      isSubmitted: canSubmit,
      submittedAt: canSubmit ? new Date().toISOString() : undefined,
      clientSignature,
      clientSignedAt,
      formKey: assignment.formKey,
      formTitle: assignment.formTitle,
    });

    // Update common fields
    if (commonFieldsData && Object.keys(commonFieldsData).length > 0) {
      const allowedCommonFields = ["name", "age", "email", "sex", "street", "state", "postCode", "dob", "ndis", "disability", "address", "phone"];
      const filtered = Object.keys(commonFieldsData)
        .filter((key) => allowedCommonFields.includes(key))
        .reduce((obj, key) => { obj[key] = commonFieldsData[key]; return obj; }, {} as any);
      if (Object.keys(filtered).length > 0) await updateCommonFields(assignment.clientId, filtered);
    }

    // Update assignment status
    await updateAssignmentStatus(assignment.clientId, assignmentId, newStatus, previousStatus);

    // Post-submit actions (non-blocking)
    if (previousStatus === "pending_admin_review" && newStatus === "completed") {
      // Admin completed a pending form
      handleAdminCompletion(assignment, formSubmission, adminId, req).catch(console.error);
    }

    if (hasAllSignatures && clientSignature) {
      // All signatures complete — notify + check batch
      handleSignatureCompletion(assignment, formSubmission, assignmentId, adminId, req).catch(console.error);
    }

    return NextResponse.json({
      success: canSubmit,
      submissionId: formSubmission.id,
      currentStatus: newStatus,
      canSubmit,
      signatureStatus: {
        isComplete: signatureValidation.isComplete,
        completedCount: signatureValidation.completedCount,
        totalRequired: signatureValidation.totalRequired,
        completedSignatures: signatureValidation.completedSignatures,
        missingSignatures: signatureValidation.missingSignatures,
      },
      message: submitMessage,
    });
  } catch (error: any) {
    console.error("Error submitting form:", error);
    return NextResponse.json({ error: "Failed to submit form", details: error.message }, { status: 500 });
  }
}

// Non-blocking: Admin completed a pending_admin_review form
async function handleAdminCompletion(assignment: any, formSubmission: any, adminId: string | undefined, req: NextRequest) {
  const clientInfo = await getClientById(assignment.clientId);
  const allAdmins = await getAllAdmins();

  // Create notifications for all admins
  await Promise.all(
    allAdmins.map((admin) =>
      createNotification({
        adminId: admin.id,
        clientId: assignment.clientId,
        formSubmissionId: formSubmission.id,
        clientName: clientInfo?.name,
        formTitle: assignment.formTitle,
        formKey: assignment.formKey,
      })
    )
  );

  await createActivityLog({
    clientId: assignment.clientId,
    adminId,
    logType: "ADMIN",
    action: "Form Fully Completed by Admin",
    metadata: { formKey: assignment.formKey, formTitle: assignment.formTitle, formSubmissionId: formSubmission.id, previousStatus: "pending_admin_review", newStatus: "completed" },
  });

  // Send completion email
  try {
    const emailUrl = `${process.env.INTERNAL_API_URL || process.env.NEXTAUTH_URL || req.nextUrl.origin}/api/notifications/send-email/${adminId}`;
    await fetch(emailUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "dual_notification",
        adminId,
        clientId: assignment.clientId,
        clientName: clientInfo?.name,
        clientEmail: clientInfo?.email,
        batchId: 0,
        completedForms: [{ id: formSubmission.id, formId: assignment.formId, title: assignment.formTitle }],
        completedAt: new Date().toLocaleString(),
      }),
    });
  } catch (e) { console.error("Email error (non-blocking):", e); }

  // Upload to Google Drive
  if (process.env.GOOGLE_DRIVE_FOLDER_ID && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    try {
      const pdfResult = await generatePDFBuffer({ formSubmissionId: formSubmission.id, formId: assignment.formId, filename: `${assignment.formTitle.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`, adminId });
      if (pdfResult.success && pdfResult.buffer) {
        const { uploadPDFToDrive } = await import("@/lib/google-drive");
        await uploadPDFToDrive({ buffer: pdfResult.buffer, filename: pdfResult.filename!, clientName: clientInfo?.name || "Unknown" });
      }
    } catch (e) { console.error("Drive upload error (non-blocking):", e); }
  }
}

// Non-blocking: All signatures complete
async function handleSignatureCompletion(assignment: any, formSubmission: any, assignmentId: string, adminId: string | undefined, req: NextRequest) {
  const clientInfo = await getClientById(assignment.clientId);
  const allAdmins = await getAllAdmins();

  // Create notifications
  await Promise.all(
    allAdmins.map((admin) =>
      createNotification({
        adminId: admin.id,
        clientId: assignment.clientId,
        formSubmissionId: formSubmission.id,
        clientName: clientInfo?.name,
        formTitle: assignment.formTitle,
        formKey: assignment.formKey,
      })
    )
  );

  // Check batch completion
  try {
    const batchAssignments = await getBatchAssignments(assignment.batchId);
    const allCompleted = batchAssignments.every((a: any) => a.currentStatus === "completed");

    if (allCompleted && batchAssignments.length > 0) {
      // Send dual notification email
      const completedFormsData = batchAssignments.map((a: any) => ({ id: a.id, formId: a.formId, title: a.formTitle }));

      try {
        const emailUrl = `${process.env.INTERNAL_API_URL || process.env.NEXTAUTH_URL || req.nextUrl.origin}/api/notifications/send-email/${adminId}`;
        await fetch(emailUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "dual_notification",
            adminId,
            clientId: assignment.clientId,
            clientName: clientInfo?.name,
            clientEmail: clientInfo?.email,
            batchId: assignment.batchId,
            completedForms: completedFormsData,
            completedAt: new Date().toLocaleString(),
          }),
        });
      } catch (e) { console.error("Batch email error (non-blocking):", e); }

      // Upload all PDFs to Google Drive
      if (process.env.GOOGLE_DRIVE_FOLDER_ID && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
        try {
          const driveFiles: Array<{ buffer: Buffer; filename: string }> = [];
          for (const form of completedFormsData) {
            const pdfResult = await generatePDFBuffer({ formSubmissionId: form.id, formId: form.formId, filename: `${form.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`, adminId });
            if (pdfResult.success && pdfResult.buffer) driveFiles.push({ buffer: pdfResult.buffer, filename: pdfResult.filename! });
          }
          if (driveFiles.length > 0) await uploadBatchToDrive(driveFiles, clientInfo?.name || "Unknown");
        } catch (e) { console.error("Drive batch upload error (non-blocking):", e); }
      }
    }
  } catch (e) { console.error("Batch completion check error (non-blocking):", e); }
}
