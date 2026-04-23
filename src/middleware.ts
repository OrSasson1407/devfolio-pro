import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(req: NextRequest) {
  const res = NextResponse.next()
  
  // Intercept referral codes from any URL
  const ref = req.nextUrl.searchParams.get('ref')
  if (ref) {
    // Store the referral code in a cookie for 30 days
    res.cookies.set('devfolio_ref', ref, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, 
      httpOnly: true,
      sameSite: 'lax',
    })
  }
  
  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}