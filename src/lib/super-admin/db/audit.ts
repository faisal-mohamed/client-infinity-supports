/**
 * Platform Audit Log — Database Operations
 * Immutable, append-only audit trail for Super Admin actions
 */

import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamodb, PLATFORM_TABLE, generateId, nowISO } from './client';
import type { PlatformAuditLog } from '../types';
import type { AuditCategory } from '../constants';

export async function createAuditLog(
  data: Omit<PlatformAuditLog, 'id' | 'createdAt'>
): Promise<PlatformAuditLog> {
  const id = generateId();
  const now = nowISO();
  const log: PlatformAuditLog = { id, ...data, createdAt: now };

  // Write to multiple partitions for different access patterns
  const items = [
    // By category (for filtered views)
    {
      TableName: PLATFORM_TABLE,
      Item: {
        PK: `AUDIT#${data.category}`,
        SK: `${now}#${id}`,
        GSI1PK: 'ALL_AUDIT',
        GSI1SK: `${now}#${id}`,
        GSI3PK: `AUDIT#${data.category}`,
        GSI3SK: `${now}#${id}`,
        entityType: 'PLATFORM_AUDIT',
        ...log,
      },
    },
  ];

  // By target org (if applicable)
  if (data.targetType === 'organization' && data.targetId) {
    items.push({
      TableName: PLATFORM_TABLE,
      Item: {
        PK: `AUDIT#ORG#${data.targetId}`,
        SK: `${now}#${id}`,
        GSI1PK: 'ALL_AUDIT',
        GSI1SK: `${now}#${id}`,
        GSI3PK: `AUDIT#${data.category}`,
        GSI3SK: `${now}#${id}`,
        entityType: 'PLATFORM_AUDIT',
        ...log,
      },
    });
  }

  // By actor (for "what did this admin do" queries)
  items.push({
    TableName: PLATFORM_TABLE,
    Item: {
      PK: `AUDIT#ACTOR#${data.actorId}`,
      SK: `${now}#${id}`,
      GSI1PK: 'ALL_AUDIT',
      GSI1SK: `${now}#${id}`,
      GSI3PK: `AUDIT#${data.category}`,
      GSI3SK: `${now}#${id}`,
      entityType: 'PLATFORM_AUDIT',
      ...log,
    },
  });

  await Promise.all(items.map((item) => dynamodb.send(new PutCommand(item))));
  return log;
}

export async function listAuditLogs(options?: {
  category?: AuditCategory;
  organizationId?: string;
  actorId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  cursor?: string;
}): Promise<{ items: PlatformAuditLog[]; nextCursor?: string }> {
  const limit = options?.limit || 50;

  let pk: string;
  if (options?.organizationId) {
    pk = `AUDIT#ORG#${options.organizationId}`;
  } else if (options?.actorId) {
    pk = `AUDIT#ACTOR#${options.actorId}`;
  } else if (options?.category) {
    pk = `AUDIT#${options.category}`;
  } else {
    // Use GSI1 for all audit logs
    const params: any = {
      TableName: PLATFORM_TABLE,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk',
      ExpressionAttributeValues: { ':pk': 'ALL_AUDIT' } as Record<string, unknown>,
      ScanIndexForward: false,
      Limit: limit,
    };

    if (options?.startDate && options?.endDate) {
      params.KeyConditionExpression += ' AND GSI1SK BETWEEN :start AND :end';
      params.ExpressionAttributeValues[':start'] = options.startDate;
      params.ExpressionAttributeValues[':end'] = options.endDate + '\uffff';
    }

    if (options?.cursor) {
      params.ExclusiveStartKey = JSON.parse(Buffer.from(options.cursor, 'base64url').toString());
    }

    const res = await dynamodb.send(new QueryCommand(params));
    return {
      items: (res.Items || []) as PlatformAuditLog[],
      nextCursor: res.LastEvaluatedKey
        ? Buffer.from(JSON.stringify(res.LastEvaluatedKey)).toString('base64url')
        : undefined,
    };
  }

  // Query by specific partition
  const params: any = {
    TableName: PLATFORM_TABLE,
    KeyConditionExpression: 'PK = :pk',
    ExpressionAttributeValues: { ':pk': pk } as Record<string, unknown>,
    ScanIndexForward: false,
    Limit: limit,
  };

  if (options?.startDate && options?.endDate) {
    params.KeyConditionExpression += ' AND SK BETWEEN :start AND :end';
    params.ExpressionAttributeValues[':start'] = options.startDate;
    params.ExpressionAttributeValues[':end'] = options.endDate + '\uffff';
  }

  if (options?.cursor) {
    params.ExclusiveStartKey = JSON.parse(Buffer.from(options.cursor, 'base64url').toString());
  }

  const res = await dynamodb.send(new QueryCommand(params));
  return {
    items: (res.Items || []) as PlatformAuditLog[],
    nextCursor: res.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(res.LastEvaluatedKey)).toString('base64url')
      : undefined,
  };
}

export async function getAuditLogsByOrg(
  orgId: string,
  limit = 50
): Promise<PlatformAuditLog[]> {
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: PLATFORM_TABLE,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: { ':pk': `AUDIT#ORG#${orgId}` },
      ScanIndexForward: false,
      Limit: limit,
    })
  );
  return (res.Items || []) as PlatformAuditLog[];
}
