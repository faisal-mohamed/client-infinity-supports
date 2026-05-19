import { getAdminByEmail as dbGetAdminByEmail, updateAdmin } from './db/admin';
import { getEmailConfig, testEmailConnection } from './email';

/**
 * Generate a secure 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Check if a verification code is valid format
 */
export function isValidVerificationCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}

/**
 * Check if a password meets minimum requirements
 * Requirements:
 * - At least 15 characters
 * - At least one uppercase letter (A-Z)
 * - At least one number (0-9)
 * - At least one special character (!@#$%^&*_-+=[]{}|;:,.<>?)
 */
export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (!password) {
    return { valid: false, message: 'Password is required' };
  }
  if (password.length < 15) {
    return { valid: false, message: 'Password must be at least 15 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter (A-Z)' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number (0-9)' };
  }
  if (!/[!@#$%^&*_\-+=\[\]{}|;:,.<>?]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character (!@#$%^&*_-+=[]{}|;:,.<>?)' };
  }
  return { valid: true };
}

/**
 * Get admin by email (case insensitive)
 */
export async function getAdminByEmail(email: string) {
  return await dbGetAdminByEmail(email.toLowerCase());
}

/**
 * Check if admin has email configuration
 */
export async function checkAdminEmailConfiguration(adminId: string): Promise<{
  configured: boolean;
  message?: string;
}> {
  try {
    await getEmailConfig(adminId);
    const connectionTest = await testEmailConnection(adminId);
    return {
      configured: connectionTest.success,
      message: connectionTest.message
    };
  } catch (error) {
    return {
      configured: false,
      message: error instanceof Error ? error.message : 'Email configuration error'
    };
  }
}

/**
 * Set reset token for admin
 */
export async function setResetToken(adminId: string, token: string, expiryMinutes: number = 15) {
  const expiryTime = token ? new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString() : undefined;

  await updateAdmin(adminId, {
    resetToken: token || undefined,
    resetTokenExpiry: expiryTime,
  });
}

/**
 * Clear reset token for admin
 */
export async function clearResetToken(adminId: string) {
  await updateAdmin(adminId, {
    resetToken: undefined,
    resetTokenExpiry: undefined,
  });
}

/**
 * Verify reset token for admin
 */
export async function verifyResetToken(email: string, token: string): Promise<{
  valid: boolean;
  admin?: any;
  message?: string;
}> {
  const admin = await getAdminByEmail(email);

  if (!admin) {
    return { valid: false, message: 'Admin not found' };
  }

  if (!admin.resetToken || !admin.resetTokenExpiry) {
    return { valid: false, message: 'No reset token found' };
  }

  if (new Date() > new Date(admin.resetTokenExpiry)) {
    await clearResetToken(admin.id);
    return { valid: false, message: 'Reset token has expired' };
  }

  if (admin.resetToken !== token) {
    return { valid: false, message: 'Invalid reset token' };
  }

  return { valid: true, admin };
}

/**
 * Rate limiting for password reset requests
 * In-memory rate limiter (stateless across instances — acceptable for single-instance deployment)
 */
const resetAttempts = new Map<string, { count: number; lastAttempt: number }>();

export function checkRateLimit(email: string, maxAttempts: number = 3, windowMinutes: number = 15): {
  allowed: boolean;
  remainingAttempts?: number;
  resetTime?: Date;
} {
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  const key = email.toLowerCase();

  const attempts = resetAttempts.get(key);

  if (!attempts) {
    resetAttempts.set(key, { count: 1, lastAttempt: now });
    return { allowed: true, remainingAttempts: maxAttempts - 1 };
  }

  if (now - attempts.lastAttempt > windowMs) {
    resetAttempts.set(key, { count: 1, lastAttempt: now });
    return { allowed: true, remainingAttempts: maxAttempts - 1 };
  }

  if (attempts.count >= maxAttempts) {
    const resetTime = new Date(attempts.lastAttempt + windowMs);
    return { allowed: false, resetTime };
  }

  attempts.count++;
  attempts.lastAttempt = now;
  resetAttempts.set(key, attempts);

  return { allowed: true, remainingAttempts: maxAttempts - attempts.count };
}

/**
 * Clear rate limit for email
 */
export function clearRateLimit(email: string): void {
  resetAttempts.delete(email.toLowerCase());
}
