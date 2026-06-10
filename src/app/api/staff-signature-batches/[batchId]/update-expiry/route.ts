import { NextRequest, NextResponse } from 'next/server';
import { getStaffByToken, updateStaff } from '@/lib/db/staff';
import { getTenantContext, isTenantError } from '@/lib/tenant-context';

// PATCH /api/staff-signature-batches/[batchId]/update-expiry
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const { batchId } = await params;
    const { expiresAt } = await request.json();

    if (!expiresAt) return NextResponse.json({ error: 'expiresAt required' }, { status: 400 });

    const staff = await getStaffByToken(batchId);
    if (!staff) return NextResponse.json({ error: 'Batch not found' }, { status: 404 });

    await updateStaff(staff.id, { linkExpiresAt: expiresAt });
    return NextResponse.json({ success: true, expiresAt });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update expiry' }, { status: 500 });
  }
}
