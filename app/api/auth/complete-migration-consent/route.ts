import { auth, clerkClient, currentUser } from '@clerk/nextjs/server'
import { FieldValue } from 'firebase-admin/firestore'
import { NextResponse } from 'next/server'
import { isAccountEmailValid } from '../../../config/accountEmail'
import { adminDb } from '../../../firebase/admin'
import { RequestError, requireSameOrigin } from '../../../utils/serverAuth'

const noStoreHeaders = { 'Cache-Control': 'no-store' }
const privacyPolicyVersion = '2026-07-20'

export async function POST(request: Request) {
  try {
    requireSameOrigin(request)
    const body: unknown = await request.json()
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      throw new RequestError(400, 'Invalid confirmation')
    }

    const { ageConfirmed, termsAccepted } = body as Record<string, unknown>
    if (ageConfirmed !== true || termsAccepted !== true) {
      throw new RequestError(400, 'Both confirmations are required')
    }

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

    const acceptedAt = new Date()
    const acceptedAtIso = acceptedAt.toISOString()
    const client = await clerkClient()
    await client.users.updateUser(userId, { legalAcceptedAt: acceptedAt })
    await client.users.updateUserMetadata(userId, {
      unsafeMetadata: {
        age13Confirmed: true,
        termsAcceptedAt: acceptedAtIso,
        privacyPolicyVersion,
        migrationRequiresConsent: null,
      },
    })

    if (adminDb) {
      await adminDb.collection('users').doc(user.externalId || userId).set({
        email: primaryEmail.emailAddress.toLowerCase(),
        age13Confirmed: true,
        termsAcceptedAt: FieldValue.serverTimestamp(),
        privacyPolicyVersion,
        authProvider: 'clerk',
      }, { merge: true })
    }

    return NextResponse.json({ completed: true }, { headers: noStoreHeaders })
  } catch (error) {
    if (error instanceof RequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status, headers: noStoreHeaders })
    }
    return NextResponse.json({ error: 'Unable to save confirmations' }, { status: 500, headers: noStoreHeaders })
  }
}
