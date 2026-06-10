import { NextRequest, NextResponse } from 'next/server';
import { getStaffById, updateStaff } from '@/lib/db/staff';
import { getTenantContext, isTenantError } from '@/lib/tenant-context';

// PATCH /api/staff-signature-batches/[batchId] — Update batch (e.g., expiry)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const { batchId } = await params;
    const body = await request.json();

    // batchId is the staff's linkToken in our model
    // Update expiry
    if (body.expiresAt) {
      // Find staff by token and update expiry
      const { getStaffByToken } = await import('@/lib/db/staff');
      const staff = await getStaffByToken(batchId);
      if (!staff) return NextResponse.json({ error: 'Batch not found' }, { status: 404 });

      await updateStaff(staff.id, { linkExpiresAt: body.expiresAt });
      return NextResponse.json({ success: true, expiresAt: body.expiresAt });
    }

    return NextResponse.json({ error: 'No update provided' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update batch' }, { status: 500 });
  }
}

// DELETE /api/staff-signature-batches/[batchId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const { batchId } = await params;
    const { getStaffByToken } = await import('@/lib/db/staff');
    const staff = await getStaffByToken(batchId);
    if (!staff) return NextResponse.json({ error: 'Batch not found' }, { status: 404 });

    // Invalidate the token by clearing it
    await updateStaff(staff.id, { linkToken: undefined, linkExpiresAt: undefined });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete batch' }, { status: 500 });
  }
}
