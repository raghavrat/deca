import { auth, clerkClient, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { isAccountEmailValid } from '../../../config/accountEmail'
import { adminDb } from '../../../firebase/admin'
import {
  getPendingClerkSignupConsent,
  hasCompletedClerkConsent,
  PRIVACY_POLICY_VERSION,
} from '../../../utils/clerkConsent'
import { RequestError, requireSameOrigin } from '../../../utils/serverAuth'

const noStoreHeaders = { 'Cache-Control': 'no-store' }

export async function POST(request: Request) {
  try {
    requireSameOrigin(request)

    const { userId } = await auth()
    if (!userId) throw new RequestError(401, 'Authentication required')

    const user = await currentUser()
    const primaryEmail = user?.primaryEmailAddress
    if (
      !user || user.id !== userId ||
      !primaryEmail || primaryEmail.verification?.status !== 'verified' ||
      !isAccountEmailValid(primaryEmail.emailAddress)
    ) {
      throw new RequestError(403, 'A valid, verified email is required')
    }

    if (hasCompletedClerkConsent(
      user.unsafeMetadata,
      user.legalAcceptedAt,
    )) {
      return NextResponse.json({ completed: true }, { headers: noStoreHeaders })
    }

    const acceptedAt = getPendingClerkSignupConsent(
      user.unsafeMetadata,
      user.legalAcceptedAt,
    )
    if (!acceptedAt) {
      throw new RequestError(409, 'Signup confirmations are not available')
    }

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
