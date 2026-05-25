/**
 * Subscription & Plans — Database Operations
 */

import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { dynamodb, PLATFORM_TABLE, generateId, nowISO } from './client';
import type { Subscription, Plan } from '../types';
import type { SubStatus, PlanTier } from '../constants';

// ─── Plans ───────────────────────────────────────────────────────────────────

export async function createPlan(data: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>): Promise<Plan> {
  const id = generateId();
  const now = nowISO();
  const plan: Plan = { id, ...data, createdAt: now, updatedAt: now };

  await dynamodb.send(
    new PutCommand({
      TableName: PLATFORM_TABLE,
      Item: {
        PK: `PLAN#${id}`,
        SK: 'PROFILE',
        GSI1PK: 'ALL_PLANS',
        GSI1SK: `${plan.tier}#${id}`,
        entityType: 'PLAN',
        ...plan,
      },
    })
  );
  return plan;
}

export async function getPlanById(id: string): Promise<Plan | null> {
  const res = await dynamodb.send(
    new GetCommand({ TableName: PLATFORM_TABLE, Key: { PK: `PLAN#${id}`, SK: 'PROFILE' } })
  );
  return (res.Item as Plan) || null;
}

export async function listPlans(): Promise<Plan[]> {
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: PLATFORM_TABLE,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk',
      ExpressionAttributeValues: { ':pk': 'ALL_PLANS' },
    })
  );
  return (res.Items || []) as Plan[];
}

export async function updatePlan(id: string, updates: Partial<Omit<Plan, 'id' | 'createdAt'>>): Promise<void> {
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
      Key: { PK: `PLAN#${id}`, SK: 'PROFILE' },
      UpdateExpression: `SET ${expressions.join(', ')}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    })
  );
}

// ─── Subscriptions ───────────────────────────────────────────────────────────

export async function createSubscription(
  data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Subscription> {
  const id = generateId();
  const now = nowISO();
  const sub: Subscription = { id, ...data, createdAt: now, updatedAt: now };

  await dynamodb.send(
    new PutCommand({
      TableName: PLATFORM_TABLE,
      Item: {
        PK: `ORG#${data.organizationId}`,
        SK: `SUBSCRIPTION#${id}`,
        GSI1PK: 'ALL_SUBSCRIPTIONS',
        GSI1SK: `${sub.status}#${now}`,
        GSI2PK: `SUB_STATUS#${sub.status}`,
        GSI2SK: `${sub.planTier}#${now}`,
        entityType: 'SUBSCRIPTION',
        ...sub,
      },
    })
  );
  return sub;
}

export async function getSubscriptionByOrgId(orgId: string): Promise<Subscription | null> {
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: PLATFORM_TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: { ':pk': `ORG#${orgId}`, ':sk': 'SUBSCRIPTION#' },
      ScanIndexForward: false,
      Limit: 1,
    })
  );
  if (!res.Items?.length) return null;
  return res.Items[0] as Subscription;
}

export async function updateSubscription(
  orgId: string,
  subId: string,
  updates: Partial<Omit<Subscription, 'id' | 'organizationId' | 'createdAt'>>
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

  // Update GSI keys if status changed
  if (updates.status) {
    expressions.push('#GSI1SK = :gsi1sk');
    names['#GSI1SK'] = 'GSI1SK';
    values[':gsi1sk'] = `${updates.status}#${nowISO()}`;
    expressions.push('#GSI2PK = :gsi2pk');
    names['#GSI2PK'] = 'GSI2PK';
    values[':gsi2pk'] = `SUB_STATUS#${updates.status}`;
  }

  await dynamodb.send(
    new UpdateCommand({
      TableName: PLATFORM_TABLE,
      Key: { PK: `ORG#${orgId}`, SK: `SUBSCRIPTION#${subId}` },
      UpdateExpression: `SET ${expressions.join(', ')}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    })
  );
}

export async function listSubscriptions(options?: {
  status?: SubStatus;
  limit?: number;
  cursor?: string;
}): Promise<{ items: Subscription[]; nextCursor?: string }> {
  const limit = options?.limit || 25;

  const params: any = {
    TableName: PLATFORM_TABLE,
    IndexName: 'GSI1',
    KeyConditionExpression: 'GSI1PK = :pk',
    ExpressionAttributeValues: { ':pk': 'ALL_SUBSCRIPTIONS' } as Record<string, unknown>,
    ScanIndexForward: false,
    Limit: limit,
  };

  if (options?.status) {
    params.KeyConditionExpression += ' AND begins_with(GSI1SK, :prefix)';
    params.ExpressionAttributeValues[':prefix'] = `${options.status}#`;
  }

  if (options?.cursor) {
    params.ExclusiveStartKey = JSON.parse(Buffer.from(options.cursor, 'base64url').toString());
  }

  const res = await dynamodb.send(new QueryCommand(params));
  return {
    items: (res.Items || []) as Subscription[],
    nextCursor: res.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(res.LastEvaluatedKey)).toString('base64url')
      : undefined,
  };
}

export async function getSubscriptionStats(): Promise<{
  total: number;
  active: number;
  trial: number;
  pastDue: number;
  monthlyRevenue: number;
}> {
  const [active, trial, pastDue] = await Promise.all(
    ['ACTIVE', 'TRIAL', 'PAST_DUE'].map(async (status) => {
      const res = await dynamodb.send(
        new QueryCommand({
          TableName: PLATFORM_TABLE,
          IndexName: 'GSI1',
          KeyConditionExpression: 'GSI1PK = :pk AND begins_with(GSI1SK, :prefix)',
          ExpressionAttributeValues: { ':pk': 'ALL_SUBSCRIPTIONS', ':prefix': `${status}#` },
          Select: 'COUNT',
        })
      );
      return res.Count || 0;
    })
  );

  // Get active subscriptions for revenue calculation
  const activeSubs = await dynamodb.send(
    new QueryCommand({
      TableName: PLATFORM_TABLE,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk AND begins_with(GSI1SK, :prefix)',
      ExpressionAttributeValues: { ':pk': 'ALL_SUBSCRIPTIONS', ':prefix': 'ACTIVE#' },
      ProjectionExpression: 'pricePerMonth',
    })
  );

  const monthlyRevenue = (activeSubs.Items || []).reduce(
    (sum: number, item: Record<string, unknown>) => sum + ((item.pricePerMonth as number) || 0),
    0
  );

  return { total: active + trial + pastDue, active, trial, pastDue, monthlyRevenue };
}
