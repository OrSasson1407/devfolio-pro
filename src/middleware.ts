import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  const ref = req.nextUrl.searchParams.get('ref')
  if (ref) {
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
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}