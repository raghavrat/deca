import { NextResponse } from 'next/server'
import { isAccountEmailValid } from '../../../config/accountEmail'
import { RequestError, requireSameOrigin } from '../../../utils/serverAuth'

export async function POST(request: Request) {
  try {
    requireSameOrigin(request)
    const body: unknown = await request.json()
    const email = typeof body === 'object' && body !== null && 'email' in body
      ? (body as { email?: unknown }).email
      : null

    if (typeof email !== 'string' || email.length > 254 || !isAccountEmailValid(email)) {
      return NextResponse.json(
        { error: 'Enter a valid email address' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } },
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
