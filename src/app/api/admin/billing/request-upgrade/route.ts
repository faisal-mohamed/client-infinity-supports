import { NextRequest, NextResponse } from 'next/server';
import { getTenantContext, isTenantError } from '@/lib/tenant-context';
import { createAuditLog } from '@/lib/super-admin/db/audit';
import { getOrganizationById } from '@/lib/super-admin/db/organizations';

// POST /api/admin/billing/request-upgrade
export async function POST(request: NextRequest) {
  const tenant = await getTenantContext();
  if (isTenantError(tenant)) return tenant;

  if (!tenant.organizationId) {
    return NextResponse.json({ error: 'No organization linked' }, { status: 400 });
  }

  const org = await getOrganizationById(tenant.organizationId);

  // Log the upgrade request for Super Admin to see in audit logs
  await createAuditLog({
    actorId: tenant.adminId,
    actorEmail: tenant.email,
    category: 'SUBSCRIPTION',
    action: 'subscription.upgrade_requested',
    targetType: 'organization',
    targetId: tenant.organizationId,
    metadata: { orgName: org?.name, currentPlan: 'current' },
  });

  return NextResponse.json({ success: true, message: 'Upgrade request submitted' });
}
