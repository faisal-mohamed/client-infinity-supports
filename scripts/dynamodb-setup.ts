/**
 * DynamoDB Table Setup Script
 * Creates all 4 tables with GSIs for Infinity Supports
 * 
 * Usage: npx ts-node scripts/dynamodb-setup.ts
 * 
 * Requires: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY env vars
 * Or configured AWS CLI profile
 */

import "dotenv/config";
import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
  UpdateTimeToLiveCommand,
  UpdateContinuousBackupsCommand,
  type CreateTableCommandInput,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-southeast-2", // Sydney for Australian gov
});

const TABLE_PREFIX = process.env.DYNAMODB_TABLE_PREFIX || "InfinitySupports";

// Table 1: Main Table
const mainTable: CreateTableCommandInput = {
  TableName: `${TABLE_PREFIX}`,
  BillingMode: "PAY_PER_REQUEST",
  KeySchema: [
    { AttributeName: "PK", KeyType: "HASH" },
    { AttributeName: "SK", KeyType: "RANGE" },
  ],
  AttributeDefinitions: [
    { AttributeName: "PK", AttributeType: "S" },
    { AttributeName: "SK", AttributeType: "S" },
    { AttributeName: "GSI1PK", AttributeType: "S" },
    { AttributeName: "GSI1SK", AttributeType: "S" },
    { AttributeName: "GSI2PK", AttributeType: "S" },
    { AttributeName: "GSI2SK", AttributeType: "S" },
    { AttributeName: "GSI3PK", AttributeType: "S" },
    { AttributeName: "GSI3SK", AttributeType: "S" },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: "GSI1",
      KeySchema: [
        { AttributeName: "GSI1PK", KeyType: "HASH" },
        { AttributeName: "GSI1SK", KeyType: "RANGE" },
      ],
      Projection: { ProjectionType: "ALL" },
    },
    {
      IndexName: "GSI2",
      KeySchema: [
        { AttributeName: "GSI2PK", KeyType: "HASH" },
        { AttributeName: "GSI2SK", KeyType: "RANGE" },
      ],
      Projection: { ProjectionType: "ALL" },
    },
    {
      IndexName: "GSI3",
      KeySchema: [
        { AttributeName: "GSI3PK", KeyType: "HASH" },
        { AttributeName: "GSI3SK", KeyType: "RANGE" },
      ],
      Projection: { ProjectionType: "ALL" },
    },
  ],
  DeletionProtectionEnabled: true,
};

// Table 2: Audit Table
const auditTable: CreateTableCommandInput = {
  TableName: `${TABLE_PREFIX}_Audit`,
  BillingMode: "PAY_PER_REQUEST",
  KeySchema: [
    { AttributeName: "PK", KeyType: "HASH" },
    { AttributeName: "SK", KeyType: "RANGE" },
  ],
  AttributeDefinitions: [
    { AttributeName: "PK", AttributeType: "S" },
    { AttributeName: "SK", AttributeType: "S" },
    { AttributeName: "GSI1PK", AttributeType: "S" },
    { AttributeName: "GSI1SK", AttributeType: "S" },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: "GSI1",
      KeySchema: [
        { AttributeName: "GSI1PK", KeyType: "HASH" },
        { AttributeName: "GSI1SK", KeyType: "RANGE" },
      ],
      Projection: { ProjectionType: "ALL" },
    },
  ],
  DeletionProtectionEnabled: true,
};

// Table 3: Notifications Table
const notificationsTable: CreateTableCommandInput = {
  TableName: `${TABLE_PREFIX}_Notifications`,
  BillingMode: "PAY_PER_REQUEST",
  KeySchema: [
    { AttributeName: "PK", KeyType: "HASH" },
    { AttributeName: "SK", KeyType: "RANGE" },
  ],
  AttributeDefinitions: [
    { AttributeName: "PK", AttributeType: "S" },
    { AttributeName: "SK", AttributeType: "S" },
    { AttributeName: "GSI1PK", AttributeType: "S" },
    { AttributeName: "GSI1SK", AttributeType: "S" },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: "GSI1",
      KeySchema: [
        { AttributeName: "GSI1PK", KeyType: "HASH" },
        { AttributeName: "GSI1SK", KeyType: "RANGE" },
      ],
      Projection: { ProjectionType: "ALL" },
    },
  ],
  DeletionProtectionEnabled: true,
};

// Table 4: Settings Table
const settingsTable: CreateTableCommandInput = {
  TableName: `${TABLE_PREFIX}_Settings`,
  BillingMode: "PAY_PER_REQUEST",
  KeySchema: [
    { AttributeName: "PK", KeyType: "HASH" },
    { AttributeName: "SK", KeyType: "RANGE" },
  ],
  AttributeDefinitions: [
    { AttributeName: "PK", AttributeType: "S" },
    { AttributeName: "SK", AttributeType: "S" },
    { AttributeName: "GSI1PK", AttributeType: "S" },
    { AttributeName: "GSI1SK", AttributeType: "S" },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: "GSI1",
      KeySchema: [
        { AttributeName: "GSI1PK", KeyType: "HASH" },
        { AttributeName: "GSI1SK", KeyType: "RANGE" },
      ],
      Projection: { ProjectionType: "ALL" },
    },
  ],
  DeletionProtectionEnabled: true,
};

async function tableExists(tableName: string): Promise<boolean> {
  try {
    await client.send(new DescribeTableCommand({ TableName: tableName }));
    return true;
  } catch (e: any) {
    if (e.name === "ResourceNotFoundException") return false;
    throw e;
  }
}

async function createTable(config: CreateTableCommandInput) {
  const name = config.TableName!;
  if (await tableExists(name)) {
    console.log(`✅ Table "${name}" already exists — skipping`);
    return;
  }
  await client.send(new CreateTableCommand(config));
  console.log(`✅ Created table "${name}"`);

  // Wait for table to become active
  await waitForTable(name);
}

async function waitForTable(tableName: string) {
  let active = false;
  while (!active) {
    const desc = await client.send(new DescribeTableCommand({ TableName: tableName }));
    if (desc.Table?.TableStatus === "ACTIVE") { active = true; break; }
    await new Promise((r) => setTimeout(r, 2000));
  }
}

async function enableTTL(tableName: string, attributeName: string) {
  try {
    await client.send(new UpdateTimeToLiveCommand({
      TableName: tableName,
      TimeToLiveSpecification: { Enabled: true, AttributeName: attributeName },
    }));
    console.log(`  ⏱️  TTL enabled on "${tableName}" (attribute: ${attributeName})`);
  } catch (e: any) {
    if (e.name === "ValidationException" && e.message?.includes("already enabled")) {
      console.log(`  ⏱️  TTL already enabled on "${tableName}"`);
    } else { throw e; }
  }
}

async function enablePITR(tableName: string) {
  try {
    await client.send(new UpdateContinuousBackupsCommand({
      TableName: tableName,
      PointInTimeRecoverySpecification: { PointInTimeRecoveryEnabled: true },
    }));
    console.log(`  🔒 PITR enabled on "${tableName}"`);
  } catch (e: any) {
    if (e.message?.includes("already enabled")) {
      console.log(`  🔒 PITR already enabled on "${tableName}"`);
    } else { throw e; }
  }
}

async function main() {
  console.log("🚀 Creating DynamoDB tables for Infinity Supports...\n");
  console.log(`   Region: ${process.env.AWS_REGION || "ap-southeast-2"}`);
  console.log(`   Prefix: ${TABLE_PREFIX}\n`);

  await createTable(mainTable);
  await createTable(auditTable);
  await createTable(notificationsTable);
  await createTable(settingsTable);

  // Enable TTL on main table (for MFA codes, expired batches)
  await enableTTL(`${TABLE_PREFIX}`, "ttl");

  // Enable PITR on all tables (government requirement)
  await enablePITR(`${TABLE_PREFIX}`);
  await enablePITR(`${TABLE_PREFIX}_Audit`);
  await enablePITR(`${TABLE_PREFIX}_Notifications`);
  await enablePITR(`${TABLE_PREFIX}_Settings`);

  console.log("\n✅ All tables created successfully!");
  console.log("\nTable Summary:");
  console.log(`  ${TABLE_PREFIX}               — Main (3 GSIs, TTL, PITR)`);
  console.log(`  ${TABLE_PREFIX}_Audit          — Audit logs (1 GSI, PITR)`);
  console.log(`  ${TABLE_PREFIX}_Notifications  — Notifications (1 GSI, PITR)`);
  console.log(`  ${TABLE_PREFIX}_Settings       — Settings (1 GSI, PITR)`);
}

main().catch((err) => {
  console.error("❌ Setup failed:", err);
  process.exit(1);
});
