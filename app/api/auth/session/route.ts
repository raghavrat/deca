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

    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken)
      
      // Only allow verified @westfordk12.us emails or allowed emails
      if (!decodedToken.email_verified) {
        console.log('Email not verified');
        return NextResponse.json({ error: 'Email not verified' }, { status: 401 })
      }

      // Create session cookie
      const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days
      const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn })
      
      cookies().set('session', sessionCookie, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })

      console.log('Session cookie set successfully');
      return NextResponse.json({ status: 'success' })
    } catch (verifyError: any) {
      console.error('Token verification error:', verifyError)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
  } catch (error: any) {
    console.error('Session creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 