import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getDownloadUrl } from '@/lib/s3';

// GET /api/upload/download?key=org/public/registration/compliance/file.pdf
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const key = request.nextUrl.searchParams.get('key');
  if (!key) {
    return NextResponse.json({ error: 'key parameter required' }, { status: 400 });
  }

  const url = await getDownloadUrl(key, 3600); // 1 hour expiry
  return NextResponse.redirect(url);
}
