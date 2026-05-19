import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import {
  generateVerificationCode,
  getAdminByEmail,
  setResetToken,
  checkRateLimit,
  checkAdminEmailConfiguration
} from '@/lib/password-reset';

function createPasswordResetEmailHTML(name: string, code: string, appName: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset - ${appName}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
        .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e9ecef; }
        .logo { font-size: 24px; font-weight: bold; color: #4f46e5; margin-bottom: 10px; }
        .title { color: #1f2937; font-size: 28px; margin-bottom: 10px; }
        .subtitle { color: #6b7280; font-size: 16px; }
        .verification-code { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; letter-spacing: 8px; margin: 30px 0; font-family: 'Courier New', monospace; }
        .instructions { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .warning { background: #fef3cd; border: 1px solid #fbbf24; color: #92400e; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">${appName}</div>
          <h1 class="title">Password Reset Request</h1>
          <p class="subtitle">We received a request to reset your password</p>
        </div>
        <div class="content">
          <p>Hello <strong>${name}</strong>,</p>
          <p>Use the verification code below to reset your password:</p>
          <div class="verification-code">${code}</div>
          <div class="instructions">
            <h3 style="margin-top: 0; color: #374151;">How to use this code:</h3>
            <ol style="margin: 10px 0; padding-left: 20px;">
              <li>Go to the password reset page</li>
              <li>Enter your email address</li>
              <li>Enter the 6-digit verification code above</li>
              <li>Create your new password</li>
            </ol>
          </div>
          <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>This code will expire in <strong>15 minutes</strong></li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>Never share this code with anyone</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated message from ${appName}.</p>
          <p>Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    // Check rate limiting
    const rateLimit = checkRateLimit(email, 3, 15);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many password reset attempts. Please try again after ${rateLimit.resetTime?.toLocaleTimeString()}.` },
        { status: 429 }
      );
    }

    const admin = await getAdminByEmail(email);

    if (!admin) {
      return NextResponse.json(
        { error: 'No admin account found with this email address. Please check your email or contact your administrator.' },
        { status: 404 }
      );
    }

    // Check email configuration
    const emailConfigCheck = await checkAdminEmailConfiguration(admin.id);
    if (!emailConfigCheck.configured) {
      return NextResponse.json(
        { error: 'Email system is not configured for your account. Please contact your administrator to set up email settings.' },
        { status: 500 }
      );
    }

    // Generate verification code and set it
    const verificationCode = generateVerificationCode();
    await setResetToken(admin.id, verificationCode, 15);

    // Send email
    try {
      const emailHTML = createPasswordResetEmailHTML(admin.name, verificationCode, 'Infinity Support Portal');

      const emailResult = await sendEmail({
        to: admin.email,
        subject: 'Password Reset Verification Code - Infinity Support Portal',
        html: emailHTML,
        adminId: admin.id,
      });

      if (!emailResult.success) {
        await setResetToken(admin.id, '', 0);
        return NextResponse.json(
          { error: 'Failed to send verification email. Please ensure your email settings are configured and try again.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Verification code sent to your email address.',
        remainingAttempts: rateLimit.remainingAttempts,
      });

    } catch (emailError) {
      await setResetToken(admin.id, '', 0);

      let errorMessage = 'Failed to send verification email. Please try again.';
      if (emailError instanceof Error) {
        if (emailError.message.includes('SMTP Host') || emailError.message.includes('not configured')) {
          errorMessage = 'Email system is not configured for your account. Please contact your administrator.';
        } else if (emailError.message.includes('authentication') || emailError.message.includes('password')) {
          errorMessage = 'Email authentication failed. Please contact your administrator to check email settings.';
        }
      }

      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
}
