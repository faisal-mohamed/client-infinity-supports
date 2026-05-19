import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
  DeleteCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { dynamodb, TABLE } from "../dynamodb";
import { generateId, nowISO, ttlFromNow } from "../dynamodb-utils";

// ─── ADMIN ───────────────────────────────────────────────────────────────────

export interface Admin {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  resetToken?: string;
  resetTokenExpiry?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getAdminByEmail(email: string): Promise<Admin | null> {
  const res = await dynamodb.send(
    new GetCommand({
      TableName: TABLE,
      Key: { PK: `ADMIN_EMAIL#${email.toLowerCase()}`, SK: "PROFILE" },
    })
  );
  if (!res.Item) return null;
  // Fetch full admin record
  return getAdminById(res.Item.adminId as string);
}

export async function getAdminById(id: string): Promise<Admin | null> {
  const res = await dynamodb.send(
    new GetCommand({
      TableName: TABLE,
      Key: { PK: `ADMIN#${id}`, SK: "PROFILE" },
      ConsistentRead: true,
    })
  );
  if (!res.Item) return null;
  return res.Item as Admin;
}

export async function createAdmin(data: { name: string; email: string; passwordHash: string }): Promise<Admin> {
  const id = generateId();
  const now = nowISO();
  const admin: Admin = { id, ...data, email: data.email.toLowerCase(), createdAt: now, updatedAt: now };

  await dynamodb.send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: TABLE,
            Item: { PK: `ADMIN#${id}`, SK: "PROFILE", entityType: "ADMIN", ...admin },
            ConditionExpression: "attribute_not_exists(PK)",
          },
        },
        {
          Put: {
            TableName: TABLE,
            Item: { PK: `ADMIN_EMAIL#${admin.email}`, SK: "PROFILE", adminId: id, entityType: "ADMIN_EMAIL" },
            ConditionExpression: "attribute_not_exists(PK)",
          },
        },
      ],
    })
  );
  return admin;
}

export async function updateAdmin(id: string, updates: Partial<Omit<Admin, "id" | "email" | "createdAt">>): Promise<void> {
  const expressions: string[] = [];
  const names: Record<string, string> = {};
  const values: Record<string, any> = {};

  Object.entries({ ...updates, updatedAt: nowISO() }).forEach(([key, val]) => {
    if (val !== undefined) {
      expressions.push(`#${key} = :${key}`);
      names[`#${key}`] = key;
      values[`:${key}`] = val;
    }
  });

  await dynamodb.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { PK: `ADMIN#${id}`, SK: "PROFILE" },
      UpdateExpression: `SET ${expressions.join(", ")}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    })
  );
}

export async function getAllAdmins(): Promise<Admin[]> {
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: TABLE,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk",
      ExpressionAttributeValues: { ":pk": "ALL_ADMINS" },
    })
  );
  return (res.Items || []) as Admin[];
}

// ─── MFA CODES ───────────────────────────────────────────────────────────────

export interface MfaCode {
  id: string;
  adminId: string;
  codeHash: string;
  expiresAt: string;
  attempts: number;
  maxAttempts: number;
  used: boolean;
  verified: boolean;
  mfaToken?: string;
  tokenExpiresAt?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export async function createMfaCode(data: Omit<MfaCode, "id" | "createdAt">): Promise<MfaCode> {
  const id = generateId();
  const now = nowISO();
  const item: MfaCode = { id, ...data, createdAt: now };
  const ttl = ttlFromNow(86400); // 24h auto-cleanup

  const putItems: any[] = [
    {
      Put: {
        TableName: TABLE,
        Item: { PK: `ADMIN#${data.adminId}`, SK: `MFA#${now}#${id}`, entityType: "MFA_CODE", ttl, ...item },
      },
    },
  ];

  // If mfaToken provided, create token lookup
  if (data.mfaToken) {
    putItems.push({
      Put: {
        TableName: TABLE,
        Item: { PK: `MFA_TOKEN#${data.mfaToken}`, SK: "MFA_TOKEN", adminId: data.adminId, mfaCodeId: id, ttl, entityType: "MFA_TOKEN_LOOKUP" },
      },
    });
  }

  await dynamodb.send(new TransactWriteCommand({ TransactItems: putItems }));
  return item;
}

export async function getActiveMfaCodes(adminId: string): Promise<MfaCode[]> {
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: { ":pk": `ADMIN#${adminId}`, ":sk": "MFA#" },
      FilterExpression: "used = :f AND expiresAt > :now",
      ExpressionAttributeValues: {
        ":pk": `ADMIN#${adminId}`,
        ":sk": "MFA#",
        ":f": false,
        ":now": nowISO(),
      },
      ScanIndexForward: false,
    })
  );
  return (res.Items || []) as MfaCode[];
}

export async function getMfaByToken(token: string): Promise<{ adminId: string; mfaCodeId: string } | null> {
  const res = await dynamodb.send(
    new GetCommand({ TableName: TABLE, Key: { PK: `MFA_TOKEN#${token}`, SK: "MFA_TOKEN" } })
  );
  if (!res.Item) return null;
  return { adminId: res.Item.adminId as string, mfaCodeId: res.Item.mfaCodeId as string };
}

export async function updateMfaCode(adminId: string, sk: string, updates: Partial<MfaCode>): Promise<void> {
  const expressions: string[] = [];
  const names: Record<string, string> = {};
  const values: Record<string, any> = {};

  Object.entries(updates).forEach(([key, val]) => {
    if (val !== undefined) {
      expressions.push(`#${key} = :${key}`);
      names[`#${key}`] = key;
      values[`:${key}`] = val;
    }
  });

  if (expressions.length === 0) return;

  await dynamodb.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { PK: `ADMIN#${adminId}`, SK: sk },
      UpdateExpression: `SET ${expressions.join(", ")}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    })
  );
}

export async function consumeMfaToken(token: string): Promise<void> {
  await dynamodb.send(
    new DeleteCommand({ TableName: TABLE, Key: { PK: `MFA_TOKEN#${token}`, SK: "MFA_TOKEN" } })
  );
}

export async function setMfaToken(adminId: string, sk: string, mfaToken: string, tokenExpiresAt: string): Promise<void> {
  const ttl = ttlFromNow(86400);
  await dynamodb.send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Update: {
            TableName: TABLE,
            Key: { PK: `ADMIN#${adminId}`, SK: sk },
            UpdateExpression: "SET mfaToken = :t, tokenExpiresAt = :e, verified = :v",
            ExpressionAttributeValues: { ":t": mfaToken, ":e": tokenExpiresAt, ":v": true },
          },
        },
        {
          Put: {
            TableName: TABLE,
            Item: { PK: `MFA_TOKEN#${mfaToken}`, SK: "MFA_TOKEN", adminId, mfaCodeSK: sk, ttl, entityType: "MFA_TOKEN_LOOKUP" },
          },
        },
      ],
    })
  );
}
