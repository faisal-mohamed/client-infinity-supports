import { NextRequest, NextResponse } from 'next/server';
import { createStaff, listStaff } from '@/lib/db/staff';
import { getTenantContext, isTenantError, checkSubscriptionLimit, isFeatureEnabled } from '@/lib/tenant-context';
import { randomBytes } from 'crypto';

// GET /api/staff - list staff with search and pagination
export async function GET(req: NextRequest) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    let staff = await listStaff();

    // Filter by organization
    if (tenant.organizationId) {
      staff = staff.filter((s) => s.createdById && s.createdById === tenant.adminId || (s as any).organizationId === tenant.organizationId);
    }

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      staff = staff.filter((s) =>
        s.firstName.toLowerCase().includes(q) ||
        s.surname.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.phone || '').includes(q) ||
        (s.role || '').toLowerCase().includes(q)
      );
    }

    // Sort by newest first
    staff.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    // Paginate
    const totalCount = staff.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const paginated = staff.slice((page - 1) * pageSize, page * pageSize);

    return NextResponse.json({
      staff: paginated,
      pagination: { page, pageSize, totalCount, totalPages, hasNextPage: page < totalPages, hasPreviousPage: page > 1 },
    });
  } catch (error: any) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

// POST /api/staff - create staff
export async function POST(req: NextRequest) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    // Feature flag check
    const enabled = await isFeatureEnabled(tenant.organizationId, 'staff_onboarding');
    if (!enabled) {
      return NextResponse.json({ error: 'Staff onboarding is not enabled for your organization.' }, { status: 403 });
    }

    // Subscription limit check
    const limitError = await checkSubscriptionLimit(tenant.organizationId, 'staff');
    if (limitError) {
      return NextResponse.json({ error: limitError }, { status: 403 });
    }

    const body = await req.json();
    const { firstName, surname, email, phone, role } = body;

    if (!firstName || !surname || !email) {
      return NextResponse.json({ error: 'First name, surname and email are required' }, { status: 400 });
    }

    // Generate onboarding link token
    const linkToken = randomBytes(32).toString('hex');
    const linkExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

    const created = await createStaff({
      firstName,
      surname,
      email: email.toLowerCase().trim(),
      phone,
      role: role || 'Support Worker',
      status: 'pending',
      linkToken,
      linkExpiresAt,
      createdById: tenant.adminId,
    });

    // Increment subscription usage
    if (tenant.organizationId) {
      try {
        const { getSubscriptionByOrgId, updateSubscription } = await import('@/lib/super-admin/db/subscriptions');
        const sub = await getSubscriptionByOrgId(tenant.organizationId);
        if (sub) {
          await updateSubscription(tenant.organizationId, sub.id, {
            usage: { ...sub.usage, staff: (sub.usage.staff || 0) + 1 },
          });
        }
      } catch (e) { /* non-critical */ }
    }

    // Activity log
    try {
      const { createStaffActivityLog } = await import('@/lib/db/audit');
      await createStaffActivityLog({
        staffId: created.id,
        adminId: tenant.adminId,
        logType: 'ADMIN',
        action: 'Created Staff',
        metadata: { staffName: `${firstName} ${surname}`, email },
      });
    } catch (e) { /* non-critical */ }

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error('Error creating staff:', error);
    return NextResponse.json({ error: 'Failed to create staff' }, { status: 500 });
  }
}
