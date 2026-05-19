import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { dynamodb, NOTIFICATIONS_TABLE } from "../dynamodb";
import { generateId, nowISO } from "../dynamodb-utils";

// ─── FORM SUBMISSION NOTIFICATION ────────────────────────────────────────────

export interface FormSubmissionNotification {
  id: string;
  adminId: string;
  clientId: string;
  formSubmissionId: string;
  isRead: boolean;
  createdAt: string;
  // Denormalized for display
  clientName?: string;
  formTitle?: string;
  formKey?: string;
}

export async function createNotification(data: Omit<FormSubmissionNotification, "id" | "createdAt" | "isRead">): Promise<FormSubmissionNotification> {
  const id = generateId();
  const now = nowISO();
  const notification: FormSubmissionNotification = { id, ...data, isRead: false, createdAt: now };

  await dynamodb.send(
    new PutCommand({
      TableName: NOTIFICATIONS_TABLE,
      Item: {
        PK: `NOTIF#ADMIN#${data.adminId}`,
        SK: `${now}#${id}`,
        entityType: "FORM_SUBMISSION_NOTIFICATION",
        // Sparse GSI for unread notifications
        GSI1PK: `UNREAD#ADMIN#${data.adminId}`,
        GSI1SK: `${now}#${id}`,
        ...notification,
      },
    })
  );
  return notification;
}

export async function getNotifications(
  adminId: string,
  options: { page?: number; limit?: number; unreadOnly?: boolean } = {}
): Promise<{ notifications: FormSubmissionNotification[]; total: number }> {
  const { page = 1, limit = 10, unreadOnly = false } = options;

  let queryParams: any;
  if (unreadOnly) {
    queryParams = {
      TableName: NOTIFICATIONS_TABLE,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk",
      ExpressionAttributeValues: { ":pk": `UNREAD#ADMIN#${adminId}` },
      ScanIndexForward: false,
    };
  } else {
    queryParams = {
      TableName: NOTIFICATIONS_TABLE,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: { ":pk": `NOTIF#ADMIN#${adminId}` },
      ScanIndexForward: false, // Newest first
    };
  }

  // Get all to count, then paginate
  const res = await dynamodb.send(new QueryCommand(queryParams));
  const all = (res.Items || []) as FormSubmissionNotification[];
  const total = all.length;
  const paginated = all.slice((page - 1) * limit, page * limit);

  return { notifications: paginated, total };
}

export async function getUnreadCount(adminId: string): Promise<number> {
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: NOTIFICATIONS_TABLE,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk",
      ExpressionAttributeValues: { ":pk": `UNREAD#ADMIN#${adminId}` },
      Select: "COUNT",
    })
  );
  return res.Count || 0;
}

export async function getNotificationById(adminId: string, id: string, createdAt: string): Promise<FormSubmissionNotification | null> {
  const res = await dynamodb.send(
    new GetCommand({
      TableName: NOTIFICATIONS_TABLE,
      Key: { PK: `NOTIF#ADMIN#${adminId}`, SK: `${createdAt}#${id}` },
    })
  );
  return res.Item ? (res.Item as FormSubmissionNotification) : null;
}

export async function markNotificationRead(adminId: string, id: string, createdAt: string): Promise<void> {
  // Remove from unread GSI (sparse index) by setting GSI1PK to null/removing it
  await dynamodb.send(
    new UpdateCommand({
      TableName: NOTIFICATIONS_TABLE,
      Key: { PK: `NOTIF#ADMIN#${adminId}`, SK: `${createdAt}#${id}` },
      UpdateExpression: "SET isRead = :t REMOVE GSI1PK, GSI1SK",
      ExpressionAttributeValues: { ":t": true },
    })
  );
}

export async function markNotificationUnread(adminId: string, id: string, createdAt: string): Promise<void> {
  await dynamodb.send(
    new UpdateCommand({
      TableName: NOTIFICATIONS_TABLE,
      Key: { PK: `NOTIF#ADMIN#${adminId}`, SK: `${createdAt}#${id}` },
      UpdateExpression: "SET isRead = :f, GSI1PK = :gpk, GSI1SK = :gsk",
      ExpressionAttributeValues: {
        ":f": false,
        ":gpk": `UNREAD#ADMIN#${adminId}`,
        ":gsk": `${createdAt}#${id}`,
      },
    })
  );
}

// ─── STAFF SUBMISSION NOTIFICATION ───────────────────────────────────────────

export interface StaffSubmissionNotification {
  id: string;
  adminId: string;
  staffId: string;
  formSubmissionId: string;
  isRead: boolean;
  createdAt: string;
  staffName?: string;
  formTitle?: string;
}

export async function createStaffNotification(data: Omit<StaffSubmissionNotification, "id" | "createdAt" | "isRead">): Promise<StaffSubmissionNotification> {
  const id = generateId();
  const now = nowISO();
  const notification: StaffSubmissionNotification = { id, ...data, isRead: false, createdAt: now };

  await dynamodb.send(
    new PutCommand({
      TableName: NOTIFICATIONS_TABLE,
      Item: {
        PK: `STAFF_NOTIF#ADMIN#${data.adminId}`,
        SK: `${now}#${id}`,
        entityType: "STAFF_SUBMISSION_NOTIFICATION",
        GSI1PK: `UNREAD#ADMIN#${data.adminId}`,
        GSI1SK: `STAFF#${now}#${id}`,
        ...notification,
      },
    })
  );
  return notification;
}
