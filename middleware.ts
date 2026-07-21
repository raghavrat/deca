import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server'

const publicPaths = new Set([
  '/',
  '/login',
  '/signup',
  '/pricing',
  '/about',
  '/privacy',
  '/terms',
  '/accessibility',
  '/forgot-password',
  '/auth/action',
  '/api/auth/session',
  '/api/auth/eligibility',
  '/api/auth/register-profile',
])

function isPublicRequest(request: NextRequest): boolean {
  const currentPath = request.nextUrl.pathname
  return publicPaths.has(currentPath) || currentPath.startsWith('/api/')
}

const handleClerkRequest = clerkMiddleware(async (auth, request) => {
  if (!isPublicRequest(request)) {
    await auth.protect()
  }
  return NextResponse.next()
}, {
  contentSecurityPolicy: {
    directives: {
      'base-uri': ["'self'"],
      'font-src': ["'self'"],
      'frame-ancestors': ["'none'"],
      'img-src': ['data:', 'blob:'],
      'media-src': ["'self'", 'blob:'],
      'object-src': ["'none'"],
    },
  },
})

function handleFirebaseRequest(request: NextRequest) {
  if (isPublicRequest(request)) return NextResponse.next()

  const session = request.cookies.get('session')
  if (!session?.value) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const serverProvider = process.env.AUTH_PROVIDER || 'firebase'
  const clientProvider = process.env.NEXT_PUBLIC_AUTH_PROVIDER || 'firebase'
  if (serverProvider !== clientProvider) {
    return NextResponse.json({ error: 'Authentication provider configuration mismatch' }, { status: 500 })
  }
  if (serverProvider === 'clerk') {
    return handleClerkRequest(request, event)
  }
  return handleFirebaseRequest(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|screenshots/).*)',
  ],
}
