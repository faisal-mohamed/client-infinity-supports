import { NextRequest, NextResponse } from 'next/server';
import { randomInt } from 'crypto';
import nodemailer from 'nodemailer';

// In-memory OTP store (for dev — in production use DynamoDB with TTL)
const otpStore = new Map<string, { code: string; expiresAt: number; attempts: number }>();

// Rate limit: max 3 OTP requests per email per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkEmailRateLimit(email: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(email);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(email, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

// POST /api/auth/verify-email — Send OTP
export async function POST(request: NextRequest) {
  const { email, action } = await request.json();

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Verify OTP
  if (action === 'verify') {
    const { code } = await request.json().catch(() => ({ code: '' }));
    // Re-parse since we already consumed the body
    return NextResponse.json({ error: 'Use verify endpoint' }, { status: 400 });
  }

  // Rate limit
  if (!checkEmailRateLimit(normalizedEmail)) {
    return NextResponse.json({ error: 'Too many attempts. Please wait 10 minutes.' }, { status: 429 });
  }

  // Generate 6-digit OTP
  const code = String(randomInt(100000, 999999));
  otpStore.set(normalizedEmail, { code, expiresAt: Date.now() + 10 * 60 * 1000, attempts: 0 });

  // Send email
  try {
    // Read SMTP config from Settings table (same as the rest of the app)
    const { getSettingByKey } = await import('@/lib/db/settings');
    const SUPER_ADMIN_ID = '01KS5NQRS0W86AYRJD1N1QHC1D'; // Platform SMTP settings owner
    const [hostSetting, passSetting, fromSetting] = await Promise.all([
      getSettingByKey(SUPER_ADMIN_ID, 'smtp_host'),
      getSettingByKey(SUPER_ADMIN_ID, 'smtp_password'),
      getSettingByKey(SUPER_ADMIN_ID, 'from_email'),
    ]);

    const smtpHost = hostSetting?.value || 'smtp.gmail.com';
    const smtpPass = passSetting?.value || '';
    const fromEmail = fromSetting?.value || '';

    if (!smtpPass || !fromEmail) {
      console.error('SMTP not configured for email verification');
      return NextResponse.json({ error: 'Email service not configured. Contact support.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: 587,
      secure: false,
      auth: { user: fromEmail, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `"Infinity Supports" <${fromEmail}>`,
      to: normalizedEmail,
      subject: 'Email Verification Code — Infinity Supports',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #002344; margin-bottom: 16px;">Verify Your Email</h2>
          <p style="color: #334e68;">Your verification code is:</p>
          <div style="background: #f0f4f8; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #002344;">${code}</span>
          </div>
          <p style="color: #627d98; font-size: 14px;">This code expires in 10 minutes.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: 'Verification code sent' });
  } catch (err) {
    console.error('Failed to send verification email:', err);
    return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
  }
}

// PUT /api/auth/verify-email — Verify OTP
export async function PUT(request: NextRequest) {
  const { email, code } = await request.json();
  const normalizedEmail = email?.toLowerCase().trim();

  if (!normalizedEmail || !code) {
    return NextResponse.json({ error: 'Email and code required' }, { status: 400 });
  }

  const stored = otpStore.get(normalizedEmail);
  if (!stored) {
    return NextResponse.json({ error: 'No verification code found. Request a new one.' }, { status: 400 });
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(normalizedEmail);
    return NextResponse.json({ error: 'Code expired. Request a new one.' }, { status: 400 });
  }

  if (stored.attempts >= 5) {
    otpStore.delete(normalizedEmail);
    return NextResponse.json({ error: 'Too many failed attempts. Request a new code.' }, { status: 429 });
  }

  if (stored.code !== code) {
    stored.attempts++;
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
  }

  // Success — mark as verified
  otpStore.delete(normalizedEmail);
  return NextResponse.json({ verified: true });
}
