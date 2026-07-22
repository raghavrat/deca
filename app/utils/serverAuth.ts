import 'server-only'

import { auth as clerkAuth, currentUser as currentClerkUser } from '@clerk/nextjs/server'
import { cookies } from 'next/headers'
import { isAccountEmailValid } from '../config/accountEmail'
import { getServerAuthProvider } from '../config/authProvider.server'
import { adminAuth, developmentIdTokenSessionsEnabled } from '../firebase/admin'
import { resolveClerkDataUid } from './userIdentity'

export interface SessionUser {
  uid: string
  authUid: string
  email: string
  displayName: string | null
  provider: 'firebase' | 'clerk'
  legacyFirebaseUid: string | null
}

export class RequestError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
  }
}

async function getFirebaseSession(optional: boolean): Promise<SessionUser | null> {
  const sessionCookie = (await cookies()).get('session')?.value
  if (!sessionCookie) {
    if (optional) return null
    throw new RequestError(401, 'Authentication required')
  }
  if (!adminAuth) {
    if (optional) return null
    throw new RequestError(500, 'Server configuration error')
  }

  try {
    const claims = developmentIdTokenSessionsEnabled
      ? await adminAuth.verifyIdToken(sessionCookie)
      : await adminAuth.verifySessionCookie(sessionCookie, true)
    if (!claims.email || !claims.email_verified || !isAccountEmailValid(claims.email)) {
      if (optional) return null
      throw new RequestError(403, 'A valid, verified email is required')
    }

    return {
      uid: claims.uid,
      authUid: claims.uid,
      email: claims.email.toLowerCase(),
      displayName: typeof claims.name === 'string' ? claims.name : null,
      provider: 'firebase',
      legacyFirebaseUid: claims.uid,
    }
  } catch (error) {
    if (error instanceof RequestError) throw error
    if (optional) return null
    throw new RequestError(401, 'Invalid or expired session')
  }
}

async function getClerkSession(optional: boolean): Promise<SessionUser | null> {
  try {
    const { userId } = await clerkAuth()
    if (!userId) {
      if (optional) return null
      throw new RequestError(401, 'Authentication required')
    }

    const clerkUser = await currentClerkUser()
    if (!clerkUser || clerkUser.id !== userId) {
      if (optional) return null
      throw new RequestError(401, 'Invalid or expired session')
    }

    const primaryEmail = clerkUser.primaryEmailAddress
    if (
      !primaryEmail ||
      primaryEmail.verification?.status !== 'verified' ||
      !isAccountEmailValid(primaryEmail.emailAddress)
    ) {
      if (optional) return null
      throw new RequestError(403, 'A valid, verified email is required')
    }

    const ageConfirmed = clerkUser.unsafeMetadata.age13Confirmed === true
    const acceptedTerms = clerkUser.legalAcceptedAt !== null
    if (!ageConfirmed || !acceptedTerms) {
      if (optional) return null
      throw new RequestError(403, 'Complete the age and policy confirmations before using training tools')
    }

    const legacyFirebaseUid = clerkUser.externalId || null
    return {
      uid: resolveClerkDataUid(clerkUser.id, legacyFirebaseUid),
      authUid: clerkUser.id,
      email: primaryEmail.emailAddress.toLowerCase(),
      displayName: clerkUser.username,
      provider: 'clerk',
      legacyFirebaseUid,
    }
  } catch (error) {
    if (error instanceof RequestError) throw error
    if (optional) return null
    throw new RequestError(401, 'Invalid or expired session')
  }
}

export async function getOptionalSession(): Promise<SessionUser | null> {
  try {
    return getServerAuthProvider() === 'clerk'
      ? await getClerkSession(true)
      : await getFirebaseSession(true)
  } catch {
    return null
  }
}

export async function requireSession(): Promise<SessionUser> {
  try {
    const session = getServerAuthProvider() === 'clerk'
      ? await getClerkSession(false)
      : await getFirebaseSession(false)
    if (!session) throw new RequestError(401, 'Authentication required')
    return session
  } catch (error) {
    if (error instanceof RequestError) throw error
    throw new RequestError(500, 'Server configuration error')
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
