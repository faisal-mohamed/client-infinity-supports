/**
 * Super Admin Module Constants
 * Centralized configuration for the SaaS platform layer
 */

// ─── Table Names ─────────────────────────────────────────────────────────────
const PREFIX = process.env.DYNAMODB_TABLE_PREFIX || 'InfinitySupports';
export const PLATFORM_TABLE = `${PREFIX}_Platform`;

// ─── Entity Types ────────────────────────────────────────────────────────────
export const ENTITY = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ORGANIZATION: 'ORGANIZATION',
  SUBSCRIPTION: 'SUBSCRIPTION',
  PLAN: 'PLAN',
  FEATURE_FLAG: 'FEATURE_FLAG',
  FORM_TEMPLATE: 'FORM_TEMPLATE',
  PLATFORM_AUDIT: 'PLATFORM_AUDIT',
  EMAIL_TEMPLATE: 'EMAIL_TEMPLATE',
  NOTIFICATION_RULE: 'NOTIFICATION_RULE',
  COMPLIANCE_CHECK: 'COMPLIANCE_CHECK',
} as const;

// ─── Organization Status ─────────────────────────────────────────────────────
export const ORG_STATUS = {
  PENDING: 'PENDING',           // Application submitted
  VERIFYING: 'VERIFYING',      // Documents under review
  ACTIVE: 'ACTIVE',            // Fully operational
  SUSPENDED: 'SUSPENDED',      // Temporarily disabled (compliance/billing)
  DEACTIVATED: 'DEACTIVATED',  // Permanently disabled (data retained 7 years)
} as const;

export type OrgStatus = typeof ORG_STATUS[keyof typeof ORG_STATUS];

// ─── Subscription Status ─────────────────────────────────────────────────────
export const SUB_STATUS = {
  TRIAL: 'TRIAL',
  ACTIVE: 'ACTIVE',
  PAST_DUE: 'PAST_DUE',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
} as const;

export type SubStatus = typeof SUB_STATUS[keyof typeof SUB_STATUS];

// ─── Plan Tiers ──────────────────────────────────────────────────────────────
export const PLAN_TIER = {
  FREE: 'FREE',
  STARTER: 'STARTER',
  PROFESSIONAL: 'PROFESSIONAL',
  ENTERPRISE: 'ENTERPRISE',
} as const;

export type PlanTier = typeof PLAN_TIER[keyof typeof PLAN_TIER];

// ─── Audit Action Categories ─────────────────────────────────────────────────
export const AUDIT_CATEGORY = {
  AUTH: 'AUTH',
  PROVIDER: 'PROVIDER',
  SUBSCRIPTION: 'SUBSCRIPTION',
  COMPLIANCE: 'COMPLIANCE',
  FORM_TEMPLATE: 'FORM_TEMPLATE',
  SETTINGS: 'SETTINGS',
  SYSTEM: 'SYSTEM',
} as const;

export type AuditCategory = typeof AUDIT_CATEGORY[keyof typeof AUDIT_CATEGORY];

// ─── Feature Flags ───────────────────────────────────────────────────────────
export const FEATURES = {
  PARTICIPANT_ONBOARDING: 'participant_onboarding',
  SERVICE_AGREEMENTS: 'service_agreements',
  STAFF_ONBOARDING: 'staff_onboarding',
  CLOCK_IN_OUT: 'clock_in_out',
  SHIFT_NOTES_AI: 'shift_notes_ai',
  INCIDENT_MANAGEMENT: 'incident_management',
  RENEWAL_ALERTS: 'renewal_alerts',
  GOOGLE_DRIVE_STORAGE: 'google_drive_storage',
  DOCUMENT_CHECKLIST: 'document_checklist',
  PDF_GENERATION: 'pdf_generation',
  EMAIL_NOTIFICATIONS: 'email_notifications',
  BULK_FORM_ASSIGNMENT: 'bulk_form_assignment',
  PII_MASKING: 'pii_masking',
  MFA: 'mfa',
  CUSTOM_BRANDING: 'custom_branding',
  API_ACCESS: 'api_access',
} as const;

// ─── Default Plan Limits ─────────────────────────────────────────────────────
export const PLAN_LIMITS = {
  FREE: { maxClients: 5, maxStaff: 2, maxAdmins: 1, maxFormsPerMonth: 20, storageGB: 1 },
  STARTER: { maxClients: 25, maxStaff: 10, maxAdmins: 3, maxFormsPerMonth: 100, storageGB: 10 },
  PROFESSIONAL: { maxClients: 100, maxStaff: 50, maxAdmins: 10, maxFormsPerMonth: 500, storageGB: 50 },
  ENTERPRISE: { maxClients: -1, maxStaff: -1, maxAdmins: -1, maxFormsPerMonth: -1, storageGB: -1 }, // -1 = unlimited
} as const;
