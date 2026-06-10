import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
  TransactWriteCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { dynamodb, TABLE, AUDIT_TABLE } from "../dynamodb";
import { generateId, nowISO } from "../dynamodb-utils";

// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface CommonFields {
  name?: string;
  surname?: string;
  age?: number;
  email?: string;
  sex?: string;
  street?: string;
  state?: string;
  postCode?: string;
  dob?: string;
  ndis?: string;
  disability?: string;
  address?: string;
  phone?: string;
  // Phase II fields
  preferredName?: string;
  pronouns?: string;
  homePhone?: string;
  suburb?: string;
  preferredLanguage?: string;
  secondaryDisability?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  ndisPlanStartDate?: string;
  ndisPlanEndDate?: string;
  fundingType?: string;
  planManagerName?: string;
  planManagerOrg?: string;
  planManagerEmail?: string;
  planManagerPhone?: string;
  nomineeName?: string;
  nomineeRelationship?: string;
  nomineePhone?: string;
  nomineeEmail?: string;
  nomineeAuthorized?: string;
  hasSupportCoordinator?: string;
  scName?: string;
  scOrganisation?: string;
  scAddress?: string;
  scEmail?: string;
  scPhone?: string;
  uploadedFiles?: Record<string, { key: string; filename: string }>;
  [key: string]: unknown; // Allow additional fields
}

export interface Client {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
  createdById?: string;
  archivedAt?: string;
  archivedBy?: string;
  commonFields: CommonFields;
}

export interface ClientListOptions {
  search?: string;
  state?: string;
  sex?: string;
  hasNdis?: string;
  hasDisability?: string;
  page?: number;
  pageSize?: number;
  organizationId?: string;
}

// ─── CREATE ──────────────────────────────────────────────────────────────────

export async function createClient(
  data: { name?: string; email?: string; phone?: string; createdById?: string; organizationId?: string },
  commonFields: CommonFields = {}
): Promise<Client> {
  const id = generateId();
  const now = nowISO();
  const email = data.email?.trim().toLowerCase();
  const nameLower = (commonFields.name || data.name || "").toLowerCase();

  const client: Client = {
    id,
    name: data.name?.trim(),
    email,
    phone: data.phone,
    organizationId: data.organizationId,
    createdAt: now,
    updatedAt: now,
    createdById: data.createdById,
    commonFields: { ...commonFields, email: commonFields.email || email, name: commonFields.name || data.name?.trim() },
  };

  await dynamodb.send(
    new TransactWriteCommand({
      TransactItems: [
        // Main client record
        {
          Put: {
            TableName: TABLE,
            Item: {
              PK: `CLIENT#${id}`,
              SK: "PROFILE",
              entityType: "CLIENT",
              GSI1PK: data.organizationId ? `ORG#${data.organizationId}#CLIENTS` : "CLIENTS",
              GSI1SK: `ACTIVE#${nameLower}#${id}`,
              GSI2PK: commonFields.state ? `CLIENT_SEARCH#${commonFields.state}` : undefined,
              GSI2SK: commonFields.state ? `${nameLower}#${id}` : undefined,
              GSI3PK: "CLIENTS_BY_DATE",
              GSI3SK: `${now}#${id}`,
              ...client,
            },
            ConditionExpression: "attribute_not_exists(PK)",
          },
        },
        // Admin → Client relationship
        ...(data.createdById
          ? [{
              Put: {
                TableName: TABLE,
                Item: {
                  PK: `ADMIN#${data.createdById}`,
                  SK: `CLIENT#${id}`,
                  entityType: "ADMIN_CLIENT",
                  clientId: id,
                  clientName: data.name?.trim(),
                  createdAt: now,
                },
              },
            }]
          : []),
        // Update dashboard counters
        {
          Update: {
            TableName: TABLE,
            Key: { PK: "COUNTERS", SK: "DASHBOARD" },
            UpdateExpression: "ADD totalActiveClients :one, newClientsThisMonth :one",
            ExpressionAttributeValues: { ":one": 1 },
          },
        },
      ],
    })
  );

  // Log activity (non-transactional, audit table)
  await dynamodb.send(
    new PutCommand({
      TableName: AUDIT_TABLE,
      Item: {
        PK: `LOG#ADMIN#${data.createdById || "SYSTEM"}`,
        SK: `${now}#${generateId()}`,
        entityType: "FORM_ACTIVITY_LOG",
        clientId: id,
        adminId: data.createdById,
        logType: "ADMIN",
        action: "Created Client",
        metadata: { clientId: id, clientName: data.name?.trim() },
        createdAt: now,
      },
    })
  );

  return client;
}

// ─── READ ────────────────────────────────────────────────────────────────────

export async function getClientById(id: string): Promise<Client | null> {
  const res = await dynamodb.send(
    new GetCommand({ TableName: TABLE, Key: { PK: `CLIENT#${id}`, SK: "PROFILE" }, ConsistentRead: true })
  );
  return res.Item ? (res.Item as Client) : null;
}

export async function listClients(options: ClientListOptions = {}): Promise<{
  clients: Client[];
  pagination: { page: number; pageSize: number; totalCount: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean };
}> {
  const { search, state, sex, hasNdis, hasDisability, page = 1, pageSize = 10, organizationId } = options;

  // Use GSI2 if filtering by state, otherwise GSI1 for all active clients
  let queryParams: any;
  const gsi1pk = organizationId ? `ORG#${organizationId}#CLIENTS` : "CLIENTS";
  queryParams = {
    TableName: TABLE,
    IndexName: "GSI1",
    KeyConditionExpression: "GSI1PK = :pk AND begins_with(GSI1SK, :prefix)",
    ExpressionAttributeValues: { ":pk": gsi1pk, ":prefix": "ACTIVE#" } as Record<string, any>,
  };

  const res = await dynamodb.send(new QueryCommand(queryParams));
  let clients = (res.Items || []) as Client[];

  // Application-level filtering (acceptable for <10K clients)
  if (search) {
    const s = search.toLowerCase();
    clients = clients.filter((c) => {
      const cf = c.commonFields || {};
      return (
        (c.name || "").toLowerCase().includes(s) ||
        (c.email || "").toLowerCase().includes(s) ||
        (c.phone || "").includes(s) ||
        (cf.name || "").toLowerCase().includes(s) ||
        (cf.surname || "").toLowerCase().includes(s) ||
        (cf.email || "").toLowerCase().includes(s) ||
        (cf.ndis || "").toLowerCase().includes(s) ||
        (cf.phone || "").includes(s)
      );
    });
  }
  if (state) {
    const stateMap: Record<string, string> = { ACT: "Australian Capital Territory", NSW: "New South Wales", NT: "Northern Territory", QLD: "Queensland", SA: "South Australia", TAS: "Tasmania", VIC: "Victoria", WA: "Western Australia" };
    const fullName = stateMap[state] || state;
    clients = clients.filter((c) => c.commonFields?.state === state || c.commonFields?.state === fullName);
  }
  if (sex) clients = clients.filter((c) => c.commonFields?.sex === sex);
  if (hasNdis === "true") clients = clients.filter((c) => !!c.commonFields?.ndis);
  else if (hasNdis === "false") clients = clients.filter((c) => !c.commonFields?.ndis);
  if (hasDisability === "true") clients = clients.filter((c) => !!c.commonFields?.disability);
  else if (hasDisability === "false") clients = clients.filter((c) => !c.commonFields?.disability);

  // Sort by name (already sorted by GSI1SK for non-search queries, but re-sort after filtering)
  clients.sort((a, b) => {
    const aName = `${a.commonFields?.name || ""} ${a.commonFields?.surname || ""}`.trim().toLowerCase();
    const bName = `${b.commonFields?.name || ""} ${b.commonFields?.surname || ""}`.trim().toLowerCase();
    return aName.localeCompare(bName, "en-AU", { sensitivity: "base", numeric: true });
  });

  const totalCount = clients.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginated = clients.slice((page - 1) * pageSize, page * pageSize);

  return {
    clients: paginated,
    pagination: { page, pageSize, totalCount, totalPages, hasNextPage: page < totalPages, hasPreviousPage: page > 1 },
  };
}

// ─── UPDATE ──────────────────────────────────────────────────────────────────

export async function updateClient(
  id: string,
  data: { name?: string; email?: string; phone?: string },
  commonFields?: CommonFields
): Promise<Client | null> {
  const existing = await getClientById(id);
  if (!existing) return null;

  const now = nowISO();
  const merged: Client = {
    ...existing,
    name: data.name !== undefined ? data.name?.trim() : existing.name,
    email: data.email !== undefined ? data.email?.trim().toLowerCase() : existing.email,
    phone: data.phone !== undefined ? data.phone : existing.phone,
    updatedAt: now,
    commonFields: commonFields ? { ...existing.commonFields, ...commonFields } : existing.commonFields,
  };

  const nameLower = (merged.commonFields.name || merged.name || "").toLowerCase();

  await dynamodb.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        PK: `CLIENT#${id}`,
        SK: "PROFILE",
        entityType: "CLIENT",
        GSI1PK: "CLIENTS",
        GSI1SK: merged.archivedAt ? `ARCHIVED#${merged.archivedAt}#${id}` : `ACTIVE#${nameLower}#${id}`,
        GSI2PK: merged.commonFields.state ? `CLIENT_SEARCH#${merged.commonFields.state}` : undefined,
        GSI2SK: merged.commonFields.state ? `${nameLower}#${id}` : undefined,
        GSI3PK: "CLIENTS_BY_DATE",
        GSI3SK: `${merged.createdAt}#${id}`,
        ...merged,
      },
    })
  );

  return merged;
}

// ─── ARCHIVE ─────────────────────────────────────────────────────────────────

export async function archiveClient(id: string, adminId?: string): Promise<void> {
  const existing = await getClientById(id);
  if (!existing || existing.archivedAt) return;

  const now = nowISO();
  const nameLower = (existing.commonFields?.name || existing.name || "").toLowerCase();

  await dynamodb.send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: TABLE,
            Item: {
              PK: `CLIENT#${id}`,
              SK: "PROFILE",
              entityType: "CLIENT",
              GSI1PK: "CLIENTS",
              GSI1SK: `ARCHIVED#${now}#${id}`,
              GSI2PK: undefined, // Remove from state search
              GSI2SK: undefined,
              GSI3PK: "CLIENTS_BY_DATE",
              GSI3SK: `${existing.createdAt}#${id}`,
              ...existing,
              archivedAt: now,
              archivedBy: adminId,
              updatedAt: now,
            },
          },
        },
        {
          Update: {
            TableName: TABLE,
            Key: { PK: "COUNTERS", SK: "DASHBOARD" },
            UpdateExpression: "ADD totalActiveClients :neg",
            ExpressionAttributeValues: { ":neg": -1 },
          },
        },
      ],
    })
  );
}

// ─── COMMON FIELDS ───────────────────────────────────────────────────────────

export async function getCommonFields(clientId: string): Promise<CommonFields | null> {
  const client = await getClientById(clientId);
  return client?.commonFields || null;
}

export async function updateCommonFields(clientId: string, fields: CommonFields): Promise<CommonFields> {
  const client = await getClientById(clientId);
  if (!client) throw new Error("Client not found");

  const merged = { ...client.commonFields, ...fields };
  await updateClient(clientId, {}, merged);
  return merged;
}

// ─── DASHBOARD COUNTERS ──────────────────────────────────────────────────────

export async function getDashboardCounters(): Promise<Record<string, number>> {
  const res = await dynamodb.send(
    new GetCommand({ TableName: TABLE, Key: { PK: "COUNTERS", SK: "DASHBOARD" }, ConsistentRead: true })
  );
  return (res.Item as Record<string, number>) || {
    totalActiveClients: 0,
    newClientsThisMonth: 0,
    completedForms: 0,
    notStartedForms: 0,
    inProgressForms: 0,
    pendingAdminReview: 0,
    signatureRequests: 0,
    completedSignatures: 0,
  };
}

export async function updateCounter(field: string, increment: number): Promise<void> {
  await dynamodb.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { PK: "COUNTERS", SK: "DASHBOARD" },
      UpdateExpression: `ADD #field :val`,
      ExpressionAttributeNames: { "#field": field },
      ExpressionAttributeValues: { ":val": increment },
    })
  );
}

// ─── COUNT CLIENTS BY DATE ───────────────────────────────────────────────────

export async function countClientsCreatedSince(since: string): Promise<number> {
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: TABLE,
      IndexName: "GSI3",
      KeyConditionExpression: "GSI3PK = :pk AND GSI3SK >= :since",
      ExpressionAttributeValues: { ":pk": "CLIENTS_BY_DATE", ":since": since },
      Select: "COUNT",
    })
  );
  return res.Count || 0;
}
