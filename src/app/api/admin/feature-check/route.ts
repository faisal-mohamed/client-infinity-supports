import { NextRequest, NextResponse } from 'next/server';
import { getTenantContext, isTenantError, isFeatureEnabled, checkSubscriptionLimit } from '@/lib/tenant-context';

// GET /api/admin/feature-check?feature=participant_onboarding
export async function GET(request: NextRequest) {
  const tenant = await getTenantContext();
  if (isTenantError(tenant)) return tenant;

  const feature = request.nextUrl.searchParams.get('feature');
  if (!feature) return NextResponse.json({ error: 'feature param required' }, { status: 400 });

  const enabled = await isFeatureEnabled(tenant.organizationId, feature);
  const limitError = feature === 'participant_onboarding'
    ? await checkSubscriptionLimit(tenant.organizationId, 'clients')
    : null;

  return NextResponse.json({
    enabled,
    limitReached: !!limitError,
    limitMessage: limitError || null,
  });
}
