import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireSuperAdmin, isErrorResponse } from '@/lib/super-admin/api-guard';
import { countOrganizationsByStatus, listOrganizations } from '@/lib/super-admin/db/organizations';
import { getSubscriptionStats, listSubscriptions } from '@/lib/super-admin/db/subscriptions';

export async function GET(request: NextRequest) {
  const auth = await requireSuperAdmin(request);
  if (isErrorResponse(auth)) return auth;

  const type = request.nextUrl.searchParams.get('type') || 'overview';

  switch (type) {
    case 'overview': {
      const [orgCounts, subStats] = await Promise.all([
        countOrganizationsByStatus(),
        getSubscriptionStats(),
      ]);
      return NextResponse.json({
        providers: orgCounts,
        subscriptions: {
          total: subStats.total,
          active: subStats.active,
          trial: subStats.trial,
          pastDue: subStats.pastDue,
        },
        revenue: { monthly: subStats.monthlyRevenue },
      });
    }

    case 'providers': {
      const { items } = await listOrganizations({ limit: 100 });
      return NextResponse.json({
        providers: items.map((org) => ({
          id: org.id,
          name: org.name,
          status: org.status,
          registrationType: org.registrationType,
          insuranceExpiry: org.insuranceExpiry ?? null,
          createdAt: org.createdAt,
        })),
      });
    }

    case 'subscriptions': {
      const subStats = await getSubscriptionStats();
      const { items } = await listSubscriptions({ limit: 100 });
      const byTier: Record<string, { count: number; revenue: number }> = {};
      for (const sub of items) {
        const tier = sub.planTier || 'unknown';
        if (!byTier[tier]) byTier[tier] = { count: 0, revenue: 0 };
        byTier[tier].count++;
        byTier[tier].revenue += (sub as any).pricePerMonth || 0;
      }
      return NextResponse.json({
        totalRevenue: subStats.monthlyRevenue,
        active: subStats.active,
        trial: subStats.trial,
        pastDue: subStats.pastDue,
        byTier,
      });
    }

    case 'compliance': {
      // Compliance data aggregation — placeholder counts until compliance module is built
      return NextResponse.json({
        alerts: {
          documentExpiry: 0,
          insuranceLapse: 0,
          auditOverdue: 0,
          incidentUnresolved: 0,
        },
        overdueItems: 0,
      });
    }

    default:
      return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
  }
}
