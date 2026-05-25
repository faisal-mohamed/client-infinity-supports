import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { getTenantContext, isTenantError, checkSubscriptionLimit } from '@/lib/tenant-context';
import { createAdmin, getAdminByEmail } from '@/lib/db/admin';
import { sendEmail } from '@/lib/email';
import { createActivityLog } from '@/lib/db/audit';

// POST /api/admin/team/invite — Invite a new admin to the organization
export async function POST(req: NextRequest) {
  const tenant = await getTenantContext();
  if (isTenantError(tenant)) return tenant;

  if (!tenant.organizationId) {
    return NextResponse.json({ error: 'Organization not configured' }, { status: 400 });
  }

  // Check admin limit
  const limitError = await checkSubscriptionLimit(tenant.organizationId, 'admins');
  if (limitError) {
    return NextResponse.json({ error: limitError }, { status: 403 });
  }

  const { email, name } = await req.json();
  if (!email || !name) {
    return NextResponse.json({ error: 'email and name are required' }, { status: 400 });
  }

  // Check if admin already exists
  const existing = await getAdminByEmail(email);
  if (existing) {
    return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
  }

  // Create admin with temp password
  const tempPassword = randomBytes(8).toString('hex') + 'A1!';
  const passwordHash = await bcrypt.hash(tempPassword, 12);

  const admin = await createAdmin({
    name,
    email,
    passwordHash,
    organizationId: tenant.organizationId,
  });

  // Copy SMTP settings from inviter to new admin
  try {
    const { bulkUpsertSettings, getSettingsByAdmin } = await import('@/lib/db/settings');
    const settings = await getSettingsByAdmin(tenant.adminId, 'email');
    if (settings.length > 0) {
      await bulkUpsertSettings(admin.id, settings.map(s => ({ key: s.key, value: s.value, category: s.category, label: s.label, sortOrder: s.sortOrder, isRequired: s.isRequired })));
    }
  } catch (e) {
    console.error('Failed to copy settings to invited admin:', e);
  }

  // Send invite email
  try {
    await sendEmail({
      to: email,
      subject: 'You have been invited to Infinity Supports Platform',
      adminId: tenant.adminId,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #002344; padding: 24px; text-align: center;">
            <h1 style="color: #cab741; margin: 0; font-size: 20px;">Infinity Supports Platform</h1>
          </div>
          <div style="padding: 32px 24px; background: #ffffff;">
            <h2 style="color: #002344; margin-top: 0;">Welcome, ${name}!</h2>
            <p style="color: #334e68;">You have been invited as an admin. Here are your login credentials:</p>
            <div style="background: #f0f4f8; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <p style="margin: 4px 0; color: #002344;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 4px 0; color: #002344;"><strong>Temporary Password:</strong> ${tempPassword}</p>
            </div>
            <p style="color: #627d98; font-size: 14px;">⚠️ Please change your password after first login.</p>
            <a href="${process.env.NEXTAUTH_URL}/admin/login" style="display: inline-block; background: #cab741; color: #002344; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">Login Now</a>
          </div>
        </div>
      `,
    });
  } catch (e) {
    console.error('Invite email failed:', e);
  }

  await createActivityLog({
    adminId: tenant.adminId,
    logType: 'ADMIN',
    action: 'Invited team member',
    metadata: { invitedEmail: email, invitedName: name, invitedAdminId: admin.id },
  });

  return NextResponse.json({ id: admin.id, email: admin.email, name: admin.name }, { status: 201 });
}
