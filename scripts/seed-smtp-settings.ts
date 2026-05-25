import 'dotenv/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-southeast-2' });
const dynamodb = DynamoDBDocumentClient.from(client, { marshallOptions: { removeUndefinedValues: true } });
const TABLE = `${process.env.DYNAMODB_TABLE_PREFIX || 'InfinitySupports'}_Settings`;
const ADMIN_ID = '01KS5NQRS0W86AYRJD1N1QHC1D';

const settings = [
  { key: 'smtp_host', value: 'smtp.gmail.com', category: 'email', sortOrder: 1, label: 'SMTP Host' },
  { key: 'smtp_port', value: '587', category: 'email', sortOrder: 2, label: 'SMTP Port' },
  { key: 'from_email', value: 'stigmatatech@gmail.com', category: 'email', sortOrder: 3, label: 'From Email' },
  { key: 'smtp_password', value: 'uvwmtzphjtaofhxq', category: 'email', sortOrder: 4, label: 'SMTP Password' },
  { key: 'admin_email', value: 'stigmatatech@gmail.com', category: 'email', sortOrder: 5, label: 'Admin Email' },
  { key: 'app_name', value: 'Infinity Supports Platform', category: 'general', sortOrder: 1, label: 'App Name' },
];

async function main() {
  console.log(`\n📧 Seeding SMTP settings for super admin: ${ADMIN_ID}`);
  console.log(`   Table: ${TABLE}\n`);

  for (const s of settings) {
    const now = new Date().toISOString();
    await dynamodb.send(new PutCommand({
      TableName: TABLE,
      Item: {
        PK: `ADMIN#${ADMIN_ID}`,
        SK: `${s.category}#${String(s.sortOrder).padStart(4, '0')}#${s.key}`,
        GSI1PK: `ADMIN#${ADMIN_ID}`,
        GSI1SK: `KEY#${s.key}`,
        entityType: 'APP_SETTING',
        id: s.key, key: s.key, value: s.value, type: 'text',
        category: s.category, label: s.label, isRequired: true,
        sortOrder: s.sortOrder, isActive: true, adminId: ADMIN_ID,
        createdAt: now, updatedAt: now,
      },
    }));
    console.log(`  ✅ ${s.key}: ${s.key === 'smtp_password' ? '****' : s.value}`);
  }

  console.log('\n✅ SMTP configured for super admin!\n');
}

main().catch((err) => { console.error('❌ Failed:', err); process.exit(1); });
