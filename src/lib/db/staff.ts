import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { dynamodb, TABLE } from "../dynamodb";
import { generateId, nowISO } from "../dynamodb-utils";

// ─── STAFF ───────────────────────────────────────────────────────────────────

export interface StaffCommonFields {
  firstName?: string;
  surname?: string;
  email?: string;
  phone?: string;
  address?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  dob?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  tfn?: string;
  abn?: string;
  superannuation?: string;
  bankDetails?: string;
}

export interface Staff {
  id: string;
  firstName: string;
  surname: string;
  email: string;
  phone?: string;
  role?: string;
  status: string;
  startDate?: string;
  linkToken?: string;
  linkExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
  createdById?: string;
  commonFields: StaffCommonFields;
}

export async function createStaff(data: Omit<Staff, "id" | "createdAt" | "updatedAt" | "commonFields"> & { commonFields?: StaffCommonFields }): Promise<Staff> {
  const id = generateId();
  const now = nowISO();
  const nameLower = `${data.firstName} ${data.surname}`.toLowerCase();
  const staff: Staff = { id, ...data, commonFields: data.commonFields || {}, createdAt: now, updatedAt: now };

  const items: any[] = [
    {
      Put: {
        TableName: TABLE,
        Item: {
          PK: `STAFF#${id}`,
          SK: "PROFILE",
          entityType: "STAFF",
          GSI1PK: "STAFF_LIST",
          GSI1SK: `STATUS#${data.status}#${nameLower}#${id}`,
          ...staff,
        },
      },
    },
  ];

  if (data.createdById) {
    items.push({
      Put: {
        TableName: TABLE,
        Item: { PK: `ADMIN#${data.createdById}`, SK: `STAFF#${id}`, entityType: "ADMIN_STAFF", staffId: id, staffName: `${data.firstName} ${data.surname}`, createdAt: now },
      },
    });
  }

  if (data.linkToken) {
    items.push({
      Put: {
        TableName: TABLE,
        Item: { PK: `STAFF_TOKEN#${data.linkToken}`, SK: "STAFF", entityType: "STAFF_TOKEN_LOOKUP", staffId: id },
        ConditionExpression: "attribute_not_exists(PK)",
      },
    });
  }

  await dynamodb.send(new TransactWriteCommand({ TransactItems: items }));
  return staff;
}

export async function getStaffById(id: string): Promise<Staff | null> {
  const res = await dynamodb.send(
    new GetCommand({ TableName: TABLE, Key: { PK: `STAFF#${id}`, SK: "PROFILE" }, ConsistentRead: true })
  );
  return res.Item ? (res.Item as Staff) : null;
}

export async function getStaffByToken(token: string): Promise<Staff | null> {
  const res = await dynamodb.send(
    new GetCommand({ TableName: TABLE, Key: { PK: `STAFF_TOKEN#${token}`, SK: "STAFF" } })
  );
  if (!res.Item) return null;
  return getStaffById(res.Item.staffId as string);
}

export async function listStaff(status?: string): Promise<Staff[]> {
  const params: any = {
    TableName: TABLE,
    IndexName: "GSI1",
    KeyConditionExpression: status
      ? "GSI1PK = :pk AND begins_with(GSI1SK, :prefix)"
      : "GSI1PK = :pk",
    ExpressionAttributeValues: status
      ? { ":pk": "STAFF_LIST", ":prefix": `STATUS#${status}#` }
      : { ":pk": "STAFF_LIST" },
  };
  const res = await dynamodb.send(new QueryCommand(params));
  return (res.Items || []) as Staff[];
}

export async function updateStaff(id: string, updates: Partial<Staff>): Promise<void> {
  const existing = await getStaffById(id);
  if (!existing) return;

  const now = nowISO();
  const merged = { ...existing, ...updates, updatedAt: now };
  const nameLower = `${merged.firstName} ${merged.surname}`.toLowerCase();

  await dynamodb.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        PK: `STAFF#${id}`,
        SK: "PROFILE",
        entityType: "STAFF",
        GSI1PK: "STAFF_LIST",
        GSI1SK: `STATUS#${merged.status}#${nameLower}#${id}`,
        ...merged,
      },
    })
  );
}

// ─── STAFF DEDICATED FORM DATA (12 one-to-one tables) ────────────────────────

export type StaffFormType =
  | "bullying_harassment_training"
  | "bullying_training"
  | "conflict_of_interest"
  | "documentation_acknowledgement"
  | "employment_details"
  | "employment_welcome_ack"
  | "ndis_code_of_conduct"
  | "ndis_workforce_capability"
  | "pre_employment_medical"
  | "support_worker"
  | "vehicle_safety_inspection";

export interface StaffFormData {
  staffId: string;
  formType: StaffFormType;
  data: Record<string, any>;
  staffSignature?: string;
  staffSignedAt?: string;
  adminSignature?: string;
  adminSignedAt?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getStaffFormData(staffId: string, formType: StaffFormType): Promise<StaffFormData | null> {
  const res = await dynamodb.send(
    new GetCommand({ TableName: TABLE, Key: { PK: `STAFF#${staffId}`, SK: `FORM_DATA#${formType}` } })
  );
  return res.Item ? (res.Item as StaffFormData) : null;
}

export async function upsertStaffFormData(staffId: string, formType: StaffFormType, data: Partial<StaffFormData>): Promise<StaffFormData> {
  const existing = await getStaffFormData(staffId, formType);
  const now = nowISO();

  const item: StaffFormData = {
    staffId,
    formType,
    data: data.data || existing?.data || {},
    staffSignature: data.staffSignature ?? existing?.staffSignature,
    staffSignedAt: data.staffSignedAt ?? existing?.staffSignedAt,
    adminSignature: data.adminSignature ?? existing?.adminSignature,
    adminSignedAt: data.adminSignedAt ?? existing?.adminSignedAt,
    status: data.status ?? existing?.status,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  await dynamodb.send(
    new PutCommand({
      TableName: TABLE,
      Item: { PK: `STAFF#${staffId}`, SK: `FORM_DATA#${formType}`, entityType: "STAFF_FORM_DATA", ...item },
    })
  );
  return item;
}

// ─── STAFF FORM BATCH ────────────────────────────────────────────────────────

export interface StaffFormBatch {
  id: string;
  staffId: string;
  batchToken: string;
  passcode?: string;
  expiresAt: string;
  createdAt: string;
  isSignatureOnly: boolean;
  isCompleted: boolean;
  completedAt?: string;
  adminNotified: boolean;
}

export async function createStaffFormBatch(data: Omit<StaffFormBatch, "id" | "createdAt">): Promise<StaffFormBatch> {
  const id = generateId();
  const now = nowISO();
  const batch: StaffFormBatch = { id, ...data, createdAt: now };

  await dynamodb.send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: TABLE,
            Item: { PK: `STAFF#${data.staffId}`, SK: `BATCH#${id}`, entityType: "STAFF_FORM_BATCH", ...batch },
          },
        },
        {
          Put: {
            TableName: TABLE,
            Item: { PK: `STAFF_BATCH_TOKEN#${data.batchToken}`, SK: "BATCH", entityType: "STAFF_BATCH_TOKEN_LOOKUP", batchId: id, staffId: data.staffId, ...batch },
            ConditionExpression: "attribute_not_exists(PK)",
          },
        },
      ],
    })
  );
  return batch;
}

export async function getStaffBatchByToken(token: string): Promise<StaffFormBatch | null> {
  const res = await dynamodb.send(
    new GetCommand({ TableName: TABLE, Key: { PK: `STAFF_BATCH_TOKEN#${token}`, SK: "BATCH" } })
  );
  return res.Item ? (res.Item as StaffFormBatch) : null;
}

// ─── STAFF FORM ASSIGNMENT ───────────────────────────────────────────────────

export interface StaffFormAssignment {
  id: string;
  staffId: string;
  formId: string;
  formVersion: number;
  assignedAt: string;
  currentStatus: string;
  isCompleted: boolean;
  isCommonFieldsCompleted: boolean;
  displayOrder: number;
  batchId: string;
  assignedById?: string;
  formKey: string;
  formTitle: string;
}

export async function createStaffFormAssignment(data: Omit<StaffFormAssignment, "id" | "assignedAt">): Promise<StaffFormAssignment> {
  const id = generateId();
  const now = nowISO();
  const assignment: StaffFormAssignment = { id, ...data, assignedAt: now };

  await dynamodb.send(
    new PutCommand({
      TableName: TABLE,
      Item: { PK: `STAFF#${data.staffId}`, SK: `ASSIGNMENT#${id}`, entityType: "STAFF_FORM_ASSIGNMENT", ...assignment },
    })
  );
  return assignment;
}

export async function getStaffAssignments(staffId: string): Promise<StaffFormAssignment[]> {
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: { ":pk": `STAFF#${staffId}`, ":sk": "ASSIGNMENT#" },
    })
  );
  return ((res.Items || []) as StaffFormAssignment[]).sort((a, b) => a.displayOrder - b.displayOrder);
}

// ─── STAFF FORM SUBMISSION ───────────────────────────────────────────────────

export interface StaffFormSubmission {
  id: string;
  staffId: string;
  formKey: string;
  data: Record<string, any>;
  isSubmitted: boolean;
  submittedAt?: string;
  updatedAt: string;
  adminFilledAt?: string;
  filledByAdmin: boolean;
  formId?: string;
  formVersion?: number;
  staffSignature?: string;
  staffSignedAt?: string;
  adminSignature?: string;
  adminSignedAt?: string;
  createdAt: string;
}

export async function upsertStaffFormSubmission(data: Omit<StaffFormSubmission, "id" | "createdAt" | "updatedAt"> & { id?: string }): Promise<StaffFormSubmission> {
  const now = nowISO();
  const existing = await getStaffFormSubmissionByKey(data.staffId, data.formKey);
  const id = existing?.id || data.id || generateId();

  const submission: StaffFormSubmission = { ...data, id, createdAt: existing?.createdAt || now, updatedAt: now };

  await dynamodb.send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: TABLE,
            Item: { PK: `STAFF#${data.staffId}`, SK: `SUBMISSION#${data.formKey}`, entityType: "STAFF_FORM_SUBMISSION", ...submission },
          },
        },
        {
          Put: {
            TableName: TABLE,
            Item: { PK: `STAFF_SUBMISSION#${id}`, SK: "PROFILE", entityType: "STAFF_SUBMISSION_LOOKUP", ...submission },
          },
        },
      ],
    })
  );
  return submission;
}

export async function getStaffFormSubmissionByKey(staffId: string, formKey: string): Promise<StaffFormSubmission | null> {
  const res = await dynamodb.send(
    new GetCommand({ TableName: TABLE, Key: { PK: `STAFF#${staffId}`, SK: `SUBMISSION#${formKey}` } })
  );
  return res.Item ? (res.Item as StaffFormSubmission) : null;
}

export async function getStaffFormSubmissionById(id: string): Promise<StaffFormSubmission | null> {
  const res = await dynamodb.send(
    new GetCommand({ TableName: TABLE, Key: { PK: `STAFF_SUBMISSION#${id}`, SK: "PROFILE" } })
  );
  return res.Item ? (res.Item as StaffFormSubmission) : null;
}
