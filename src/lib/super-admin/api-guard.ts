/**
 * Super Admin API Guard
 * Validates JWT token has super_admin role. Returns actor info or error response.
 */

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

interface SuperAdminToken {
  id: string;
  email: string;
  role: 'super_admin';
}

export async function requireSuperAdmin(
  request: NextRequest
): Promise<SuperAdminToken | NextResponse> {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token || token.role !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return {
    id: token.id as string,
    email: token.email as string,
    role: 'super_admin',
  };
}

export function isErrorResponse(result: SuperAdminToken | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}
