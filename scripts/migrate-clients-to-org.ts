/**
 * Migration: Assign organizationId to existing clients
 * 
 * This script:
 * 1. Finds the admin's organizationId
 * 2. Queries all clients from the legacy "CLIENTS" GSI1PK
 * 3. Updates each client with organizationId and new org-scoped GSI1PK
 *
 * Usage: ADMIN_EMAIL=admin@example.com npx ts-node scripts/migrate-clients-to-org.ts
 */

import 'dotenv/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-southeast-2' });
const dynamodb = DynamoDBDocumentClient.from(client, { marshallOptions: { removeUndefinedValues: true } });
const TABLE = process.env.DYNAMODB_TABLE_PREFIX || 'InfinitySupports';

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.error('❌ Set ADMIN_EMAIL env var to the provider admin email');
    process.exit(1);
  }

  // 1. Find admin by email
  const emailLookup = await dynamodb.send(new GetCommand({
    TableName: TABLE,
    Key: { PK: `ADMIN_EMAIL#${adminEmail.toLowerCase()}`, SK: 'PROFILE' },
  }));

  if (!emailLookup.Item) {
    console.error(`❌ Admin not found: ${adminEmail}`);
    process.exit(1);
  }

  const adminId = emailLookup.Item.adminId as string;

  // Get admin record to find organizationId
  const adminRecord = await dynamodb.send(new GetCommand({
    TableName: TABLE,
    Key: { PK: `ADMIN#${adminId}`, SK: 'PROFILE' },
  }));

  const organizationId = adminRecord.Item?.organizationId as string;
  if (!organizationId) {
    console.error(`❌ Admin ${adminEmail} has no organizationId. Was this admin created via Super Admin approval?`);
    process.exit(1);
  }

  console.log(`\n🔄 Migrating clients to org: ${organizationId}`);
  console.log(`   Admin: ${adminEmail} (${adminId})\n`);

  // 2. Query all clients from legacy GSI
  let allClients: any[] = [];
  let lastKey: any = undefined;

  do {
    const res = await dynamodb.send(new QueryCommand({
      TableName: TABLE,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk',
      ExpressionAttributeValues: { ':pk': 'CLIENTS' },
      ExclusiveStartKey: lastKey,
    }));
    allClients.push(...(res.Items || []));
    lastKey = res.LastEvaluatedKey;
  } while (lastKey);

  console.log(`   Found ${allClients.length} clients to migrate\n`);

  if (allClients.length === 0) {
    console.log('✅ No clients to migrate');
    return;
  }

  // 3. Update each client
  let updated = 0;
  let skipped = 0;

  for (const item of allClients) {
    // Skip if already has organizationId
    if (item.organizationId) {
      skipped++;
      continue;
    }

    const clientId = item.id || item.PK?.replace('CLIENT#', '');
    const nameLower = (item.commonFields?.name || item.name || '').toLowerCase();

    try {
      await dynamodb.send(new UpdateCommand({
        TableName: TABLE,
        Key: { PK: `CLIENT#${clientId}`, SK: 'PROFILE' },
        UpdateExpression: 'SET organizationId = :orgId, GSI1PK = :gsi1pk',
        ExpressionAttributeValues: {
          ':orgId': organizationId,
          ':gsi1pk': `ORG#${organizationId}#CLIENTS`,
        },
      }));
      updated++;
      if (updated % 10 === 0) process.stdout.write(`   Updated ${updated}/${allClients.length}\r`);
    } catch (e: any) {
      console.error(`   ❌ Failed to update client ${clientId}:`, e.message);
    }
  }

  console.log(`\n✅ Migration complete!`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped (already migrated): ${skipped}`);
  console.log(`   Total: ${allClients.length}\n`);
}

main().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
