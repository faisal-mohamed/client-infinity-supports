import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ─── Public paths (no auth required) ─────────────────────────────────────
  const publicPaths = [
    '/admin/login',
    '/admin/register',
    '/admin/forgot-password',
    '/admin/reset-password',
    '/super-admin/login',
  ]

  const isPublicSignaturePath = pathname.startsWith('/forms/signature/')

  if (publicPaths.includes(pathname) || isPublicSignaturePath) {
    return NextResponse.next()
  }

  // ─── Super Admin routes ──────────────────────────────────────────────────
  if (pathname.startsWith('/super-admin')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token || token.role !== 'super_admin') {
      const loginUrl = new URL('/super-admin/login', request.url)
      loginUrl.searchParams.set('callbackUrl', request.url)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  // ─── Provider Admin routes ───────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('callbackUrl', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // If a super_admin accidentally hits /admin, redirect to super-admin
    if (token.role === 'super_admin') {
      return NextResponse.redirect(new URL('/super-admin/dashboard', request.url))
    }

    return NextResponse.next()
  }

  // ─── Forms routes (public token-based) ───────────────────────────────────
  if (pathname.startsWith('/forms')) {
    // Forms are accessed via token, no JWT needed
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin(.*)', '/forms(.*)', '/super-admin(.*)'],
}
