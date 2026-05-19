import { NextRequest, NextResponse } from "next/server";
import { getClientById, getFormById, getClientAssignments, createFormBatch, createFormAssignment, createActivityLog } from "@/lib/db";
import { randomBytes } from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { formIds, adminId } = body;

    if (!adminId) {
      return NextResponse.json(
        { error: "Missing or invalid admin ID" },
        { status: 400 }
      );
    }

    if (!formIds || !Array.isArray(formIds) || formIds.length === 0) {
      return NextResponse.json(
        { error: "No forms selected for assignment" },
        { status: 400 }
      );
    }

    const client = await getClientById(id);
    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Get forms
    const forms = await Promise.all(formIds.map((fid: string) => getFormById(fid)));
    const validForms = forms.filter((f): f is NonNullable<typeof f> => f !== null);

    if (validForms.length !== formIds.length) {
      return NextResponse.json(
        { error: "Some forms not found" },
        { status: 400 }
      );
    }

    // Calculate next instance numbers
    const existingAssignments = await getClientAssignments(id, true);
    const formsWithInstances = validForms.map((form) => {
      const existing = existingAssignments
        .filter((a) => a.formId === form.id && a.formVersion === form.version)
        .sort((a, b) => b.instanceNumber - a.instanceNumber);
      const nextInstanceNumber = (existing[0]?.instanceNumber || 0) + 1;
      return { ...form, newInstanceNumber: nextInstanceNumber };
    });

    const batchToken = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const formBatch = await createFormBatch({
      clientId: id,
      batchToken,
      expiresAt: expiresAt.toISOString(),
      isSignatureOnly: false,
      isCompleted: false,
      adminNotified: false,
    });

    const formAssignments = await Promise.all(
      formsWithInstances.map((form, index) =>
        createFormAssignment({
          clientId: id,
          formId: form.id,
          formVersion: form.version,
          batchId: formBatch.id,
          displayOrder: index + 1,
          assignedById: adminId,
          instanceNumber: form.newInstanceNumber,
          currentStatus: "not_started",
          isCompleted: false,
          isCommonFieldsCompleted: false,
          formKey: form.formKey,
          formTitle: form.title,
          requiresSignature: form.requiresSignature,
        })
      )
    );

    await createActivityLog({
      clientId: id,
      adminId,
      logType: "ADMIN",
      action: "Forms Assigned",
      metadata: {
        batchId: formBatch.id,
        formsAssigned: formsWithInstances.map((form) => ({
          formId: form.id,
          formKey: form.formKey,
          title: form.title,
          version: form.version,
        })),
        assignedCount: formsWithInstances.length,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully assigned ${formsWithInstances.length} form(s) to ${client.name}`,
      batchId: formBatch.id,
      batchToken,
      assignedForms: formsWithInstances.map((form) => ({
        id: form.id,
        title: form.title,
        formKey: form.formKey,
        version: form.version,
      })),
      skippedForms: 0,
    });
  } catch (error: any) {
    console.error("Error assigning forms to client:", error);
    return NextResponse.json(
      { error: "Failed to assign forms to client", details: error.message },
      { status: 500 }
    );
  }
}
