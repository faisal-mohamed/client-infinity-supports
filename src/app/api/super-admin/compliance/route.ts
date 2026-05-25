import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin, isErrorResponse } from '@/lib/super-admin/api-guard';
import { createAuditLog } from '@/lib/super-admin/db/audit';
import { dynamodb, PLATFORM_TABLE, generateId, nowISO } from '@/lib/super-admin/db/client';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

export async function GET(req: NextRequest) {
  const auth = await requireSuperAdmin(req);
  if (isErrorResponse(auth)) return auth;

  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get('organizationId');
  const status = searchParams.get('status');

  let params;
  if (organizationId) {
    params = {
      TableName: PLATFORM_TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: { ':pk': `ORG#${organizationId}`, ':sk': 'COMPLIANCE#' },
    };
  } else {
    params = {
      TableName: PLATFORM_TABLE,
      IndexName: 'GSI1',
      KeyConditionExpression: status
        ? 'GSI1PK = :gsi1pk AND begins_with(GSI1SK, :gsi1sk)'
        : 'GSI1PK = :gsi1pk',
      ExpressionAttributeValues: {
        ':gsi1pk': 'ALL_COMPLIANCE',
        ...(status && { ':gsi1sk': `${status}#` }),
      },
    };
  }

  const result = await dynamodb.send(new QueryCommand(params));
  return NextResponse.json({ items: result.Items ?? [] });
}

export async function POST(req: NextRequest) {
  const auth = await requireSuperAdmin(req);
  if (isErrorResponse(auth)) return auth;

  const { organizationId, checkType, status, dueDate, details } = await req.json();
  if (!organizationId || !checkType || !status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const id = generateId();
  const createdAt = nowISO();

  const item = {
    PK: `ORG#${organizationId}`,
    SK: `COMPLIANCE#${checkType}#${id}`,
    GSI1PK: 'ALL_COMPLIANCE',
    GSI1SK: `${status}#${createdAt}`,
    id,
    organizationId,
    checkType,
    status,
    dueDate: dueDate ?? null,
    details: details ?? null,
    createdAt,
  };

  await dynamodb.send(new PutCommand({ TableName: PLATFORM_TABLE, Item: item }));
  await createAuditLog({
    actorId: auth.id,
    actorEmail: auth.email,
    category: 'COMPLIANCE',
    action: 'compliance_check.created',
    targetType: 'organization',
    targetId: organizationId,
    metadata: { checkType, status },
  });

  return NextResponse.json({ item }, { status: 201 });
}
