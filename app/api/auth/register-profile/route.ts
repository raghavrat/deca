import { FieldValue } from 'firebase-admin/firestore'
import { NextResponse } from 'next/server'
import { isAccountEmailValid } from '../../../config/accountEmail'
import { adminAuth, adminDb } from '../../../firebase/admin'
import { RequestError, requireSameOrigin } from '../../../utils/serverAuth'

const noStoreHeaders = { 'Cache-Control': 'no-store' }

export async function POST(request: Request) {
  try {
    requireSameOrigin(request)
    if (!adminAuth || !adminDb) throw new RequestError(500, 'Server configuration error')

    const body: unknown = await request.json()
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      throw new RequestError(400, 'Invalid account details')
    }

    const { idToken, name, ageConfirmed, termsAccepted } = body as Record<string, unknown>
    const normalizedName = typeof name === 'string' ? name.trim() : ''
    if (
      typeof idToken !== 'string' || idToken.length < 100 || idToken.length > 10_000 ||
      !normalizedName || normalizedName.length > 80 ||
      ageConfirmed !== true || termsAccepted !== true
    ) {
      throw new RequestError(400, 'Invalid account details')
    }

    const claims = await adminAuth.verifyIdToken(idToken)
    if (!claims.email || !isAccountEmailValid(claims.email)) {
      throw new RequestError(400, 'Enter a valid email address')
    }

    await adminDb.collection('users').doc(claims.uid).set({
      email: claims.email.toLowerCase(),
      name: normalizedName,
      displayName: normalizedName,
      problemsCompleted: 0,
      leaderboardVisible: false,
      age13Confirmed: true,
      termsAcceptedAt: FieldValue.serverTimestamp(),
      privacyPolicyVersion: '2026-07-20',
      authProvider: 'firebase',
      createdAt: FieldValue.serverTimestamp(),
    }, { merge: true })

    return NextResponse.json({ created: true }, { headers: noStoreHeaders })
  } catch (error) {
    if (error instanceof RequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status, headers: noStoreHeaders })
    }
    return NextResponse.json({ error: 'Unable to finish account setup' }, { status: 500, headers: noStoreHeaders })
  }
}
