import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Add debug headers to API responses
  if (path.startsWith('/api/')) {
    // Clone the response to add headers
    const response = NextResponse.next();
    
    // Add a header to track API calls for debugging
    response.headers.set('X-API-Timestamp', new Date().toISOString());
    
    return response;
  }

  // Continue with the request
  return NextResponse.next();
}

// Configure the middleware to run only for API routes
export const config = {
  matcher: '/api/:path*',
};
