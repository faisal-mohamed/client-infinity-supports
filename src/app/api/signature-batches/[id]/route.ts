import { NextRequest, NextResponse } from "next/server";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamodb, TABLE } from "@/lib/dynamodb";
import { deleteBatch } from "@/lib/db/forms";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Invalid batch ID" }, { status: 400 });

    // Find the batch to get clientId and batchToken
    // Search in GSI1 or scan — batch items are stored under CLIENT#<clientId>/BATCH#<id>
    const res = await dynamodb.send(
      new QueryCommand({
        TableName: TABLE,
        IndexName: "GSI1",
        KeyConditionExpression: "GSI1PK = :pk",
        FilterExpression: "id = :id AND entityType = :et",
        ExpressionAttributeValues: { ":pk": "CLIENTS", ":id": id, ":et": "FORM_BATCH" },
      })
    );

    // Alternative: try to find via batch token lookup or direct query
    // Since we don't have a direct batch-by-id index, search all client batches
    // For now, use the batchToken approach — the frontend should pass the token
    // Fallback: scan for the batch
    const scanRes = await dynamodb.send(
      new QueryCommand({
        TableName: TABLE,
        IndexName: "GSI3",
        KeyConditionExpression: "GSI3PK = :pk",
        FilterExpression: "id = :batchId",
        ExpressionAttributeValues: { ":pk": "ALL_ASSIGNMENTS", ":batchId": id },
      })
    );

    // Simpler approach: the batch ID is known, find it by checking BATCH_TOKEN items
    // Actually, we need a different approach. Let's query by the batch directly.
    // The batch is stored at CLIENT#<clientId>/BATCH#<id>
    // Without knowing clientId, we need to find it.

    // Use a simple approach: find any assignment that references this batchId
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

    // Now get the batch to find the token
    const { GetCommand } = await import("@aws-sdk/lib-dynamodb");
    const batchRes = await dynamodb.send(
      new GetCommand({ TableName: TABLE, Key: { PK: `CLIENT#${clientId}`, SK: `BATCH#${id}` } })
    );

    if (!batchRes.Item) {
      return NextResponse.json({ error: "Signature batch not found" }, { status: 404 });
    }

    await deleteBatch(clientId, id, batchRes.Item.batchToken);

    return NextResponse.json({ message: "Signature batch deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting signature batch:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
