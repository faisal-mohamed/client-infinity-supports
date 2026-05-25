import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin, isErrorResponse } from '@/lib/super-admin/api-guard';
import { createAuditLog } from '@/lib/super-admin/db/audit';
import { dynamodb, PLATFORM_TABLE, generateId, nowISO } from '@/lib/super-admin/db/client';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

export async function GET(req: NextRequest) {
  const auth = await requireSuperAdmin(req);
  if (isErrorResponse(auth)) return auth;

  const status = req.nextUrl.searchParams.get('status') || 'published';

  const { Items = [] } = await dynamodb.send(new QueryCommand({
    TableName: PLATFORM_TABLE,
    IndexName: 'GSI1',
    KeyConditionExpression: 'GSI1PK = :pk AND begins_with(GSI1SK, :sk)',
    ExpressionAttributeValues: { ':pk': 'ALL_TEMPLATES', ':sk': `${status}#` },
  }));

  return NextResponse.json({ templates: Items });
}

export async function POST(req: NextRequest) {
  const auth = await requireSuperAdmin(req);
  if (isErrorResponse(auth)) return auth;

  const body = await req.json();
  const { formKey, name, description, category, schema, pages, requiredSignatures } = body;

  if (!formKey || !name || !category) {
    return NextResponse.json({ error: 'formKey, name, and category are required' }, { status: 400 });
  }

  const id = generateId();
  const now = nowISO();

  const item = {
    PK: `TEMPLATE#${id}`,
    SK: 'PROFILE',
    GSI1PK: 'ALL_TEMPLATES',
    GSI1SK: `draft#${formKey}`,
    id,
    formKey,
    name,
    description: description || '',
    category,
    schema: schema || {},
    pages: pages || [],
    requiredSignatures: requiredSignatures || [],
    status: 'draft',
    version: 1,
    createdAt: now,
    updatedAt: now,
  };

  await dynamodb.send(new PutCommand({ TableName: PLATFORM_TABLE, Item: item }));

  await createAuditLog({
    actorId: auth.id,
    actorEmail: auth.email,
    category: 'FORM_TEMPLATE',
    action: 'template.created',
    targetType: 'form_template',
    targetId: id,
    metadata: { formKey, name, category },
  });

  return NextResponse.json({ template: item }, { status: 201 });
}
