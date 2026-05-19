import { NextRequest, NextResponse } from "next/server";
import { getBatchByToken, getBatchAssignments } from "@/lib/db/forms";
import { getClientById, updateClient, updateCommonFields } from "@/lib/db/client";
import { createActivityLog } from "@/lib/db/audit";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dynamodb, TABLE } from "@/lib/dynamodb";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await req.json();

    const batch = await getBatchByToken(token);
    if (!batch) return NextResponse.json({ error: "Invalid access token" }, { status: 404 });

    if (new Date() > new Date(batch.expiresAt)) {
      return NextResponse.json({ error: "Access link has expired" }, { status: 403 });
    }

    if (batch.passcode) {
      const passcode = req.nextUrl.searchParams.get("passcode");
      if (!passcode) return NextResponse.json({ error: "Passcode required" }, { status: 403 });
      if (batch.passcode !== passcode) return NextResponse.json({ error: "Invalid passcode" }, { status: 403 });
    }

    // Map frontend field names to DB field names
    const fieldMap: Record<string, string> = {
      givenName: "name",
      dateOfBirth: "dob",
      ndisNumber: "ndis",
      addressNumberStreet: "street",
      postcode: "postCode",
      homePhone: "phone",
      disabilityConditions: "disability",
    };

    const mappedBody: Record<string, any> = {};
    for (const [frontendKey, dbKey] of Object.entries(fieldMap)) {
      if (body[frontendKey] !== undefined) mappedBody[dbKey] = body[frontendKey];
    }
    // Also include direct field names
    ["name", "age", "email", "sex", "street", "state", "postCode", "dob", "ndis", "disability", "address", "phone", "surname"].forEach((key) => {
      if (body[key] !== undefined) mappedBody[key] = body[key];
    });

    // Update client top-level fields if provided
    const clientUpdates: any = {};
    if (body.name) clientUpdates.name = body.name;
    if (body.email) clientUpdates.email = body.email;
    if (body.phone) clientUpdates.phone = body.phone;

    if (Object.keys(clientUpdates).length > 0) {
      await updateClient(batch.clientId, clientUpdates);
    }

    // Update common fields
    const commonFields = await updateCommonFields(batch.clientId, mappedBody);

    // Mark all assignments in batch as common fields completed
    const assignments = await getBatchAssignments(batch.id);
    await Promise.all(
      assignments.map((a: any) =>
        dynamodb.send(
          new UpdateCommand({
            TableName: TABLE,
            Key: { PK: `CLIENT#${batch.clientId}`, SK: `ASSIGNMENT#${a.id || a.assignmentId}` },
            UpdateExpression: "SET isCommonFieldsCompleted = :t",
            ExpressionAttributeValues: { ":t": true },
          })
        )
      )
    );

    // Log activity
    await createActivityLog({
      clientId: batch.clientId,
      logType: "CLIENT",
      action: "Updated Common Fields",
      metadata: { batchId: batch.id },
    });

    return NextResponse.json({ success: true, commonFields });
  } catch (error: any) {
    console.error("Error updating common fields:", error);
    return NextResponse.json({ error: "Failed to update common fields", details: error.message }, { status: 500 });
  }
}
