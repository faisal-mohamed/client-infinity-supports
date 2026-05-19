import { NextResponse } from 'next/server';
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamodb, TABLE } from "@/lib/dynamodb";
import { startOfMonth } from 'date-fns';

export async function GET(request: Request) {
  try {
    // Count active clients
    const clientsRes = await dynamodb.send(
      new QueryCommand({
        TableName: TABLE,
        IndexName: "GSI1",
        KeyConditionExpression: "GSI1PK = :pk AND begins_with(GSI1SK, :prefix)",
        ExpressionAttributeValues: { ":pk": "CLIENTS", ":prefix": "ACTIVE#" },
        Select: "COUNT",
      })
    );
    const totalClients = clientsRes.Count || 0;

    // Count new clients this month
    const monthStart = startOfMonth(new Date()).toISOString();
    const newClientsRes = await dynamodb.send(
      new QueryCommand({
        TableName: TABLE,
        IndexName: "GSI3",
        KeyConditionExpression: "GSI3PK = :pk AND GSI3SK >= :since",
        ExpressionAttributeValues: { ":pk": "CLIENTS_BY_DATE", ":since": monthStart },
        Select: "COUNT",
      })
    );
    const newClientsThisMonth = newClientsRes.Count || 0;

    // Count form assignments by status
    const allAssignmentsRes = await dynamodb.send(
      new QueryCommand({
        TableName: TABLE,
        IndexName: "GSI3",
        KeyConditionExpression: "GSI3PK = :pk",
        ExpressionAttributeValues: { ":pk": "ALL_ASSIGNMENTS" },
      })
    );
    const allAssignments = allAssignmentsRes.Items || [];

    let completedForms = 0;
    let notStarted = 0;
    let formsInProgress = 0;
    let signatureRequests = 0;
    let completedSignatures = 0;

    for (const item of allAssignments) {
      const status = item.currentStatus;
      if (status === "completed") completedForms++;
      else if (status === "not_started") notStarted++;
      else if (status === "in_progress") formsInProgress++;
      else if (status === "pending_admin_review") formsInProgress++;

      // Signature tracking
      if (item.requiresSignature) {
        signatureRequests++;
        if (status === "completed") completedSignatures++;
      }
    }

    return NextResponse.json({
      totalClients,
      newClientsThisMonth,
      completedForms,
      notStarted,
      formsInProgress,
      signatureRequests,
      completedSignatures,
    });
  } catch (error) {
    console.error("Dashboard stats fetch error:", error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats.' },
      { status: 500 }
    );
  }
}
