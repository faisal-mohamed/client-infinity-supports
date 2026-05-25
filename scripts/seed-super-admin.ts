/**
 * Seed Super Admin User
 * Usage: npx ts-node scripts/seed-super-admin.ts
 */

import 'dotenv/config';
import bcrypt from 'bcrypt';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { randomBytes } from 'crypto';

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-southeast-2' });
const dynamodb = DynamoDBDocumentClient.from(ddbClient, { marshallOptions: { removeUndefinedValues: true } });
const TABLE = `${process.env.DYNAMODB_TABLE_PREFIX || 'InfinitySupports'}_Platform`;

// ULID generator
const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
function generateId(): string {
  let str = '';
  let now = Date.now();
  for (let i = 10; i > 0; i--) { str = ENCODING[now % 32] + str; now = Math.floor(now / 32); }
  const bytes = randomBytes(16);
  for (let i = 0; i < 16; i++) str += ENCODING[bytes[i] % 32];
  return str;
}

async function main() {
  const email = (process.env.SUPER_ADMIN_EMAIL || 'superadmin@infinitysupports.com.au').toLowerCase();
  const password = process.env.SUPER_ADMIN_PASSWORD || 'ChangeMe!2026';
  const name = process.env.SUPER_ADMIN_NAME || 'Platform Admin';

  console.log(`\n🔐 Seeding Super Admin: ${email}`);
  console.log(`   Table: ${TABLE}\n`);

  // Check if exists
  const existing = await dynamodb.send(
    new GetCommand({ TableName: TABLE, Key: { PK: `SA_EMAIL#${email}`, SK: 'PROFILE' } })
  );
  if (existing.Item) {
    console.log('✅ Super Admin already exists — skipping');
    return;
  }

  const id = generateId();
  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash(password, 12);

  await dynamodb.send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: TABLE,
            Item: {
              PK: `SA#${id}`, SK: 'PROFILE',
              GSI1PK: 'ALL_SUPER_ADMINS', GSI1SK: now,
              entityType: 'SUPER_ADMIN',
              id, email, name, passwordHash, mfaEnabled: true, createdAt: now, updatedAt: now,
            },
            ConditionExpression: 'attribute_not_exists(PK)',
          },
        },
        {
          Put: {
            TableName: TABLE,
            Item: { PK: `SA_EMAIL#${email}`, SK: 'PROFILE', superAdminId: id, entityType: 'SA_EMAIL_LOOKUP' },
            ConditionExpression: 'attribute_not_exists(PK)',
          },
        },
      ],
    })
  );

  console.log(`✅ Super Admin created: ${id}`);
  console.log(`   Email: ${email}`);
  console.log(`   Name: ${name}`);
  console.log('\n⚠️  Change the default password immediately after first login!\n');
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
