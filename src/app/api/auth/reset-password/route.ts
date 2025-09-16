import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { 
  isValidVerificationCode, 
  isValidPassword, 
  verifyResetToken, 
  clearResetToken 
} from '@/lib/password-reset';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: 'Email, verification code, and new password are required' },
        { status: 400 }
      );
    }

    // Validate code format
    if (!isValidVerificationCode(code)) {
      return NextResponse.json(
        { error: 'Verification code must be 6 digits' },
        { status: 400 }
      );
    }

    // Validate password
    const passwordValidation = isValidPassword(newPassword);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    // Verify the reset token
    const verification = await verifyResetToken(email, code);

    if (!verification.valid || !verification.admin) {
      return NextResponse.json(
        { error: verification.message || 'Invalid verification code' },
        { status: 400 }
      );
    }

    const admin = verification.admin;

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update admin password and clear reset token
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        passwordHash: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        updatedAt: new Date(),
      },
    });

    console.log(`✅ Password reset successfully for admin: ${admin.email}`);

    // Log the password reset activity
    try {
      await prisma.formActivityLog.create({
        data: {
          adminId: admin.id,
          logType: 'ADMIN',
          action: 'Password Reset',
          metadata: {
            email: admin.email,
            timestamp: new Date().toISOString(),
            userAgent: request.headers.get('user-agent') || 'Unknown',
          },
        },
      });
    } catch (logError) {
      console.error('Failed to log password reset activity:', logError);
      // Don't fail the request if logging fails
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
  } finally {
    await prisma.$disconnect();
  }
}
