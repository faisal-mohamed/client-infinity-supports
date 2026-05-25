import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireSuperAdmin, isErrorResponse } from '@/lib/super-admin/api-guard';
import {
  listPlans,
  createPlan,
  updatePlan,
  listSubscriptions,
  createSubscription,
  getSubscriptionByOrgId,
  getSubscriptionStats,
} from '@/lib/super-admin/db/subscriptions';
import { getOrganizationById } from '@/lib/super-admin/db/organizations';
import { createAuditLog } from '@/lib/super-admin/db/audit';
import { PLAN_LIMITS } from '@/lib/super-admin/constants';
import type { PlanTier } from '@/lib/super-admin/constants';

// GET /api/super-admin/subscriptions?type=plans|subscriptions|stats
export async function GET(request: NextRequest) {
  const auth = await requireSuperAdmin(request);
  if (isErrorResponse(auth)) return auth;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'subscriptions';

  if (type === 'plans') {
    return NextResponse.json(await listPlans());
  }

  if (type === 'stats') {
    return NextResponse.json(await getSubscriptionStats());
  }

  const status = searchParams.get('status') || undefined;
  const limit = parseInt(searchParams.get('limit') || '25');
  const cursor = searchParams.get('cursor') || undefined;

  const result = await listSubscriptions({ status: status as any, limit, cursor });
  return NextResponse.json(result);
}

// POST /api/super-admin/subscriptions — Create plan or assign subscription
export async function POST(request: NextRequest) {
  const auth = await requireSuperAdmin(request);
  if (isErrorResponse(auth)) return auth;

  const body = await request.json();

  // Create a plan definition
  if (body.type === 'plan') {
    if (!body.tier || !body.name || body.priceMonthly === undefined) {
      return NextResponse.json({ error: 'Plan requires tier, name, priceMonthly' }, { status: 400 });
    }

    const tier = body.tier as PlanTier;
    const limits = body.limits || PLAN_LIMITS[tier] || PLAN_LIMITS.STARTER;

    const plan = await createPlan({
      tier,
      name: body.name,
      description: body.description || '',
      priceMonthly: body.priceMonthly,
      priceAnnual: body.priceAnnual || Math.round(body.priceMonthly * 0.8),
      limits,
      features: body.features || [],
      isActive: true,
    });

    await createAuditLog({
      actorId: auth.id,
      actorEmail: auth.email,
      category: 'SUBSCRIPTION',
      action: 'plan.created',
      targetType: 'plan',
      targetId: plan.id,
      metadata: { tier, name: body.name },
    });

    return NextResponse.json(plan, { status: 201 });
  }

  // Assign subscription to organization
  if (!body.organizationId || !body.planId) {
    return NextResponse.json({ error: 'organizationId and planId required' }, { status: 400 });
  }

  const org = await getOrganizationById(body.organizationId);
  if (!org) return NextResponse.json({ error: 'Organization not found' }, { status: 404 });

  const existingSub = await getSubscriptionByOrgId(body.organizationId);
  if (existingSub && existingSub.status !== 'CANCELLED' && existingSub.status !== 'EXPIRED') {
    return NextResponse.json({ error: 'Organization already has an active subscription' }, { status: 409 });
  }

  const plans = await listPlans();
  const plan = plans.find((p) => p.id === body.planId);
  if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });

  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  const isTrial = body.trial === true;
  const trialEnd = isTrial ? new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) : undefined;

  const sub = await createSubscription({
    organizationId: body.organizationId,
    planId: plan.id,
    planTier: plan.tier,
    status: isTrial ? 'TRIAL' : 'ACTIVE',
    billingEmail: body.billingEmail || org.primaryContactEmail,
    billingCycle: body.billingCycle || 'monthly',
    pricePerMonth: plan.priceMonthly,
    trialEndsAt: trialEnd?.toISOString(),
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd: periodEnd.toISOString(),
    usage: { clients: 0, staff: 0, admins: 0, formsThisMonth: 0, storageUsedGB: 0 },
    limits: plan.limits,
  });

  await createAuditLog({
    actorId: auth.id,
    actorEmail: auth.email,
    category: 'SUBSCRIPTION',
    action: 'subscription.created',
    targetType: 'organization',
    targetId: body.organizationId,
    metadata: { planTier: plan.tier, trial: isTrial },
  });

  return NextResponse.json(sub, { status: 201 });
}
