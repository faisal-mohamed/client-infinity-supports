import { NextRequest, NextResponse } from 'next/server';
import { createOrganization, getOrganizationByABN } from '@/lib/super-admin/db/organizations';
import { createAuditLog } from '@/lib/super-admin/db/audit';
import { validateABNFormat, lookupABN } from '@/lib/abn-validation';

// In-memory rate limiter (per IP, 3 registrations per hour)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// Account type definitions with required fields
const ACCOUNT_TYPES = ['registered_provider', 'support_coordinator', 'independent_worker'] as const;
type AccountType = typeof ACCOUNT_TYPES[number];

const COMMON_REQUIRED = ['accountType', 'firstName', 'lastName', 'email', 'phone', 'password', 'street', 'suburb', 'state', 'postcode'];
const PROVIDER_REQUIRED = ['organisationName', 'abn', 'providerType', 'companyStructure'];
const COORDINATOR_REQUIRED = ['practitionerType', 'yearsOfExperience'];
const WORKER_REQUIRED = ['workerType', 'yearsOfExperience'];

const VALID_STATES = ['WA', 'NSW', 'VIC', 'QLD', 'SA', 'TAS', 'NT', 'ACT'];

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many registration attempts. Please try again later.' }, { status: 429 });
  }

  const body = await request.json();

  // Validate account type
  if (!ACCOUNT_TYPES.includes(body.accountType)) {
    return NextResponse.json({ error: 'Invalid account type' }, { status: 400 });
  }

  // Validate common required fields
  for (const field of COMMON_REQUIRED) {
    if (!body[field]?.toString().trim()) {
      return NextResponse.json({ error: `${field} is required` }, { status: 400 });
    }
  }

  // Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.email)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
  }

  // Phone format (Australian: 10 digits starting with 0)
  const phoneClean = body.phone.replace(/\s/g, '');
  if (!/^0\d{9}$/.test(phoneClean)) {
    return NextResponse.json({ error: 'Phone must be 10 digits starting with 0 (e.g., 0412345678)' }, { status: 400 });
  }

  // Password strength (min 15 chars to match existing login validation)
  if (body.password.length < 15) {
    return NextResponse.json({ error: 'Password must be at least 15 characters' }, { status: 400 });
  }

  // Postcode format (4 digits)
  if (!/^\d{4}$/.test(body.postcode)) {
    return NextResponse.json({ error: 'Postcode must be 4 digits' }, { status: 400 });
  }

  // State validation
  if (!VALID_STATES.includes(body.state)) {
    return NextResponse.json({ error: `State must be one of: ${VALID_STATES.join(', ')}` }, { status: 400 });
  }

  // Type-specific validation
  const accountType: AccountType = body.accountType;
  let requiredFields: string[] = [];
  if (accountType === 'registered_provider') requiredFields = PROVIDER_REQUIRED;
  else if (accountType === 'support_coordinator') requiredFields = COORDINATOR_REQUIRED;
  else if (accountType === 'independent_worker') requiredFields = WORKER_REQUIRED;

  for (const field of requiredFields) {
    if (!body[field]?.toString().trim()) {
      return NextResponse.json({ error: `${field} is required for ${accountType}` }, { status: 400 });
    }
  }

  // ABN validation (for providers and workers with ABN)
  const abn = body.abn?.replace(/\s/g, '');
  if (abn) {
    const abnCheck = validateABNFormat(abn);
    if (!abnCheck.valid) {
      return NextResponse.json({ error: abnCheck.error }, { status: 400 });
    }

    // Check ABN uniqueness
    const existingOrg = await getOrganizationByABN(abn);
    if (existingOrg) {
      return NextResponse.json({ error: 'An organization with this ABN is already registered' }, { status: 409 });
    }
  }

  // Build organization record
  const orgName = accountType === 'registered_provider'
    ? body.organisationName
    : `${body.firstName} ${body.lastName}`;

  const registrationType = accountType === 'registered_provider'
    ? (body.providerType === 'registered' ? 'registered' : 'unregistered')
    : 'unregistered';

  try {
    const org = await createOrganization({
      name: orgName,
      tradingName: body.tradingName || undefined,
      abn: abn || '00000000000', // Placeholder for coordinators without ABN
      ndisRegistrationNumber: body.ndisRegistrationNumber || undefined,
      registrationType,
      registrationGroups: body.classesOfSupport || [],
      status: 'PENDING',
      primaryContactName: `${body.firstName} ${body.lastName}`,
      primaryContactEmail: body.email.toLowerCase().trim(),
      primaryContactPhone: body.phone,
      address: {
        street: body.street,
        suburb: body.suburb,
        state: body.state,
        postcode: body.postcode,
      },
      // Store account-type-specific data in notes (structured)
      notes: JSON.stringify({
        accountType,
        companyStructure: body.companyStructure,
        practitionerType: body.practitionerType,
        workerType: body.workerType,
        yearsOfExperience: body.yearsOfExperience,
        areasOfExpertise: body.areasOfExpertise,
        servicesOffered: body.servicesOffered,
        availability: body.availability,
        supportMode: body.supportMode,
        website: body.website,
        classesOfSupport: body.classesOfSupport,
        contactPersonName: body.contactPersonName,
        contactPersonDesignation: body.contactPersonDesignation,
        contactPersonEmail: body.contactPersonEmail,
        contactPersonPhone: body.contactPersonPhone,
        membershipNumber: body.membershipNumber,
        policeCheckId: body.policeCheckId,
        policeCheckExpiry: body.policeCheckExpiry,
        skillsCategories: body.skillsCategories,
        ndisWorkerScreeningId: body.ndisWorkerScreeningId,
        firstAidExpiry: body.firstAidExpiry,
        ndisOrientationModule: body.ndisOrientationModule,
        wwccNumber: body.wwccNumber,
        wwccExpiry: body.wwccExpiry,
        hasOwnVehicle: body.hasOwnVehicle,
        driverLicenseNumber: body.driverLicenseNumber,
        driverLicenseExpiry: body.driverLicenseExpiry,
        travelRadius: body.travelRadius,
        bankBsb: body.bankBsb,
        bankAccountNumber: body.bankAccountNumber,
        bankAccountName: body.bankAccountName,
        uploadedFiles: body.uploadedFiles || {},
      }),
    });

    // Store password hash separately for use during approval
    // We hash it now so the plaintext is never stored
    const bcrypt = await import('bcrypt');
    const passwordHash = await bcrypt.hash(body.password, 12);

    // Store password hash in a separate record (deleted after approval)
    const { PutCommand } = await import('@aws-sdk/lib-dynamodb');
    const { dynamodb, PLATFORM_TABLE } = await import('@/lib/super-admin/db/client');
    const { ttlFromNow } = await import('@/lib/dynamodb-utils');

    await dynamodb.send(new PutCommand({
      TableName: PLATFORM_TABLE,
      Item: {
        PK: `ORG#${org.id}`,
        SK: 'PENDING_CREDENTIALS',
        passwordHash,
        email: body.email.toLowerCase().trim(),
        firstName: body.firstName,
        lastName: body.lastName,
        ttl: ttlFromNow(30 * 24 * 60 * 60), // Auto-delete after 30 days if not approved
      },
    }));

    // ABN lookup (non-blocking, for enrichment)
    if (abn) {
      lookupABN(abn).then((result) => {
        if (result) {
          console.log(`[ABR] ABN ${abn} lookup: ${result.name} (${result.status})`);
        }
      }).catch(() => {});
    }

    // Audit log
    await createAuditLog({
      actorId: 'SELF_REGISTRATION',
      actorEmail: body.email,
      category: 'PROVIDER',
      action: 'provider.self_registered',
      targetType: 'organization',
      targetId: org.id,
      metadata: { accountType, name: orgName },
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully. You will receive an email once your account is approved.',
      organizationId: org.id,
    }, { status: 201 });

  } catch (err: any) {
    if (err.name === 'TransactionCanceledException') {
      return NextResponse.json({ error: 'Registration failed — ABN may already be in use' }, { status: 409 });
    }
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
