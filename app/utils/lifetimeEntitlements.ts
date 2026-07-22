import 'server-only'

import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from '../firebase/admin'

interface LifetimePurchaseDetails {
  checkoutSessionId: string
  paymentIntentId: string | null
  amountTotal: number | null
  currency: string | null
}

export async function hasLifetimeAccess(userUid: string): Promise<boolean> {
  if (!adminDb) throw new Error('Firebase Admin is not configured')
  const snapshot = await adminDb.collection('users').doc(userUid).get()
  const lifetime = snapshot.get('billing.lifetime')
  return typeof lifetime === 'object' && lifetime !== null && lifetime.active === true
}

export async function grantLifetimeAccess(
  userUid: string,
  details: LifetimePurchaseDetails,
): Promise<void> {
  if (!adminDb) throw new Error('Firebase Admin is not configured')

  await adminDb.collection('users').doc(userUid).set({
    billing: {
      lifetime: {
        active: true,
        checkoutSessionId: details.checkoutSessionId,
        paymentIntentId: details.paymentIntentId,
        amountTotal: details.amountTotal,
        currency: details.currency,
        purchasedAt: FieldValue.serverTimestamp(),
        revokedAt: null,
      },
    },
  }, { merge: true })
}

export async function revokeLifetimeAccess(
  userUid: string,
  reason: 'refunded' | 'disputed',
): Promise<void> {
  if (!adminDb) throw new Error('Firebase Admin is not configured')

  const userRef = adminDb.collection('users').doc(userUid)
  if (!(await userRef.get()).exists) return

  await userRef.set({
    billing: {
      lifetime: {
        active: false,
        revokedAt: FieldValue.serverTimestamp(),
        revocationReason: reason,
      },
    },
  }, { merge: true })
}
