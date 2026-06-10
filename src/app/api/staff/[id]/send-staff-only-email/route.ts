import { NextRequest, NextResponse } from 'next/server';
import { getStaffById } from '@/lib/db/staff';
import { getTenantContext, isTenantError } from '@/lib/tenant-context';

// POST /api/staff/[id]/send-staff-only-email
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const { id } = await params;
    const staff = await getStaffById(id);
    if (!staff) return NextResponse.json({ error: 'Staff not found' }, { status: 404 });

    if (!staff.linkToken) {
      return NextResponse.json({ error: 'No onboarding link generated for this staff' }, { status: 400 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const link = `${baseUrl}/staff/onboard/${staff.linkToken}`;

    // Send email
    try {
      const { sendEmail } = await import('@/lib/email');
      await sendEmail({
        to: staff.email,
        subject: `Complete Your Onboarding — ${staff.firstName}`,
        adminId: tenant.adminId,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #002344; padding: 24px; text-align: center;">
              <h1 style="color: #cab741; margin: 0; font-size: 20px;">Staff Onboarding</h1>
            </div>
            <div style="padding: 32px 24px;">
              <h2 style="color: #002344;">Hi ${staff.firstName},</h2>
              <p style="color: #334e68;">Please complete your onboarding forms using the link below:</p>
              <a href="${link}" style="display: inline-block; background: #cab741; color: #002344; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">Complete Onboarding</a>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Staff email failed:', emailErr);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Email sent' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
