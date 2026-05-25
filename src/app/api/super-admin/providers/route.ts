import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireSuperAdmin, isErrorResponse } from '@/lib/super-admin/api-guard';
import {
  createOrganization,
  listOrganizations,
  countOrganizationsByStatus,
} from '@/lib/super-admin/db/organizations';
import { createAuditLog } from '@/lib/super-admin/db/audit';
import { ORG_STATUS } from '@/lib/super-admin/constants';

// GET /api/super-admin/providers — List providers with filters
export async function GET(request: NextRequest) {
  const auth = await requireSuperAdmin(request);
  if (isErrorResponse(auth)) return auth;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') as keyof typeof ORG_STATUS | null;
  const limit = parseInt(searchParams.get('limit') || '25');
  const cursor = searchParams.get('cursor') || undefined;

  const result = await listOrganizations({
    status: status ? ORG_STATUS[status] : undefined,
    limit,
    cursor,
  });

  return NextResponse.json(result);
}

// POST /api/super-admin/providers — Create new provider (onboarding)
export async function POST(request: NextRequest) {
  const auth = await requireSuperAdmin(request);
  if (isErrorResponse(auth)) return auth;

  const body = await request.json();

  // Validate required fields
  const required = ['name', 'abn', 'primaryContactName', 'primaryContactEmail', 'primaryContactPhone', 'address'];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }

  // Validate ABN format (11 digits)
  const abnClean = body.abn.replace(/\s/g, '');
  if (!/^\d{11}$/.test(abnClean)) {
    return NextResponse.json({ error: 'ABN must be 11 digits' }, { status: 400 });
  }

  // Validate address
  const addr = body.address;
  if (!addr.street || !addr.suburb || !addr.state || !addr.postcode) {
    return NextResponse.json({ error: 'Address must include street, suburb, state, postcode' }, { status: 400 });
  }

  const validStates = ['WA', 'NSW', 'VIC', 'QLD', 'SA', 'TAS', 'NT', 'ACT'];
  if (!validStates.includes(addr.state)) {
    return NextResponse.json({ error: `State must be one of: ${validStates.join(', ')}` }, { status: 400 });
  }

  try {
    const org = await createOrganization({
      name: body.name,
      tradingName: body.tradingName || undefined,
      abn: abnClean,
      ndisRegistrationNumber: body.ndisRegistrationNumber || undefined,
      registrationType: body.registrationType || 'unregistered',
      registrationGroups: body.registrationGroups || [],
      status: 'PENDING',
      primaryContactName: body.primaryContactName,
      primaryContactEmail: body.primaryContactEmail,
      primaryContactPhone: body.primaryContactPhone,
      address: addr,
      insuranceExpiry: body.insuranceExpiry || undefined,
      workerCompExpiry: body.workerCompExpiry || undefined,
      ndisRegistrationExpiry: body.ndisRegistrationExpiry || undefined,
      notes: body.notes || undefined,
    });

    // Audit log
    await createAuditLog({
      actorId: auth.id,
      actorEmail: auth.email,
      category: 'PROVIDER',
      action: 'provider.created',
      targetType: 'organization',
      targetId: org.id,
      metadata: { name: org.name, abn: org.abn },
    });

    return NextResponse.json(org, { status: 201 });
  } catch (err: any) {
    // ABN uniqueness violation
    if (err.name === 'TransactionCanceledException') {
      return NextResponse.json({ error: 'A provider with this ABN already exists' }, { status: 409 });
    }
    throw err;
  }
}
