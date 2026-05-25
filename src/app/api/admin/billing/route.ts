import { NextRequest, NextResponse } from 'next/server';
import { getTenantContext, isTenantError } from '@/lib/tenant-context';
import { getSubscriptionByOrgId, getPlanById } from '@/lib/super-admin/db/subscriptions';
import { getOrganizationById } from '@/lib/super-admin/db/organizations';

// GET /api/admin/billing — Provider sees their plan, usage, and limits
export async function GET(req: NextRequest) {
  const tenant = await getTenantContext();
  if (isTenantError(tenant)) return tenant;

  if (!tenant.organizationId) {
    return NextResponse.json({ error: 'No organization linked' }, { status: 404 });
  }

  const [org, sub] = await Promise.all([
    getOrganizationById(tenant.organizationId),
    getSubscriptionByOrgId(tenant.organizationId),
  ]);

  if (!org) return NextResponse.json({ error: 'Organization not found' }, { status: 404 });

  const plan = sub?.planId ? await getPlanById(sub.planId) : null;

  return NextResponse.json({
    organization: { id: org.id, name: org.name, status: org.status },
    subscription: sub ? {
      status: sub.status,
      planTier: sub.planTier,
      planName: plan?.name || sub.planTier,
      billingCycle: sub.billingCycle,
      currentPeriodEnd: sub.currentPeriodEnd,
      trialEndsAt: sub.trialEndsAt,
    } : null,
    usage: sub?.usage || { clients: 0, staff: 0, admins: 0, formsThisMonth: 0, storageUsedGB: 0 },
    limits: sub?.limits || { maxClients: 0, maxStaff: 0, maxAdmins: 0, maxFormsPerMonth: 0, storageGB: 0 },
  });
}
