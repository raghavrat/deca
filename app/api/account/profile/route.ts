import { FieldValue } from 'firebase-admin/firestore'
import { NextResponse } from 'next/server'
import { adminDb } from '../../../firebase/admin'
import { RequestError, requireSameOrigin, requireSession } from '../../../utils/serverAuth'

const noStoreHeaders = { 'Cache-Control': 'no-store' }

export async function GET() {
  try {
    const user = await requireSession()
    if (!adminDb) throw new RequestError(500, 'Server configuration error')

    const profileRef = adminDb.collection('users').doc(user.uid)
    let profileSnapshot = await profileRef.get()
    if (!profileSnapshot.exists) {
      const displayName = user.displayName?.trim().slice(0, 80) || ''
      await profileRef.set({
        email: user.email,
        name: displayName,
        displayName,
        problemsCompleted: 0,
        leaderboardVisible: false,
        authProvider: user.provider,
        authUid: user.authUid,
        createdAt: FieldValue.serverTimestamp(),
      })
      profileSnapshot = await profileRef.get()
    } else {
      const currentProfile = profileSnapshot.data() || {}
      const fallbackName = user.displayName?.trim().slice(0, 80) || ''
      await profileRef.set({
        email: user.email,
        authProvider: user.provider,
        authUid: user.authUid,
        ...(typeof currentProfile.name === 'string' ? {} : { name: fallbackName }),
        ...(typeof currentProfile.displayName === 'string' ? {} : { displayName: fallbackName }),
        ...(typeof currentProfile.problemsCompleted === 'number' ? {} : { problemsCompleted: 0 }),
        ...(typeof currentProfile.leaderboardVisible === 'boolean' ? {} : { leaderboardVisible: false }),
        ...(currentProfile.createdAt ? {} : { createdAt: FieldValue.serverTimestamp() }),
      }, { merge: true })
      profileSnapshot = await profileRef.get()
    }

    const profile = profileSnapshot.data() || {}
    return NextResponse.json({
      name: typeof profile.name === 'string' ? profile.name : '',
      leaderboardVisible: profile.leaderboardVisible === true,
    }, { headers: noStoreHeaders })
  } catch (error) {
    if (error instanceof RequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status, headers: noStoreHeaders })
    }
    return NextResponse.json({ error: 'Unable to load account profile' }, { status: 500, headers: noStoreHeaders })
  }
}

export async function PATCH(request: Request) {
  try {
    requireSameOrigin(request)
    const user = await requireSession()
    if (!adminDb) throw new RequestError(500, 'Server configuration error')

    const body: unknown = await request.json()
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      throw new RequestError(400, 'Invalid profile update')
    }

    const input = body as Record<string, unknown>
    const update: Record<string, unknown> = {
      email: user.email,
      authProvider: user.provider,
      authUid: user.authUid,
      updatedAt: FieldValue.serverTimestamp(),
    }

    if ('name' in input) {
      const normalizedName = typeof input.name === 'string' ? input.name.trim() : ''
      if (!normalizedName || normalizedName.length > 80) {
        throw new RequestError(400, 'Display name must be between 1 and 80 characters')
      }
      update.name = normalizedName
      update.displayName = normalizedName
    }

    if ('leaderboardVisible' in input) {
      if (typeof input.leaderboardVisible !== 'boolean') {
        throw new RequestError(400, 'Invalid leaderboard preference')
      }
      update.leaderboardVisible = input.leaderboardVisible
    }

    if (!('name' in input) && !('leaderboardVisible' in input)) {
      throw new RequestError(400, 'No supported profile fields were provided')
    }

    await adminDb.collection('users').doc(user.uid).set(update, { merge: true })
    return NextResponse.json({ updated: true }, { headers: noStoreHeaders })
  } catch (error) {
    if (error instanceof RequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status, headers: noStoreHeaders })
    }
    return NextResponse.json({ error: 'Unable to update account profile' }, { status: 500, headers: noStoreHeaders })
  }
}
