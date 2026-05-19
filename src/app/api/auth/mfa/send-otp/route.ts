import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getAdminByEmail } from '@/lib/db/admin';
import { checkMfaRateLimit, createMfaCode, markMfaCodeUsed, cleanupExpiredMfaCodes } from '@/lib/mfa';
import { sendEmail } from '@/lib/email';
import { createMfaOtpEmailHTML } from '@/lib/mfa-email-template';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // 1. Validate credentials
    const admin = await getAdminByEmail(email.toLowerCase());
    if (!admin) {
      // Constant-time response to prevent user enumeration
      await bcrypt.hash('dummy', 10);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 2. Rate limit check
    const rateLimit = await checkMfaRateLimit(admin.id);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Please try again later.', retryAfter: rateLimit.retryAfter },
        { status: 429 }
      );
    }

    // 3. Generate and store OTP
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null;
    const ua = req.headers.get('user-agent') || null;
    const { code, mfaSK } = await createMfaCode(admin.id, ip, ua);

    // 4. Send OTP email
    const html = createMfaOtpEmailHTML(admin.name, code);
    const emailResult = await sendEmail({
      to: admin.email,
      subject: 'Login Verification Code - Infinity Supports WA',
      html,
      adminId: admin.id,
    });

    if (!emailResult.success) {
      // Mark code as used since email failed
      await markMfaCodeUsed(admin.id, mfaSK);
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

    // 5. Background cleanup (no-op with TTL, kept for API compatibility)
    cleanupExpiredMfaCodes().catch(() => {});

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
      adminId: admin.id,
      expiresIn: 300, // 5 minutes in seconds
    });
  } catch (error: any) {
    console.error('[MFA Send OTP] Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
