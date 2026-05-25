/**
 * Super Admin Module — Type Definitions
 * All interfaces for the SaaS platform layer
 */

import type { OrgStatus, SubStatus, PlanTier, AuditCategory } from './constants';

// ─── Super Admin User ────────────────────────────────────────────────────────
export interface SuperAdmin {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  mfaEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Organization (Provider Tenant) ──────────────────────────────────────────
export interface Organization {
  id: string;
  name: string;
  tradingName?: string;
  abn: string;                    // Australian Business Number (11 digits)
  ndisRegistrationNumber?: string;
  registrationType: 'registered' | 'unregistered';
  registrationGroups?: string[];  // NDIS registration group codes
  status: OrgStatus;
  // Contact
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  address: {
    street: string;
    suburb: string;
    state: string;              // WA, NSW, VIC, QLD, SA, TAS, NT, ACT
    postcode: string;
  };
  // Compliance documents
  insuranceExpiry?: string;       // Public liability insurance
  workerCompExpiry?: string;      // Workers compensation
  ndisRegistrationExpiry?: string;
  // Branding
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  // Metadata
  onboardedBy?: string;           // Super admin who approved
  onboardedAt?: string;
  suspendedAt?: string;
  suspendedReason?: string;
  deactivatedAt?: string;
  deactivatedReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Subscription ────────────────────────────────────────────────────────────
export interface Subscription {
  id: string;
  organizationId: string;
  planId: string;
  planTier: PlanTier;
  status: SubStatus;
  // Billing
  billingEmail: string;
  billingCycle: 'monthly' | 'annual';
  pricePerMonth: number;          // In cents (AUD)
  // Dates
  trialEndsAt?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt?: string;
  // Usage (current period)
  usage: {
    clients: number;
    staff: number;
    admins: number;
    formsThisMonth: number;
    storageUsedGB: number;
  };
  // Limits (from plan)
  limits: {
    maxClients: number;
    maxStaff: number;
    maxAdmins: number;
    maxFormsPerMonth: number;
    storageGB: number;
  };
  createdAt: string;
  updatedAt: string;
}

// ─── Plan Definition ─────────────────────────────────────────────────────────
export interface Plan {
  id: string;
  tier: PlanTier;
  name: string;
  description: string;
  priceMonthly: number;           // Cents AUD
  priceAnnual: number;            // Cents AUD (per month, billed annually)
  limits: {
    maxClients: number;
    maxStaff: number;
    maxAdmins: number;
    maxFormsPerMonth: number;
    storageGB: number;
  };
  features: string[];             // Feature flag keys enabled for this plan
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Feature Flag (per-org override) ─────────────────────────────────────────
export interface FeatureFlag {
  organizationId: string;
  featureKey: string;
  enabled: boolean;
  overriddenBy?: string;          // Super admin who set override
  overriddenAt?: string;
  reason?: string;
}

// ─── Platform Audit Log ──────────────────────────────────────────────────────
export interface PlatformAuditLog {
  id: string;
  actorId: string;                // Super admin ID or 'SYSTEM'
  actorEmail: string;
  category: AuditCategory;
  action: string;                 // e.g., 'provider.approved', 'subscription.cancelled'
  targetType?: string;            // e.g., 'organization', 'subscription'
  targetId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// ─── Form Template (Master) ──────────────────────────────────────────────────
export interface FormTemplate {
  id: string;
  formKey: string;                // Unique key (e.g., 'welcome_form')
  version: number;
  name: string;
  description: string;
  category: string;               // e.g., 'participant', 'staff', 'compliance'
  schema: Record<string, unknown>; // JSON schema definition
  pages: number;
  requiredSignatures: string[];   // e.g., ['participant', 'admin']
  status: 'draft' | 'published' | 'deprecated';
  publishedAt?: string;
  deprecatedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Email Template ──────────────────────────────────────────────────────────
export interface EmailTemplate {
  id: string;
  key: string;                    // e.g., 'form_assigned', 'welcome_provider'
  name: string;
  subject: string;
  htmlBody: string;
  variables: string[];            // Available template variables
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Notification Rule ───────────────────────────────────────────────────────
export interface NotificationRule {
  id: string;
  event: string;                  // e.g., 'provider.onboarded', 'subscription.past_due'
  channels: ('email' | 'in_app')[];
  templateId?: string;
  isActive: boolean;
  createdAt: string;
}

// ─── Compliance Check ────────────────────────────────────────────────────────
export interface ComplianceCheck {
  id: string;
  organizationId: string;
  checkType: string;              // e.g., 'insurance_expiry', 'ndis_registration', 'worker_screening'
  status: 'compliant' | 'warning' | 'non_compliant' | 'pending';
  dueDate?: string;
  lastCheckedAt: string;
  details?: Record<string, unknown>;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
}

// ─── API Response Types ──────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  nextCursor?: string;
  hasMore: boolean;
}

export interface DashboardStats {
  totalProviders: number;
  activeProviders: number;
  pendingProviders: number;
  suspendedProviders: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  complianceAlerts: number;
}
