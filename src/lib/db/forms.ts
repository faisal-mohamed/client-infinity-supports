import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
  DeleteCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { dynamodb, TABLE } from "../dynamodb";
import { generateId, nowISO, ttlFromDate } from "../dynamodb-utils";

// ─── MASTER FORM ─────────────────────────────────────────────────────────────

export interface MasterForm {
  id: string;
  formKey: string;
  title: string;
  version: number;
  schema?: any;
  requiresSignature?: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getFormById(id: string): Promise<MasterForm | null> {
  const res = await dynamodb.send(
    new GetCommand({ TableName: TABLE, Key: { PK: `FORM#${id}`, SK: "PROFILE" } })
  );
  return res.Item ? (res.Item as MasterForm) : null;
}

export async function getFormByKey(formKey: string, version?: number): Promise<MasterForm | null> {
  if (version !== undefined) {
    const res = await dynamodb.send(
      new GetCommand({ TableName: TABLE, Key: { PK: `FORM_KEY#${formKey}`, SK: `VERSION#${version}` } })
    );
    return res.Item ? (res.Item as MasterForm) : null;
  }
  // Get latest version
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: { ":pk": `FORM_KEY#${formKey}` },
      ScanIndexForward: false,
      Limit: 1,
    })
  );
  return res.Items?.[0] ? (res.Items[0] as MasterForm) : null;
}

export async function listForms(): Promise<MasterForm[]> {
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: TABLE,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk",
      ExpressionAttributeValues: { ":pk": "ALL_FORMS" },
    })
  );
  return (res.Items || []) as MasterForm[];
}

export async function createForm(data: Omit<MasterForm, "id" | "createdAt" | "updatedAt">): Promise<MasterForm> {
  const id = generateId();
  const now = nowISO();
  const form: MasterForm = { id, ...data, createdAt: now, updatedAt: now };

  await dynamodb.send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: TABLE,
            Item: {
              PK: `FORM#${id}`,
              SK: "PROFILE",
              entityType: "MASTER_FORM",
              GSI1PK: "ALL_FORMS",
              GSI1SK: `${data.formKey}#${id}`,
              ...form,
            },
          },
        },
        {
          Put: {
            TableName: TABLE,
            Item: {
              PK: `FORM_KEY#${data.formKey}`,
              SK: `VERSION#${data.version}`,
              entityType: "FORM_VERSION",
              formId: id,
              ...form,
            },
          },
        },
      ],
    })
  );
  return form;
}

// ─── FORM BATCH ──────────────────────────────────────────────────────────────

export interface FormBatch {
  id: string;
  clientId: string;
  batchToken: string;
  passcode?: string;
  expiresAt: string;
  createdAt: string;
  isSignatureOnly: boolean;
  isCompleted: boolean;
  completedAt?: string;
  adminNotified: boolean;
}

export async function createFormBatch(data: Omit<FormBatch, "id" | "createdAt">): Promise<FormBatch> {
  const id = generateId();
  const now = nowISO();
  const batch: FormBatch = { id, ...data, createdAt: now };
  const ttl = ttlFromDate(new Date(new Date(data.expiresAt).getTime() + 30 * 86400000)); // 30 days after expiry

  await dynamodb.send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: TABLE,
            Item: { PK: `CLIENT#${data.clientId}`, SK: `BATCH#${id}`, entityType: "FORM_BATCH", ttl, ...batch },
          },
        },
        {
          Put: {
            TableName: TABLE,
            Item: { PK: `BATCH_TOKEN#${data.batchToken}`, SK: "BATCH", entityType: "BATCH_TOKEN_LOOKUP", batchId: id, clientId: data.clientId, ttl, ...batch },
            ConditionExpression: "attribute_not_exists(PK)", // Ensure token uniqueness
          },
        },
      ],
    })
  );
  return batch;
}

export async function getBatchByToken(token: string): Promise<FormBatch | null> {
  const res = await dynamodb.send(
    new GetCommand({ TableName: TABLE, Key: { PK: `BATCH_TOKEN#${token}`, SK: "BATCH" } })
  );
  return res.Item ? (res.Item as FormBatch) : null;
}

export async function getBatchById(clientId: string, batchId: string): Promise<FormBatch | null> {
  const res = await dynamodb.send(
    new GetCommand({ TableName: TABLE, Key: { PK: `CLIENT#${clientId}`, SK: `BATCH#${batchId}` } })
  );
  return res.Item ? (res.Item as FormBatch) : null;
}

export async function updateBatch(clientId: string, batchId: string, updates: Partial<FormBatch>): Promise<void> {
  const expressions: string[] = [];
  const names: Record<string, string> = {};
  const values: Record<string, any> = {};

  Object.entries(updates).forEach(([key, val]) => {
    if (val !== undefined) {
      expressions.push(`#${key} = :${key}`);
      names[`#${key}`] = key;
      values[`:${key}`] = val;
    }
  });
  if (expressions.length === 0) return;

  await dynamodb.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { PK: `CLIENT#${clientId}`, SK: `BATCH#${batchId}` },
      UpdateExpression: `SET ${expressions.join(", ")}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    })
  );
}

export async function getClientBatches(clientId: string, signatureOnly?: boolean): Promise<FormBatch[]> {
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: { ":pk": `CLIENT#${clientId}`, ":sk": "BATCH#" },
    })
  );
  let batches = (res.Items || []) as FormBatch[];
  if (signatureOnly !== undefined) {
    batches = batches.filter((b) => b.isSignatureOnly === signatureOnly);
  }
  return batches;
}

export async function deleteBatch(clientId: string, batchId: string, batchToken: string): Promise<void> {
  await dynamodb.send(
    new TransactWriteCommand({
      TransactItems: [
        { Delete: { TableName: TABLE, Key: { PK: `CLIENT#${clientId}`, SK: `BATCH#${batchId}` } } },
        { Delete: { TableName: TABLE, Key: { PK: `BATCH_TOKEN#${batchToken}`, SK: "BATCH" } } },
      ],
    })
  );
  // Also delete signature batch forms
  const sigForms = await getSignatureBatchForms(batchId);
  if (sigForms.length > 0) {
    const deleteRequests = sigForms.map((sf) => ({
      DeleteRequest: { Key: { PK: `BATCH#${batchId}`, SK: `SIG_FORM#${sf.formSubmissionId}` } },
    }));
    // BatchWrite max 25 items
    for (let i = 0; i < deleteRequests.length; i += 25) {
      await dynamodb.send(new BatchWriteCommand({ RequestItems: { [TABLE]: deleteRequests.slice(i, i + 25) } }));
    }
  }
}

// ─── FORM ASSIGNMENT ─────────────────────────────────────────────────────────

export interface FormAssignment {
  id: string;
  clientId: string;
  formId: string;
  formVersion: number;
  assignedAt: string;
  currentStatus: string;
  isCompleted: boolean;
  isCommonFieldsCompleted: boolean;
  displayOrder: number;
  batchId: string;
  assignedById?: string;
  archivedAt?: string;
  archivedBy?: string;
  instanceNumber: number;
  // Denormalized
  formKey: string;
  formTitle: string;
  requiresSignature?: boolean;
}

export async function createFormAssignment(data: Omit<FormAssignment, "id" | "assignedAt">): Promise<FormAssignment> {
  const id = generateId();
  const now = nowISO();
  const assignment: FormAssignment = { id, ...data, assignedAt: now };

  await dynamodb.send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: TABLE,
            Item: {
              PK: `CLIENT#${data.clientId}`,
              SK: `ASSIGNMENT#${id}`,
              entityType: "FORM_ASSIGNMENT",
              GSI1PK: `ASSIGNMENTS#${data.clientId}`,
              GSI1SK: `STATUS#${data.currentStatus}#${now}`,
              GSI2PK: `BATCH_ASSIGNMENTS#${data.batchId}`,
              GSI2SK: `ORDER#${String(data.displayOrder).padStart(4, "0")}#${id}`,
              GSI3PK: "ALL_ASSIGNMENTS",
              GSI3SK: `STATUS#${data.currentStatus}#${now}#${id}`,
              ...assignment,
            },
          },
        },
        // Also store in batch collection
        {
          Put: {
            TableName: TABLE,
            Item: {
              PK: `BATCH#${data.batchId}`,
              SK: `ASSIGNMENT#${id}`,
              entityType: "BATCH_ASSIGNMENT",
              assignmentId: id,
              clientId: data.clientId,
              formId: data.formId,
              formKey: data.formKey,
              formTitle: data.formTitle,
              currentStatus: data.currentStatus,
              instanceNumber: data.instanceNumber,
              formVersion: data.formVersion,
            },
          },
        },
        // Update counter
        {
          Update: {
            TableName: TABLE,
            Key: { PK: "COUNTERS", SK: "DASHBOARD" },
            UpdateExpression: "ADD notStartedForms :one",
            ExpressionAttributeValues: { ":one": 1 },
          },
        },
      ],
    })
  );
  return assignment;
}

export async function getAssignmentById(clientId: string, assignmentId: string): Promise<FormAssignment | null> {
  const res = await dynamodb.send(
    new GetCommand({ TableName: TABLE, Key: { PK: `CLIENT#${clientId}`, SK: `ASSIGNMENT#${assignmentId}` }, ConsistentRead: true })
  );
  return res.Item ? (res.Item as FormAssignment) : null;
}

export async function findAssignmentById(assignmentId: string): Promise<FormAssignment | null> {
  // Search via GSI3 which has all assignments
  // Alternative: scan with filter (acceptable for low volume)
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: TABLE,
      IndexName: "GSI3",
      KeyConditionExpression: "GSI3PK = :pk",
      FilterExpression: "id = :id",
      ExpressionAttributeValues: { ":pk": "ALL_ASSIGNMENTS", ":id": assignmentId },
    })
  );
  return res.Items?.[0] ? (res.Items[0] as FormAssignment) : null;
}

export async function getClientAssignments(clientId: string, includeArchived = false): Promise<FormAssignment[]> {
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: { ":pk": `CLIENT#${clientId}`, ":sk": "ASSIGNMENT#" },
    })
  );
  let assignments = (res.Items || []) as FormAssignment[];
  if (!includeArchived) {
    assignments = assignments.filter((a) => !a.archivedAt);
  }
  return assignments.sort((a, b) => a.displayOrder - b.displayOrder || a.assignedAt.localeCompare(b.assignedAt));
}

export async function getBatchAssignments(batchId: string): Promise<FormAssignment[]> {
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: TABLE,
      IndexName: "GSI2",
      KeyConditionExpression: "GSI2PK = :pk",
      ExpressionAttributeValues: { ":pk": `BATCH_ASSIGNMENTS#${batchId}` },
    })
  );
  return (res.Items || []) as FormAssignment[];
}

export async function updateAssignmentStatus(
  clientId: string,
  assignmentId: string,
  newStatus: string,
  oldStatus: string
): Promise<void> {
  const existing = await getAssignmentById(clientId, assignmentId);
  if (!existing) return;

  const now = nowISO();

  // Update main record with new GSI keys
  await dynamodb.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        ...existing,
        PK: `CLIENT#${clientId}`,
        SK: `ASSIGNMENT#${assignmentId}`,
        entityType: "FORM_ASSIGNMENT",
        currentStatus: newStatus,
        isCompleted: newStatus === "completed",
        GSI1PK: `ASSIGNMENTS#${clientId}`,
        GSI1SK: `STATUS#${newStatus}#${existing.assignedAt}`,
        GSI2PK: `BATCH_ASSIGNMENTS#${existing.batchId}`,
        GSI2SK: `ORDER#${String(existing.displayOrder).padStart(4, "0")}#${assignmentId}`,
        GSI3PK: "ALL_ASSIGNMENTS",
        GSI3SK: `STATUS#${newStatus}#${existing.assignedAt}#${assignmentId}`,
      },
    })
  );

  // Update batch assignment record
  await dynamodb.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { PK: `BATCH#${existing.batchId}`, SK: `ASSIGNMENT#${assignmentId}` },
      UpdateExpression: "SET currentStatus = :s",
      ExpressionAttributeValues: { ":s": newStatus },
    })
  );

  // Update counters (decrement old, increment new)
  const counterMap: Record<string, string> = {
    not_started: "notStartedForms",
    in_progress: "inProgressForms",
    pending_admin_review: "pendingAdminReview",
    completed: "completedForms",
  };
  const oldField = counterMap[oldStatus];
  const newField = counterMap[newStatus];

  if (oldField && newField && oldField !== newField) {
    await dynamodb.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { PK: "COUNTERS", SK: "DASHBOARD" },
        UpdateExpression: `ADD #oldF :neg, #newF :pos`,
        ExpressionAttributeNames: { "#oldF": oldField, "#newF": newField },
        ExpressionAttributeValues: { ":neg": -1, ":pos": 1 },
      })
    );
  }
}

export async function archiveAssignment(clientId: string, assignmentId: string, adminId?: string): Promise<void> {
  const now = nowISO();
  await dynamodb.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { PK: `CLIENT#${clientId}`, SK: `ASSIGNMENT#${assignmentId}` },
      UpdateExpression: "SET archivedAt = :at, archivedBy = :by",
      ExpressionAttributeValues: { ":at": now, ":by": adminId },
    })
  );
}

// ─── FORM SUBMISSION ─────────────────────────────────────────────────────────

export interface FormSubmission {
  id: string;
  clientId: string;
  formId: string;
  formVersion: number;
  instanceNumber: number;
  data: Record<string, any>;
  isSubmitted: boolean;
  submittedAt?: string;
  updatedAt: string;
  filledByAdmin: boolean;
  adminFilledAt?: string;
  clientSignature?: string;
  clientSignedAt?: string;
  // Denormalized
  formKey: string;
  formTitle: string;
}

export async function getSubmission(clientId: string, formId: string, formVersion: number, instanceNumber: number): Promise<FormSubmission | null> {
  const res = await dynamodb.send(
    new GetCommand({
      TableName: TABLE,
      Key: { PK: `CLIENT#${clientId}`, SK: `SUBMISSION#${formId}#${formVersion}#${instanceNumber}` },
      ConsistentRead: true,
    })
  );
  return res.Item ? (res.Item as FormSubmission) : null;
}

export async function getSubmissionById(id: string): Promise<FormSubmission | null> {
  const res = await dynamodb.send(
    new GetCommand({ TableName: TABLE, Key: { PK: `SUBMISSION#${id}`, SK: "PROFILE" }, ConsistentRead: true })
  );
  return res.Item ? (res.Item as FormSubmission) : null;
}

export async function upsertSubmission(data: Omit<FormSubmission, "id" | "updatedAt"> & { id?: string }): Promise<FormSubmission> {
  const now = nowISO();
  const compositeKey = `SUBMISSION#${data.formId}#${data.formVersion}#${data.instanceNumber}`;

  // Check if exists
  const existing = await getSubmission(data.clientId, data.formId, data.formVersion, data.instanceNumber);
  const id = existing?.id || data.id || generateId();

  const submission: FormSubmission = { ...data, id, updatedAt: now };

  await dynamodb.send(
    new TransactWriteCommand({
      TransactItems: [
        // Main composite key record
        {
          Put: {
            TableName: TABLE,
            Item: {
              PK: `CLIENT#${data.clientId}`,
              SK: compositeKey,
              entityType: "FORM_SUBMISSION",
              ...submission,
            },
          },
        },
        // ID lookup record
        {
          Put: {
            TableName: TABLE,
            Item: {
              PK: `SUBMISSION#${id}`,
              SK: "PROFILE",
              entityType: "SUBMISSION_LOOKUP",
              clientId: data.clientId,
              formId: data.formId,
              formVersion: data.formVersion,
              instanceNumber: data.instanceNumber,
              ...submission,
            },
          },
        },
      ],
    })
  );

  return submission;
}

export async function getClientSubmissions(clientId: string): Promise<FormSubmission[]> {
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: { ":pk": `CLIENT#${clientId}`, ":sk": "SUBMISSION#" },
    })
  );
  return (res.Items || []) as FormSubmission[];
}

export async function updateSubmission(id: string, clientId: string, formId: string, formVersion: number, instanceNumber: number, updates: Partial<FormSubmission>): Promise<void> {
  const now = nowISO();
  const compositeKey = `SUBMISSION#${formId}#${formVersion}#${instanceNumber}`;
  const fullUpdates = { ...updates, updatedAt: now };

  const expressions: string[] = [];
  const names: Record<string, string> = {};
  const values: Record<string, any> = {};

  Object.entries(fullUpdates).forEach(([key, val]) => {
    if (val !== undefined && key !== "id" && key !== "clientId" && key !== "formId" && key !== "formVersion" && key !== "instanceNumber") {
      expressions.push(`#${key} = :${key}`);
      names[`#${key}`] = key;
      values[`:${key}`] = val;
    }
  });

  if (expressions.length === 0) return;

  // Update both records
  await dynamodb.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { PK: `CLIENT#${clientId}`, SK: compositeKey },
      UpdateExpression: `SET ${expressions.join(", ")}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    })
  );
  await dynamodb.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { PK: `SUBMISSION#${id}`, SK: "PROFILE" },
      UpdateExpression: `SET ${expressions.join(", ")}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    })
  );
}

// ─── SIGNATURE BATCH FORM ────────────────────────────────────────────────────

export interface SignatureBatchForm {
  batchId: string;
  formSubmissionId: string;
  createdAt: string;
}

export async function createSignatureBatchForm(batchId: string, formSubmissionId: string): Promise<SignatureBatchForm> {
  const now = nowISO();
  const item: SignatureBatchForm = { batchId, formSubmissionId, createdAt: now };

  await dynamodb.send(
    new PutCommand({
      TableName: TABLE,
      Item: { PK: `BATCH#${batchId}`, SK: `SIG_FORM#${formSubmissionId}`, entityType: "SIGNATURE_BATCH_FORM", ...item },
      ConditionExpression: "attribute_not_exists(PK)", // Unique constraint
    })
  );
  return item;
}

export async function getSignatureBatchForms(batchId: string): Promise<SignatureBatchForm[]> {
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: { ":pk": `BATCH#${batchId}`, ":sk": "SIG_FORM#" },
    })
  );
  return (res.Items || []) as SignatureBatchForm[];
}

// ─── FORM PROGRESS ───────────────────────────────────────────────────────────

export async function upsertFormProgress(clientId: string, formId: string, formVersion: number, currentSection: string): Promise<void> {
  await dynamodb.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        PK: `CLIENT#${clientId}`,
        SK: `PROGRESS#${formId}#${formVersion}`,
        entityType: "FORM_PROGRESS",
        clientId,
        formId,
        formVersion,
        currentSection,
        updatedAt: nowISO(),
      },
    })
  );
}
