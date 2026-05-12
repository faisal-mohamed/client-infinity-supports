import { randomBytes, randomInt } from 'crypto';
import bcrypt from 'bcrypt';
import { prisma } from './prisma';

const MFA_CODE_EXPIRY_MINUTES = 5;
const MFA_TOKEN_EXPIRY_SECONDS = 60;
const MFA_MAX_ATTEMPTS = 3;
const MFA_RATE_LIMIT_WINDOW_MINUTES = 15;
const MFA_RATE_LIMIT_MAX_CODES = 5;
const BCRYPT_ROUNDS = 10;

/**
 * Generate a cryptographically secure 6-digit OTP.
 * Uses crypto.randomInt (not Math.random) for government-grade entropy.
 */
export function generateOTP(): string {
  return randomInt(100000, 999999).toString();
}

/**
 * Generate a cryptographically secure one-time token (hex).
 */
function generateMfaToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Check rate limit: max N codes per admin within time window.
 * Prevents OTP flooding/email spam.
 */
export async function checkMfaRateLimit(adminId: number): Promise<{ allowed: boolean; retryAfter?: Date }> {
  const windowStart = new Date(Date.now() - MFA_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000);

  const recentCodes = await prisma.mfaCode.count({
    where: {
      adminId,
      createdAt: { gte: windowStart },
    },
  });

  if (recentCodes >= MFA_RATE_LIMIT_MAX_CODES) {
    return {
      allowed: false,
      retryAfter: new Date(Date.now() + MFA_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000),
    };
  }

  return { allowed: true };
}

/**
 * Create and store a new MFA code for an admin.
 * Invalidates any existing unused codes for this admin.
 * Returns the plaintext code (for emailing) and the DB record ID.
 */
export async function createMfaCode(
  adminId: number,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<{ code: string; mfaId: number }> {
  // Invalidate all existing unused codes for this admin
  await prisma.mfaCode.updateMany({
    where: { adminId, used: false },
    data: { used: true },
  });

  const code = generateOTP();
  const codeHash = await bcrypt.hash(code, BCRYPT_ROUNDS);
  const expiresAt = new Date(Date.now() + MFA_CODE_EXPIRY_MINUTES * 60 * 1000);

  const record = await prisma.mfaCode.create({
    data: {
      adminId,
      codeHash,
      expiresAt,
      attempts: 0,
      maxAttempts: MFA_MAX_ATTEMPTS,
      used: false,
      verified: false,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
    },
  });

  return { code, mfaId: record.id };
}

/**
 * Verify an MFA code. Returns a one-time mfaToken on success.
 * Handles: expiry, attempt limiting, replay prevention.
 */
export async function verifyMfaCode(
  adminId: number,
  code: string
): Promise<{ success: boolean; mfaToken?: string; error?: string }> {
  // Find the latest unused, unexpired code for this admin
  const mfaRecord = await prisma.mfaCode.findFirst({
    where: {
      adminId,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!mfaRecord) {
    return { success: false, error: 'No valid OTP found. Please request a new code.' };
  }

  // Check attempt limit
  if (mfaRecord.attempts >= mfaRecord.maxAttempts) {
    await prisma.mfaCode.update({
      where: { id: mfaRecord.id },
      data: { used: true },
    });
    return { success: false, error: 'Too many failed attempts. Please request a new code.' };
  }

  // Verify the code against bcrypt hash
  const isValid = await bcrypt.compare(code, mfaRecord.codeHash);

  if (!isValid) {
    await prisma.mfaCode.update({
      where: { id: mfaRecord.id },
      data: { attempts: { increment: 1 } },
    });
    const remaining = mfaRecord.maxAttempts - mfaRecord.attempts - 1;
    return {
      success: false,
      error: remaining > 0
        ? `Invalid code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
        : 'Invalid code. No attempts remaining. Please request a new code.',
    };
  }

  // Success — generate one-time mfaToken
  const mfaToken = generateMfaToken();
  const tokenExpiresAt = new Date(Date.now() + MFA_TOKEN_EXPIRY_SECONDS * 1000);

  await prisma.mfaCode.update({
    where: { id: mfaRecord.id },
    data: {
      used: true,
      verified: true,
      mfaToken,
      tokenExpiresAt,
    },
  });

  return { success: true, mfaToken };
}

/**
 * Validate a one-time mfaToken during NextAuth authorize().
 * Consumes the token (single use).
 */
export async function validateMfaToken(adminId: number, mfaToken: string): Promise<boolean> {
  const record = await prisma.mfaCode.findFirst({
    where: {
      adminId,
      mfaToken,
      verified: true,
      tokenExpiresAt: { gt: new Date() },
    },
  });

  if (!record) return false;

  // Consume the token — prevent replay
  await prisma.mfaCode.update({
    where: { id: record.id },
    data: { mfaToken: null, tokenExpiresAt: null },
  });

  return true;
}

/**
 * Cleanup expired MFA codes older than 24 hours.
 * Call periodically or on each login.
 */
export async function cleanupExpiredMfaCodes(): Promise<number> {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const result = await prisma.mfaCode.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: cutoff } },
        { used: true, createdAt: { lt: cutoff } },
      ],
    },
  });
  return result.count;
}
