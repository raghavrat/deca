import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const currentPath = request.nextUrl.pathname

  // Paths that don't require authentication
  const publicPaths = ['/login', '/signup', '/api/auth/session']
  
  // Allow public paths and API routes
  if (publicPaths.includes(currentPath) || currentPath.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Redirect to login if no session exists
  if (!session?.value) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Add paths that should be protected
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (API routes that handle authentication)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
} 