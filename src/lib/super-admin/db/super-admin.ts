/**
 * Super Admin User — Database Operations
 */

import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { dynamodb, PLATFORM_TABLE, generateId, nowISO } from './client';
import type { SuperAdmin } from '../types';

export async function getSuperAdminByEmail(email: string): Promise<SuperAdmin | null> {
  const res = await dynamodb.send(
    new GetCommand({
      TableName: PLATFORM_TABLE,
      Key: { PK: `SA_EMAIL#${email.toLowerCase()}`, SK: 'PROFILE' },
    })
  );
  if (!res.Item) return null;
  return getSuperAdminById(res.Item.superAdminId as string);
}

export async function getSuperAdminById(id: string): Promise<SuperAdmin | null> {
  const res = await dynamodb.send(
    new GetCommand({
      TableName: PLATFORM_TABLE,
      Key: { PK: `SA#${id}`, SK: 'PROFILE' },
      ConsistentRead: true,
    })
  );
  if (!res.Item) return null;
  return res.Item as SuperAdmin;
}

export async function createSuperAdmin(data: {
  email: string;
  name: string;
  passwordHash: string;
}): Promise<SuperAdmin> {
  const id = generateId();
  const now = nowISO();
  const admin: SuperAdmin = {
    id,
    email: data.email.toLowerCase(),
    name: data.name,
    passwordHash: data.passwordHash,
    mfaEnabled: true, // Enforced for super admins
    createdAt: now,
    updatedAt: now,
  };

  await dynamodb.send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: PLATFORM_TABLE,
            Item: {
              PK: `SA#${id}`,
              SK: 'PROFILE',
              GSI1PK: 'ALL_SUPER_ADMINS',
              GSI1SK: now,
              entityType: 'SUPER_ADMIN',
              ...admin,
            },
            ConditionExpression: 'attribute_not_exists(PK)',
          },
        },
        {
          Put: {
            TableName: PLATFORM_TABLE,
            Item: {
              PK: `SA_EMAIL#${admin.email}`,
              SK: 'PROFILE',
              superAdminId: id,
              entityType: 'SA_EMAIL_LOOKUP',
            },
            ConditionExpression: 'attribute_not_exists(PK)',
          },
        },
      ],
    })
  );
  return admin;
}

export async function updateSuperAdmin(
  id: string,
  updates: Partial<Pick<SuperAdmin, 'name' | 'mfaEnabled' | 'lastLoginAt'>>
): Promise<void> {
  const expressions: string[] = [];
  const names: Record<string, string> = {};
  const values: Record<string, unknown> = {};

  Object.entries({ ...updates, updatedAt: nowISO() }).forEach(([key, val]) => {
    if (val !== undefined) {
      expressions.push(`#${key} = :${key}`);
      names[`#${key}`] = key;
      values[`:${key}`] = val;
    }
  });

  await dynamodb.send(
    new UpdateCommand({
      TableName: PLATFORM_TABLE,
      Key: { PK: `SA#${id}`, SK: 'PROFILE' },
      UpdateExpression: `SET ${expressions.join(', ')}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    })
  );
}

export async function listSuperAdmins(): Promise<SuperAdmin[]> {
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: PLATFORM_TABLE,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk',
      ExpressionAttributeValues: { ':pk': 'ALL_SUPER_ADMINS' },
    })
  );
  return (res.Items || []) as SuperAdmin[];
}
