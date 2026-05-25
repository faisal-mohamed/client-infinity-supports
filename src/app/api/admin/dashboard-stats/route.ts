import { NextResponse } from 'next/server';
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamodb, TABLE } from "@/lib/dynamodb";
import { getTenantContext, isTenantError } from "@/lib/tenant-context";

export async function GET() {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const clientsGSI1PK = tenant.organizationId ? `ORG#${tenant.organizationId}#CLIENTS` : "CLIENTS";

    // Count active clients (scoped by org)
    const clientsRes = await dynamodb.send(
      new QueryCommand({
        TableName: TABLE,
        IndexName: "GSI1",
        KeyConditionExpression: "GSI1PK = :pk AND begins_with(GSI1SK, :prefix)",
        ExpressionAttributeValues: { ":pk": clientsGSI1PK, ":prefix": "ACTIVE#" },
        Select: "COUNT",
      })
    );
    const totalClients = clientsRes.Count || 0;

    // If org-scoped and has 0 clients, no need to query forms
    if (tenant.organizationId && totalClients === 0) {
      return NextResponse.json({
        totalClients: 0,
        newClientsThisMonth: 0,
        completedForms: 0,
        notStarted: 0,
        formsInProgress: 0,
        signatureRequests: 0,
        completedSignatures: 0,
      });
    }

    // Get all client IDs for this org (to filter assignments)
    const clientsData = await dynamodb.send(
      new QueryCommand({
        TableName: TABLE,
        IndexName: "GSI1",
        KeyConditionExpression: "GSI1PK = :pk AND begins_with(GSI1SK, :prefix)",
        ExpressionAttributeValues: { ":pk": clientsGSI1PK, ":prefix": "ACTIVE#" },
        ProjectionExpression: "id",
      })
    );
    const orgClientIds = new Set((clientsData.Items || []).map((i) => i.id));

    // Count new clients this month (filter by org client IDs)
    let newClientsThisMonth = 0;
    if (!tenant.organizationId) {
      // Legacy: count all
      const { startOfMonth } = await import('date-fns');
      const monthStart = startOfMonth(new Date()).toISOString();
      const res = await dynamodb.send(
        new QueryCommand({
          TableName: TABLE,
          IndexName: "GSI3",
          KeyConditionExpression: "GSI3PK = :pk AND GSI3SK >= :since",
          ExpressionAttributeValues: { ":pk": "CLIENTS_BY_DATE", ":since": monthStart },
          Select: "COUNT",
        })
      );
      newClientsThisMonth = res.Count || 0;
    } else {
      // Org-scoped: count clients created this month in this org
      const { startOfMonth } = await import('date-fns');
      const monthStart = startOfMonth(new Date()).toISOString();
      const res = await dynamodb.send(
        new QueryCommand({
          TableName: TABLE,
          IndexName: "GSI3",
          KeyConditionExpression: "GSI3PK = :pk AND GSI3SK >= :since",
          ExpressionAttributeValues: { ":pk": "CLIENTS_BY_DATE", ":since": monthStart },
          ProjectionExpression: "id",
        })
      );
      newClientsThisMonth = (res.Items || []).filter((i) => orgClientIds.has(i.id)).length;
    }

    // Count form assignments — only for this org's clients
    const allAssignmentsRes = await dynamodb.send(
      new QueryCommand({
        TableName: TABLE,
        IndexName: "GSI3",
        KeyConditionExpression: "GSI3PK = :pk",
        ExpressionAttributeValues: { ":pk": "ALL_ASSIGNMENTS" },
      })
    );

    let completedForms = 0;
    let notStarted = 0;
    let formsInProgress = 0;
    let signatureRequests = 0;
    let completedSignatures = 0;

    for (const item of (allAssignmentsRes.Items || [])) {
      // Filter: only count assignments for this org's clients
      if (tenant.organizationId && !orgClientIds.has(item.clientId)) continue;

      const status = item.currentStatus;
      if (status === "completed") completedForms++;
      else if (status === "not_started") notStarted++;
      else if (status === "in_progress" || status === "pending_admin_review") formsInProgress++;

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
    return NextResponse.json({ error: 'Failed to fetch dashboard stats.' }, { status: 500 });
  }
}
