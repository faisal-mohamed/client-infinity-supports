import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin, isErrorResponse } from '@/lib/super-admin/api-guard';
import { createAuditLog } from '@/lib/super-admin/db/audit';
import { dynamodb, PLATFORM_TABLE, nowISO } from '@/lib/super-admin/db/client';
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireSuperAdmin(request);
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  const { Item } = await dynamodb.send(new GetCommand({
    TableName: PLATFORM_TABLE,
    Key: { PK: `TEMPLATE#${id}`, SK: 'PROFILE' },
  }));

  if (!Item) return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  return NextResponse.json(Item);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireSuperAdmin(request);
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  const body = await request.json();
  const now = nowISO();

  const { Item } = await dynamodb.send(new GetCommand({
    TableName: PLATFORM_TABLE,
    Key: { PK: `TEMPLATE#${id}`, SK: 'PROFILE' },
  }));

  if (!Item) return NextResponse.json({ error: 'Template not found' }, { status: 404 });

  const updates: Record<string, unknown> = { updatedAt: now };
  let actionName = 'template.updated';

  if (body.status === 'published') {
    updates.status = 'published';
    updates.GSI1SK = `published#${Item.formKey}`;
    updates.version = ((Item.version as number) || 1) + 1;
    actionName = 'template.published';
  } else if (body.status === 'deprecated') {
    updates.status = 'deprecated';
    updates.GSI1SK = `deprecated#${Item.formKey}`;
    actionName = 'template.deprecated';
  } else {
    const allowed = ['name', 'description', 'category', 'schema', 'pages', 'requiredSignatures'];
    for (const f of allowed) {
      if (body[f] !== undefined) updates[f] = body[f];
    }
  }

  const expNames: Record<string, string> = {};
  const expValues: Record<string, unknown> = {};
  const setClauses: string[] = [];

  Object.entries(updates).forEach(([key, val], i) => {
    expNames[`#f${i}`] = key;
    expValues[`:v${i}`] = val;
    setClauses.push(`#f${i} = :v${i}`);
  });

  await dynamodb.send(new UpdateCommand({
    TableName: PLATFORM_TABLE,
    Key: { PK: `TEMPLATE#${id}`, SK: 'PROFILE' },
    UpdateExpression: `SET ${setClauses.join(', ')}`,
    ExpressionAttributeNames: expNames,
    ExpressionAttributeValues: expValues,
  }));

  await createAuditLog({
    actorId: auth.id,
    actorEmail: auth.email,
    category: 'FORM_TEMPLATE',
    action: actionName,
    targetType: 'form_template',
    targetId: id,
    metadata: { fields: Object.keys(updates) },
  });

  return NextResponse.json({ success: true });
}
