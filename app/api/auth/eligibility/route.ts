import { NextResponse } from 'next/server'
import { isEmailAllowed } from '../../../config/allowedEmails'
import { RequestError, requireSameOrigin } from '../../../utils/serverAuth'

export async function POST(request: Request) {
  try {
    requireSameOrigin(request)
    const body: unknown = await request.json()
    const email = typeof body === 'object' && body !== null && 'email' in body
      ? (body as { email?: unknown }).email
      : null

    if (typeof email !== 'string' || email.length > 254 || !isEmailAllowed(email)) {
      return NextResponse.json(
        { error: 'This email is not eligible to register' },
        { status: 403, headers: { 'Cache-Control': 'no-store' } },
      )
    }

    return NextResponse.json({ eligible: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    if (error instanceof RequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
