import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const cookieStore = await cookies()
  
  // Secure cookie deletion - must match ALL attributes used when setting the cookie
  // This is critical for proper cookie deletion across all browsers
  const isProduction = process.env.NODE_ENV === 'production'
  
  cookieStore.set('session', '', {
    maxAge: 0, // Immediately expire the cookie
    httpOnly: true, // Must match the security attributes from session creation
    secure: isProduction, // Must match the secure flag setting
    sameSite: 'strict', // Must match the sameSite setting for proper deletion
    path: '/', // Must match the path setting
  })
  
  return NextResponse.json({ status: 'success' })
}