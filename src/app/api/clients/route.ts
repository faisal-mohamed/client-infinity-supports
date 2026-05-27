import { NextRequest, NextResponse } from "next/server";
import { createClient, listClients } from "@/lib/db/client";
import { createActivityLog } from "@/lib/db/audit";
import { getTenantContext, isTenantError, checkSubscriptionLimit, isFeatureEnabled } from "@/lib/tenant-context";

export async function POST(req: NextRequest) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    // Check feature flag
    const featureEnabled = await isFeatureEnabled(tenant.organizationId, 'participant_onboarding');
    if (!featureEnabled) {
      return NextResponse.json({ error: 'Adding new participants is currently disabled for your account. Please contact your platform administrator.' }, { status: 403 });
    }

    // Check subscription limit
    const limitError = await checkSubscriptionLimit(tenant.organizationId, 'clients');
    if (limitError) {
      return NextResponse.json({ error: limitError }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, phone, commonFields } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required to create a client." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const clientName = name?.trim();

    const result = await createClient(
      { name: clientName, email: normalizedEmail, phone, createdById: tenant.adminId, organizationId: tenant.organizationId || undefined },
      {
        ...commonFields,
        name: commonFields?.name || clientName,
        email: commonFields?.email || normalizedEmail,
        phone: commonFields?.phone || phone,
        surname: commonFields?.surname,
      }
    );

    // Increment subscription usage counter
    if (tenant.organizationId) {
      try {
        const { getSubscriptionByOrgId, updateSubscription } = await import('@/lib/super-admin/db/subscriptions');
        const sub = await getSubscriptionByOrgId(tenant.organizationId);
        if (sub) {
          await updateSubscription(tenant.organizationId, sub.id, {
            usage: { ...sub.usage, clients: (sub.usage.clients || 0) + 1 },
          });
        }
      } catch (e) { /* non-critical */ }
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Error creating client:", error);
    return NextResponse.json({ error: "Failed to create client", details: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const url = new URL(req.url);

    if (url.searchParams.get("exists") === "true") {
      return NextResponse.json({ exists: false });
    }

    const options = {
      search: url.searchParams.get("search") || undefined,
      state: url.searchParams.get("state") || undefined,
      sex: url.searchParams.get("sex") || undefined,
      hasNdis: url.searchParams.get("hasNdis") || undefined,
      hasDisability: url.searchParams.get("hasDisability") || undefined,
      page: parseInt(url.searchParams.get("page") || "1"),
      pageSize: parseInt(url.searchParams.get("pageSize") || "10"),
      organizationId: tenant.organizationId || undefined,
    };

    const { clients, pagination } = await listClients(options);

    const serializedClients = clients.map((client) => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      createdById: client.createdById,
      archivedAt: client.archivedAt,
      archivedBy: client.archivedBy,
      commonFields: client.commonFields || null,
      logs: [],
    }));

    return NextResponse.json({ clients: serializedClients, pagination });
  } catch (error: any) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ error: "Failed to fetch clients", details: error.message }, { status: 500 });
  }
}
