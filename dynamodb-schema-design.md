# DynamoDB Schema Design — Infinity Supports

## Architecture Decision: Single-Table Design with Auxiliary Tables

Given the complexity (36 Prisma models, 42 API routes, government audit requirements), we use a **hybrid approach**:
- **Main Table**: Core entities (Admin, Client, Staff, Forms, Assignments, Submissions)
- **Audit Table**: Activity logs, PII access logs (high-write, time-series)
- **Notifications Table**: Notifications (separate for efficient unread queries)
- **Settings Table**: App settings (separate for per-admin config)

This avoids GSI explosion while keeping access patterns efficient.

---

## TABLE 1: `InfinitySupports` (Main Table)

### Key Schema
- **Partition Key (PK)**: `string` — Entity group identifier
- **Sort Key (SK)**: `string` — Entity-specific sort key

### Entity Key Patterns

| Entity | PK | SK | Purpose |
|--------|----|----|---------|
| Admin | `ADMIN#<id>` | `PROFILE` | Admin profile |
| Admin (email lookup) | `ADMIN_EMAIL#<email>` | `PROFILE` | Email → Admin ID lookup |
| MFA Code | `ADMIN#<id>` | `MFA#<createdAt>#<id>` | MFA codes per admin |
| MFA Token Lookup | `MFA_TOKEN#<token>` | `MFA_TOKEN` | Token → MFA code lookup |
| Client | `CLIENT#<id>` | `PROFILE` | Client profile + common fields (denormalized) |
| Client (by admin) | `ADMIN#<adminId>` | `CLIENT#<id>` | Admin's clients list |
| MasterForm | `FORM#<id>` | `PROFILE` | Form template |
| MasterForm (key lookup) | `FORM_KEY#<formKey>` | `VERSION#<version>` | FormKey+Version lookup |
| FormBatch | `CLIENT#<clientId>` | `BATCH#<id>` | Client's form batches |
| FormBatch (token lookup) | `BATCH_TOKEN#<token>` | `BATCH` | Token → Batch lookup |
| FormAssignment | `CLIENT#<clientId>` | `ASSIGNMENT#<id>` | Client's form assignments |
| FormAssignment (by batch) | `BATCH#<batchId>` | `ASSIGNMENT#<id>` | Batch's assignments |
| FormSubmission | `CLIENT#<clientId>` | `SUBMISSION#<formId>#<version>#<instance>` | Client's form submissions |
| FormSubmission (by ID) | `SUBMISSION#<id>` | `PROFILE` | Direct submission lookup |
| SignatureBatchForm | `BATCH#<batchId>` | `SIG_FORM#<formSubmissionId>` | Signature batch forms |
| FormProgress | `CLIENT#<clientId>` | `PROGRESS#<formId>#<version>` | Form progress tracking |
| Insight | `CLIENT#<clientId>` | `INSIGHT#<id>` | Client insights |
| Staff | `STAFF#<id>` | `PROFILE` | Staff profile + common fields |
| Staff (by admin) | `ADMIN#<adminId>` | `STAFF#<id>` | Admin's staff list |
| Staff (token lookup) | `STAFF_TOKEN#<token>` | `STAFF` | Link token → Staff lookup |
| StaffFormBatch | `STAFF#<staffId>` | `BATCH#<id>` | Staff form batches |
| StaffFormBatch (token) | `STAFF_BATCH_TOKEN#<token>` | `BATCH` | Token → Staff batch |
| StaffFormAssignment | `STAFF#<staffId>` | `ASSIGNMENT#<id>` | Staff form assignments |
| StaffFormSubmission | `STAFF#<staffId>` | `SUBMISSION#<formKey>` | Staff form submissions |
| StaffFormSubmission (by ID) | `STAFF_SUBMISSION#<id>` | `PROFILE` | Direct lookup |
| StaffFormProgress | `STAFF#<staffId>` | `PROGRESS#<formId>#<version>` | Staff form progress |
| StaffFormDownload | `STAFF#<staffId>` | `DOWNLOAD#<formKey>#<id>` | Staff downloads |
| Staff Dedicated Forms | `STAFF#<staffId>` | `FORM_DATA#<formType>` | 12 one-to-one form tables |
| StaffSignatureBatchForm | `STAFF_BATCH#<batchId>` | `SIG_FORM#<submissionId>` | Staff sig batch forms |

### GSI-1: `GSI1` (Status/Type queries)
- **GSI1PK**: Entity type grouping
- **GSI1SK**: Status + timestamp for filtering

| Entity | GSI1PK | GSI1SK | Purpose |
|--------|--------|--------|---------|
| Client | `CLIENTS` | `ACTIVE#<name_lower>#<id>` | List active clients sorted by name |
| Client (archived) | `CLIENTS` | `ARCHIVED#<archivedAt>#<id>` | Archived clients |
| FormAssignment | `ASSIGNMENTS#<clientId>` | `STATUS#<status>#<assignedAt>` | Client assignments by status |
| FormAssignment (all) | `ALL_ASSIGNMENTS` | `STATUS#<status>#<assignedAt>#<id>` | All assignments by status (dashboard) |
| Staff | `STAFF_LIST` | `STATUS#<status>#<name>#<id>` | Staff by status |

### GSI-2: `GSI2` (Batch/Token lookups — already handled by PK patterns above, reserved for search)
- **GSI2PK**: Search grouping
- **GSI2SK**: Search attributes

| Entity | GSI2PK | GSI2SK | Purpose |
|--------|--------|--------|---------|
| Client | `CLIENT_SEARCH#<state>` | `<name_lower>#<id>` | Filter by state |
| FormAssignment | `BATCH_ASSIGNMENTS#<batchId>` | `ORDER#<displayOrder>#<id>` | Batch assignments ordered |

### GSI-3: `GSI3` (Time-based queries)
- **GSI3PK**: Time-based grouping
- **GSI3SK**: Timestamp

| Entity | GSI3PK | GSI3SK | Purpose |
|--------|--------|--------|---------|
| Client | `CLIENTS_BY_DATE` | `<createdAt>#<id>` | Clients by creation date (new this month) |
| FormSubmission | `SUBMISSIONS_REQUIRING_SIG` | `<formId>#<clientId>#<id>` | Submissions needing signatures |

---

## TABLE 2: `InfinitySupports_Audit` (Activity Logs)

### Key Schema
- **PK**: `string` — Log source identifier
- **SK**: `string` — Timestamp-based sort

| Entity | PK | SK | Purpose |
|--------|----|----|---------|
| FormActivityLog | `LOG#CLIENT#<clientId>` | `<createdAt>#<id>` | Client activity logs |
| FormActivityLog (by admin) | `LOG#ADMIN#<adminId>` | `<createdAt>#<id>` | Admin activity logs |
| PIIAccessLog | `PII#ADMIN#<adminId>` | `<accessedAt>#<id>` | PII access by admin |
| PIIAccessLog (by client) | `PII#CLIENT#<clientId>` | `<accessedAt>#<id>` | PII access for client |
| StaffActivityLog | `LOG#STAFF#<staffId>` | `<createdAt>#<id>` | Staff activity logs |

### GSI-1 (Audit): Time-range queries
- **GSI1PK**: `ALL_LOGS` or `ALL_PII`
- **GSI1SK**: `<createdAt>#<id>`

---

## TABLE 3: `InfinitySupports_Notifications`

### Key Schema
- **PK**: `string` — Admin identifier
- **SK**: `string` — Timestamp-based sort

| Entity | PK | SK | Purpose |
|--------|----|----|---------|
| FormSubmissionNotification | `NOTIF#ADMIN#<adminId>` | `<createdAt>#<id>` | Admin notifications (newest first) |
| StaffSubmissionNotification | `STAFF_NOTIF#ADMIN#<adminId>` | `<createdAt>#<id>` | Staff notifications |

### GSI-1 (Notifications): Unread filter
- **GSI1PK**: `UNREAD#ADMIN#<adminId>` (only populated when isRead=false)
- **GSI1SK**: `<createdAt>#<id>`

When notification is marked as read, remove GSI1PK value (sparse index).

---

## TABLE 4: `InfinitySupports_Settings`

### Key Schema
- **PK**: `ADMIN#<adminId>` (use `ADMIN#GLOBAL` for global defaults)
- **SK**: `<category>#<sortOrder>#<key>`

### GSI-1 (Settings): Key lookup
- **GSI1PK**: `ADMIN#<adminId>`
- **GSI1SK**: `KEY#<key>`

---

## ACCESS PATTERNS MAPPED

### Authentication (6 routes)

| Access Pattern | Table | Key Used |
|---------------|-------|----------|
| Get admin by email | Main | PK=`ADMIN_EMAIL#<email>`, SK=`PROFILE` |
| Get admin by ID | Main | PK=`ADMIN#<id>`, SK=`PROFILE` |
| Create MFA code | Main | PK=`ADMIN#<id>`, SK=`MFA#<createdAt>#<id>` |
| Get active MFA codes (rate limit) | Main | PK=`ADMIN#<id>`, SK begins_with `MFA#`, filter used=false |
| Verify MFA token | Main | PK=`MFA_TOKEN#<token>`, SK=`MFA_TOKEN` |
| Update admin password | Main | PK=`ADMIN#<id>`, SK=`PROFILE` |

### Dashboard Stats (aggregations)

| Access Pattern | Implementation |
|---------------|---------------|
| Total active clients | GSI1: PK=`CLIENTS`, SK begins_with `ACTIVE#` → COUNT |
| New clients this month | GSI3: PK=`CLIENTS_BY_DATE`, SK >= `<startOfMonth>` → COUNT |
| Completed forms | GSI1: PK=`ALL_ASSIGNMENTS`, SK begins_with `STATUS#completed` → COUNT |
| Not started forms | GSI1: PK=`ALL_ASSIGNMENTS`, SK begins_with `STATUS#not_started` → COUNT |
| In progress forms | GSI1: PK=`ALL_ASSIGNMENTS`, SK begins_with `STATUS#in_progress` → COUNT |
| Signature requests | Scan with filter (or maintain counter item) |
| Completed signatures | Scan with filter (or maintain counter item) |

**Counter Strategy**: Maintain a `COUNTERS` item (PK=`COUNTERS`, SK=`DASHBOARD`) with atomic increments/decrements on status changes. This avoids expensive scans.

### Client CRUD (14 routes)

| Access Pattern | Table | Key Used |
|---------------|-------|----------|
| Create client | Main | PK=`CLIENT#<id>`, SK=`PROFILE` + PK=`ADMIN#<adminId>`, SK=`CLIENT#<id>` + GSI entries |
| Get client by ID | Main | PK=`CLIENT#<id>`, SK=`PROFILE` |
| List clients (paginated, sorted by name) | Main GSI1 | PK=`CLIENTS`, SK begins_with `ACTIVE#`, limit + lastEvaluatedKey |
| Search clients by name/email/NDIS | Main GSI1 | PK=`CLIENTS`, SK begins_with `ACTIVE#<search>` (prefix match on name) |
| Filter by state | Main GSI2 | PK=`CLIENT_SEARCH#<state>`, SK begins_with... |
| Update client | Main | PK=`CLIENT#<id>`, SK=`PROFILE` |
| Archive client | Main | Move from `ACTIVE#...` to `ARCHIVED#...` in GSI1SK |
| Get client form assignments | Main | PK=`CLIENT#<clientId>`, SK begins_with `ASSIGNMENT#` |
| Export clients | Main GSI1 | PK=`CLIENTS`, full scan with filters |

### Form Management (5 routes)

| Access Pattern | Table | Key Used |
|---------------|-------|----------|
| List all forms | Main | PK begins_with `FORM#` (scan) or maintain `ALL_FORMS` collection |
| Get form by ID | Main | PK=`FORM#<id>`, SK=`PROFILE` |
| Get form by key+version | Main | PK=`FORM_KEY#<formKey>`, SK=`VERSION#<version>` |
| Get form batch by token | Main | PK=`BATCH_TOKEN#<token>`, SK=`BATCH` |
| Get batch assignments | Main | PK=`BATCH#<batchId>`, SK begins_with `ASSIGNMENT#` |

### Form Assignments (3 routes)

| Access Pattern | Table | Key Used |
|---------------|-------|----------|
| Get assignment by ID | Main | PK=`CLIENT#<clientId>`, SK=`ASSIGNMENT#<id>` (need ID→clientId index) |
| Save form data | Main | PK=`CLIENT#<clientId>`, SK=`SUBMISSION#<formId>#<version>#<instance>` |
| Submit form | Main | Update submission + assignment status (transaction) |
| Archive assignment | Main | Update archivedAt field + move GSI1SK |

**Note**: For "Get assignment by ID" without knowing clientId, we add:
- GSI-4: `ASSIGNMENT_ID#<id>` → points to the full item

### Signature Routes (4 routes)

| Access Pattern | Table | Key Used |
|---------------|-------|----------|
| Get batch by token | Main | PK=`BATCH_TOKEN#<token>`, SK=`BATCH` |
| Get signature batch forms | Main | PK=`BATCH#<batchId>`, SK begins_with `SIG_FORM#` |
| Get form submission for signature | Main | PK=`SUBMISSION#<id>`, SK=`PROFILE` |
| Submit signature | Main | Update submission (transaction with batch completion check) |

### Notifications

| Access Pattern | Table | Key Used |
|---------------|-------|----------|
| Get admin notifications (paginated) | Notifications | PK=`NOTIF#ADMIN#<adminId>`, SK descending, limit |
| Get unread count | Notifications GSI1 | PK=`UNREAD#ADMIN#<adminId>`, count |
| Mark as read | Notifications | Update item + remove GSI1PK (sparse index) |
| Create notification | Notifications | Put item |

### Settings

| Access Pattern | Table | Key Used |
|---------------|-------|----------|
| Get all settings for admin | Settings | PK=`ADMIN#<adminId>`, all SK |
| Get settings by category | Settings | PK=`ADMIN#<adminId>`, SK begins_with `<category>#` |
| Get setting by key | Settings GSI1 | PK=`ADMIN#<adminId>`, SK=`KEY#<key>` |
| Upsert setting | Settings | PK=`ADMIN#<adminId>`, SK=`<category>#<sortOrder>#<key>` |
| Get global defaults | Settings | PK=`ADMIN#GLOBAL`, all SK |

---

## ID GENERATION STRATEGY

Since DynamoDB has no auto-increment, we use:
- **ULID** (Universally Unique Lexicographically Sortable Identifier) for all entity IDs
- ULIDs are time-ordered, 26 chars, URL-safe, and sortable
- Package: `ulid` (npm)

For backward compatibility during migration, we maintain a mapping of old integer IDs to new ULIDs.

---

## COUNTER ITEMS (Dashboard Aggregations)

```
PK: "COUNTERS"
SK: "DASHBOARD"
Attributes:
  totalActiveClients: number (atomic increment/decrement)
  newClientsThisMonth: number (reset monthly via TTL or scheduled job)
  completedForms: number
  notStartedForms: number
  inProgressForms: number
  pendingAdminReview: number
  signatureRequests: number
  completedSignatures: number
  lastUpdated: string (ISO timestamp)
```

Updated atomically via `UpdateExpression` ADD operations whenever:
- Client created/archived → totalActiveClients ±1
- Form assignment status changes → completedForms/notStartedForms/inProgressForms ±1
- Signature added/cleared → signatureRequests/completedSignatures ±1

---

## TRANSACTION PATTERNS

### Create Client (currently uses Prisma $transaction)
DynamoDB TransactWriteItems (max 100 items):
1. Put `CLIENT#<id>` / `PROFILE`
2. Put `ADMIN#<adminId>` / `CLIENT#<id>`
3. Put audit log item
4. Update `COUNTERS` / `DASHBOARD` (increment totalActiveClients)

### Assign Forms Batch
TransactWriteItems:
1. Put `CLIENT#<clientId>` / `BATCH#<batchId>`
2. Put `BATCH_TOKEN#<token>` / `BATCH`
3. Put N × `CLIENT#<clientId>` / `ASSIGNMENT#<id>`
4. Put N × `BATCH#<batchId>` / `ASSIGNMENT#<id>`
5. Update `COUNTERS` (increment notStartedForms by N)
6. Put audit log

**Limit**: If batch has >25 forms, split into multiple transactions (DynamoDB limit: 100 items per TransactWriteItems, but 25 per batch write).

### Submit Form
TransactWriteItems:
1. Upsert `CLIENT#<clientId>` / `SUBMISSION#<formId>#<version>#<instance>`
2. Put `SUBMISSION#<id>` / `PROFILE` (ID lookup)
3. Update `CLIENT#<clientId>` / `ASSIGNMENT#<id>` (status change)
4. Update `COUNTERS` (decrement old status, increment new status)
5. Conditionally update common fields

Post-transaction (eventual consistency, non-blocking):
- Create notifications
- Send emails
- Upload to Google Drive

---

## CLIENT SEARCH STRATEGY

DynamoDB cannot do `LIKE '%search%'` queries. Options:

### Option A: Application-Level Filtering (Chosen for <10K clients)
- Fetch all active clients from GSI1 (PK=`CLIENTS`)
- Filter in application memory
- Cache results with short TTL (30 seconds)

### Option B: OpenSearch (if scale exceeds 10K clients)
- DynamoDB Streams → Lambda → OpenSearch
- Full-text search on name, email, NDIS, phone
- Only needed if client count grows significantly

For this government NDIS application (likely <5000 clients), Option A is sufficient and avoids additional infrastructure cost/complexity.

---

## DATA MODEL (TypeScript Interfaces)

```typescript
// Base item structure
interface DynamoItem {
  PK: string;
  SK: string;
  GSI1PK?: string;
  GSI1SK?: string;
  GSI2PK?: string;
  GSI2SK?: string;
  GSI3PK?: string;
  GSI3SK?: string;
  entityType: string; // "ADMIN" | "CLIENT" | "FORM" | etc.
  id: string; // ULID
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  ttl?: number; // Unix timestamp for auto-expiry (MFA codes, expired batches)
}

// Admin
interface AdminItem extends DynamoItem {
  entityType: "ADMIN";
  name: string;
  email: string;
  passwordHash: string;
  resetToken?: string;
  resetTokenExpiry?: string;
}

// Client (denormalized with CommonField)
interface ClientItem extends DynamoItem {
  entityType: "CLIENT";
  name?: string;
  email?: string;
  phone?: string;
  createdById?: string;
  archivedAt?: string;
  archivedBy?: string;
  // Denormalized CommonField data
  commonFields: {
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
  };
}

// FormAssignment
interface FormAssignmentItem extends DynamoItem {
  entityType: "FORM_ASSIGNMENT";
  clientId: string;
  formId: string;
  formVersion: number;
  currentStatus: string; // not_started | in_progress | pending_admin_review | completed
  isCompleted: boolean;
  isCommonFieldsCompleted: boolean;
  displayOrder: number;
  batchId: string;
  assignedById?: string;
  archivedAt?: string;
  archivedBy?: string;
  instanceNumber: number;
  // Denormalized form info (avoid extra lookups)
  formKey: string;
  formTitle: string;
  requiresSignature?: boolean;
}

// FormSubmission
interface FormSubmissionItem extends DynamoItem {
  entityType: "FORM_SUBMISSION";
  clientId: string;
  formId: string;
  formVersion: number;
  instanceNumber: number;
  data: Record<string, any>; // JSON form data
  isSubmitted: boolean;
  submittedAt?: string;
  filledByAdmin: boolean;
  adminFilledAt?: string;
  clientSignature?: string;
  clientSignedAt?: string;
  // Denormalized
  formKey: string;
  formTitle: string;
}

// FormBatch
interface FormBatchItem extends DynamoItem {
  entityType: "FORM_BATCH";
  clientId: string;
  batchToken: string;
  passcode?: string;
  expiresAt: string;
  isSignatureOnly: boolean;
  isCompleted: boolean;
  completedAt?: string;
  adminNotified: boolean;
  ttl: number; // Auto-expire old batches
}

// MFA Code
interface MfaCodeItem extends DynamoItem {
  entityType: "MFA_CODE";
  adminId: string;
  codeHash: string;
  expiresAt: string;
  attempts: number;
  maxAttempts: number;
  used: boolean;
  verified: boolean;
  mfaToken?: string;
  tokenExpiresAt?: string;
  ipAddress?: string;
  userAgent?: string;
  ttl: number; // Auto-expire after 24 hours
}
```

---

## TTL (Time-To-Live) Strategy

| Entity | TTL Rule | Purpose |
|--------|----------|---------|
| MfaCode | 24 hours after creation | Auto-cleanup expired codes |
| FormBatch (expired) | 30 days after expiresAt | Cleanup old expired batches |
| StaffFormBatch (expired) | 30 days after expiresAt | Cleanup old expired staff batches |

---

## CONSISTENCY GUARANTEES

| Operation | Consistency Level | Mechanism |
|-----------|------------------|-----------|
| Create client | Strong | TransactWriteItems |
| Submit form | Strong | TransactWriteItems |
| Read client profile | Strong | ConsistentRead=true |
| List clients | Eventual | GSI query (acceptable for list views) |
| Dashboard counters | Eventual | Atomic updates, slight lag acceptable |
| Notifications | Eventual | Acceptable for notification counts |
| Signature submission | Strong | TransactWriteItems (prevents double-sign) |
| Settings read | Strong | ConsistentRead=true |

---

## MIGRATION NOTES

1. **ID Mapping**: Maintain `OLD_ID#<table>#<intId>` → `NEW_ID#<ulid>` mapping items during migration
2. **Dual-Write Period**: Not needed — this is a full cutover migration
3. **Data Integrity**: Validate all foreign key relationships are preserved as denormalized data
4. **Rollback Plan**: Keep PostgreSQL running read-only for 30 days post-migration

---

## COST ESTIMATION (Government Scale)

Assuming: 2000 clients, 50 admins, 20K form submissions, 100K log entries

| Resource | Monthly Cost (approx) |
|----------|----------------------|
| Main Table (On-Demand) | ~$5-15 |
| Audit Table (On-Demand) | ~$2-5 |
| Notifications Table | ~$1-3 |
| Settings Table | ~$1 |
| Storage (25GB free tier) | $0 |
| **Total** | **~$10-25/month** |

vs. RDS PostgreSQL t4g.micro: ~$12-15/month (comparable, but DynamoDB scales infinitely)
