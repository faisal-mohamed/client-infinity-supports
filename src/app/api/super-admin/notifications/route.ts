import { NextRequest, NextResponse } from 'next/server';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { requireSuperAdmin, isErrorResponse } from '@/lib/super-admin/api-guard';
import { createAuditLog } from '@/lib/super-admin/db/audit';
import { dynamodb, PLATFORM_TABLE, generateId, nowISO } from '@/lib/super-admin/db/client';

export async function GET(request: NextRequest) {
  const auth = await requireSuperAdmin(request);
  if (isErrorResponse(auth)) return auth;

  const type = request.nextUrl.searchParams.get('type') || 'templates';
  const gsi1pk = type === 'rules' ? 'ALL_NOTIF_RULES' : 'ALL_EMAIL_TEMPLATES';

  const res = await dynamodb.send(
    new QueryCommand({
      TableName: PLATFORM_TABLE,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk',
      ExpressionAttributeValues: { ':pk': gsi1pk },
    })
  );

  return NextResponse.json({ items: res.Items || [] });
}

export async function POST(request: NextRequest) {
  const auth = await requireSuperAdmin(request);
  if (isErrorResponse(auth)) return auth;

  const body = await request.json();
  const id = generateId();
  const now = nowISO();

  if (body.type === 'template') {
    if (!body.key || !body.name || !body.subject) {
      return NextResponse.json({ error: 'key, name, subject required' }, { status: 400 });
    }

    await dynamodb.send(
      new PutCommand({
        TableName: PLATFORM_TABLE,
        Item: {
          PK: `EMAIL_TPL#${id}`,
          SK: 'PROFILE',
          GSI1PK: 'ALL_EMAIL_TEMPLATES',
          GSI1SK: body.key,
          entityType: 'EMAIL_TEMPLATE',
          id, key: body.key, name: body.name, subject: body.subject,
          htmlBody: body.htmlBody || '', variables: body.variables || [],
          isActive: true, createdAt: now, updatedAt: now,
        },
      })
    );

    await createAuditLog({
      actorId: auth.id, actorEmail: auth.email,
      category: 'SETTINGS', action: 'email_template.created',
      targetType: 'email_template', targetId: id,
      metadata: { key: body.key, name: body.name },
    });

    return NextResponse.json({ id, key: body.key, name: body.name }, { status: 201 });
  }

  if (body.type === 'rule') {
    if (!body.event || !body.channels) {
      return NextResponse.json({ error: 'event, channels required' }, { status: 400 });
    }

    await dynamodb.send(
      new PutCommand({
        TableName: PLATFORM_TABLE,
        Item: {
          PK: `NOTIF_RULE#${id}`,
          SK: 'PROFILE',
          GSI1PK: 'ALL_NOTIF_RULES',
          GSI1SK: body.event,
          entityType: 'NOTIFICATION_RULE',
          id, event: body.event, channels: body.channels,
          templateId: body.templateId || null,
          isActive: true, createdAt: now,
        },
      })
    );

    await createAuditLog({
      actorId: auth.id, actorEmail: auth.email,
      category: 'SETTINGS', action: 'notification_rule.created',
      targetType: 'notification_rule', targetId: id,
      metadata: { event: body.event },
    });

    return NextResponse.json({ id, event: body.event }, { status: 201 });
  }

  return NextResponse.json({ error: 'type must be "template" or "rule"' }, { status: 400 });
}
