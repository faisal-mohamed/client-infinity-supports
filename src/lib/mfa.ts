import { randomBytes, randomInt } from 'crypto';
import bcrypt from 'bcrypt';
import {
  QueryCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { dynamodb, TABLE } from './dynamodb';
import { generateId, nowISO, ttlFromNow } from './dynamodb-utils';

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
export async function checkMfaRateLimit(adminId: string): Promise<{ allowed: boolean; retryAfter?: Date }> {
  const windowStart = new Date(Date.now() - MFA_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();

  const res = await dynamodb.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND SK >= :sk",
      ExpressionAttributeValues: {
        ":pk": `ADMIN#${adminId}`,
        ":sk": `MFA#${windowStart}`,
      },
    })
  );

  const recentCodes = (res.Items || []).filter(item => item.entityType === "MFA_CODE").length;

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
 * Returns the plaintext code (for emailing) and the DB record SK.
 */
export async function createMfaCode(
  adminId: string,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<{ code: string; mfaSK: string }> {
  // Invalidate all existing unused codes for this admin
  const existingCodes = await dynamodb.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      FilterExpression: "used = :f",
      ExpressionAttributeValues: {
        ":pk": `ADMIN#${adminId}`,
        ":sk": "MFA#",
        ":f": false,
      },
    })
  );

  // Mark existing unused codes as used
  if (existingCodes.Items && existingCodes.Items.length > 0) {
    await Promise.all(
      existingCodes.Items.map((item) =>
        dynamodb.send(
          new UpdateCommand({
            TableName: TABLE,
            Key: { PK: `ADMIN#${adminId}`, SK: item.SK },
            UpdateExpression: "SET used = :t",
            ExpressionAttributeValues: { ":t": true },
          })
        )
      )
    );
  }

  const code = generateOTP();
  const codeHash = await bcrypt.hash(code, BCRYPT_ROUNDS);
  const now = nowISO();
  const expiresAt = new Date(Date.now() + MFA_CODE_EXPIRY_MINUTES * 60 * 1000).toISOString();
  const id = generateId();
  const sk = `MFA#${now}#${id}`;
  const ttl = ttlFromNow(86400); // 24h auto-cleanup

  await dynamodb.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        PK: `ADMIN#${adminId}`,
        SK: sk,
        entityType: "MFA_CODE",
        id,
        adminId,
        codeHash,
        expiresAt,
        attempts: 0,
        maxAttempts: MFA_MAX_ATTEMPTS,
        used: false,
        verified: false,
        ipAddress: ipAddress || undefined,
        userAgent: userAgent || undefined,
        createdAt: now,
        ttl,
      },
    })
  );

  return { code, mfaSK: sk };
}

/**
 * Verify an MFA code. Returns a one-time mfaToken on success.
 * Handles: expiry, attempt limiting, replay prevention.
 */
export async function verifyMfaCode(
  adminId: string,
  code: string
): Promise<{ success: boolean; mfaToken?: string; error?: string }> {
  const now = nowISO();

  // Find the latest unused, unexpired code for this admin
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      FilterExpression: "used = :f AND expiresAt > :now AND entityType = :et",
      ExpressionAttributeValues: {
        ":pk": `ADMIN#${adminId}`,
        ":sk": "MFA#",
        ":f": false,
        ":now": now,
        ":et": "MFA_CODE",
      },
      ScanIndexForward: false, // Latest first
    })
  );

  const mfaRecord = res.Items?.[0];

  if (!mfaRecord) {
    return { success: false, error: 'No valid OTP found. Please request a new code.' };
  }

  // Check attempt limit
  if (mfaRecord.attempts >= mfaRecord.maxAttempts) {
    await dynamodb.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { PK: `ADMIN#${adminId}`, SK: mfaRecord.SK },
        UpdateExpression: "SET used = :t",
        ExpressionAttributeValues: { ":t": true },
      })
    );
    return { success: false, error: 'Too many failed attempts. Please request a new code.' };
  }

  // Verify the code against bcrypt hash
  const isValid = await bcrypt.compare(code, mfaRecord.codeHash as string);

  if (!isValid) {
    await dynamodb.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { PK: `ADMIN#${adminId}`, SK: mfaRecord.SK },
        UpdateExpression: "SET attempts = attempts + :one",
        ExpressionAttributeValues: { ":one": 1 },
      })
    );
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
  const tokenExpiresAt = new Date(Date.now() + MFA_TOKEN_EXPIRY_SECONDS * 1000).toISOString();
  const ttl = ttlFromNow(86400);

  await dynamodb.send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Update: {
            TableName: TABLE,
            Key: { PK: `ADMIN#${adminId}`, SK: mfaRecord.SK },
            UpdateExpression: "SET used = :t, verified = :v, mfaToken = :mt, tokenExpiresAt = :te",
            ExpressionAttributeValues: { ":t": true, ":v": true, ":mt": mfaToken, ":te": tokenExpiresAt },
          },
        },
        {
          Put: {
            TableName: TABLE,
            Item: {
              PK: `MFA_TOKEN#${mfaToken}`,
              SK: "MFA_TOKEN",
              entityType: "MFA_TOKEN_LOOKUP",
              adminId,
              mfaCodeSK: mfaRecord.SK,
              tokenExpiresAt,
              ttl,
            },
          },
        },
      ],
    })
  );

  return { success: true, mfaToken };
}

/**
 * Validate a one-time mfaToken during NextAuth authorize().
 * Consumes the token (single use).
 */
export async function validateMfaToken(adminId: string, mfaToken: string): Promise<boolean> {
  // Look up token
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND SK = :sk",
      ExpressionAttributeValues: {
        ":pk": `MFA_TOKEN#${mfaToken}`,
        ":sk": "MFA_TOKEN",
      },
    })
  );

  const record = res.Items?.[0];
  if (!record) return false;

  // Verify it belongs to this admin and hasn't expired
  if (record.adminId !== adminId) return false;
  if (record.tokenExpiresAt && record.tokenExpiresAt < nowISO()) return false;

  // Consume the token — prevent replay
  await dynamodb.send(
    new DeleteCommand({
      TableName: TABLE,
      Key: { PK: `MFA_TOKEN#${mfaToken}`, SK: "MFA_TOKEN" },
    })
  );

  return true;
}

/**
 * Mark an MFA code as used (e.g., when email send fails).
 */
export async function markMfaCodeUsed(adminId: string, mfaSK: string): Promise<void> {
  await dynamodb.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { PK: `ADMIN#${adminId}`, SK: mfaSK },
      UpdateExpression: "SET used = :t",
      ExpressionAttributeValues: { ":t": true },
    })
  );
}

/**
 * Cleanup expired MFA codes older than 24 hours.
 * With TTL enabled, this is handled automatically by DynamoDB.
 * This function is kept for API compatibility but is now a no-op.
 */
export async function cleanupExpiredMfaCodes(): Promise<number> {
  // DynamoDB TTL handles this automatically — no manual cleanup needed
  return 0;
}
