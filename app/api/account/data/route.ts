import { cookies } from 'next/headers'
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { adminAuth, adminDb } from '../../../firebase/admin'
import { deleteRoleplaysForUser, getRoleplaysForUser } from '../../../utils/roleplayStore'
import { RequestError, requireSameOrigin, requireSession } from '../../../utils/serverAuth'

const noStoreHeaders = { 'Cache-Control': 'no-store' }

function getHttpStatus(error: unknown): number | null {
  if (typeof error !== 'object' || error === null) return null
  const candidate = error as { status?: unknown; statusCode?: unknown }
  if (typeof candidate.status === 'number') return candidate.status
  if (typeof candidate.statusCode === 'number') return candidate.statusCode
  return null
}

export async function GET() {
  try {
    const user = await requireSession()
    if (!adminDb) throw new RequestError(500, 'Server configuration error')

    const userRef = adminDb.collection('users').doc(user.uid)
    const [profileSnapshot, usageSnapshot, roleplays] = await Promise.all([
      userRef.get(),
      userRef.collection('usage').get(),
      getRoleplaysForUser(user),
    ])

    return NextResponse.json({
      exportedAt: new Date().toISOString(),
      account: {
        uid: user.uid,
        email: user.email,
        profile: profileSnapshot.exists ? profileSnapshot.data() : null,
      },
      usage: Object.fromEntries(usageSnapshot.docs.map(document => [document.id, document.data()])),
      roleplays,
      note: 'Question practice statistics and theme preferences are stored only in this browser and are not included in the server export.',
    }, { headers: noStoreHeaders })
  } catch (error) {
    if (error instanceof RequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status, headers: noStoreHeaders })
    }
    return NextResponse.json({ error: 'Unable to export account data' }, { status: 500, headers: noStoreHeaders })
  }
}

export async function DELETE(request: Request) {
  try {
    requireSameOrigin(request)
    const user = await requireSession()
    const body: unknown = await request.json()
    const confirmation = typeof body === 'object' && body !== null && 'confirmation' in body
      ? (body as { confirmation?: unknown }).confirmation
      : null

    if (confirmation !== 'DELETE') {
      return NextResponse.json({ error: 'Deletion confirmation is required' }, { status: 400, headers: noStoreHeaders })
    }
    if (!adminDb) throw new RequestError(500, 'Server configuration error')

    let clerkApi: Awaited<ReturnType<typeof clerkClient>> | null = null
    if (user.provider === 'clerk') {
      clerkApi = await clerkClient()
      try {
        const subscription = await clerkApi.billing.getUserBillingSubscription(user.authUid)
        const chargeableItems = subscription.subscriptionItems.filter(item =>
          (item.amount?.amount || 0) > 0 ||
          (item.nextPayment?.amount || 0) > 0 ||
          item.isFreeTrial === true,
        )
        await Promise.all(chargeableItems.map(item =>
          clerkApi!.billing.cancelSubscriptionItem(item.id, { endNow: true }),
        ))
      } catch (error) {
        // Billing is optional. A missing subscription is expected before plans
        // are enabled; other failures must stop deletion to avoid future charges.
        if (getHttpStatus(error) !== 404) throw error
      }
    }

    await Promise.all([
      adminDb.recursiveDelete(adminDb.collection('users').doc(user.uid)),
      deleteRoleplaysForUser(user),
    ])
    if (user.provider === 'clerk') {
      if (user.legacyFirebaseUid && adminAuth) {
        try {
          await adminAuth.revokeRefreshTokens(user.legacyFirebaseUid)
          await adminAuth.deleteUser(user.legacyFirebaseUid)
        } catch (error: unknown) {
          const errorCode = typeof error === 'object' && error !== null && 'code' in error
            ? (error as { code?: unknown }).code
            : null
          if (errorCode !== 'auth/user-not-found') throw error
        }
      }
      await clerkApi!.users.deleteUser(user.authUid)
    } else {
      if (!adminAuth) throw new RequestError(500, 'Server configuration error')
      await adminAuth.revokeRefreshTokens(user.authUid)
      await adminAuth.deleteUser(user.authUid)

      const cookieStore = await cookies()
      cookieStore.set('session', '', {
        maxAge: 0,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      })
    }

    return NextResponse.json({ deleted: true }, { headers: noStoreHeaders })
  } catch (error) {
    if (error instanceof RequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status, headers: noStoreHeaders })
    }
    return NextResponse.json({ error: 'Unable to delete account data' }, { status: 500, headers: noStoreHeaders })
  }
}
