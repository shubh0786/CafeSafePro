import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Add additional route protection based on roles if needed
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Protect franchise routes
    if (path.startsWith('/franchise') && token?.role !== 'FRANCHISE_ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Protect settings routes
    if (path.startsWith('/settings') && !['OWNER', 'FRANCHISE_ADMIN'].includes(token?.role || '')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ req, token }) {
        if (!token) return false
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/tasks/:path*',
    '/temperature/:path*',
    '/records/:path*',
    '/stock/:path*',
    '/equipment/:path*',
    '/pest-control/:path*',
    '/staff/:path*',
    '/stores/:path*',
    '/franchise/:path*',
    '/reports/:path*',
    '/settings/:path*',
  ],
}
