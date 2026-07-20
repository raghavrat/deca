import 'server-only'

import { cookies } from 'next/headers'
import { adminAuth } from '../firebase/admin'
import { isEmailAllowed } from '../config/allowedEmails'

export interface SessionUser {
  uid: string
  email: string
}

export class RequestError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
  }
}

export async function requireSession(): Promise<SessionUser> {
  const sessionCookie = (await cookies()).get('session')?.value

  if (!sessionCookie) {
    throw new RequestError(401, 'Authentication required')
  }

  if (!adminAuth) {
    throw new RequestError(500, 'Server configuration error')
  }

  try {
    const claims = await adminAuth.verifySessionCookie(sessionCookie, true)
    if (!claims.email || !claims.email_verified || !isEmailAllowed(claims.email)) {
      throw new RequestError(403, 'Account is not authorized')
    }

    return { uid: claims.uid, email: claims.email.toLowerCase() }
  } catch (error) {
    if (error instanceof RequestError) {
      throw error
    }
    throw new RequestError(401, 'Invalid or expired session')
  }
}

export function requireSameOrigin(request: Request): void {
  const origin = request.headers.get('origin')
  const expectedOrigin = new URL(request.url).origin

  if (!origin || origin !== expectedOrigin) {
    throw new RequestError(403, 'Invalid request origin')
  }
}

export function requestErrorResponse(error: unknown): Response | null {
  if (error instanceof RequestError) {
    return Response.json({ error: error.message }, { status: error.status })
  }
  return null
}
