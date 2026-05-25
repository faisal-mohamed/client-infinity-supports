import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireSuperAdmin, isErrorResponse } from '@/lib/super-admin/api-guard';
import {
  getOrganizationById,
  updateOrganization,
  approveOrganization,
  suspendOrganization,
  reactivateOrganization,
  deactivateOrganization,
} from '@/lib/super-admin/db/organizations';
import { createAuditLog } from '@/lib/super-admin/db/audit';

// GET /api/super-admin/providers/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireSuperAdmin(request);
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  const org = await getOrganizationById(id);
  if (!org) return NextResponse.json({ error: 'Provider not found' }, { status: 404 });

  return NextResponse.json(org);
}

// PATCH /api/super-admin/providers/[id] — Update provider or change status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireSuperAdmin(request);
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  const org = await getOrganizationById(id);
  if (!org) return NextResponse.json({ error: 'Provider not found' }, { status: 404 });

  const body = await request.json();

  // Status transition actions
  if (body.action) {
    switch (body.action) {
      case 'approve':
        if (org.status !== 'PENDING' && org.status !== 'VERIFYING') {
          return NextResponse.json({ error: 'Can only approve pending/verifying providers' }, { status: 400 });
        }
        await approveOrganization(id, auth.id);
        await createAuditLog({
          actorId: auth.id,
          actorEmail: auth.email,
          category: 'PROVIDER',
          action: 'provider.approved',
          targetType: 'organization',
          targetId: id,
          metadata: { name: org.name },
        });
        break;

      case 'suspend':
        if (org.status !== 'ACTIVE') {
          return NextResponse.json({ error: 'Can only suspend active providers' }, { status: 400 });
        }
        if (!body.reason) {
          return NextResponse.json({ error: 'Suspension reason is required' }, { status: 400 });
        }
        await suspendOrganization(id, body.reason);
        await createAuditLog({
          actorId: auth.id,
          actorEmail: auth.email,
          category: 'PROVIDER',
          action: 'provider.suspended',
          targetType: 'organization',
          targetId: id,
          metadata: { name: org.name, reason: body.reason },
        });
        break;

      case 'reactivate':
        if (org.status !== 'SUSPENDED') {
          return NextResponse.json({ error: 'Can only reactivate suspended providers' }, { status: 400 });
        }
        await reactivateOrganization(id);
        await createAuditLog({
          actorId: auth.id,
          actorEmail: auth.email,
          category: 'PROVIDER',
          action: 'provider.reactivated',
          targetType: 'organization',
          targetId: id,
          metadata: { name: org.name },
        });
        break;

      case 'deactivate':
        if (!body.reason) {
          return NextResponse.json({ error: 'Deactivation reason is required' }, { status: 400 });
        }
        await deactivateOrganization(id, body.reason);
        await createAuditLog({
          actorId: auth.id,
          actorEmail: auth.email,
          category: 'PROVIDER',
          action: 'provider.deactivated',
          targetType: 'organization',
          targetId: id,
          metadata: { name: org.name, reason: body.reason },
        });
        break;

      default:
        return NextResponse.json({ error: `Unknown action: ${body.action}` }, { status: 400 });
    }

    const updated = await getOrganizationById(id);
    return NextResponse.json(updated);
  }

  // Regular field updates
  const allowedFields = [
    'name', 'tradingName', 'ndisRegistrationNumber', 'registrationType',
    'registrationGroups', 'primaryContactName', 'primaryContactEmail',
    'primaryContactPhone', 'address', 'insuranceExpiry', 'workerCompExpiry',
    'ndisRegistrationExpiry', 'logoUrl', 'primaryColor', 'accentColor', 'notes',
  ];

  const updates: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) updates[field] = body[field];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  await updateOrganization(id, updates as any);

  await createAuditLog({
    actorId: auth.id,
    actorEmail: auth.email,
    category: 'PROVIDER',
    action: 'provider.updated',
    targetType: 'organization',
    targetId: id,
    metadata: { fields: Object.keys(updates) },
  });

  const updated = await getOrganizationById(id);
  return NextResponse.json(updated);
}
