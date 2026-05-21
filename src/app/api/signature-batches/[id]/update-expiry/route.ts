import { NextRequest, NextResponse } from "next/server";
import { GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamodb, TABLE } from "@/lib/dynamodb";
import { updateBatch } from "@/lib/db/forms";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { expiresAt } = body;

    if (!id) return NextResponse.json({ error: "Invalid batch ID" }, { status: 400 });
    if (!expiresAt) return NextResponse.json({ error: "Expiry date is required" }, { status: 400 });

    const expiryDate = new Date(expiresAt);
    if (expiryDate <= new Date()) {
      return NextResponse.json({ error: "Expiry date must be in the future" }, { status: 400 });
    }

    // Find clientId from batch assignments
    const assignRes = await dynamodb.send(
      new QueryCommand({
        TableName: TABLE,
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: { ":pk": `BATCH#${id}` },
        Limit: 1,
      })
    );

    if (!assignRes.Items || assignRes.Items.length === 0) {
      return NextResponse.json({ error: "Signature batch not found" }, { status: 404 });
    }

    const clientId = assignRes.Items[0].clientId as string;
    await updateBatch(clientId, id, { expiresAt: expiryDate.toISOString() });

    // Fetch updated batch
    const batchRes = await dynamodb.send(
      new GetCommand({ TableName: TABLE, Key: { PK: `CLIENT#${clientId}`, SK: `BATCH#${id}` } })
    );

    return NextResponse.json({
      message: "Expiry date updated successfully",
      batch: batchRes.Item,
    });
  } catch (error: any) {
    console.error("Error updating signature batch expiry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
