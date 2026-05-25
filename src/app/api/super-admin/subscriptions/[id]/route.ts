import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireSuperAdmin, isErrorResponse } from '@/lib/super-admin/api-guard';
import { getSubscriptionByOrgId, updateSubscription, updatePlan } from '@/lib/super-admin/db/subscriptions';
import { createAuditLog } from '@/lib/super-admin/db/audit';

// PATCH /api/super-admin/subscriptions/[id] — Update subscription or plan
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireSuperAdmin(request);
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  const body = await request.json();

  // Update a plan definition
  if (body.type === 'plan') {
    const allowed = ['name', 'description', 'priceMonthly', 'priceAnnual', 'limits', 'features', 'isActive'];
    const updates: Record<string, unknown> = {};
    for (const k of allowed) {
      if (body[k] !== undefined) updates[k] = body[k];
    }
    await updatePlan(id, updates as any);
    await createAuditLog({
      actorId: auth.id,
      actorEmail: auth.email,
      category: 'SUBSCRIPTION',
      action: 'plan.updated',
      targetType: 'plan',
      targetId: id,
      metadata: { fields: Object.keys(updates) },
    });
    return NextResponse.json({ success: true });
  }

  // Update subscription (status change, cancel, etc.)
  // id here is the organizationId
  const sub = await getSubscriptionByOrgId(id);
  if (!sub) return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });

  if (body.action === 'cancel') {
    await updateSubscription(id, sub.id, {
      status: 'CANCELLED',
      cancelledAt: new Date().toISOString(),
    });
    await createAuditLog({
      actorId: auth.id,
      actorEmail: auth.email,
      category: 'SUBSCRIPTION',
      action: 'subscription.cancelled',
      targetType: 'organization',
      targetId: id,
    });
    return NextResponse.json({ success: true, status: 'CANCELLED' });
  }

  if (body.action === 'activate') {
    await updateSubscription(id, sub.id, { status: 'ACTIVE' });
    await createAuditLog({
      actorId: auth.id,
      actorEmail: auth.email,
      category: 'SUBSCRIPTION',
      action: 'subscription.activated',
      targetType: 'organization',
      targetId: id,
    });
    return NextResponse.json({ success: true, status: 'ACTIVE' });
  }

  // Generic field updates
  const allowed = ['billingEmail', 'billingCycle', 'pricePerMonth', 'limits'];
  const updates: Record<string, unknown> = {};
  for (const k of allowed) {
    if (body[k] !== undefined) updates[k] = body[k];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields' }, { status: 400 });
  }

  await updateSubscription(id, sub.id, updates as any);
  await createAuditLog({
    actorId: auth.id,
    actorEmail: auth.email,
    category: 'SUBSCRIPTION',
    action: 'subscription.updated',
    targetType: 'organization',
    targetId: id,
    metadata: { fields: Object.keys(updates) },
  });

  return NextResponse.json({ success: true });
}
