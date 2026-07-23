import { auth, clerkClient, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { isAccountEmailValid } from '../../../config/accountEmail'
import { adminDb } from '../../../firebase/admin'
import {
  getPendingClerkSignupConsent,
  hasCompletedClerkConsent,
  PRIVACY_POLICY_VERSION,
} from '../../../utils/clerkConsent'
import { RateLimiter } from '../../../utils/rateLimiter'
import { RequestError, requireSameOrigin } from '../../../utils/serverAuth'

const noStoreHeaders = { 'Cache-Control': 'no-store' }
const consentFinalizationRateLimiter = new RateLimiter(5_000)

export async function POST(request: Request) {
  let reservedRateLimitKey: string | undefined

  try {
    requireSameOrigin(request)

    const { userId } = await auth()
    if (!userId) throw new RequestError(401, 'Authentication required')

    const rateLimitKey = `user:${userId}`
    const rateLimit = consentFinalizationRateLimiter.checkIdentifier(rateLimitKey)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Please wait before retrying account setup',
          timeRemaining: rateLimit.timeRemaining,
        },
        {
          status: 429,
          headers: {
            ...noStoreHeaders,
            'Retry-After': String(rateLimit.timeRemaining || 1),
          },
        },
      )
    }
    consentFinalizationRateLimiter.recordIdentifier(rateLimitKey)
    reservedRateLimitKey = rateLimitKey

    const user = await currentUser()
    const primaryEmail = user?.primaryEmailAddress
    if (
      !user || user.id !== userId ||
      !primaryEmail || primaryEmail.verification?.status !== 'verified' ||
      !isAccountEmailValid(primaryEmail.emailAddress)
    ) {
      throw new RequestError(403, 'A valid, verified email is required')
    }

    const hasCompletedConsent = hasCompletedClerkConsent(
      user.unsafeMetadata,
      user.legalAcceptedAt,
    )
    const acceptedAt = hasCompletedConsent && user.legalAcceptedAt !== null
      ? new Date(user.legalAcceptedAt)
      : getPendingClerkSignupConsent(
          user.unsafeMetadata,
          user.legalAcceptedAt,
        )
    if (!acceptedAt) {
      throw new RequestError(409, 'Signup confirmations are not available')
    }

    if (!hasCompletedConsent) {
      const client = await clerkClient()
      await client.users.updateUser(userId, { legalAcceptedAt: acceptedAt })
      await client.users.updateUserMetadata(userId, {
        unsafeMetadata: {
          age13Confirmed: true,
          termsAcceptedAt: acceptedAt.toISOString(),
          privacyPolicyVersion: PRIVACY_POLICY_VERSION,
          migrationRequiresConsent: null,
        },
      })
    }

    if (adminDb) {
      await adminDb.collection('users').doc(user.externalId || userId).set({
        email: primaryEmail.emailAddress.toLowerCase(),
        age13Confirmed: true,
        termsAcceptedAt: acceptedAt,
        privacyPolicyVersion: PRIVACY_POLICY_VERSION,
        authProvider: 'clerk',
      }, { merge: true })
    }

    return NextResponse.json({ completed: true }, { headers: noStoreHeaders })
  } catch (error) {
    if (reservedRateLimitKey) {
      consentFinalizationRateLimiter.removeIdentifier(reservedRateLimitKey)
    }
    if (error instanceof RequestError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status, headers: noStoreHeaders },
      )
    }
    return NextResponse.json(
      { error: 'Unable to finish account setup' },
      { status: 500, headers: noStoreHeaders },
    )
  }
}
