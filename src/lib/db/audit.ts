import {
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { dynamodb, AUDIT_TABLE } from "../dynamodb";
import { generateId, nowISO } from "../dynamodb-utils";

// ─── FORM ACTIVITY LOG ───────────────────────────────────────────────────────

export interface FormActivityLog {
  id: string;
  clientId?: string;
  adminId?: string;
  logType: "CLIENT" | "ADMIN";
  action: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export async function createActivityLog(data: Omit<FormActivityLog, "id" | "createdAt">): Promise<FormActivityLog> {
  const id = generateId();
  const now = nowISO();
  const log: FormActivityLog = { id, ...data, createdAt: now };

  // Write to both client and admin partitions for dual-access
  const items: any[] = [];

  if (data.clientId) {
    items.push({
      TableName: AUDIT_TABLE,
      Item: {
        PK: `LOG#CLIENT#${data.clientId}`,
        SK: `${now}#${id}`,
        GSI1PK: "ALL_LOGS",
        GSI1SK: `${now}#${id}`,
        entityType: "FORM_ACTIVITY_LOG",
        ...log,
      },
    });
  }

  if (data.adminId) {
    items.push({
      TableName: AUDIT_TABLE,
      Item: {
        PK: `LOG#ADMIN#${data.adminId}`,
        SK: `${now}#${id}`,
        GSI1PK: "ALL_LOGS",
        GSI1SK: `${now}#${id}`,
        entityType: "FORM_ACTIVITY_LOG",
        ...log,
      },
    });
  }

  // If neither client nor admin, write to system log
  if (!data.clientId && !data.adminId) {
    items.push({
      TableName: AUDIT_TABLE,
      Item: {
        PK: "LOG#SYSTEM",
        SK: `${now}#${id}`,
        GSI1PK: "ALL_LOGS",
        GSI1SK: `${now}#${id}`,
        entityType: "FORM_ACTIVITY_LOG",
        ...log,
      },
    });
  }

  await Promise.all(items.map((item) => dynamodb.send(new PutCommand(item))));
  return log;
}

export async function getClientLogs(clientId: string, limit = 50): Promise<FormActivityLog[]> {
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: AUDIT_TABLE,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: { ":pk": `LOG#CLIENT#${clientId}` },
      ScanIndexForward: false,
      Limit: limit,
    })
  );
  return (res.Items || []) as FormActivityLog[];
}

export async function getAdminLogs(adminId: string, limit = 50): Promise<FormActivityLog[]> {
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: AUDIT_TABLE,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: { ":pk": `LOG#ADMIN#${adminId}` },
      ScanIndexForward: false,
      Limit: limit,
    })
  );
  return (res.Items || []) as FormActivityLog[];
}

// ─── PII ACCESS LOG ──────────────────────────────────────────────────────────

export interface PIIAccessLog {
  id: string;
  adminId: string;
  clientId: string;
  formId?: string;
  assignmentId?: string;
  action: "reveal" | "hide";
  accessedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function createPIIAccessLog(data: Omit<PIIAccessLog, "id" | "accessedAt">): Promise<PIIAccessLog> {
  const id = generateId();
  const now = nowISO();
  const log: PIIAccessLog = { id, ...data, accessedAt: now };

  // Write to both admin and client partitions
  await Promise.all([
    dynamodb.send(
      new PutCommand({
        TableName: AUDIT_TABLE,
        Item: {
          PK: `PII#ADMIN#${data.adminId}`,
          SK: `${now}#${id}`,
          GSI1PK: "ALL_PII",
          GSI1SK: `${now}#${id}`,
          entityType: "PII_ACCESS_LOG",
          ...log,
        },
      })
    ),
    dynamodb.send(
      new PutCommand({
        TableName: AUDIT_TABLE,
        Item: {
          PK: `PII#CLIENT#${data.clientId}`,
          SK: `${now}#${id}`,
          entityType: "PII_ACCESS_LOG",
          ...log,
        },
      })
    ),
  ]);

  return log;
}

export async function getPIILogsByAdmin(adminId: string, limit = 100): Promise<PIIAccessLog[]> {
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: AUDIT_TABLE,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: { ":pk": `PII#ADMIN#${adminId}` },
      ScanIndexForward: false,
      Limit: limit,
    })
  );
  return (res.Items || []) as PIIAccessLog[];
}

export async function getPIILogsByClient(clientId: string, limit = 100): Promise<PIIAccessLog[]> {
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: AUDIT_TABLE,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: { ":pk": `PII#CLIENT#${clientId}` },
      ScanIndexForward: false,
      Limit: limit,
    })
  );
  return (res.Items || []) as PIIAccessLog[];
}

// ─── STAFF ACTIVITY LOG ──────────────────────────────────────────────────────

export interface StaffActivityLog {
  id: string;
  staffId?: string;
  adminId?: string;
  logType: "CLIENT" | "ADMIN";
  action: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export async function createStaffActivityLog(data: Omit<StaffActivityLog, "id" | "createdAt">): Promise<StaffActivityLog> {
  const id = generateId();
  const now = nowISO();
  const log: StaffActivityLog = { id, ...data, createdAt: now };

  const items: any[] = [];
  if (data.staffId) {
    items.push({
      TableName: AUDIT_TABLE,
      Item: { PK: `LOG#STAFF#${data.staffId}`, SK: `${now}#${id}`, entityType: "STAFF_ACTIVITY_LOG", ...log },
    });
  }
  if (data.adminId) {
    items.push({
      TableName: AUDIT_TABLE,
      Item: { PK: `LOG#ADMIN#${data.adminId}`, SK: `STAFF#${now}#${id}`, entityType: "STAFF_ACTIVITY_LOG", ...log },
    });
  }

  await Promise.all(items.map((item) => dynamodb.send(new PutCommand(item))));
  return log;
}
