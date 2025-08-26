import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log('[Middleware] pathname:', pathname)

  const publicPaths = [
    '/admin/login',
    '/admin/register',
    '/admin/forgot-password',
    '/admin/reset-password',
  ]

  const isPublicSignaturePath = pathname.startsWith('/forms/signature/')

  // ✅ Allow public paths
  if (publicPaths.includes(pathname) || isPublicSignaturePath) {
    console.log('[Middleware] Public route, bypassing auth')
    return NextResponse.next()
  }

  // 🔒 Check for protected routes
  const isProtected =
    pathname.startsWith('/admin') || pathname.startsWith('/forms')

  console.log('[Middleware] isProtected:', isProtected)

  if (!isProtected) return NextResponse.next()

  // 🔑 Auth check
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  console.log('[Middleware] token:', token)

  if (!token) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin(.*)', '/forms(.*)'],
}
