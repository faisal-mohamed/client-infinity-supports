import { NextRequest, NextResponse } from 'next/server';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamodb, TABLE } from '@/lib/dynamodb';
import { getTenantContext, isTenantError } from '@/lib/tenant-context';

// GET /api/admin/team — List all admins in the same organization
export async function GET(req: NextRequest) {
  const tenant = await getTenantContext();
  if (isTenantError(tenant)) return tenant;

  if (!tenant.organizationId) {
    return NextResponse.json({ members: [] });
  }

  // Query all admins with this organizationId via GSI1
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: TABLE,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk',
      ExpressionAttributeValues: { ':pk': 'ALL_ADMINS' },
    })
  );

  const members = (res.Items || [])
    .filter((item) => item.organizationId === tenant.organizationId)
    .map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      createdAt: item.createdAt,
    }));

  return NextResponse.json({ members });
}
