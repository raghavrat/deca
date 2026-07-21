import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { adminAuth } from '../../../firebase/admin'
import { isAccountEmailValid } from '../../../config/accountEmail'
import { getErrorCode } from '../../../utils/errorHandling'
import { logger } from '../../../utils/logger'
import { RequestError, requireSameOrigin } from '../../../utils/serverAuth'

const noStoreHeaders = { 'Cache-Control': 'no-store' }

export async function GET() {
  logger.log('Session GET endpoint called');
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')

    if (!sessionCookie?.value) {
      logger.log('No session cookie found');
      return NextResponse.json({ error: 'No session cookie' }, { status: 401, headers: noStoreHeaders })
    }

    if (!adminAuth) {
      logger.errorProduction('Firebase Admin SDK not initialized - adminAuth is null');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500, headers: noStoreHeaders })
    }

    try {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie.value, true)
      
      // Validate email against whitelist
      if (!decodedClaims.email || !isAccountEmailValid(decodedClaims.email)) {
        logger.log('Session account email is invalid');
        return NextResponse.json({ error: 'A valid email address is required' }, { status: 403, headers: noStoreHeaders })
      }

      logger.log('Session validated successfully');
      return NextResponse.json({ 
        status: 'success',
        user: {
          uid: decodedClaims.uid,
          email: decodedClaims.email,
          email_verified: decodedClaims.email_verified
        }
      }, { headers: noStoreHeaders })
    } catch (verifyError: unknown) {
      logger.error('Session verification failed')
      const errorCode = getErrorCode(verifyError)
      
      if (errorCode === 'auth/session-cookie-expired') {
        return NextResponse.json({ error: 'Session expired' }, { status: 401, headers: noStoreHeaders })
      }
      
      return NextResponse.json({ error: 'Invalid session' }, { status: 401, headers: noStoreHeaders })
    }
  } catch {
    logger.errorProduction('Session validation failed')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: noStoreHeaders })
  }
}

export async function POST(request: Request) {
  logger.log('Session POST endpoint called');
  try {
    requireSameOrigin(request)
    const { idToken } = await request.json()
    logger.log('Received ID token:', idToken ? 'Yes' : 'No');
    
    if (typeof idToken !== 'string' || idToken.length < 100 || idToken.length > 10000) {
      logger.log('No ID token provided');
      return NextResponse.json({ error: 'Invalid ID token' }, { status: 400, headers: noStoreHeaders })
    }

    // Check if adminAuth is properly initialized
    if (!adminAuth) {
      logger.errorProduction('Firebase Admin SDK not initialized - adminAuth is null');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500, headers: noStoreHeaders })
    }
    logger.log('Firebase Admin SDK is available');

    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken)
      
      // Only allow verified emails
      if (!decodedToken.email_verified) {
        logger.log('Email not verified');
        return NextResponse.json({ error: 'Email not verified' }, { status: 401, headers: noStoreHeaders })
      }

      // Validate email against whitelist
      if (!decodedToken.email || !isAccountEmailValid(decodedToken.email)) {
        logger.log('Token account email is invalid');
        return NextResponse.json({ error: 'A valid email address is required' }, { status: 403, headers: noStoreHeaders })
      }

      // Create session cookie
      const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days
      const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn })
      
      // Get cookies instance
      const cookieStore = await cookies()
      
      // Enhanced security configuration for session cookies
      const isProduction = process.env.NODE_ENV === 'production'
      
      cookieStore.set('session', sessionCookie, {
        maxAge: expiresIn / 1000, // maxAge is in seconds, not milliseconds
        httpOnly: true, // Prevents client-side JavaScript access (XSS protection)
        secure: isProduction, // HTTPS only in production (man-in-the-middle protection)
        sameSite: 'strict',
        path: '/', // Cookie available for entire domain
      })

      logger.log('Session cookie set successfully');
      return NextResponse.json({ status: 'success' }, { headers: noStoreHeaders })
    } catch (verifyError: unknown) {
      logger.error('Token verification failed')
      const errorCode = getErrorCode(verifyError)
      
      // More specific error messages
      if (errorCode === 'auth/id-token-expired') {
        return NextResponse.json({ error: 'Token expired' }, { status: 401, headers: noStoreHeaders })
      } else if (errorCode === 'auth/argument-error') {
        return NextResponse.json({ error: 'Invalid token format' }, { status: 400, headers: noStoreHeaders })
      }
      
      return NextResponse.json({ error: 'Invalid token' }, { status: 401, headers: noStoreHeaders })
    }
  } catch (error: unknown) {
    logger.errorProduction('Session creation failed')
    if (error instanceof RequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status, headers: noStoreHeaders })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: noStoreHeaders })
  }
}
