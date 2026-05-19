import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import {
  isValidVerificationCode,
  isValidPassword,
  verifyResetToken,
} from '@/lib/password-reset';
import { updateAdmin } from '@/lib/db/admin';
import { createActivityLog } from '@/lib/db/audit';

export async function POST(request: NextRequest) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: 'Email, verification code, and new password are required' },
        { status: 400 }
      );
    }

    if (!isValidVerificationCode(code)) {
      return NextResponse.json(
        { error: 'Verification code must be 6 digits' },
        { status: 400 }
      );
    }

    const passwordValidation = isValidPassword(newPassword);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    const verification = await verifyResetToken(email, code);

    if (!verification.valid || !verification.admin) {
      return NextResponse.json(
        { error: verification.message || 'Invalid verification code' },
        { status: 400 }
      );
    }

    const admin = verification.admin;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update admin password and clear reset token
    await updateAdmin(admin.id, {
      passwordHash: hashedPassword,
      resetToken: undefined,
      resetTokenExpiry: undefined,
    });

    // Log the password reset activity (non-blocking)
    try {
      await createActivityLog({
        adminId: admin.id,
        logType: 'ADMIN',
        action: 'Password Reset',
        metadata: {
          email: admin.email,
          timestamp: new Date().toISOString(),
          userAgent: request.headers.get('user-agent') || 'Unknown',
        },
      });
    } catch (logError) {
      console.error('Failed to log password reset activity:', logError);
    }

    return NextResponse.json({
      message: 'Password reset successfully',
      success: true,
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
