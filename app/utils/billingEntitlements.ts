import 'server-only'

import { auth } from '@clerk/nextjs/server'
import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from '../firebase/admin'
import { RequestError, type SessionUser } from './serverAuth'
import { hasLifetimeAccess } from './lifetimeEntitlements'

type ClerkPlanTier = 'starter' | 'champion' | 'elite'

export interface RoleplayGenerationReservation {
  userUid: string
  tier: Exclude<ClerkPlanTier, 'elite'>
  monthKey: string
}

const STARTER_LIFETIME_LIMIT = 2
const CHAMPION_MONTHLY_LIMIT = 100

function currentMonthKey(): string {
  return new Date().toISOString().slice(0, 7)
}

async function getClerkPlanTier(user: SessionUser): Promise<ClerkPlanTier> {
  if (await hasLifetimeAccess(user.uid)) return 'elite'

  const { has } = await auth()
  const elitePlan = process.env.CLERK_ELITE_PLAN_SLUG || 'elite'
  const championPlan = process.env.CLERK_CHAMPION_PLAN_SLUG || 'champion'

  if (has({ plan: elitePlan })) return 'elite'
  if (has({ plan: championPlan })) return 'champion'
  return 'starter'
}

export async function reserveRoleplayGeneration(
  user: SessionUser,
): Promise<RoleplayGenerationReservation | null> {
  // Firebase remains unchanged during migration. Clerk plan limits begin only
  // after the explicit provider cutover.
  if (user.provider !== 'clerk') return null
  if (!adminDb) throw new RequestError(500, 'Server configuration error')

  const tier = await getClerkPlanTier(user)
  if (tier === 'elite') return null

  const monthKey = currentMonthKey()
  const usageRef = adminDb.collection('users').doc(user.uid).collection('usage').doc('roleplay-generations')

  await adminDb.runTransaction(async transaction => {
    const snapshot = await transaction.get(usageRef)
    const data = snapshot.data() || {}
    const lifetimeCount = typeof data.lifetimeCount === 'number' ? data.lifetimeCount : 0
    const savedMonthKey = typeof data.monthKey === 'string' ? data.monthKey : monthKey
    const savedMonthCount = typeof data.monthCount === 'number' ? data.monthCount : 0
    const monthCount = savedMonthKey === monthKey ? savedMonthCount : 0

    if (tier === 'starter' && lifetimeCount >= STARTER_LIFETIME_LIMIT) {
      throw new RequestError(402, 'Your two Starter roleplays have been used. Choose a plan to keep practicing.')
    }
    if (tier === 'champion' && monthCount >= CHAMPION_MONTHLY_LIMIT) {
      throw new RequestError(402, 'Your Champion roleplay allowance resets next month.')
    }

    transaction.set(usageRef, {
      lifetimeCount: lifetimeCount + 1,
      monthKey,
      monthCount: monthCount + 1,
      lastReservedAt: FieldValue.serverTimestamp(),
    }, { merge: true })
  })

  return { userUid: user.uid, tier, monthKey }
}

export async function releaseRoleplayGeneration(
  reservation: RoleplayGenerationReservation,
): Promise<void> {
  if (!adminDb) return
  const usageRef = adminDb.collection('users').doc(reservation.userUid).collection('usage').doc('roleplay-generations')

  await adminDb.runTransaction(async transaction => {
    const snapshot = await transaction.get(usageRef)
    if (!snapshot.exists) return
    const data = snapshot.data() || {}
    const lifetimeCount = typeof data.lifetimeCount === 'number' ? data.lifetimeCount : 0
    const monthCount = data.monthKey === reservation.monthKey && typeof data.monthCount === 'number'
      ? data.monthCount
      : 0

    transaction.set(usageRef, {
      lifetimeCount: Math.max(0, lifetimeCount - 1),
      ...(data.monthKey === reservation.monthKey
        ? { monthCount: Math.max(0, monthCount - 1) }
        : {}),
      lastReleasedAt: FieldValue.serverTimestamp(),
    }, { merge: true })
  })
}
