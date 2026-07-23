import 'server-only'

import { auth } from '@clerk/nextjs/server'
import { randomUUID } from 'crypto'
import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from '../firebase/admin'
import { RequestError, type SessionUser } from './serverAuth'
import { hasLifetimeAccess } from './lifetimeEntitlements'
import {
  createRoleplayUsageReleasePolicy,
  createRoleplayUsageReservationPolicy,
  RoleplayUsagePolicyError,
  type RoleplayPlanTier,
} from './roleplayUsagePolicy'

export interface RoleplayGenerationReservation {
  reservationId: string
  userUid: string
  tier: RoleplayPlanTier
  monthKey: string
}

async function getRoleplayPlanTier(user: SessionUser): Promise<RoleplayPlanTier> {
  if (await hasLifetimeAccess(user.uid)) return 'elite'
  if (user.provider !== 'clerk') return 'starter'

  const { has } = await auth()
  const elitePlan = process.env.CLERK_ELITE_PLAN_SLUG || 'elite'
  const championPlan = process.env.CLERK_CHAMPION_PLAN_SLUG || 'champion'

  if (has({ plan: elitePlan })) return 'elite'
  if (has({ plan: championPlan })) return 'champion'
  return 'starter'
}

export async function reserveRoleplayGeneration(
  user: SessionUser,
): Promise<RoleplayGenerationReservation> {
  if (!adminDb) throw new RequestError(500, 'Server configuration error')

  const tier = await getRoleplayPlanTier(user)
  const reservationId = randomUUID()
  const usageRef = adminDb.collection('users').doc(user.uid).collection('usage').doc('roleplay-generations')
  let monthKey = ''

  try {
    await adminDb.runTransaction(async transaction => {
      const snapshot = await transaction.get(usageRef)
      const policy = createRoleplayUsageReservationPolicy(
        tier,
        snapshot.data() || {},
      )
      monthKey = policy.monthKey

      transaction.set(usageRef, {
        ...policy.updates,
        currentTier: tier,
        lastReservationId: reservationId,
        lastReservedAt: FieldValue.serverTimestamp(),
      }, { merge: true })
    })
  } catch (error) {
    if (error instanceof RoleplayUsagePolicyError) {
      throw new RequestError(error.status, error.message)
    }
    throw error
  }

  return { reservationId, userUid: user.uid, tier, monthKey }
}

export async function releaseRoleplayGeneration(
  reservation: RoleplayGenerationReservation,
): Promise<void> {
  if (!adminDb) return
  const usageRef = adminDb.collection('users').doc(reservation.userUid).collection('usage').doc('roleplay-generations')

  await adminDb.runTransaction(async transaction => {
    const snapshot = await transaction.get(usageRef)
    if (!snapshot.exists) return
    const policy = createRoleplayUsageReleasePolicy(
      reservation.tier,
      reservation.monthKey,
      snapshot.data() || {},
    )
    const releasesLatestReservation =
      snapshot.data()?.lastReservationId === reservation.reservationId

    transaction.set(usageRef, {
      ...policy.updates,
      ...(releasesLatestReservation
        ? {
            lastReservationId: FieldValue.delete(),
            lastReservedAt: FieldValue.delete(),
          }
        : {}),
      lastReleasedAt: FieldValue.serverTimestamp(),
    }, { merge: true })
  })
}
