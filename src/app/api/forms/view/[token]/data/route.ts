import { NextRequest, NextResponse } from "next/server";
import { getBatchByToken, getBatchAssignments, getSubmission, upsertSubmission, updateAssignmentStatus } from "@/lib/db/forms";
import { getClientById } from "@/lib/db/client";
import { createActivityLog } from "@/lib/db/audit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token: batchToken } = await params;
    const formId = req.nextUrl.searchParams.get("formId");
    if (!formId) return NextResponse.json({ error: "Missing formId in query params" }, { status: 400 });

    const batch = await getBatchByToken(batchToken);
    if (!batch) return NextResponse.json({ error: "Invalid batch token or formId" }, { status: 404 });

    const assignments = await getBatchAssignments(batch.id);
    const assignment = assignments.find((a: any) => a.formId === formId);
    if (!assignment) return NextResponse.json({ error: "Invalid batch token or formId" }, { status: 404 });

    const client = await getClientById(batch.clientId);
    if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    const formSubmission = await getSubmission(
      batch.clientId,
      assignment.formId,
      assignment.formVersion,
      assignment.instanceNumber || 1
    );

    // Navigation
    const sortedAssignments = assignments.sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0));
    const currentIndex = sortedAssignments.findIndex((a: any) => (a.id || a.assignmentId) === (assignment.id || assignment.assignmentId));
    const previousForm = currentIndex > 0 ? sortedAssignments[currentIndex - 1] : null;
    const nextForm = currentIndex < sortedAssignments.length - 1 ? sortedAssignments[currentIndex + 1] : null;

    return NextResponse.json({
      assignment: {
        ...assignment,
        form: { id: assignment.formId, formKey: assignment.formKey, title: assignment.formTitle, version: assignment.formVersion },
      },
      form: { id: assignment.formId, formKey: assignment.formKey, title: assignment.formTitle, version: assignment.formVersion, schema: null },
      client: { id: client.id, name: client.name, email: client.email, commonFields: client.commonFields },
      commonFields: client.commonFields || null,
      formData: formSubmission?.data || {},
      isSubmitted: formSubmission?.isSubmitted || false,
      navigation: {
        previousForm: previousForm ? { id: previousForm.id || previousForm.assignmentId, formId: previousForm.formId, displayOrder: previousForm.displayOrder } : null,
        nextForm: nextForm ? { id: nextForm.id || nextForm.assignmentId, formId: nextForm.formId, displayOrder: nextForm.displayOrder } : null,
        batchToken,
      },
    });
  } catch (error: any) {
    console.error("Error fetching form data:", error);
    return NextResponse.json({ error: "Failed to fetch form data", details: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token: batchToken } = await params;
    const body = await req.json();
    const { formId } = body;
    if (!formId) return NextResponse.json({ error: "Missing formId in request body" }, { status: 400 });

    const batch = await getBatchByToken(batchToken);
    if (!batch) return NextResponse.json({ error: "Invalid batch token or formId" }, { status: 404 });

    const assignments = await getBatchAssignments(batch.id);
    const assignment = assignments.find((a: any) => a.formId === formId);
    if (!assignment) return NextResponse.json({ error: "Invalid batch token or formId" }, { status: 404 });

    const clientId = batch.clientId;
    const formVersion = assignment.formVersion;
    const instanceNumber = assignment.instanceNumber || 1;

    const formSubmission = await upsertSubmission({
      clientId,
      formId: assignment.formId,
      formVersion,
      instanceNumber,
      data: body.data,
      isSubmitted: body.isSubmitted || false,
      submittedAt: body.isSubmitted ? new Date().toISOString() : undefined,
      filledByAdmin: false,
      formKey: assignment.formKey,
      formTitle: assignment.formTitle,
    });

    if (body.isSubmitted) {
      await updateAssignmentStatus(clientId, assignment.id || assignment.assignmentId, "completed", assignment.currentStatus);
      await createActivityLog({
        clientId,
        logType: "CLIENT",
        action: "Submitted Form",
        metadata: { formId: assignment.formId, formTitle: assignment.formTitle, formVersion },
      });
    } else {
      await createActivityLog({
        clientId,
        logType: "CLIENT",
        action: "Saved Form Progress",
        metadata: { formId: assignment.formId, formTitle: assignment.formTitle, formVersion },
      });
    }

    return NextResponse.json({ success: true, isSubmitted: body.isSubmitted || false, formSubmission });
  } catch (error: any) {
    console.error("Error updating form data:", error);
    return NextResponse.json({ error: "Failed to update form data", details: error.message }, { status: 500 });
  }
}
