import { NextRequest, NextResponse } from 'next/server';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { dynamodb, TABLE } from '@/lib/dynamodb';
import { getTenantContext, isTenantError } from '@/lib/tenant-context';
import { getAdminById } from '@/lib/db/admin';

// DELETE /api/admin/team/[memberId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const tenant = await getTenantContext();
  if (isTenantError(tenant)) return tenant;

  const { memberId } = await params;

  // Can't remove yourself
  if (memberId === tenant.adminId) {
    return NextResponse.json({ error: 'You cannot remove yourself' }, { status: 400 });
  }

  // Verify member exists and belongs to same org
  const member = await getAdminById(memberId);
  if (!member) return NextResponse.json({ error: 'Member not found' }, { status: 404 });

  if (tenant.organizationId && member.organizationId !== tenant.organizationId) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  }

  // Delete admin record and email lookup
  await dynamodb.send(new DeleteCommand({ TableName: TABLE, Key: { PK: `ADMIN#${memberId}`, SK: 'PROFILE' } }));
  await dynamodb.send(new DeleteCommand({ TableName: TABLE, Key: { PK: `ADMIN_EMAIL#${member.email}`, SK: 'PROFILE' } }));

  return NextResponse.json({ success: true, message: 'Team member removed' });
}
