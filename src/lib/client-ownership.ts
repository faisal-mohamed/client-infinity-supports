/**
 * Client Ownership Guard
 * Validates that the requesting admin's org owns the client.
 * Use in all /api/clients/[id]/* routes.
 */

import { NextResponse } from 'next/server';
import { getClientById } from '@/lib/db/client';
import { getTenantContext, isTenantError, type TenantContext } from '@/lib/tenant-context';

interface OwnershipResult {
  tenant: TenantContext;
  clientId: string;
}

/**
 * Validates session + client ownership. Returns tenant context and clientId, or error response.
 */
export async function validateClientOwnership(
  clientId: string
): Promise<OwnershipResult | NextResponse> {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const client = await getClientById(clientId);
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Ownership check: if both have orgId, they must match
    if (tenant.organizationId && client.organizationId && client.organizationId !== tenant.organizationId) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return { tenant, clientId };
  } catch (error) {
    console.error('Client ownership check failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export function isOwnershipError(result: OwnershipResult | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}
