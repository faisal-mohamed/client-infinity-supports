/**
 * Tenant Context — Extracts organizationId from session for data isolation
 * Use in all provider API routes to scope data access.
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getSubscriptionByOrgId } from '@/lib/super-admin/db/subscriptions';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamodb } from '@/lib/dynamodb';
import { PLATFORM_TABLE } from '@/lib/super-admin/db/client';

export interface TenantContext {
  adminId: string;
  organizationId: string;
  email: string;
}

/**
 * Get tenant context from session. Returns TenantContext or error response.
 */
export async function getTenantContext(): Promise<TenantContext | NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orgId = (session.user as any).organizationId;

  return {
    adminId: session.user.id,
    organizationId: orgId || '',
    email: session.user.email || '',
  };
}

export function isTenantError(result: TenantContext | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}

/**
 * Check subscription limits for an organization.
 * Returns null if within limits, or error message if exceeded.
 */
export async function checkSubscriptionLimit(
  organizationId: string,
  resource: 'clients' | 'staff' | 'admins' | 'formsThisMonth'
): Promise<string | null> {
  if (!organizationId) return null;

  try {
    const sub = await getSubscriptionByOrgId(organizationId);
    if (!sub) return null;

    if (sub.status === 'CANCELLED' || sub.status === 'EXPIRED') {
      return 'Your subscription is inactive. Please contact support.';
    }

    const limitKey = resource === 'clients' ? 'maxClients'
      : resource === 'staff' ? 'maxStaff'
      : resource === 'admins' ? 'maxAdmins'
      : 'maxFormsPerMonth';

    const limit = sub.limits[limitKey];
    if (limit === -1) return null;

    const usage = sub.usage[resource];
    if (usage >= limit) {
      return `You have reached your plan limit of ${limit} ${resource}. Please upgrade your plan.`;
    }
  } catch (e) {
    // Non-critical — don't block operations if limit check fails
  }

  return null;
}

/**
 * Check if a feature is enabled for an organization.
 */
export async function isFeatureEnabled(
  organizationId: string,
  featureKey: string
): Promise<boolean> {
  if (!organizationId) return true;

  try {
    const res = await dynamodb.send(
      new QueryCommand({
        TableName: PLATFORM_TABLE,
        KeyConditionExpression: 'PK = :pk AND SK = :sk',
        ExpressionAttributeValues: {
          ':pk': `ORG#${organizationId}`,
          ':sk': `FEATURE#${featureKey}`,
        },
      })
    );

    const flag = res.Items?.[0];
    if (!flag) return true;
    return flag.enabled as boolean;
  } catch (e) {
    return true; // Default to enabled if check fails
  }
}
