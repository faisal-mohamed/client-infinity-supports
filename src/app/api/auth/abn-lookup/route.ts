import { NextRequest, NextResponse } from 'next/server';
import { validateABNFormat, lookupABN } from '@/lib/abn-validation';

// GET /api/auth/abn-lookup?abn=12345678901
export async function GET(request: NextRequest) {
  const abn = request.nextUrl.searchParams.get('abn')?.replace(/\s/g, '');
  if (!abn) return NextResponse.json({ error: 'abn parameter required' }, { status: 400 });

  const validation = validateABNFormat(abn);
  if (!validation.valid) {
    return NextResponse.json({ valid: false, error: validation.error });
  }

  const result = await lookupABN(abn);

  return NextResponse.json({
    valid: true,
    abn,
    name: result?.name || null,
    status: result?.status || null,
    type: result?.type || null,
    state: result?.state || null,
  });
}
