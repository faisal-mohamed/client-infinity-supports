import { NextRequest, NextResponse } from 'next/server';
import { getStaffById, updateStaff } from '@/lib/db/staff';
import { getTenantContext, isTenantError } from '@/lib/tenant-context';

// GET /api/staff/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const { id } = await params;
    const staff = await getStaffById(id);
    if (!staff) return NextResponse.json({ error: 'Staff not found' }, { status: 404 });

    return NextResponse.json(staff);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

// PUT /api/staff/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const { id } = await params;
    const staff = await getStaffById(id);
    if (!staff) return NextResponse.json({ error: 'Staff not found' }, { status: 404 });

    const body = await request.json();
    const { firstName, surname, email, phone, role, status, commonFields } = body;

    await updateStaff(id, {
      ...(firstName && { firstName }),
      ...(surname && { surname }),
      ...(email && { email: email.toLowerCase().trim() }),
      ...(phone !== undefined && { phone }),
      ...(role && { role }),
      ...(status && { status }),
      ...(commonFields && { commonFields: { ...staff.commonFields, ...commonFields } }),
    });

    const updated = await getStaffById(id);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update staff' }, { status: 500 });
  }
}

// DELETE /api/staff/[id] (archive)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const { id } = await params;
    const staff = await getStaffById(id);
    if (!staff) return NextResponse.json({ error: 'Staff not found' }, { status: 404 });

    await updateStaff(id, { status: 'archived' });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to archive staff' }, { status: 500 });
  }
}
