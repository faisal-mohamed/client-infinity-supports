import { NextRequest, NextResponse } from 'next/server';
import { isValidVerificationCode, verifyResetToken } from '@/lib/password-reset';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    if (!isValidVerificationCode(code)) {
      return NextResponse.json(
        { error: 'Verification code must be 6 digits' },
        { status: 400 }
      );
    }

    const verification = await verifyResetToken(email, code);

    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.message || 'Invalid verification code' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Verification code is valid',
      verified: true,
    });

  } catch (error) {
    console.error('Verify reset code error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
