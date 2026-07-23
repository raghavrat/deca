export type RoleplayPlanTier = 'starter' | 'champion' | 'elite'

export const ROLEPLAY_PLAN_LIMITS = {
  starter: {
    limit: 2,
    period: 'lifetime',
  },
  champion: {
    limit: 100,
    period: 'month',
  },
  elite: {
    limit: null,
    period: 'month',
  },
} as const

export const ROLEPLAY_GENERATION_COOLDOWN_MS = 5 * 60 * 1000

export interface RoleplayUsageReservationPolicy {
  monthKey: string
  updates: Record<string, number | string>
}

export interface RoleplayUsageReleasePolicy {
  updates: Record<string, number>
}

export class RoleplayUsagePolicyError extends Error {
  constructor(
    public readonly status: 402 | 429,
    message: string,
    public readonly timeRemaining?: number,
  ) {
    super(message)
    this.name = 'RoleplayUsagePolicyError'
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

function count(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : 0
}

function timestampMillis(value: unknown): number | null {
  if (value instanceof Date) return value.getTime()
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (
    typeof value === 'object' &&
    value !== null &&
    'toMillis' in value &&
    typeof value.toMillis === 'function'
  ) {
    const milliseconds = value.toMillis()
    return typeof milliseconds === 'number' && Number.isFinite(milliseconds)
      ? milliseconds
      : null
  }
  return null
}

export function roleplayMonthKey(now = new Date()): string {
  return now.toISOString().slice(0, 7)
}

export function createRoleplayUsageReservationPolicy(
  tier: RoleplayPlanTier,
  data: Record<string, unknown>,
  now = new Date(),
): RoleplayUsageReservationPolicy {
  const monthKey = roleplayMonthKey(now)
  const lastReservedAt = timestampMillis(data.lastReservedAt)
  if (
    lastReservedAt !== null &&
    now.getTime() - lastReservedAt < ROLEPLAY_GENERATION_COOLDOWN_MS
  ) {
    const timeRemaining = Math.max(
      1,
      Math.ceil(
        (ROLEPLAY_GENERATION_COOLDOWN_MS - (now.getTime() - lastReservedAt)) / 1000,
      ),
    )
    throw new RoleplayUsagePolicyError(
      429,
      'Please wait before generating another roleplay.',
      timeRemaining,
    )
  }

  const totalLifetimeCount = count(
    data.totalLifetimeCount ?? data.lifetimeCount,
  )
  const updates: Record<string, number | string> = {
    schemaVersion: 2,
    totalLifetimeCount: totalLifetimeCount + 1,
  }

  if (tier === 'starter') {
    const starterLifetimeCount = count(
      data.starterLifetimeCount ?? data.lifetimeCount,
    )
    if (starterLifetimeCount >= ROLEPLAY_PLAN_LIMITS.starter.limit) {
      throw new RoleplayUsagePolicyError(
        402,
        'Your two Starter roleplays have been used. Choose a plan to keep practicing.',
      )
    }
    updates.starterLifetimeCount = starterLifetimeCount + 1
  }

  if (tier === 'champion') {
    const savedMonthKey = typeof data.championMonthKey === 'string'
      ? data.championMonthKey
      : data.monthKey
    const savedMonthCount = data.championMonthCount ?? data.monthCount
    const championMonthCount = savedMonthKey === monthKey
      ? count(savedMonthCount)
      : 0
    if (championMonthCount >= ROLEPLAY_PLAN_LIMITS.champion.limit) {
      throw new RoleplayUsagePolicyError(
        402,
        'Your Champion roleplay allowance resets next month.',
      )
    }
    updates.championMonthKey = monthKey
    updates.championMonthCount = championMonthCount + 1
  }

  if (tier === 'elite') {
    const eliteMonthCount = data.eliteMonthKey === monthKey
      ? count(data.eliteMonthCount)
      : 0
    updates.eliteMonthKey = monthKey
    updates.eliteMonthCount = eliteMonthCount + 1
  }

  return { monthKey, updates }
}

export function createRoleplayUsageReleasePolicy(
  tier: RoleplayPlanTier,
  monthKey: string,
  data: Record<string, unknown>,
): RoleplayUsageReleasePolicy {
  const updates: Record<string, number> = {
    totalLifetimeCount: Math.max(0, count(data.totalLifetimeCount) - 1),
  }

  if (tier === 'starter') {
    updates.starterLifetimeCount = Math.max(
      0,
      count(data.starterLifetimeCount) - 1,
    )
  }
  if (tier === 'champion' && data.championMonthKey === monthKey) {
    updates.championMonthCount = Math.max(
      0,
      count(data.championMonthCount) - 1,
    )
  }
  if (tier === 'elite' && data.eliteMonthKey === monthKey) {
    updates.eliteMonthCount = Math.max(
      0,
      count(data.eliteMonthCount) - 1,
    )
  }

  return { updates }
}
