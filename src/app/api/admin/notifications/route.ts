import { NextRequest, NextResponse } from "next/server";
import { getNotifications } from "@/lib/db/notifications";
import { getClientById } from "@/lib/db/client";
import { getTenantContext, isTenantError } from "@/lib/tenant-context";

export async function GET(request: NextRequest) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const result = await getNotifications(tenant.adminId, { page: 1, limit: 200, unreadOnly });

    // Filter notifications to only include those for this org's clients
    let filtered = result.notifications;
    if (tenant.organizationId) {
      const checks = await Promise.all(
        filtered.map(async (n) => {
          if (!n.clientId) return true; // Keep non-client notifications
          const client = await getClientById(n.clientId);
          if (!client) return false; // Client deleted
          if (!client.organizationId) return false; // Legacy unscoped client
          return client.organizationId === tenant.organizationId;
        })
      );
      filtered = filtered.filter((_, i) => checks[i]);
    }

    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      notifications: paginated,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
