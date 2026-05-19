import { NextRequest, NextResponse } from "next/server";
import { getBatchByToken, getBatchAssignments, getSubmission } from "@/lib/db/forms";
import { getClientById } from "@/lib/db/client";
import { getClientLogs } from "@/lib/db/audit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const passcode = req.nextUrl.searchParams.get("passcode");

    const batch = await getBatchByToken(token);
    if (!batch) return NextResponse.json({ error: "Invalid access token" }, { status: 404 });

    if (new Date() > new Date(batch.expiresAt)) {
      return NextResponse.json({ error: "Access link has expired" }, { status: 403 });
    }

    if (batch.passcode) {
      if (!passcode) return NextResponse.json({ error: "Passcode required" }, { status: 403 });
      if (batch.passcode !== passcode) return NextResponse.json({ error: "Invalid passcode" }, { status: 403 });
    }

    const client = await getClientById(batch.clientId);
    if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    const assignments = await getBatchAssignments(batch.id);
    const logs = await getClientLogs(batch.clientId, 50);

    // Get submissions for each assignment
    const forms = await Promise.all(
      assignments.sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0)).map(async (assignment: any) => {
        const submission = await getSubmission(
          batch.clientId,
          assignment.formId,
          assignment.formVersion,
          assignment.instanceNumber || 1
        );
        return {
          id: assignment.id,
          formId: assignment.formId,
          title: assignment.formTitle,
          displayOrder: assignment.displayOrder,
          isCompleted: assignment.isCompleted,
          formKey: assignment.formKey,
          schema: null, // Schema fetched separately if needed
          submission: submission || null,
        };
      })
    );

    return NextResponse.json({
      batch: { id: batch.id, batchToken: batch.batchToken, expiresAt: batch.expiresAt, createdAt: batch.createdAt },
      client: { id: client.id, name: client.name, email: client.email, commonFields: client.commonFields, logs },
      forms,
    });
  } catch (error: any) {
    console.error("Error accessing form batch:", error);
    return NextResponse.json({ error: "Failed to access forms", details: error.message }, { status: 500 });
  }
}
