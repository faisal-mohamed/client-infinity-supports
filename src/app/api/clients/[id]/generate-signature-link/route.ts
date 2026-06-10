import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getClientById } from "@/lib/db/client";
import { getClientAssignments, getSubmission, upsertSubmission, createFormBatch, createSignatureBatchForm, updateSubmission } from "@/lib/db/forms";
import { createActivityLog } from "@/lib/db/audit";
import { validateClientOwnership, isOwnershipError } from '@/lib/client-ownership';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const ownership = await validateClientOwnership(id);
    if (isOwnershipError(ownership)) return ownership;
    if (!id) return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });

    const body = await req.json();
    const { formAssignmentIds } = body;

    if (!formAssignmentIds || !Array.isArray(formAssignmentIds) || formAssignmentIds.length === 0) {
      return NextResponse.json({ error: "No form assignments selected" }, { status: 400 });
    }

    const client = await getClientById(id);
    if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    // Get all assignments for this client
    const allAssignments = await getClientAssignments(id);
    const selectedAssignments = allAssignments.filter((a) => formAssignmentIds.includes(a.id));

    if (selectedAssignments.length !== formAssignmentIds.length) {
      return NextResponse.json({ error: "Some form assignments not found or don't belong to this client" }, { status: 400 });
    }

    // Forms allowed without admin fill
    const formsAllowedWithoutAdminFill = [
      "emergency_drill", "participant_risk_assessment", "support_action_plan",
      "schedule_of_supports",
    ];

    // Get/create submissions for each assignment
    const processedSubmissions = await Promise.all(
      selectedAssignments.map(async (assignment) => {
        let submission = await getSubmission(id, assignment.formId, assignment.formVersion, assignment.instanceNumber);

        if (!submission && formsAllowedWithoutAdminFill.includes(assignment.formKey)) {
          submission = await upsertSubmission({
            clientId: id,
            formId: assignment.formId,
            formVersion: assignment.formVersion,
            instanceNumber: assignment.instanceNumber,
            data: {},
            filledByAdmin: false,
            isSubmitted: false,
            formKey: assignment.formKey,
            formTitle: assignment.formTitle,
          });
        }

        return {
          assignmentId: assignment.id,
          submissionId: submission?.id,
          filledByAdmin: submission?.filledByAdmin || false,
          hasData: submission?.data && Object.keys(submission.data).length > 0,
          formTitle: assignment.formTitle,
          formKey: assignment.formKey,
        };
      })
    );

    // Filter valid submissions
    const validSubmissions = processedSubmissions.filter(
      (sub) => sub.submissionId && (sub.filledByAdmin || formsAllowedWithoutAdminFill.includes(sub.formKey) || sub.hasData)
    );

    if (validSubmissions.length === 0) {
      return NextResponse.json({ error: "Cannot generate signature link: No valid forms found. Please fill in the forms first." }, { status: 400 });
    }

    // Generate unique token
    const batchToken = randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create signature batch
    const signatureBatch = await createFormBatch({
      clientId: id,
      batchToken,
      expiresAt: expiresAt.toISOString(),
      isSignatureOnly: true,
      isCompleted: false,
      adminNotified: false,
    });

    // Create SignatureBatchForm entries
    for (const sub of validSubmissions) {
      await createSignatureBatchForm(signatureBatch.id, sub.submissionId!);
      // Mark submission as sent to client
      const assignment = selectedAssignments.find((a) => a.id === sub.assignmentId)!;
      const submission = await getSubmission(id, assignment.formId, assignment.formVersion, assignment.instanceNumber);
      if (submission) {
        await updateSubmission(submission.id, id, assignment.formId, assignment.formVersion, assignment.instanceNumber, { filledByAdmin: false });
      }
    }

    // Log activity
    await createActivityLog({
      clientId: id,
      logType: "ADMIN",
      action: "Signature Link Generated",
      metadata: {
        batchId: signatureBatch.id,
        batchToken,
        formsCount: validSubmissions.length,
        forms: validSubmissions.map((sub) => ({ formTitle: sub.formTitle, formKey: sub.formKey })),
      },
    });

    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host") || "localhost:3001";
    const baseUrl = `${protocol}://${host}`;

    return NextResponse.json({
      success: true,
      token: batchToken,
      batchId: signatureBatch.id,
      expiresAt: expiresAt.toISOString(),
      clientName: client.name,
      formsCount: validSubmissions.length,
      forms: validSubmissions.map((sub) => ({ formTitle: sub.formTitle, formKey: sub.formKey })),
      signatureUrl: `${baseUrl}/forms/signature/${batchToken}`,
    });
  } catch (error: any) {
    console.error("Error generating signature link:", error);
    return NextResponse.json({ error: "Failed to generate signature link", details: error.message }, { status: 500 });
  }
}
