import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { adminAuth } from '../../../firebase/admin'

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json()
    
    if (!idToken) {
      console.log('No ID token provided');
      return NextResponse.json({ error: 'No ID token provided' }, { status: 400 })
    }

    // Check if adminAuth is properly initialized
    if (!adminAuth) {
      console.error('Firebase Admin SDK not initialized');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken)
      
      // Only allow verified emails
      if (!decodedToken.email_verified) {
        console.log('Email not verified');
        return NextResponse.json({ error: 'Email not verified' }, { status: 401 })
      }

      // Create session cookie
      const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days
      const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn })
      
      // Get cookies instance
      const cookieStore = await cookies()
      
      cookieStore.set('session', sessionCookie, {
        maxAge: expiresIn / 1000, // maxAge is in seconds, not milliseconds
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })

      console.log('Session cookie set successfully');
      return NextResponse.json({ status: 'success' })
    } catch (verifyError: any) {
      console.error('Token verification error:', verifyError)
      
      // More specific error messages
      if (verifyError.code === 'auth/id-token-expired') {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 })
      } else if (verifyError.code === 'auth/argument-error') {
        return NextResponse.json({ error: 'Invalid token format' }, { status: 400 })
      }
      
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
  } catch (error: any) {
    console.error('Session creation error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
} 