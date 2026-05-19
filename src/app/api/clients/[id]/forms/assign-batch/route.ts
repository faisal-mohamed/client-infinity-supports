import { NextRequest, NextResponse } from "next/server";
import { createFormBatch, createFormAssignment, getFormById, createActivityLog } from "@/lib/db";
import crypto from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { formIds, expiresAt } = body;

    if (!formIds || !formIds.length || !expiresAt) {
      return NextResponse.json(
        { error: "Missing required fields: formIds or expiresAt" },
        { status: 400 }
      );
    }

    const batchToken = crypto.randomBytes(32).toString('hex');
    const passcode = Math.floor(100000 + Math.random() * 900000).toString();

    const batch = await createFormBatch({
      clientId: id,
      batchToken,
      passcode,
      expiresAt: new Date(expiresAt).toISOString(),
      isSignatureOnly: false,
      isCompleted: false,
      adminNotified: false,
    });

    const assignments = [];
    for (let i = 0; i < formIds.length; i++) {
      const formId = formIds[i];
      const form = await getFormById(formId);
      if (!form) {
        throw new Error(`Form with ID ${formId} not found`);
      }

      const assignment = await createFormAssignment({
        clientId: id,
        formId,
        formVersion: form.version,
        currentStatus: "not_started",
        isCompleted: false,
        isCommonFieldsCompleted: false,
        displayOrder: i,
        batchId: batch.id,
        instanceNumber: 1,
        formKey: form.formKey,
        formTitle: form.title,
        requiresSignature: form.requiresSignature,
      });
      assignments.push(assignment);
    }

    await createActivityLog({
      clientId: id,
      logType: "ADMIN",
      action: "Assigned Form Batch",
      metadata: { formIds, batchToken, expiresAt, assignmentCount: formIds.length },
    });

    return NextResponse.json({
      batch,
      assignments,
      passcode,
      accessLink: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/forms/access/${batchToken}`,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error assigning form batch:", error);
    return NextResponse.json(
      { error: "Failed to assign form batch", details: error.message },
      { status: 500 }
    );
  }
}
