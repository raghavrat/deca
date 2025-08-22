import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const currentPath = request.nextUrl.pathname

  console.log('Middleware check for path:', currentPath);
  console.log('Session cookie:', session);

  // Paths that don't require authentication
  const publicPaths = ['/', '/login', '/signup', '/pricing', '/about', '/forgot-password', '/auth/action', '/api/auth/session']
  
  // Allow public paths and API routes
  if (publicPaths.includes(currentPath) || currentPath.startsWith('/api/')) {
    console.log('Allowing public path or API route');
    return NextResponse.next()
  }

  // For protected routes, only check if session cookie exists
  // Detailed session validation will be done by individual pages using Firebase Admin SDK
  if (!session?.value) {
    console.log('No session cookie found, redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  console.log('Session cookie found, allowing access');
  // If session cookie exists, allow access
  // The actual session validation will happen in API routes or server components
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
     * - images/ (public images directory)
     * - screenshots/ (public screenshots directory)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|images/|screenshots/).*)',
  ],
} 