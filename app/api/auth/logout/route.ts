import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { RequestError, requireSameOrigin } from '../../../utils/serverAuth'

export async function POST(request: Request) {
  try {
    requireSameOrigin(request)
    const cookieStore = await cookies()

    // Cookie deletion must match the attributes used during creation.
    const isProduction = process.env.NODE_ENV === 'production'
  
    cookieStore.set('session', '', {
      maxAge: 0,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      path: '/',
    })
  
    return NextResponse.json({ status: 'success' }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    if (error instanceof RequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Unable to sign out' }, { status: 500 })
  }
}
