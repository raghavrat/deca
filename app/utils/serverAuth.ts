import 'server-only'

import { cookies } from 'next/headers'
import { adminAuth, developmentIdTokenSessionsEnabled } from '../firebase/admin'
import { isAccountEmailValid } from '../config/accountEmail'

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

export async function getOptionalSession(): Promise<SessionUser | null> {
  const sessionCookie = (await cookies()).get('session')?.value
  if (!sessionCookie || !adminAuth) return null

  try {
    const claims = developmentIdTokenSessionsEnabled
      ? await adminAuth.verifyIdToken(sessionCookie)
      : await adminAuth.verifySessionCookie(sessionCookie, true)
    if (!claims.email || !claims.email_verified || !isAccountEmailValid(claims.email)) return null
    return { uid: claims.uid, email: claims.email.toLowerCase() }
  } catch {
    return null
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
    const claims = developmentIdTokenSessionsEnabled
      ? await adminAuth.verifyIdToken(sessionCookie)
      : await adminAuth.verifySessionCookie(sessionCookie, true)
    if (!claims.email || !claims.email_verified || !isAccountEmailValid(claims.email)) {
      throw new RequestError(403, 'A valid, verified email is required')
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
