import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { adminAuth } from '../../../firebase/admin'
import { isEmailAllowed } from '../../../config/allowedEmails'
import { getErrorMessage, getErrorCode } from '../../../utils/errorHandling'
import { logger } from '../../../utils/logger'

export async function GET() {
  logger.log('Session GET endpoint called');
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')

    if (!sessionCookie?.value) {
      logger.log('No session cookie found');
      return NextResponse.json({ error: 'No session cookie' }, { status: 401 })
    }

    if (!adminAuth) {
      logger.errorProduction('Firebase Admin SDK not initialized - adminAuth is null');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    try {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie.value, true)
      
      // Validate email against whitelist
      if (!decodedClaims.email || !isEmailAllowed(decodedClaims.email)) {
        logger.log('Email not in whitelist:', decodedClaims.email);
        return NextResponse.json({ error: 'This email domain is not allowed to access the system' }, { status: 403 })
      }

      logger.log('Session validated successfully for user:', decodedClaims.email);
      return NextResponse.json({ 
        status: 'success',
        user: {
          uid: decodedClaims.uid,
          email: decodedClaims.email,
          email_verified: decodedClaims.email_verified
        }
      })
    } catch (verifyError: unknown) {
      logger.error('Session verification error:', verifyError)
      const errorCode = getErrorCode(verifyError)
      
      if (errorCode === 'auth/session-cookie-expired') {
        return NextResponse.json({ error: 'Session expired' }, { status: 401 })
      }
      
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }
  } catch (error: unknown) {
    logger.errorProduction('Session validation error:', error)
    const errorMessage = getErrorMessage(error)
    return NextResponse.json({ error: errorMessage || 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  logger.log('Session POST endpoint called');
  try {
    const { idToken } = await request.json()
    logger.log('Received ID token:', idToken ? 'Yes' : 'No');
    
    if (!idToken) {
      logger.log('No ID token provided');
      return NextResponse.json({ error: 'No ID token provided' }, { status: 400 })
    }

    // Check if adminAuth is properly initialized
    if (!adminAuth) {
      logger.errorProduction('Firebase Admin SDK not initialized - adminAuth is null');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    logger.log('Firebase Admin SDK is available');

    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken)
      
      // Only allow verified emails
      if (!decodedToken.email_verified) {
        logger.log('Email not verified');
        return NextResponse.json({ error: 'Email not verified' }, { status: 401 })
      }

      // Validate email against whitelist
      if (!decodedToken.email || !isEmailAllowed(decodedToken.email)) {
        logger.log('Email not in whitelist:', decodedToken.email);
        return NextResponse.json({ error: 'This email domain is not allowed to access the system' }, { status: 403 })
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
        sameSite: 'lax', // Allows cookie to be sent on navigation from external sites (needed for redirects)
        path: '/', // Cookie available for entire domain
      })

      logger.log('Session cookie set successfully');
      // Also log the cookie for debugging (remove in production)
      console.log('Setting session cookie:', {
        value: sessionCookie.substring(0, 20) + '...', // Log first 20 chars for security
        maxAge: expiresIn / 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/'
      });
      return NextResponse.json({ status: 'success' })
    } catch (verifyError: unknown) {
      logger.error('Token verification error:', verifyError)
      const errorCode = getErrorCode(verifyError)
      
      // More specific error messages
      if (errorCode === 'auth/id-token-expired') {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 })
      } else if (errorCode === 'auth/argument-error') {
        return NextResponse.json({ error: 'Invalid token format' }, { status: 400 })
      }
      
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
  } catch (error: unknown) {
    logger.errorProduction('Session creation error:', error)
    const errorMessage = getErrorMessage(error)
    return NextResponse.json({ error: errorMessage || 'Internal server error' }, { status: 500 })
  }
} 