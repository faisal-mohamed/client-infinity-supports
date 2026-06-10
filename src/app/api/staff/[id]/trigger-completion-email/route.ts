import { NextRequest, NextResponse } from 'next/server';
import { getStaffById } from '@/lib/db/staff';
import { getTenantContext, isTenantError } from '@/lib/tenant-context';

// POST /api/staff/[id]/trigger-completion-email
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

    // Send completion notification to admin
    try {
      const { sendEmail } = await import('@/lib/email');
      await sendEmail({
        to: tenant.email,
        subject: `Staff Onboarding Complete — ${staff.firstName} ${staff.surname}`,
        adminId: tenant.adminId,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #002344; padding: 24px; text-align: center;">
              <h1 style="color: #cab741; margin: 0;">Staff Onboarding Complete</h1>
            </div>
            <div style="padding: 32px 24px;">
              <p style="color: #334e68;"><strong>${staff.firstName} ${staff.surname}</strong> has completed their onboarding forms.</p>
              <p style="color: #627d98;">Please review and counter-sign their forms from the admin dashboard.</p>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Completion email failed:', emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to trigger email' }, { status: 500 });
  }
}
