/**
 * S3 Bucket Setup Script
 * Creates the S3 bucket for file storage.
 *
 * Usage: npx ts-node scripts/s3-bucket-setup.ts
 */

import 'dotenv/config';
import {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketCorsCommand,
  PutPublicAccessBlockCommand,
} from '@aws-sdk/client-s3';

const REGION = process.env.AWS_REGION || 'ap-southeast-1';
const BUCKET = process.env.S3_BUCKET || 'infinity-supports-dev-files';

const s3 = new S3Client({ region: REGION });

async function main() {
  console.log(`\n🪣 Setting up S3 bucket: ${BUCKET} (${REGION})\n`);

  // Check if bucket exists
  try {
    await s3.send(new HeadBucketCommand({ Bucket: BUCKET }));
    console.log('✅ Bucket already exists');
  } catch (e: any) {
    if (e.name === 'NotFound' || e.$metadata?.httpStatusCode === 404) {
      // Create bucket
      await s3.send(new CreateBucketCommand({ Bucket: BUCKET }));
      console.log('✅ Bucket created');
    } else {
      throw e;
    }
  }

  // Block public access
  await s3.send(new PutPublicAccessBlockCommand({
    Bucket: BUCKET,
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: true,
      IgnorePublicAcls: true,
      BlockPublicPolicy: true,
      RestrictPublicBuckets: true,
    },
  }));
  console.log('  🔒 Public access blocked');

  // Set CORS for presigned URL uploads from browser
  await s3.send(new PutBucketCorsCommand({
    Bucket: BUCKET,
    CORSConfiguration: {
      CORSRules: [{
        AllowedHeaders: ['*'],
        AllowedMethods: ['GET', 'PUT', 'POST'],
        AllowedOrigins: ['http://localhost:3000', process.env.NEXTAUTH_URL || '*'],
        ExposeHeaders: ['ETag'],
        MaxAgeSeconds: 3600,
      }],
    },
  }));
  console.log('  🌐 CORS configured');

  console.log(`\n✅ S3 bucket ready: ${BUCKET}\n`);
  console.log(`Add to .env: S3_BUCKET=${BUCKET}\n`);
}

main().catch((err) => {
  console.error('❌ S3 setup failed:', err);
  process.exit(1);
});
