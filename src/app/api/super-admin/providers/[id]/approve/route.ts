import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { requireSuperAdmin, isErrorResponse } from '@/lib/super-admin/api-guard';
import { getOrganizationById, approveOrganization } from '@/lib/super-admin/db/organizations';
import { createAuditLog } from '@/lib/super-admin/db/audit';
import { createAdmin, getAdminByEmail } from '@/lib/db/admin';
import { sendEmail } from '@/lib/email';

// POST /api/super-admin/providers/[id]/approve
// Approves org + creates provider admin user + sends welcome email
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireSuperAdmin(request);
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  const org = await getOrganizationById(id);
  if (!org) return NextResponse.json({ error: 'Provider not found' }, { status: 404 });

  if (org.status !== 'PENDING' && org.status !== 'VERIFYING') {
    return NextResponse.json({ error: 'Can only approve pending/verifying providers' }, { status: 400 });
  }

  // Check if admin already exists for this email
  const existing = await getAdminByEmail(org.primaryContactEmail);
  if (existing) {
    // Admin already exists — just approve the org without creating a new user
    await approveOrganization(id, auth.id);

    await createAuditLog({
      actorId: auth.id,
      actorEmail: auth.email,
      category: 'PROVIDER',
      action: 'provider.approved',
      targetType: 'organization',
      targetId: id,
      metadata: { existingAdminId: existing.id },
    });

    return NextResponse.json({
      organization: { id, status: 'ACTIVE' },
      admin: { id: existing.id, email: existing.email, name: existing.name },
      message: 'Provider approved. Admin account already exists.',
    });
  }

  // Check for stored credentials from self-registration
  const { GetCommand, DeleteCommand } = await import('@aws-sdk/lib-dynamodb');
  const { dynamodb: platformDb, PLATFORM_TABLE } = await import('@/lib/super-admin/db/client');

  const pendingCreds = await platformDb.send(new GetCommand({
    TableName: PLATFORM_TABLE,
    Key: { PK: `ORG#${id}`, SK: 'PENDING_CREDENTIALS' },
  }));

  let passwordHash: string;
  let tempPassword: string | null = null;

  if (pendingCreds.Item?.passwordHash) {
    // Self-registered: use their chosen password
    passwordHash = pendingCreds.Item.passwordHash as string;
    // Clean up pending credentials
    await platformDb.send(new DeleteCommand({
      TableName: PLATFORM_TABLE,
      Key: { PK: `ORG#${id}`, SK: 'PENDING_CREDENTIALS' },
    }));
  } else {
    // Manual onboarding: generate temp password
    tempPassword = randomBytes(8).toString('hex') + 'A1!';
    passwordHash = await bcrypt.hash(tempPassword, 12);
  }

  // Create provider admin user in main table
  const admin = await createAdmin({
    name: org.primaryContactName,
    email: org.primaryContactEmail,
    passwordHash,
    organizationId: id,
  });

  // Copy SMTP settings from super admin to new provider admin (for MFA emails)
  try {
    const { bulkUpsertSettings, getSettingsByAdmin } = await import('@/lib/db/settings');
    const superAdminSettings = await getSettingsByAdmin(auth.id, 'email');
    if (superAdminSettings.length > 0) {
      await bulkUpsertSettings(admin.id, superAdminSettings.map(s => ({ key: s.key, value: s.value, category: s.category, label: s.label, sortOrder: s.sortOrder, isRequired: s.isRequired })));
    }
  } catch (e) {
    console.error('Failed to copy SMTP settings to provider admin:', e);
  }

  // Approve the organization
  await approveOrganization(id, auth.id);

  // Send welcome email
  try {
    const credentialsBlock = tempPassword
      ? `<div style="background: #f0f4f8; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <p style="margin: 0 0 8px; color: #627d98; font-size: 14px;">Your login credentials:</p>
              <p style="margin: 4px 0; color: #002344;"><strong>Email:</strong> ${org.primaryContactEmail}</p>
              <p style="margin: 4px 0; color: #002344;"><strong>Temporary Password:</strong> ${tempPassword}</p>
            </div>
            <p style="color: #627d98; font-size: 14px;">⚠️ Please change your password immediately after first login.</p>`
      : `<p style="color: #334e68;">You can now log in using the email and password you provided during registration.</p>`;

    await sendEmail({
      to: org.primaryContactEmail,
      subject: 'Welcome to Infinity Supports Platform — Your Account is Approved!',
      adminId: auth.id,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #002344; padding: 24px; text-align: center;">
            <h1 style="color: #cab741; margin: 0; font-size: 20px;">Infinity Supports Platform</h1>
          </div>
          <div style="padding: 32px 24px; background: #ffffff;">
            <h2 style="color: #002344; margin-top: 0;">Welcome, ${org.primaryContactName}!</h2>
            <p style="color: #334e68;">Your organization <strong>${org.name}</strong> has been approved and your admin account is ready.</p>
            ${credentialsBlock}
            <a href="${process.env.NEXTAUTH_URL}/admin/login" style="display: inline-block; background: #cab741; color: #002344; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">Login to Your Dashboard</a>
          </div>
          <div style="padding: 16px 24px; background: #f0f4f8; text-align: center;">
            <p style="color: #627d98; font-size: 12px; margin: 0;">Infinity Supports Platform — NDIS Compliance Made Simple</p>
          </div>
        </div>
      `,
    });
  } catch (emailErr) {
    console.error('Welcome email failed:', emailErr);
    // Don't fail the approval if email fails
  }

  // Audit log
  await createAuditLog({
    actorId: auth.id,
    actorEmail: auth.email,
    category: 'PROVIDER',
    action: 'provider.approved_with_admin',
    targetType: 'organization',
    targetId: id,
    metadata: { adminId: admin.id, adminEmail: admin.email },
  });

  return NextResponse.json({
    organization: { id, status: 'ACTIVE' },
    admin: { id: admin.id, email: admin.email, name: admin.name },
    message: 'Provider approved and admin account created. Welcome email sent.',
  });
}
