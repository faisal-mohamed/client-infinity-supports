import { NextRequest, NextResponse } from 'next/server';
import { verifyMfaCode } from '@/lib/mfa';

export async function POST(req: NextRequest) {
  try {
    const { adminId, code } = await req.json();

    if (!adminId || !code) {
      return NextResponse.json({ error: 'Admin ID and code are required' }, { status: 400 });
    }

    // Validate code format
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: 'Code must be 6 digits' }, { status: 400 });
    }

    const result = await verifyMfaCode(parseInt(adminId), code);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      mfaToken: result.mfaToken,
    });
  } catch (error: any) {
    console.error('[MFA Verify OTP] Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
