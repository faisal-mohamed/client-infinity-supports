/**
 * Platform Table Setup — Super Admin Module
 * Creates the Platform table for SaaS-level data
 *
 * Usage: npx ts-node scripts/platform-table-setup.ts
 *
 * Key Design:
 *   PK/SK — Primary access pattern
 *   GSI1 (GSI1PK/GSI1SK) — List all of entity type, filter by status/date
 *   GSI2 (GSI2PK/GSI2SK) — Cross-entity lookups (e.g., org by ABN, email lookup)
 *   GSI3 (GSI3PK/GSI3SK) — Time-series queries (audit logs by date range)
 *
 * Access Patterns:
 *   Get org by ID:           PK=ORG#{id}, SK=PROFILE
 *   Get org by ABN:          GSI2PK=ABN#{abn}, GSI2SK=ORG
 *   List all orgs:           GSI1PK=ALL_ORGS, GSI1SK={status}#{createdAt}
 *   Get subscription:        PK=ORG#{orgId}, SK=SUBSCRIPTION#{id}
 *   Get plan by ID:          PK=PLAN#{id}, SK=PROFILE
 *   List plans:              GSI1PK=ALL_PLANS, GSI1SK={tier}#{id}
 *   Get super admin:         PK=SA#{id}, SK=PROFILE
 *   Get SA by email:         PK=SA_EMAIL#{email}, SK=PROFILE
 *   Feature flags for org:   PK=ORG#{orgId}, SK=FEATURE#{key}
 *   Audit logs (all):        GSI3PK=AUDIT#{category}, GSI3SK={createdAt}#{id}
 *   Audit logs (by org):     PK=AUDIT#ORG#{orgId}, SK={createdAt}#{id}
 *   Form templates:          PK=TEMPLATE#{id}, SK=PROFILE
 *   List templates:          GSI1PK=ALL_TEMPLATES, GSI1SK={status}#{formKey}
 *   Email templates:         PK=EMAIL_TPL#{id}, SK=PROFILE
 *   Compliance checks:       PK=ORG#{orgId}, SK=COMPLIANCE#{checkType}#{id}
 */

import 'dotenv/config';
import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
  UpdateTimeToLiveCommand,
  UpdateContinuousBackupsCommand,
  type CreateTableCommandInput,
} from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-southeast-2',
});

const TABLE_PREFIX = process.env.DYNAMODB_TABLE_PREFIX || 'InfinitySupports';
const TABLE_NAME = `${TABLE_PREFIX}_Platform`;

const platformTable: CreateTableCommandInput = {
  TableName: TABLE_NAME,
  BillingMode: 'PAY_PER_REQUEST',
  KeySchema: [
    { AttributeName: 'PK', KeyType: 'HASH' },
    { AttributeName: 'SK', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'PK', AttributeType: 'S' },
    { AttributeName: 'SK', AttributeType: 'S' },
    { AttributeName: 'GSI1PK', AttributeType: 'S' },
    { AttributeName: 'GSI1SK', AttributeType: 'S' },
    { AttributeName: 'GSI2PK', AttributeType: 'S' },
    { AttributeName: 'GSI2SK', AttributeType: 'S' },
    { AttributeName: 'GSI3PK', AttributeType: 'S' },
    { AttributeName: 'GSI3SK', AttributeType: 'S' },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'GSI1',
      KeySchema: [
        { AttributeName: 'GSI1PK', KeyType: 'HASH' },
        { AttributeName: 'GSI1SK', KeyType: 'RANGE' },
      ],
      Projection: { ProjectionType: 'ALL' },
    },
    {
      IndexName: 'GSI2',
      KeySchema: [
        { AttributeName: 'GSI2PK', KeyType: 'HASH' },
        { AttributeName: 'GSI2SK', KeyType: 'RANGE' },
      ],
      Projection: { ProjectionType: 'ALL' },
    },
    {
      IndexName: 'GSI3',
      KeySchema: [
        { AttributeName: 'GSI3PK', KeyType: 'HASH' },
        { AttributeName: 'GSI3SK', KeyType: 'RANGE' },
      ],
      Projection: { ProjectionType: 'ALL' },
    },
  ],
  DeletionProtectionEnabled: true,
};

async function tableExists(tableName: string): Promise<boolean> {
  try {
    await client.send(new DescribeTableCommand({ TableName: tableName }));
    return true;
  } catch (e: any) {
    if (e.name === 'ResourceNotFoundException') return false;
    throw e;
  }
}

async function waitForTable(tableName: string) {
  let active = false;
  while (!active) {
    const desc = await client.send(new DescribeTableCommand({ TableName: tableName }));
    if (desc.Table?.TableStatus === 'ACTIVE') { active = true; break; }
    await new Promise((r) => setTimeout(r, 2000));
  }
}

async function main() {
  console.log('🚀 Creating Platform table for Super Admin module...\n');
  console.log(`   Region: ${process.env.AWS_REGION || 'ap-southeast-2'}`);
  console.log(`   Table:  ${TABLE_NAME}\n`);

  if (await tableExists(TABLE_NAME)) {
    console.log(`✅ Table "${TABLE_NAME}" already exists — skipping creation`);
  } else {
    await client.send(new CreateTableCommand(platformTable));
    console.log(`✅ Created table "${TABLE_NAME}"`);
    await waitForTable(TABLE_NAME);
  }

  // Enable TTL (for expired tokens, trial periods)
  try {
    await client.send(new UpdateTimeToLiveCommand({
      TableName: TABLE_NAME,
      TimeToLiveSpecification: { Enabled: true, AttributeName: 'ttl' },
    }));
    console.log('  ⏱️  TTL enabled');
  } catch (e: any) {
    if (e.message?.includes('already enabled')) console.log('  ⏱️  TTL already enabled');
    else throw e;
  }

  // Enable Point-in-Time Recovery (NDIS 7-year retention requirement)
  try {
    await client.send(new UpdateContinuousBackupsCommand({
      TableName: TABLE_NAME,
      PointInTimeRecoverySpecification: { PointInTimeRecoveryEnabled: true },
    }));
    console.log('  🔒 PITR enabled');
  } catch (e: any) {
    if (e.message?.includes('already enabled')) console.log('  🔒 PITR already enabled');
    else throw e;
  }

  console.log(`\n✅ Platform table ready: ${TABLE_NAME} (3 GSIs, TTL, PITR)`);
}

main().catch((err) => {
  console.error('❌ Platform table setup failed:', err);
  process.exit(1);
});
