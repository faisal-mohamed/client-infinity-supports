/**
 * S3 File Storage Service
 * Handles upload, download, delete, and presigned URL generation.
 * Per-tenant folder structure: org/{orgId}/...
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const BUCKET = process.env.S3_BUCKET || 'infinity-supports-dev-files';
const REGION = process.env.AWS_REGION || 'ap-southeast-1';

const s3 = new S3Client({ region: REGION });

export { BUCKET };

/**
 * Build the S3 key (path) for a file based on context.
 */
export function buildS3Key(params: {
  organizationId: string;
  folder: 'clients' | 'staff' | 'registration' | 'branding';
  entityId?: string;
  subfolder?: string;
  filename: string;
}): string {
  const { organizationId, folder, entityId, subfolder, filename } = params;
  const parts = ['org', organizationId, folder];
  if (entityId) parts.push(entityId);
  if (subfolder) parts.push(subfolder);
  parts.push(filename);
  return parts.join('/');
}

/**
 * Upload a file to S3.
 */
export async function uploadFile(params: {
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
  metadata?: Record<string, string>;
}): Promise<{ key: string; url: string }> {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
      Metadata: params.metadata,
    })
  );

  return {
    key: params.key,
    url: `https://${BUCKET}.s3.${REGION}.amazonaws.com/${params.key}`,
  };
}

/**
 * Generate a presigned URL for downloading a file (valid for 1 hour).
 */
export async function getDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn }
  );
}

/**
 * Generate a presigned URL for uploading a file directly from the browser.
 */
export async function getUploadUrl(params: {
  key: string;
  contentType: string;
  expiresIn?: number;
}): Promise<string> {
  return getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: params.key,
      ContentType: params.contentType,
    }),
    { expiresIn: params.expiresIn || 600 } // 10 min default
  );
}

/**
 * Delete a file from S3.
 */
export async function deleteFile(key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

/**
 * Max file size: 10MB
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Allowed MIME types
 */
export const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
