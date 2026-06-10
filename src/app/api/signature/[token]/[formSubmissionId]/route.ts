import { NextRequest, NextResponse } from "next/server";
import { getBatchByToken, getSignatureBatchForms, getSubmissionById, getFormById, updateSubmission, updateBatch, getBatchAssignments, updateAssignmentStatus, getClientAssignments } from "@/lib/db/forms";
import { getClientById } from "@/lib/db/client";
import { getAllAdmins } from "@/lib/db/admin";
import { createNotification } from "@/lib/db/notifications";
import { createActivityLog } from "@/lib/db/audit";
import { getFormConfig } from "@/app/forms/registry";
import { calculateFormStatus } from "@/lib/formStatusHelper";

// GET - Fetch specific form for signature
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string; formSubmissionId: string }> }
) {
  try {
    const { token, formSubmissionId } = await params;

    if (!token || !formSubmissionId) {
      return NextResponse.json(
        { error: "Token and form submission ID are required" },
        { status: 400 }
      );
    }

    const batch = await getBatchByToken(token);

    if (!batch || !batch.isSignatureOnly) {
      return NextResponse.json(
        { error: "Signature link not found or form not accessible" },
        { status: 404 }
      );
    }

    if (new Date(batch.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "This signature link has expired" },
        { status: 410 }
      );
    }

    const signatureForms = await getSignatureBatchForms(batch.id);

    if (signatureForms.length === 0) {
      return NextResponse.json(
        { error: "Form not found in this signature batch" },
        { status: 404 }
      );
    }

    const result = signatureForms.find((item: any) => item.formSubmissionId === formSubmissionId);

    if (!result) {
      return NextResponse.json(
        { error: "Form not found in this signature batch" },
        { status: 404 }
      );
    }

    const formSubmission = await getSubmissionById(formSubmissionId);
    let form = null;
    if (formSubmission) {
      form = await getFormById(formSubmission.formId);
    }

    const client = await getClientById(batch.clientId);

    return NextResponse.json({
      formSubmission: formSubmission ? {
        ...formSubmission,
        form: form ? {
          id: form.id,
          formKey: form.formKey,
          title: form.title,
          version: form.version,
          schema: form.schema,
          requiresSignature: form.requiresSignature,
        } : null,
      } : null,
      client: client ? {
        id: client.id,
        name: client.name,
        email: client.email,
        commonFields: client.commonFields ? [client.commonFields] : [],
      } : null,
      batchToken: batch.batchToken,
      isExpired: new Date(batch.expiresAt) < new Date(),
    });

  } catch (error: any) {
    console.error("Error fetching form for signature:", error);
    return NextResponse.json(
      { error: "Failed to fetch form data", details: error.message },
      { status: 500 }
    );
  }
}

interface SignatureRequirement {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
  dataKey?: string;
  signedAtKey?: string;
  signerName?: string;
  groupId?: string;
  groupRequirementType?: "any" | "all";
  groupRequired?: boolean;
}

function getRequiredSignaturesWithGroups(signatures: SignatureRequirement[], formData: any): SignatureRequirement[] {
  const individualRequired: SignatureRequirement[] = [];
  const grouped: Record<string, SignatureRequirement[]> = {};

  for (const sig of signatures) {
    if (sig.groupId && sig.groupRequired) {
      if (!grouped[sig.groupId]) grouped[sig.groupId] = [];
      grouped[sig.groupId].push(sig);
    } else if (sig.required) {
      individualRequired.push(sig);
    }
  }

  const groupEvaluated: SignatureRequirement[] = [];
  for (const [groupId, groupSignatures] of Object.entries(grouped)) {
    const type = groupSignatures[0]?.groupRequirementType || "any";
    const hasOneSigned = groupSignatures.some(sig => !!formData?.[sig.dataKey ?? ""]);
    const allSigned = groupSignatures.every(sig => !!formData?.[sig.dataKey ?? ""]);

    if (type === "any" && !hasOneSigned) {
      groupEvaluated.push(...groupSignatures);
    } else if (type === "all" && !allSigned) {
      groupEvaluated.push(...groupSignatures);
    }
  }

  return [...individualRequired, ...groupEvaluated];
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string; formSubmissionId: string }> }
) {
  try {
    const { token, formSubmissionId } = await params;
    const { signature, signatureId, signedAt, signerName } = await req.json();

    if (!token || !formSubmissionId || !signature || !signatureId || !signedAt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const batch = await getBatchByToken(token);
    if (!batch || !batch.isSignatureOnly) return NextResponse.json({ error: "Signature link not found" }, { status: 404 });
    if (new Date(batch.expiresAt) < new Date()) return NextResponse.json({ error: "Signature link expired" }, { status: 410 });

    const signatureForms = await getSignatureBatchForms(batch.id);
    const signatureForm = signatureForms.find((sf: any) => sf.formSubmissionId === formSubmissionId);
    if (!signatureForm) return NextResponse.json({ error: "Form not found in batch" }, { status: 404 });

    const currentSubmission: any = await getSubmissionById(formSubmissionId);
    if (!currentSubmission) return NextResponse.json({ error: "Form submission not found" }, { status: 404 });

    const form = await getFormById(currentSubmission.formId);
    const formKey = form?.formKey;
    const formConfig = getFormConfig(formKey || '');
    const signatures = formConfig?.signatures || [];

    let signatureConfig = signatures.find((sig: any) => sig.id === signatureId);

    if (!signatureConfig && signatureId === "conflict_signature" && formKey === "sa_support_coordination") {
      signatureConfig = {
        id: "conflict_signature",
        dataKey: "signature",
        signedAtKey: "signDate",
        signerName: "printName",
        label: "Conflict Signature"
      };
    }

    if (!signatureConfig) {
      return NextResponse.json({ error: `Signature config not found for ID: ${signatureId}` }, { status: 400 });
    }

    const { dataKey, signedAtKey, signerName: signerNameKey } = signatureConfig;

    let autoDetectedRole = "";
    const formsWithSignatureRole = ["schedule_of_supports", "sa_delivery_of_supports", "sa_support_coordination"];
    if (formsWithSignatureRole.includes(formKey!)) {
      if (dataKey === "nomineeSignature") autoDetectedRole = "Nominee";
      else if (dataKey === "participantSignature") autoDetectedRole = "Participant";
    }

    const updatedFormData: any = { ...currentSubmission.data };

    if (formKey === 'support_action_plan') {
      if (dataKey === 'authorSignature') {
        updatedFormData.authorSignature = signature;
        if (signedAtKey) updatedFormData[signedAtKey] = signedAt;
        if (signerNameKey) updatedFormData[signerNameKey] = signerName;
        if (!updatedFormData.participantSignature) updatedFormData.participantSignature = '';
      } else if (dataKey === 'participantSignature') {
        updatedFormData.participantSignature = signature;
        if (signedAtKey) updatedFormData[signedAtKey] = signedAt;
        if (signerNameKey) updatedFormData[signerNameKey] = signerName;
        if (!updatedFormData.authorSignature) updatedFormData.authorSignature = '';
      } else {
        updatedFormData[dataKey!] = signature;
        if (signedAtKey) updatedFormData[signedAtKey] = signedAt;
        if (signerNameKey) updatedFormData[signerNameKey] = signerName;
      }
    } else {
      updatedFormData[dataKey!] = signature;
      if (signedAtKey) updatedFormData[signedAtKey] = signedAt;
      if (signerNameKey) updatedFormData[signerNameKey] = signerName;
    }

    if (autoDetectedRole) updatedFormData.signatureRole = autoDetectedRole;

    await updateSubmission(formSubmissionId, currentSubmission.clientId, currentSubmission.formId, currentSubmission.formVersion, currentSubmission.instanceNumber, {
      clientSignature: "true",
      clientSignedAt: new Date().toISOString(),
      data: updatedFormData,
    });

    // Update form assignment status
    const assignments = await getClientAssignments(currentSubmission.clientId);
    const formAssignment = assignments.find(a => a.formId === currentSubmission.formId && a.formVersion === currentSubmission.formVersion && a.instanceNumber === currentSubmission.instanceNumber);

    if (formAssignment) {
      const newStatus = calculateFormStatus(formKey!, updatedFormData, true, !!currentSubmission.isSubmitted);
      await updateAssignmentStatus(currentSubmission.clientId, formAssignment.id, newStatus, formAssignment.currentStatus || 'in_progress');
    }

    const adminId = formAssignment?.assignedById;

    // Check if entire batch is complete
    let isNowComplete = true;
    for (const sf of signatureForms) {
      const sfSubmission = await getSubmissionById(sf.formSubmissionId);
      const sfForm = sfSubmission ? await getFormById(sfSubmission.formId) : null;
      const config = getFormConfig(sfForm?.formKey || '');
      const submissionData: any = sfSubmission?.data || {};
      const required = getRequiredSignaturesWithGroups(config?.signatures || [], submissionData);
      const allSigned = required.every((sig: any) => !!submissionData[sig.dataKey!]);
      if (!allSigned) { isNowComplete = false; break; }
    }

    if (isNowComplete && !batch.isCompleted) {
      await updateBatch(batch.clientId, batch.id, {
        isCompleted: true,
        completedAt: new Date().toISOString(),
      });

      await createActivityLog({
        clientId: batch.clientId,
        logType: "CLIENT",
        action: "Signature Batch Completed",
        metadata: {
          batchId: batch.id,
          batchToken: batch.batchToken,
          totalForms: signatureForms.length,
          completedAt: new Date().toISOString(),
        },
      });

      const allAdmins = await getAllAdmins();
      await Promise.all(
        allAdmins.map((admin: any) =>
          createNotification({
            adminId: admin.id,
            clientId: batch.clientId,
            formSubmissionId,
          })
        )
      );

      // Send notification email
      try {
        const completedFormsData = await Promise.all(
          signatureForms.map(async (sf: any) => {
            const sub = await getSubmissionById(sf.formSubmissionId);
            const f = sub ? await getFormById(sub.formId) : null;
            return { id: sf.formSubmissionId, formId: f?.id, title: f?.title || "Untitled" };
          })
        );

        const client = await getClientById(batch.clientId);
        const emailResponse = await fetch(
          `${process.env.NEXTAUTH_URL || process.env.VERCEL_URL}/api/notifications/send-email/${adminId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "dual_notification",
              clientId: batch.clientId,
              clientName: client?.name,
              clientEmail: client?.email,
              batchId: batch.id,
              completedForms: completedFormsData,
              completedAt: new Date().toLocaleString(),
            }),
          }
        );
        if (!emailResponse.ok) console.error("❌ Email error:", await emailResponse.text());

        // Upload to Google Drive
        if (process.env.GOOGLE_DRIVE_FOLDER_ID && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
          try {
            const { uploadBatchToDrive } = await import("@/lib/google-drive");
            const { generatePDFBuffer } = await import("@/lib/pdf-buffer");
            const driveFiles: Array<{ buffer: Buffer; filename: string }> = [];
            for (const form of completedFormsData) {
              const pdfResult = await generatePDFBuffer({ formSubmissionId: form.id, formId: form.formId || '', filename: `${form.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`, adminId: adminId || '' });
              if (pdfResult.success && pdfResult.buffer) driveFiles.push({ buffer: pdfResult.buffer, filename: pdfResult.filename! });
            }
            if (driveFiles.length > 0) await uploadBatchToDrive(driveFiles, client?.name || "Unknown");
          } catch (driveErr) { console.error("❌ Drive upload error (non-blocking):", driveErr); }
        }
      } catch (err) {
        console.error("❌ Email send failed (non-blocking):", err);
      }
    }

    // Return final status
    let refreshedStatus = "in_progress";
    if (formAssignment) {
      const refreshedAssignments = await getClientAssignments(currentSubmission.clientId);
      const refreshedMatch = refreshedAssignments.find(a => a.formId === currentSubmission.formId && a.formVersion === currentSubmission.formVersion && a.instanceNumber === currentSubmission.instanceNumber);
      refreshedStatus = refreshedMatch?.currentStatus || "in_progress";
    }

    return NextResponse.json({
      success: true,
      message: "Signature submitted successfully",
      signatureId,
      signedAt,
      allSignaturesComplete: refreshedStatus === "completed",
    });
  } catch (error: any) {
    console.error("Error in signature POST:", error);
    return NextResponse.json(
      { error: "Failed to submit signature", details: error.message },
      { status: 500 }
    );
  }
}

// Save in-progress form data for a signature link
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ token: string; formSubmissionId: string }> }
) {
  try {
    const { token, formSubmissionId } = await params;
    const { data, isSubmitted } = await req.json();

    if (!token || !formSubmissionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const batch = await getBatchByToken(token);
    if (!batch || !batch.isSignatureOnly) return NextResponse.json({ error: "Signature link not found" }, { status: 404 });
    if (new Date(batch.expiresAt) < new Date()) return NextResponse.json({ error: "Signature link expired" }, { status: 410 });

    const signatureForms = await getSignatureBatchForms(batch.id);
    const signatureForm = signatureForms.find((sf: any) => sf.formSubmissionId === formSubmissionId);
    if (!signatureForm) return NextResponse.json({ error: "Form not in this signature link" }, { status: 404 });

    const submission = await getSubmissionById(formSubmissionId);
    if (!submission) return NextResponse.json({ error: "Submission not found" }, { status: 404 });

    const updateData: any = {
      data,
      updatedAt: new Date().toISOString(),
    };

    if (isSubmitted) {
      updateData.isSubmitted = true;
      updateData.submittedAt = new Date().toISOString();
      updateData.clientSignature = "true";
      updateData.clientSignedAt = new Date().toISOString();
    }

    await updateSubmission(formSubmissionId, submission.clientId, submission.formId, submission.formVersion, submission.instanceNumber, updateData);

    const updated = await getSubmissionById(formSubmissionId);

    // Update FormAssignment status
    if (updated) {
      const assignments = await getClientAssignments(updated.clientId);
      const formAssignment = assignments.find(a => a.formId === updated.formId && a.formVersion === updated.formVersion && a.instanceNumber === updated.instanceNumber);

      if (formAssignment) {
        const form = await getFormById(updated.formId);
        const newStatus = calculateFormStatus(
          form?.formKey || '',
          updated?.data,
          true,
          updated?.isSubmitted
        );
        await updateAssignmentStatus(updated!.clientId, formAssignment.id, newStatus, formAssignment.currentStatus || 'in_progress');
      }
    }

    // Notification logic when staff submits
    if (isSubmitted) {
      const form = updated ? await getFormById(updated.formId) : null;
      const formKey = form?.formKey;
      const formTitle = form?.title || 'Unknown Form';
      const formId = form?.id;
      const client = await getClientById(batch.clientId);
      const clientName = client?.name || 'Unknown Client';
      const staffName = data?.supportWorkers || data?.staffName || 'Support Worker';

      let adminId: string | undefined;
      if (updated) {
        const assignments = await getClientAssignments(updated.clientId);
        const match = assignments.find(a => a.formId === updated.formId && a.formVersion === updated.formVersion && a.instanceNumber === updated.instanceNumber);
        adminId = match?.assignedById;
      }

      // Update form assignment to pending_admin_review (for forms requiring admin sign)
      if (updated) {
        const allAssignments = await getClientAssignments(updated.clientId);
        const targetAssignment = allAssignments.find(a => a.formId === updated.formId && a.formVersion === updated.formVersion && a.instanceNumber === updated.instanceNumber);
        if (targetAssignment && targetAssignment.currentStatus !== 'pending_admin_review') {
          const form = await getFormById(updated.formId);
          if (form?.formKey === 'emergency_drill' || form?.formKey === 'conflict_of_interest') {
            await updateAssignmentStatus(updated.clientId, targetAssignment.id, 'pending_admin_review', targetAssignment.currentStatus || 'in_progress');
          }
        }
      }

      try {
        const allAdmins = await getAllAdmins();
        await Promise.all(
          allAdmins.map((admin: any) =>
            createNotification({
              adminId: admin.id,
              clientId: batch.clientId,
              formSubmissionId,
            })
          )
        );

        await updateBatch(batch.clientId, batch.id, { adminNotified: true });

        if (adminId) {
          try {
            const emailResponse = await fetch(
              `${process.env.NEXTAUTH_URL || process.env.VERCEL_URL}/api/notifications/send-email/${adminId}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: "staff_form_submitted",
                  clientId: batch.clientId,
                  clientName,
                  staffName,
                  formTitle,
                  formId,
                  formSubmissionId,
                  submittedAt: new Date().toLocaleString(),
                }),
              }
            );
            if (!emailResponse.ok) console.error("❌ Email notification failed:", await emailResponse.text());
          } catch (emailError) {
            console.error("❌ Email send error (non-blocking):", emailError);
          }
        }

        await createActivityLog({
          clientId: batch.clientId,
          logType: "CLIENT",
          action: "Staff Form Section Submitted",
          metadata: {
            formKey,
            formTitle,
            formSubmissionId,
            staffName,
            batchId: batch.id,
            submittedAt: new Date().toISOString(),
          },
        });
      } catch (notificationError) {
        console.error("❌ Notification error (non-blocking):", notificationError);
      }
    }

    return NextResponse.json({ success: true, formSubmissionId: updated?.id || formSubmissionId });
  } catch (error: any) {
    console.error("Error saving form via signature token:", error);
    return NextResponse.json(
      { error: "Failed to save form data", details: error.message },
      { status: 500 }
    );
  }
}
