import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { requireSuperAdmin, isErrorResponse } from '@/lib/super-admin/api-guard';
import { createAuditLog } from '@/lib/super-admin/db/audit';
import { dynamodb, PLATFORM_TABLE, nowISO } from '@/lib/super-admin/db/client';
import { FEATURES } from '@/lib/super-admin/constants';

// GET /api/super-admin/settings?organizationId=xxx
export async function GET(request: NextRequest) {
  const auth = await requireSuperAdmin(request);
  if (isErrorResponse(auth)) return auth;

  const { searchParams } = new URL(request.url);
  const organizationId = searchParams.get('organizationId');

  if (!organizationId) {
    return NextResponse.json({ features: FEATURES });
  }

  const res = await dynamodb.send(
    new QueryCommand({
      TableName: PLATFORM_TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `ORG#${organizationId}`,
        ':sk': 'FEATURE#',
      },
    })
  );

  return NextResponse.json({ items: res.Items || [] });
}

// POST /api/super-admin/settings
export async function POST(request: NextRequest) {
  const auth = await requireSuperAdmin(request);
  if (isErrorResponse(auth)) return auth;

  const { organizationId, featureKey, enabled, reason } = await request.json();

  if (!organizationId || !featureKey || enabled === undefined) {
    return NextResponse.json(
      { error: 'organizationId, featureKey, and enabled are required' },
      { status: 400 }
    );
  }

  const now = nowISO();

  await dynamodb.send(
    new PutCommand({
      TableName: PLATFORM_TABLE,
      Item: {
        PK: `ORG#${organizationId}`,
        SK: `FEATURE#${featureKey}`,
        entityType: 'FEATURE_FLAG',
        featureKey,
        enabled,
        reason: reason || '',
        updatedAt: now,
        updatedBy: auth.email,
      },
    })
  );

  await createAuditLog({
    actorId: auth.id,
    actorEmail: auth.email,
    category: 'SETTINGS',
    action: `feature.${enabled ? 'enabled' : 'disabled'}`,
    targetType: 'organization',
    targetId: organizationId,
    metadata: { featureKey, enabled, reason },
  });

  return NextResponse.json({ success: true, featureKey, enabled });
}
