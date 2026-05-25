import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin, isErrorResponse } from '@/lib/super-admin/api-guard';
import { listAuditLogs } from '@/lib/super-admin/db/audit';
import type { AuditCategory } from '@/lib/super-admin/constants';

export async function GET(request: NextRequest) {
  const auth = await requireSuperAdmin(request);
  if (isErrorResponse(auth)) return auth;

  const params = request.nextUrl.searchParams;

  const result = await listAuditLogs({
    category: (params.get('category') as AuditCategory) || undefined,
    organizationId: params.get('organizationId') || undefined,
    actorId: params.get('actorId') || undefined,
    startDate: params.get('startDate') || undefined,
    endDate: params.get('endDate') || undefined,
    limit: params.get('limit') ? Number(params.get('limit')) : undefined,
    cursor: params.get('cursor') || undefined,
  });

  return NextResponse.json(result);
}
