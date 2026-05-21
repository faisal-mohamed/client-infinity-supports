import { createActivityLog } from "./db/audit";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamodb, AUDIT_TABLE } from "./dynamodb";
import { nowISO } from "./dynamodb-utils";

export interface EmailLogEntry {
  type: 'batch_completed' | 'test_email';
  recipient: string;
  subject: string;
  clientId?: string;
  clientName?: string;
  batchId?: string;
  formsCount?: number;
  attachmentsCount?: number;
  messageId?: string;
  status: 'success' | 'failed' | 'retry';
  error?: string;
  attemptCount?: number;
  sentAt?: Date;
}

export async function logEmailSuccess(entry: EmailLogEntry): Promise<void> {
  try {
    await createActivityLog({
      clientId: entry.clientId || undefined,
      logType: "ADMIN",
      action: `Email Sent: ${entry.type}`,
      metadata: {
        recipient: entry.recipient,
        subject: entry.subject,
        messageId: entry.messageId,
        status: entry.status,
        clientName: entry.clientName,
        batchId: entry.batchId,
        formsCount: entry.formsCount,
        attachmentsCount: entry.attachmentsCount,
        sentAt: entry.sentAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to log email success:", error);
  }
}

export async function logEmailFailure(entry: EmailLogEntry): Promise<void> {
  try {
    await createActivityLog({
      clientId: entry.clientId || undefined,
      logType: "ADMIN",
      action: `Email Failed: ${entry.type}`,
      metadata: {
        recipient: entry.recipient,
        subject: entry.subject,
        status: entry.status,
        error: entry.error,
        attemptCount: entry.attemptCount,
        clientName: entry.clientName,
        batchId: entry.batchId,
      },
    });
  } catch (error) {
    console.error("Failed to log email failure:", error);
  }
}

export async function getEmailStats(days: number = 7) {
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: AUDIT_TABLE,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk AND GSI1SK >= :since",
      ExpressionAttributeValues: { ":pk": "ALL_LOGS", ":since": since },
      FilterExpression: "contains(#action, :email)",
      ExpressionAttributeNames: { "#action": "action" },
    })
  );
  const items = res.Items || [];
  const successItems = items.filter((i: any) => i.action?.includes("Email Sent"));
  const failedItems = items.filter((i: any) => i.action?.includes("Email Failed"));

  return {
    totalEmails: items.length,
    successfulEmails: successItems.length,
    failedEmails: failedItems.length,
    successRate: items.length > 0 ? Math.round((successItems.length / items.length) * 100) : 100,
    retryAttempts: failedItems.filter((i: any) => i.metadata?.attemptCount > 1).length,
  };
}

export async function getRecentEmailFailures(limit: number = 10) {
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: AUDIT_TABLE,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk",
      ExpressionAttributeValues: { ":pk": "ALL_LOGS" },
      FilterExpression: "contains(#action, :failed)",
      ExpressionAttributeNames: { "#action": "action" },
      ScanIndexForward: false,
      Limit: 100, // Fetch more, filter down
    })
  );
  const failures = (res.Items || [])
    .filter((i: any) => i.action?.includes("Email Failed"))
    .slice(0, limit)
    .map((i: any) => ({
      timestamp: i.createdAt,
      recipient: i.metadata?.recipient,
      error: i.metadata?.error,
      clientName: i.metadata?.clientName,
      emailType: i.metadata?.type || i.action,
    }));
  return failures;
}
