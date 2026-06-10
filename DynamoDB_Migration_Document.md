# Database Migration Document
## PostgreSQL → Amazon DynamoDB
### Project: Infinity Supports WA — Client Portal
### Date: May 13, 2026

---

## 1. Migration Summary

| Aspect | PostgreSQL (Before) | DynamoDB (After) |
|--------|-------------------|-----------------|
| Tables | 36 | 4 |
| Global Secondary Indexes | N/A (built-in) | 6 |
| ORM | Prisma 6.19 | AWS SDK v3 (DocumentClient) |
| ID Type | Auto-increment Integer | ULID (String, time-sortable) |
| Hosting | Neon PostgreSQL (US East) | AWS DynamoDB (ap-southeast-1, Singapore) |
| Billing | Fixed instance cost | Pay-per-request (on-demand) |
| Backup | Depends on provider | Point-in-Time Recovery (PITR) enabled |
| Auto-cleanup | Manual cron jobs | TTL (Time-to-Live) on MFA codes & expired batches |
| Deletion Protection | None | Enabled on all tables |

---

## 2. DynamoDB Table Architecture

### 4 Tables Created:

| # | Table Name | Purpose | GSIs | TTL | PITR |
|---|-----------|---------|------|-----|------|
| 1 | InfinitySupports_Dev | Main data (all entities) | 3 | ✅ (ttl) | ✅ |
| 2 | InfinitySupports_Dev_Audit | Activity logs + PII access logs | 1 | ❌ | ✅ |
| 3 | InfinitySupports_Dev_Notifications | Form/staff submission notifications | 1 | ❌ | ✅ |
| 4 | InfinitySupports_Dev_Settings | Per-admin app settings | 1 | ❌ | ✅ |

---

## 3. PostgreSQL to DynamoDB Table Mapping

### 36 PostgreSQL Tables → 4 DynamoDB Tables

| PostgreSQL Table | DynamoDB Table | Partition Key (PK) | Sort Key (SK) | Notes |
|-----------------|---------------|-------------------|--------------|-------|
| Admin | Main | `ADMIN#<id>` | `PROFILE` | + email lookup item |
| MfaCode | Main | `ADMIN#<id>` | `MFA#<timestamp>#<id>` | TTL auto-deletes after 24h |
| Client | Main | `CLIENT#<id>` | `PROFILE` | CommonField embedded |
| CommonField | Main | `CLIENT#<id>` | `PROFILE` | **Merged into Client item** |
| MasterForm | Main | `FORM#<id>` | `PROFILE` | + key-version lookup |
| FormBatch | Main | `CLIENT#<clientId>` | `BATCH#<id>` | + token lookup item |
| FormAssignment | Main | `CLIENT#<clientId>` | `ASSIGNMENT#<id>` | + batch collection item |
| FormSubmission | Main | `CLIENT#<clientId>` | `SUBMISSION#<formId>#<ver>#<inst>` | + ID lookup item |
| FormProgress | Main | `CLIENT#<clientId>` | `PROGRESS#<formId>#<ver>` | |
| SignatureBatchForm | Main | `BATCH#<batchId>` | `SIG_FORM#<submissionId>` | |
| Insight | Main | `CLIENT#<clientId>` | `INSIGHT#<id>` | |
| FormActivityLog | Audit | `LOG#CLIENT#<clientId>` | `<timestamp>#<id>` | Dual-partition (client + admin) |
| PIIAccessLog | Audit | `PII#ADMIN#<adminId>` | `<timestamp>#<id>` | Dual-partition |
| FormSubmissionNotification | Notifications | `NOTIF#ADMIN#<adminId>` | `<timestamp>#<id>` | Sparse GSI for unread |
| AppSettings | Settings | `ADMIN#<adminId>` | `<category>#<sort>#<key>` | |
| Staff | Main | `STAFF#<id>` | `PROFILE` | StaffCommonField embedded |
| StaffCommonField | Main | `STAFF#<id>` | `PROFILE` | **Merged into Staff item** |
| StaffBullyingHarassmentTraining | Main | `STAFF#<id>` | `FORM_DATA#bullying_harassment_training` | |
| StaffBullyingTraining | Main | `STAFF#<id>` | `FORM_DATA#bullying_training` | |
| StaffConflictOfInterest | Main | `STAFF#<id>` | `FORM_DATA#conflict_of_interest` | |
| StaffDocumentationAcknowledgement | Main | `STAFF#<id>` | `FORM_DATA#documentation_acknowledgement` | |
| StaffEmploymentDetails | Main | `STAFF#<id>` | `FORM_DATA#employment_details` | |
| StaffEmploymentWelcomeAck | Main | `STAFF#<id>` | `FORM_DATA#employment_welcome_ack` | |
| StaffNdisCodeOfConduct | Main | `STAFF#<id>` | `FORM_DATA#ndis_code_of_conduct` | |
| StaffNdisWorkforceCapability | Main | `STAFF#<id>` | `FORM_DATA#ndis_workforce_capability` | |
| StaffPreEmploymentMedical | Main | `STAFF#<id>` | `FORM_DATA#pre_employment_medical` | |
| StaffSupportWorker | Main | `STAFF#<id>` | `FORM_DATA#support_worker` | |
| StaffVehicleSafetyInspection | Main | `STAFF#<id>` | `FORM_DATA#vehicle_safety_inspection` | |
| StaffFormBatch | Main | `STAFF#<id>` | `BATCH#<batchId>` | + token lookup |
| StaffFormAssignment | Main | `STAFF#<id>` | `ASSIGNMENT#<id>` | |
| StaffFormSubmission | Main | `STAFF#<id>` | `SUBMISSION#<formKey>` | + ID lookup |
| StaffFormProgress | Main | `STAFF#<id>` | `PROGRESS#<formId>#<ver>` | |
| StaffFormDownload | Main | `STAFF#<id>` | `DOWNLOAD#<formKey>#<id>` | |
| StaffActivityLog | Audit | `LOG#STAFF#<staffId>` | `<timestamp>#<id>` | |
| StaffSignatureBatchForm | Main | `STAFF_BATCH#<batchId>` | `SIG_FORM#<submissionId>` | |
| StaffSubmissionNotification | Notifications | `STAFF_NOTIF#ADMIN#<adminId>` | `<timestamp>#<id>` | |

---

## 4. Global Secondary Indexes (GSIs)

### Main Table — 3 GSIs

| GSI | Partition Key (GSI PK) | Sort Key (GSI SK) | Purpose |
|-----|----------------------|------------------|---------|
| GSI1 | Entity type grouping | Status + timestamp | List active clients, all assignments by status, all admins, all forms |
| GSI2 | Search grouping | Search attributes | Filter clients by state, batch assignments ordered |
| GSI3 | Time-based grouping | Timestamp | Clients by creation date, all assignments for dashboard stats |

#### GSI1 Access Patterns:
| Entity | GSI1PK | GSI1SK | Query |
|--------|--------|--------|-------|
| Active Clients | `CLIENTS` | `ACTIVE#<name>#<id>` | List all active clients sorted by name |
| Archived Clients | `CLIENTS` | `ARCHIVED#<date>#<id>` | List archived clients |
| All Assignments | `ALL_ASSIGNMENTS` | `STATUS#<status>#<date>#<id>` | Dashboard counts by status |
| All Admins | `ALL_ADMINS` | `<email>#<id>` | List all admins |
| All Forms | `ALL_FORMS` | `<formKey>#<id>` | List all form templates |
| Staff List | `STAFF_LIST` | `STATUS#<status>#<name>#<id>` | List staff by status |

#### GSI2 Access Patterns:
| Entity | GSI2PK | GSI2SK | Query |
|--------|--------|--------|-------|
| Clients by State | `CLIENT_SEARCH#<state>` | `<name>#<id>` | Filter clients by state |
| Batch Assignments | `BATCH_ASSIGNMENTS#<batchId>` | `ORDER#<display>#<id>` | Get ordered assignments in a batch |

#### GSI3 Access Patterns:
| Entity | GSI3PK | GSI3SK | Query |
|--------|--------|--------|-------|
| Clients by Date | `CLIENTS_BY_DATE` | `<createdAt>#<id>` | New clients this month |
| All Assignments | `ALL_ASSIGNMENTS` | `STATUS#<status>#<date>#<id>` | Count by status for dashboard |

### Audit Table — 1 GSI

| GSI | GSI1PK | GSI1SK | Purpose |
|-----|--------|--------|---------|
| GSI1 | `ALL_LOGS` or `ALL_PII` | `<timestamp>#<id>` | Time-range queries across all logs |

### Notifications Table — 1 GSI (Sparse)

| GSI | GSI1PK | GSI1SK | Purpose |
|-----|--------|--------|---------|
| GSI1 | `UNREAD#ADMIN#<adminId>` | `<timestamp>#<id>` | Count/list unread notifications only |

**Sparse Index**: Only unread notifications have GSI1PK populated. When marked as read, GSI1PK is removed — item disappears from the index automatically.

### Settings Table — 1 GSI

| GSI | GSI1PK | GSI1SK | Purpose |
|-----|--------|--------|---------|
| GSI1 | `ADMIN#<adminId>` | `KEY#<key>` | Lookup setting by key name |

---

## 5. Key Design Decisions

### 5.1 Why 4 Tables (Not 1, Not 36)

| Approach | Problem |
|----------|---------|
| 1 table (pure single-table) | Audit logs would create hot partitions, throttling client reads |
| 36 tables (1:1 with PostgreSQL) | Requires cross-table queries, defeats DynamoDB's strength |
| **4 tables (hybrid)** | Entities accessed together share a partition; independent workloads separated |

### 5.2 Denormalization Strategy

| PostgreSQL (Normalized) | DynamoDB (Denormalized) | Benefit |
|------------------------|------------------------|---------|
| Client + CommonField (2 tables, JOIN) | Single item with embedded commonFields | 1 read instead of 2 |
| Staff + StaffCommonField (2 tables) | Single item with embedded commonFields | 1 read instead of 2 |
| FormAssignment + MasterForm (JOIN for title) | Assignment item includes formKey, formTitle | No extra lookup needed |
| FormSubmission + MasterForm (JOIN) | Submission includes formKey, formTitle | No extra lookup needed |

### 5.3 ID Strategy

| PostgreSQL | DynamoDB |
|-----------|----------|
| Auto-increment integer (1, 2, 3...) | ULID (26 chars, time-sortable, globally unique) |
| Sequential, predictable | Random, no coordination needed |
| Requires DB sequence | Generated in application code |

**ULID Example**: `01KRGD5HJGV06VJAP7ERZMS7A6`
- First 10 chars = timestamp (millisecond precision)
- Last 16 chars = cryptographic randomness

### 5.4 Token Lookups (Strongly Consistent)

| Token Type | PostgreSQL | DynamoDB |
|-----------|-----------|----------|
| Batch Token | GSI query (eventually consistent) | Direct PK lookup: `BATCH_TOKEN#<token>` (strongly consistent) |
| MFA Token | WHERE query | Direct PK lookup: `MFA_TOKEN#<token>` |
| Staff Link Token | WHERE query | Direct PK lookup: `STAFF_TOKEN#<token>` |

### 5.5 Dashboard Aggregations

| PostgreSQL | DynamoDB |
|-----------|----------|
| 7 separate `COUNT(*)` queries per page load | Query GSI3 `ALL_ASSIGNMENTS` + count in memory |
| ~50ms per query × 7 = ~350ms | Single query ~20ms + count = ~25ms total |

---

## 6. Data Type Mapping

| PostgreSQL Type | DynamoDB Type | Notes |
|----------------|--------------|-------|
| Int (PK, autoincrement) | String (S) | ULID string |
| String / Text | String (S) | Direct mapping |
| Boolean | Boolean (BOOL) | Direct mapping |
| DateTime | String (S) | ISO 8601 format |
| Json | Map (M) | Native DynamoDB Map |
| Int (FK) | String (S) | ULID reference (no FK enforcement) |
| Enum (LogType) | String (S) | Stored as string value |
| Nullable fields | Omitted | DynamoDB: omit attribute entirely |
| Base64 (signatures) | String (S) | Stored as-is |

---

## 7. Transaction Mapping

| Operation | PostgreSQL | DynamoDB |
|-----------|-----------|----------|
| Create Client | `$transaction` (3 tables) | `TransactWriteItems` (3 items: profile + admin-client + counter) |
| Register Admin | Single INSERT + unique constraint | `TransactWriteItems` (2 items: profile + email lookup with ConditionExpression) |
| Assign Forms | `$transaction` (batch + N assignments) | `TransactWriteItems` (batch + token + assignments + counter) |
| Submit Form | Upsert + update status | `TransactWriteItems` (submission + ID lookup + status update) |
| Generate Signature Link | `$transaction` (batch + N sig forms) | Sequential: createFormBatch + N × createSignatureBatchForm |
| Archive Client | UPDATE archivedAt | `PutItem` with updated GSI1SK (ACTIVE → ARCHIVED) + counter decrement |

### DynamoDB Transaction Limits:
- Max 100 items per `TransactWriteItems`
- Max 4MB total request size
- All items must be in the same region

---

## 8. Search Implementation

### Client Search (name, email, phone, NDIS)

| PostgreSQL | DynamoDB |
|-----------|----------|
| `WHERE ILIKE '%term%' OR ...` (6 columns) | Query GSI1 → filter in application memory |
| Database handles filtering | Application handles filtering |
| Works at any scale | Works well for <10,000 clients |

**Current approach** (acceptable for government NDIS provider scale):
1. Query all active clients from GSI1 (~5,000 max)
2. Filter in JavaScript by search term (case-insensitive)
3. Sort by name using `localeCompare('en-AU')`
4. Paginate with array slice

**Note**: The original PostgreSQL code already sorted in-memory using the same `localeCompare` approach.

---

## 9. Security & Compliance Features

| Feature | Implementation |
|---------|---------------|
| Deletion Protection | Enabled on all 4 tables (prevents accidental `DeleteTable`) |
| Point-in-Time Recovery | Enabled on all 4 tables (35-day recovery window) |
| TTL Auto-Cleanup | MFA codes expire after 24h, batches after 30 days post-expiry |
| MFA Enforcement | First login: password-only → configure SMTP → MFA auto-enabled |
| PII Audit Trail | Every reveal/hide logged to Audit table with timestamp, IP, user agent |
| Soft Deletes | `archivedAt` field — no hard deletes (government data retention) |
| Encryption at Rest | AWS default (AES-256) — all DynamoDB data encrypted |
| Encryption in Transit | TLS 1.2+ for all API calls |

---

## 10. Migration Results

### Data Migrated (May 13, 2026):

| Entity | Records | Source → Target |
|--------|---------|-----------------|
| Admins | 8 | PostgreSQL → Main table |
| MasterForms | 30 | PostgreSQL → Main table |
| Clients | 23 (22 active) | PostgreSQL → Main table (with embedded CommonFields) |
| FormBatches | 336 | PostgreSQL → Main table (with token lookups) |
| FormAssignments | 310 | PostgreSQL → Main table (with batch collections) |
| FormSubmissions | 150 | PostgreSQL → Main table (dual-key: composite + ID lookup) |
| SignatureBatchForms | 95 | PostgreSQL → Main table |
| Notifications | 1,167 | PostgreSQL → Notifications table |
| Settings | 105 | PostgreSQL → Settings table |
| Activity Logs | 449 | PostgreSQL → Audit table |

### ID Mapping:
All integer IDs were converted to ULIDs. Referential integrity maintained through the migration script's ID mapping table.

---

## 11. Cost Comparison

| Resource | PostgreSQL (Neon) | DynamoDB (On-Demand) |
|----------|------------------|---------------------|
| Compute | ~$19/month (Pro plan) | $0 (serverless) |
| Storage | Included | ~$0.25/GB/month |
| Reads | Included | $0.25 per million |
| Writes | Included | $1.25 per million |
| Backups (PITR) | Extra cost | Included |
| **Estimated Monthly** | **~$19-25** | **~$5-15** |

---

## 12. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                        │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Auth     │  │ Clients  │  │ Forms    │  │ Settings │   │
│  │ Routes   │  │ Routes   │  │ Routes   │  │ Routes   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │              │              │              │          │
│  ┌────┴──────────────┴──────────────┴──────────────┴─────┐   │
│  │              Data Access Layer (src/lib/db/)           │   │
│  │  admin.ts | client.ts | forms.ts | notifications.ts   │   │
│  │  settings.ts | audit.ts | staff.ts                    │   │
│  └────┬──────────────┬──────────────┬──────────────┬─────┘   │
│       │              │              │              │          │
└───────┼──────────────┼──────────────┼──────────────┼──────────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────┐ ┌──────────────┐ ┌──────────┐
│ Main Table   │ │ Audit    │ │ Notifications│ │ Settings │
│ (3 GSIs,TTL) │ │ (1 GSI)  │ │ (1 GSI)      │ │ (1 GSI)  │
│              │ │          │ │              │ │          │
│ • Admin      │ │ • Form   │ │ • Form Sub   │ │ • Per-   │
│ • Client     │ │   Activity│ │   Notifs     │ │   admin  │
│ • Form       │ │   Logs   │ │ • Staff Sub  │ │   config │
│ • Assignment │ │ • PII    │ │   Notifs     │ │ • Global │
│ • Submission │ │   Access │ │              │ │   defaults│
│ • Batch      │ │   Logs   │ │              │ │          │
│ • Staff      │ │ • Staff  │ │              │ │          │
│ • MFA Codes  │ │   Activity│ │              │ │          │
│ • Signatures │ │   Logs   │ │              │ │          │
└──────────────┘ └──────────┘ └──────────────┘ └──────────┘
```

---

## 13. Files Modified

### New Files Created:
| File | Purpose |
|------|---------|
| `src/lib/dynamodb.ts` | DynamoDB client singleton |
| `src/lib/dynamodb-utils.ts` | ULID generation, timestamps, TTL helpers |
| `src/lib/db/admin.ts` | Admin + MFA data access |
| `src/lib/db/client.ts` | Client + CommonFields + counters |
| `src/lib/db/forms.ts` | MasterForm, FormBatch, FormAssignment, FormSubmission |
| `src/lib/db/notifications.ts` | Notification CRUD with sparse GSI |
| `src/lib/db/settings.ts` | Per-admin settings with global fallback |
| `src/lib/db/audit.ts` | Activity logs + PII access logs |
| `src/lib/db/staff.ts` | Staff + dedicated forms + batches |
| `src/lib/db/index.ts` | Barrel export |
| `scripts/dynamodb-setup.ts` | Table creation script |
| `scripts/migrate-data.ts` | PostgreSQL → DynamoDB ETL script |
| `dynamodb-schema-design.md` | Schema design document |
| `.env.example` | New environment template |

### Files Rewritten (Prisma → DynamoDB):
- 42+ API route files
- `src/lib/mfa.ts`
- `src/lib/authOptions.ts`
- `src/lib/password-reset.ts`
- `src/lib/adminReviewUtils.ts`
- `src/lib/settings-server.ts`
- `src/lib/email-logger.ts`
- `src/lib/form-title-helper.ts`
- `src/lib/formStatusHelper.ts`
- `src/lib/api-server.ts`

### Files Removed (Post-Migration):
- `src/lib/prisma.ts` (dead file)
- `prisma/` directory (schema + migrations — keep for reference)

---

## 14. Environment Variables

### Before (PostgreSQL):
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...
GOOGLE_DRIVE_FOLDER_ID=...
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
```

### After (DynamoDB):
```
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
DYNAMODB_TABLE_PREFIX=InfinitySupports_Dev
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...
GOOGLE_DRIVE_FOLDER_ID=...
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
```

---

## 15. Rollback Plan

If critical issues are discovered post-migration:
1. PostgreSQL database is still intact (read-only)
2. Revert code to previous git commit
3. Restore `DATABASE_URL` in `.env`
4. Application immediately works with PostgreSQL again

**Recommended**: Keep PostgreSQL running read-only for 30 days post-migration as safety net.

---

*End of Document*
