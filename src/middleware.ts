import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Define protected API paths that require authentication
  const isProtectedApiPath =
    path.startsWith('/api/forms') ||
    path.startsWith('/api/clients') ||
    path.startsWith('/api/generate-pdf');

  // Check if the request is for a protected API endpoint
  if (isProtectedApiPath) {
    // Get the session token
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    // If no session exists, return 401 Unauthorized
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Match all API routes that need protection
    '/api/forms/:path*',
    '/api/clients/:path*',
    '/api/generate-pdf/:path*',
  ],
};