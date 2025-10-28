import { PrismaClient } from '@prisma/client';
import { getEmailConfig, testEmailConnection } from './email';

const prisma = new PrismaClient();

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
 */
export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (!password) {
    return { valid: false, message: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }
  
  // Add more password requirements if needed
  // if (!/(?=.*[a-z])/.test(password)) {
  //   return { valid: false, message: 'Password must contain at least one lowercase letter' };
  // }
  
  return { valid: true };
}

/**
 * Clean up expired reset tokens (can be run as a cleanup job)
 */
export async function cleanupExpiredResetTokens(): Promise<number> {
  try {
    const result = await prisma.admin.updateMany({
      where: {
        resetTokenExpiry: {
          lt: new Date(),
        },
        resetToken: {
          not: null,
        },
      },
      data: {
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    console.log(`🧹 Cleaned up ${result.count} expired reset tokens`);
    return result.count;
  } catch (error) {
    console.error('Error cleaning up expired reset tokens:', error);
    throw error;
  }
}

/**
 * Get admin by email (case insensitive)
 */
export async function getAdminByEmail(email: string) {
  return await prisma.admin.findUnique({
    where: { email: email.toLowerCase() },
  });
}

/**
 * Check if admin has email configuration
 */
export async function checkAdminEmailConfiguration(adminId: number): Promise<{
  configured: boolean;
  message?: string;
}> {
  try {
    await getEmailConfig(adminId);
    
    // Test the email connection
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
export async function setResetToken(adminId: number, token: string, expiryMinutes: number = 15) {
  const expiryTime = new Date(Date.now() + expiryMinutes * 60 * 1000);
  
  return await prisma.admin.update({
    where: { id: adminId },
    data: {
      resetToken: token || null,
      resetTokenExpiry: token ? expiryTime : null,
    },
  });
}

/**
 * Clear reset token for admin
 */
export async function clearResetToken(adminId: number) {
  return await prisma.admin.update({
    where: { id: adminId },
    data: {
      resetToken: null,
      resetTokenExpiry: null,
    },
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
  
  if (new Date() > admin.resetTokenExpiry) {
    // Clean up expired token
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
 * This is a simple in-memory rate limiter - for production, consider using Redis
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
  
  // Reset if window has passed
  if (now - attempts.lastAttempt > windowMs) {
    resetAttempts.set(key, { count: 1, lastAttempt: now });
    return { allowed: true, remainingAttempts: maxAttempts - 1 };
  }
  
  // Check if limit exceeded
  if (attempts.count >= maxAttempts) {
    const resetTime = new Date(attempts.lastAttempt + windowMs);
    return { allowed: false, resetTime };
  }
  
  // Increment attempts
  attempts.count++;
  attempts.lastAttempt = now;
  resetAttempts.set(key, attempts);
  
  return { allowed: true, remainingAttempts: maxAttempts - attempts.count };
}

/**
 * Clear rate limit for email (useful for testing or admin override)
 */
export function clearRateLimit(email: string): void {
  resetAttempts.delete(email.toLowerCase());
}
