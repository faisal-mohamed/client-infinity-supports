import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getTenantContext, isTenantError } from '@/lib/tenant-context';
import { getAdminById, updateAdmin } from '@/lib/db/admin';

// POST /api/admin/change-password
export async function POST(request: NextRequest) {
  const tenant = await getTenantContext();
  if (isTenantError(tenant)) return tenant;

  const { currentPassword, newPassword } = await request.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Current password and new password are required' }, { status: 400 });
  }

  if (newPassword.length < 15) {
    return NextResponse.json({ error: 'New password must be at least 15 characters' }, { status: 400 });
  }

  if (currentPassword === newPassword) {
    return NextResponse.json({ error: 'New password must be different from current password' }, { status: 400 });
  }

  const admin = await getAdminById(tenant.adminId);
  if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 });

  const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await updateAdmin(tenant.adminId, { passwordHash });

  return NextResponse.json({ success: true, message: 'Password changed successfully' });
}
