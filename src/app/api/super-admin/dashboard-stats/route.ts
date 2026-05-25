import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { countOrganizationsByStatus } from '@/lib/super-admin/db/organizations';
import { getSubscriptionStats } from '@/lib/super-admin/db/subscriptions';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [orgCounts, subStats] = await Promise.all([
    countOrganizationsByStatus(),
    getSubscriptionStats(),
  ]);

  return NextResponse.json({
    totalProviders: Object.values(orgCounts).reduce((a, b) => a + b, 0),
    activeProviders: orgCounts.ACTIVE,
    pendingProviders: orgCounts.PENDING + orgCounts.VERIFYING,
    suspendedProviders: orgCounts.SUSPENDED,
    totalSubscriptions: subStats.total,
    activeSubscriptions: subStats.active,
    monthlyRevenue: subStats.monthlyRevenue,
    complianceAlerts: 0, // TODO: implement compliance check counts
  });
}
