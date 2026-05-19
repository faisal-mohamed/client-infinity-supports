/**
 * PostgreSQL → DynamoDB Data Migration Script
 * 
 * Migrates all data from the existing PostgreSQL database to DynamoDB.
 * Run AFTER dynamodb-setup.ts has created the tables.
 * 
 * Usage: npx ts-node scripts/migrate-data.ts
 * 
 * Requires: DATABASE_URL (PostgreSQL), AWS credentials configured
 */

import { PrismaClient } from "@prisma/client";
import { DynamoDBDocumentClient, PutCommand, BatchWriteCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const prisma = new PrismaClient();
const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION || "ap-southeast-2" }),
  { marshallOptions: { removeUndefinedValues: true } }
);

const TABLE = process.env.DYNAMODB_TABLE_PREFIX || "InfinitySupports";
const AUDIT_TABLE = `${TABLE}_Audit`;
const NOTIFICATIONS_TABLE = `${TABLE}_Notifications`;
const SETTINGS_TABLE = `${TABLE}_Settings`;

// ULID generation (same as dynamodb-utils.ts)
import { randomBytes } from "crypto";
const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
function generateId(): string {
  let str = "";
  let t = Date.now();
  for (let i = 10; i > 0; i--) { str = ENCODING[t % 32] + str; t = Math.floor(t / 32); }
  const bytes = randomBytes(16);
  for (let i = 0; i < 16; i++) str += ENCODING[bytes[i] % 32];
  return str;
}

// ID mapping: old integer ID → new ULID
const idMap: Record<string, Record<number, string>> = {
  admin: {}, client: {}, form: {}, batch: {}, assignment: {}, submission: {}, staff: {},
};

function mapId(entity: string, oldId: number): string {
  if (!idMap[entity][oldId]) idMap[entity][oldId] = generateId();
  return idMap[entity][oldId];
}

// Batch write helper (max 25 items per batch)
async function batchPut(table: string, items: any[]) {
  for (let i = 0; i < items.length; i += 25) {
    const batch = items.slice(i, i + 25);
    await ddb.send(new BatchWriteCommand({
      RequestItems: { [table]: batch.map((item) => ({ PutRequest: { Item: item } })) },
    }));
  }
}

async function migrateAdmins() {
  console.log("📦 Migrating Admins...");
  const admins = await prisma.admin.findMany();
  const items: any[] = [];

  for (const admin of admins) {
    const id = mapId("admin", admin.id);
    // Profile item
    items.push({
      PK: `ADMIN#${id}`, SK: "PROFILE", entityType: "ADMIN",
      GSI1PK: "ALL_ADMINS", GSI1SK: `${admin.email}#${id}`,
      id, name: admin.name, email: admin.email, passwordHash: admin.passwordHash,
      resetToken: admin.resetToken || undefined, resetTokenExpiry: admin.resetTokenExpiry?.toISOString(),
      createdAt: admin.createdAt.toISOString(), updatedAt: admin.updatedAt.toISOString(),
    });
    // Email lookup
    items.push({
      PK: `ADMIN_EMAIL#${admin.email}`, SK: "PROFILE", entityType: "ADMIN_EMAIL", adminId: id,
    });
  }
  await batchPut(TABLE, items);
  console.log(`  ✅ ${admins.length} admins migrated`);
}

async function migrateClients() {
  console.log("📦 Migrating Clients...");
  const clients = await prisma.client.findMany({ include: { commonFields: true } });
  const items: any[] = [];
  let activeCount = 0;

  for (const client of clients) {
    const id = mapId("client", client.id);
    const cf = client.commonFields;
    const commonFields = cf ? { name: cf.name, surname: cf.surname, age: cf.age, email: cf.email, sex: cf.sex, street: cf.street, state: cf.state, postCode: cf.postCode, dob: cf.dob, ndis: cf.ndis, disability: cf.disability, address: cf.address, phone: cf.phone } : {};
    const nameLower = (cf?.name || client.name || "").toLowerCase();
    const isArchived = !!client.archivedAt;
    if (!isArchived) activeCount++;

    items.push({
      PK: `CLIENT#${id}`, SK: "PROFILE", entityType: "CLIENT",
      GSI1PK: "CLIENTS", GSI1SK: isArchived ? `ARCHIVED#${client.archivedAt!.toISOString()}#${id}` : `ACTIVE#${nameLower}#${id}`,
      GSI2PK: cf?.state ? `CLIENT_SEARCH#${cf.state}` : undefined,
      GSI2SK: cf?.state ? `${nameLower}#${id}` : undefined,
      GSI3PK: "CLIENTS_BY_DATE", GSI3SK: `${client.createdAt.toISOString()}#${id}`,
      id, name: client.name, email: client.email, phone: client.phone,
      createdAt: client.createdAt.toISOString(), updatedAt: client.updatedAt.toISOString(),
      createdById: client.createdById ? mapId("admin", client.createdById) : undefined,
      archivedAt: client.archivedAt?.toISOString(), archivedBy: client.archivedBy ? String(client.archivedBy) : undefined,
      commonFields,
    });

    // Admin→Client relationship
    if (client.createdById) {
      items.push({
        PK: `ADMIN#${mapId("admin", client.createdById)}`, SK: `CLIENT#${id}`,
        entityType: "ADMIN_CLIENT", clientId: id, clientName: client.name, createdAt: client.createdAt.toISOString(),
      });
    }
  }
  await batchPut(TABLE, items);

  // Initialize counters
  await ddb.send(new PutCommand({ TableName: TABLE, Item: {
    PK: "COUNTERS", SK: "DASHBOARD", totalActiveClients: activeCount, newClientsThisMonth: 0,
    completedForms: 0, notStartedForms: 0, inProgressForms: 0, pendingAdminReview: 0, signatureRequests: 0, completedSignatures: 0,
  }}));
  console.log(`  ✅ ${clients.length} clients migrated (${activeCount} active)`);
}

async function migrateForms() {
  console.log("📦 Migrating MasterForms...");
  const forms = await prisma.masterForm.findMany();
  const items: any[] = [];

  for (const form of forms) {
    const id = mapId("form", form.id);
    items.push({
      PK: `FORM#${id}`, SK: "PROFILE", entityType: "MASTER_FORM",
      GSI1PK: "ALL_FORMS", GSI1SK: `${form.formKey}#${id}`,
      id, formKey: form.formKey, title: form.title, version: form.version,
      schema: form.schema, requiresSignature: form.requiresSignature,
      createdAt: form.createdAt.toISOString(), updatedAt: form.updatedAt.toISOString(),
    });
    items.push({
      PK: `FORM_KEY#${form.formKey}`, SK: `VERSION#${form.version}`,
      entityType: "FORM_VERSION", formId: id, ...{ id, formKey: form.formKey, title: form.title, version: form.version, schema: form.schema, requiresSignature: form.requiresSignature, createdAt: form.createdAt.toISOString(), updatedAt: form.updatedAt.toISOString() },
    });
  }
  await batchPut(TABLE, items);
  console.log(`  ✅ ${forms.length} forms migrated`);
}

async function migrateBatchesAndAssignments() {
  console.log("📦 Migrating FormBatches + Assignments...");
  const batches = await prisma.formBatch.findMany({ include: { assignments: { include: { form: true } } } });
  const items: any[] = [];
  let counters = { notStartedForms: 0, inProgressForms: 0, completedForms: 0, pendingAdminReview: 0 };

  for (const batch of batches) {
    const batchId = mapId("batch", batch.id);
    const clientId = mapId("client", batch.clientId);

    items.push({
      PK: `CLIENT#${clientId}`, SK: `BATCH#${batchId}`, entityType: "FORM_BATCH",
      id: batchId, clientId, batchToken: batch.batchToken, passcode: batch.passcode,
      expiresAt: batch.expiresAt.toISOString(), createdAt: batch.createdAt.toISOString(),
      isSignatureOnly: batch.isSignatureOnly, isCompleted: batch.isCompleted,
      completedAt: batch.completedAt?.toISOString(), adminNotified: batch.adminNotified,
    });
    items.push({
      PK: `BATCH_TOKEN#${batch.batchToken}`, SK: "BATCH", entityType: "BATCH_TOKEN_LOOKUP",
      batchId, clientId, batchToken: batch.batchToken, expiresAt: batch.expiresAt.toISOString(),
      isSignatureOnly: batch.isSignatureOnly, isCompleted: batch.isCompleted,
    });

    for (const a of batch.assignments) {
      if (a.archivedAt) continue;
      const aId = mapId("assignment", a.id);
      const formId = mapId("form", a.formId);
      const status = a.currentStatus;
      if (status === "not_started") counters.notStartedForms++;
      else if (status === "in_progress") counters.inProgressForms++;
      else if (status === "completed") counters.completedForms++;
      else if (status === "pending_admin_review") counters.pendingAdminReview++;

      items.push({
        PK: `CLIENT#${clientId}`, SK: `ASSIGNMENT#${aId}`, entityType: "FORM_ASSIGNMENT",
        GSI1PK: `ASSIGNMENTS#${clientId}`, GSI1SK: `STATUS#${status}#${a.assignedAt.toISOString()}`,
        GSI2PK: `BATCH_ASSIGNMENTS#${batchId}`, GSI2SK: `ORDER#${String(a.displayOrder).padStart(4, "0")}#${aId}`,
        GSI3PK: "ALL_ASSIGNMENTS", GSI3SK: `STATUS#${status}#${a.assignedAt.toISOString()}#${aId}`,
        id: aId, clientId, formId, formVersion: a.formVersion, assignedAt: a.assignedAt.toISOString(),
        currentStatus: status, isCompleted: a.isCompleted, isCommonFieldsCompleted: a.isCommonFieldsCompleted,
        displayOrder: a.displayOrder, batchId, assignedById: a.assignedById ? mapId("admin", a.assignedById) : undefined,
        instanceNumber: a.instanceNumber, formKey: a.form.formKey, formTitle: a.form.title, requiresSignature: a.form.requiresSignature,
      });
      items.push({
        PK: `BATCH#${batchId}`, SK: `ASSIGNMENT#${aId}`, entityType: "BATCH_ASSIGNMENT",
        assignmentId: aId, clientId, formId, formKey: a.form.formKey, formTitle: a.form.title,
        currentStatus: status, instanceNumber: a.instanceNumber, formVersion: a.formVersion, displayOrder: a.displayOrder,
      });
    }
  }
  await batchPut(TABLE, items);

  // Update counters
  await ddb.send(new PutCommand({ TableName: TABLE, Item: { PK: "COUNTERS", SK: "DASHBOARD", ...counters, totalActiveClients: 0, newClientsThisMonth: 0, signatureRequests: 0, completedSignatures: 0 } }));
  console.log(`  ✅ ${batches.length} batches, ${items.length - batches.length * 2} assignments migrated`);
}

async function migrateSubmissions() {
  console.log("📦 Migrating FormSubmissions...");
  const submissions = await prisma.formSubmission.findMany({ include: { form: true } });
  const items: any[] = [];

  for (const s of submissions) {
    const id = mapId("submission", s.id);
    const clientId = mapId("client", s.clientId);
    const formId = mapId("form", s.formId);

    const item = {
      id, clientId, formId, formVersion: s.formVersion, instanceNumber: s.instanceNumber,
      data: s.data, isSubmitted: s.isSubmitted, submittedAt: s.submittedAt?.toISOString(),
      updatedAt: s.updatedAt.toISOString(), filledByAdmin: s.filledByAdmin, adminFilledAt: s.adminFilledAt?.toISOString(),
      clientSignature: s.clientSignature, clientSignedAt: s.clientSignedAt?.toISOString(),
      formKey: s.form.formKey, formTitle: s.form.title, entityType: "FORM_SUBMISSION",
    };

    items.push({ PK: `CLIENT#${clientId}`, SK: `SUBMISSION#${formId}#${s.formVersion}#${s.instanceNumber}`, ...item });
    items.push({ PK: `SUBMISSION#${id}`, SK: "PROFILE", ...item, entityType: "SUBMISSION_LOOKUP" });
  }
  await batchPut(TABLE, items);
  console.log(`  ✅ ${submissions.length} submissions migrated`);
}

async function migrateSignatureBatchForms() {
  console.log("📦 Migrating SignatureBatchForms...");
  const sbfs = await prisma.signatureBatchForm.findMany();
  const items: any[] = [];

  for (const sbf of sbfs) {
    const batchId = mapId("batch", sbf.batchId);
    const submissionId = mapId("submission", sbf.formSubmissionId);
    items.push({
      PK: `BATCH#${batchId}`, SK: `SIG_FORM#${submissionId}`, entityType: "SIGNATURE_BATCH_FORM",
      batchId, formSubmissionId: submissionId, createdAt: sbf.createdAt.toISOString(),
    });
  }
  await batchPut(TABLE, items);
  console.log(`  ✅ ${sbfs.length} signature batch forms migrated`);
}

async function migrateNotifications() {
  console.log("📦 Migrating Notifications...");
  const notifs = await prisma.formSubmissionNotification.findMany();
  const items: any[] = [];

  for (const n of notifs) {
    const id = generateId();
    const adminId = mapId("admin", n.adminId);
    const createdAt = n.createdAt.toISOString();
    items.push({
      PK: `NOTIF#ADMIN#${adminId}`, SK: `${createdAt}#${id}`, entityType: "FORM_SUBMISSION_NOTIFICATION",
      ...(n.isRead ? {} : { GSI1PK: `UNREAD#ADMIN#${adminId}`, GSI1SK: `${createdAt}#${id}` }),
      id, adminId, clientId: mapId("client", n.clientId), formSubmissionId: mapId("submission", n.formSubmissionId),
      isRead: n.isRead, createdAt,
    });
  }
  await batchPut(NOTIFICATIONS_TABLE, items);
  console.log(`  ✅ ${notifs.length} notifications migrated`);
}

async function migrateSettings() {
  console.log("📦 Migrating Settings...");
  const settings = await prisma.appSettings.findMany();
  const items: any[] = [];

  for (const s of settings) {
    const adminId = s.adminId ? mapId("admin", s.adminId) : "GLOBAL";
    items.push({
      PK: `ADMIN#${adminId}`, SK: `${s.category}#${String(s.sortOrder).padStart(4, "0")}#${s.key}`,
      GSI1PK: `ADMIN#${adminId}`, GSI1SK: `KEY#${s.key}`, entityType: "APP_SETTING",
      id: generateId(), key: s.key, value: s.value, type: s.type, category: s.category,
      label: s.label, description: s.description, isRequired: s.isRequired, defaultValue: s.defaultValue,
      validation: s.validation, sortOrder: s.sortOrder, isActive: s.isActive, adminId,
      createdAt: s.createdAt.toISOString(), updatedAt: s.updatedAt.toISOString(),
    });
  }
  await batchPut(SETTINGS_TABLE, items);
  console.log(`  ✅ ${settings.length} settings migrated`);
}

async function migrateActivityLogs() {
  console.log("📦 Migrating Activity Logs...");
  const logs = await prisma.formActivityLog.findMany({ take: 10000, orderBy: { createdAt: "desc" } });
  const items: any[] = [];

  for (const log of logs) {
    const id = generateId();
    const createdAt = log.createdAt.toISOString();
    const pk = log.clientId ? `LOG#CLIENT#${mapId("client", log.clientId)}` : log.adminId ? `LOG#ADMIN#${mapId("admin", log.adminId)}` : "LOG#SYSTEM";
    items.push({
      PK: pk, SK: `${createdAt}#${id}`, GSI1PK: "ALL_LOGS", GSI1SK: `${createdAt}#${id}`,
      entityType: "FORM_ACTIVITY_LOG", id,
      clientId: log.clientId ? mapId("client", log.clientId) : undefined,
      adminId: log.adminId ? mapId("admin", log.adminId) : undefined,
      logType: log.logType, action: log.action, metadata: log.metadata, createdAt,
    });
  }
  await batchPut(AUDIT_TABLE, items);
  console.log(`  ✅ ${logs.length} activity logs migrated`);
}

async function main() {
  console.log("🚀 Starting PostgreSQL → DynamoDB data migration\n");
  console.log(`   Source: ${process.env.DATABASE_URL?.split("@")[1]?.split("/")[0] || "PostgreSQL"}`);
  console.log(`   Target: ${TABLE} (${process.env.AWS_REGION || "ap-southeast-2"})\n`);

  await migrateAdmins();
  await migrateForms();
  await migrateClients();
  await migrateBatchesAndAssignments();
  await migrateSubmissions();
  await migrateSignatureBatchForms();
  await migrateNotifications();
  await migrateSettings();
  await migrateActivityLogs();

  console.log("\n✅ Migration complete!");
  console.log(`\nID Mapping Summary:`);
  Object.entries(idMap).forEach(([entity, map]) => {
    console.log(`  ${entity}: ${Object.keys(map).length} records`);
  });

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
