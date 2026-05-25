/**
 * Organization (Provider) — Database Operations
 */

import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { dynamodb, PLATFORM_TABLE, generateId, nowISO } from './client';
import type { Organization } from '../types';
import type { OrgStatus } from '../constants';

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function createOrganization(
  data: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Organization> {
  const id = generateId();
  const now = nowISO();
  const org: Organization = { id, ...data, createdAt: now, updatedAt: now };

  await dynamodb.send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: PLATFORM_TABLE,
            Item: {
              PK: `ORG#${id}`,
              SK: 'PROFILE',
              GSI1PK: 'ALL_ORGS',
              GSI1SK: `${org.status}#${now}`,
              GSI2PK: `ABN#${org.abn}`,
              GSI2SK: 'ORG',
              entityType: 'ORGANIZATION',
              ...org,
            },
            ConditionExpression: 'attribute_not_exists(PK)',
          },
        },
        // ABN uniqueness check via conditional put
        {
          Put: {
            TableName: PLATFORM_TABLE,
            Item: {
              PK: `ABN#${org.abn}`,
              SK: 'LOOKUP',
              organizationId: id,
              entityType: 'ABN_LOOKUP',
            },
            ConditionExpression: 'attribute_not_exists(PK)',
          },
        },
      ],
    })
  );
  return org;
}

export async function getOrganizationById(id: string): Promise<Organization | null> {
  const res = await dynamodb.send(
    new GetCommand({
      TableName: PLATFORM_TABLE,
      Key: { PK: `ORG#${id}`, SK: 'PROFILE' },
    })
  );
  if (!res.Item) return null;
  return res.Item as Organization;
}

export async function getOrganizationByABN(abn: string): Promise<Organization | null> {
  const res = await dynamodb.send(
    new GetCommand({
      TableName: PLATFORM_TABLE,
      Key: { PK: `ABN#${abn}`, SK: 'LOOKUP' },
    })
  );
  if (!res.Item) return null;
  return getOrganizationById(res.Item.organizationId as string);
}

export async function updateOrganization(
  id: string,
  updates: Partial<Omit<Organization, 'id' | 'abn' | 'createdAt'>>
): Promise<void> {
  const expressions: string[] = [];
  const names: Record<string, string> = {};
  const values: Record<string, unknown> = {};

  const allUpdates = { ...updates, updatedAt: nowISO() };

  Object.entries(allUpdates).forEach(([key, val]) => {
    if (val !== undefined) {
      expressions.push(`#${key} = :${key}`);
      names[`#${key}`] = key;
      values[`:${key}`] = val;
    }
  });

  // Update GSI1SK if status changed (for filtering by status)
  if (updates.status) {
    expressions.push('#GSI1SK = :gsi1sk');
    names['#GSI1SK'] = 'GSI1SK';
    // Preserve original createdAt in sort key
    const org = await getOrganizationById(id);
    values[':gsi1sk'] = `${updates.status}#${org?.createdAt || nowISO()}`;
  }

  await dynamodb.send(
    new UpdateCommand({
      TableName: PLATFORM_TABLE,
      Key: { PK: `ORG#${id}`, SK: 'PROFILE' },
      UpdateExpression: `SET ${expressions.join(', ')}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    })
  );
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export async function listOrganizations(options?: {
  status?: OrgStatus;
  limit?: number;
  cursor?: string;
}): Promise<{ items: Organization[]; nextCursor?: string }> {
  const limit = options?.limit || 25;

  const params: any = {
    TableName: PLATFORM_TABLE,
    IndexName: 'GSI1',
    KeyConditionExpression: 'GSI1PK = :pk',
    ExpressionAttributeValues: { ':pk': 'ALL_ORGS' } as Record<string, unknown>,
    ScanIndexForward: false,
    Limit: limit,
  };

  // Filter by status prefix
  if (options?.status) {
    params.KeyConditionExpression += ' AND begins_with(GSI1SK, :statusPrefix)';
    params.ExpressionAttributeValues[':statusPrefix'] = `${options.status}#`;
  }

  if (options?.cursor) {
    params.ExclusiveStartKey = JSON.parse(Buffer.from(options.cursor, 'base64url').toString());
  }

  const res = await dynamodb.send(new QueryCommand(params));
  const items = (res.Items || []) as Organization[];
  const nextCursor = res.LastEvaluatedKey
    ? Buffer.from(JSON.stringify(res.LastEvaluatedKey)).toString('base64url')
    : undefined;

  return { items, nextCursor };
}

export async function countOrganizationsByStatus(): Promise<Record<OrgStatus, number>> {
  const counts: Record<string, number> = {
    PENDING: 0,
    VERIFYING: 0,
    ACTIVE: 0,
    SUSPENDED: 0,
    DEACTIVATED: 0,
  };

  // Query each status prefix (efficient for dashboard stats)
  await Promise.all(
    Object.keys(counts).map(async (status) => {
      const res = await dynamodb.send(
        new QueryCommand({
          TableName: PLATFORM_TABLE,
          IndexName: 'GSI1',
          KeyConditionExpression: 'GSI1PK = :pk AND begins_with(GSI1SK, :prefix)',
          ExpressionAttributeValues: { ':pk': 'ALL_ORGS', ':prefix': `${status}#` },
          Select: 'COUNT',
        })
      );
      counts[status] = res.Count || 0;
    })
  );

  return counts as Record<OrgStatus, number>;
}

// ─── Status Transitions ──────────────────────────────────────────────────────

export async function approveOrganization(id: string, approvedBy: string): Promise<void> {
  await updateOrganization(id, {
    status: 'ACTIVE',
    onboardedBy: approvedBy,
    onboardedAt: nowISO(),
  });
}

export async function suspendOrganization(id: string, reason: string): Promise<void> {
  await updateOrganization(id, {
    status: 'SUSPENDED',
    suspendedAt: nowISO(),
    suspendedReason: reason,
  });
}

export async function reactivateOrganization(id: string): Promise<void> {
  await updateOrganization(id, {
    status: 'ACTIVE',
    suspendedAt: undefined,
    suspendedReason: undefined,
  });
}

export async function deactivateOrganization(id: string, reason: string): Promise<void> {
  await updateOrganization(id, {
    status: 'DEACTIVATED',
    deactivatedAt: nowISO(),
    deactivatedReason: reason,
  });
}
