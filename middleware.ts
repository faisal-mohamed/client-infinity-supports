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
  
  // Form routes passcode protection
  if ((path.startsWith('/forms/view-form/') || 
       path.startsWith('/forms/common-fields/') ||
       path.startsWith('/forms/completed/')) && 
      !path.startsWith('/forms/access/')) {
    
    const token = path.split('/').pop();
    const passcode = request.nextUrl.searchParams.get('passcode');
    
    // If no passcode provided, redirect to access page
    if (!passcode && token) {
      return NextResponse.redirect(new URL(`/forms/access/${token}`, request.url));
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
    // Match form routes that need passcode protection
    '/forms/view-form/:path*',
    '/forms/common-fields/:path*',
    '/forms/completed/:path*'
  ],
};
