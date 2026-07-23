import {
  createRoleplayUsageReleasePolicy,
  createRoleplayUsageReservationPolicy,
  ROLEPLAY_GENERATION_COOLDOWN_MS,
  RoleplayUsagePolicyError,
} from '../roleplayUsagePolicy'

const now = new Date('2026-07-23T15:00:00.000Z')

function expectPolicyError(
  action: () => unknown,
  status: 402 | 429,
): RoleplayUsagePolicyError {
  try {
    action()
  } catch (error) {
    expect(error).toBeInstanceOf(RoleplayUsagePolicyError)
    expect((error as RoleplayUsagePolicyError).status).toBe(status)
    return error as RoleplayUsagePolicyError
  }
  throw new Error('Expected roleplay usage policy to reject the reservation')
}

describe('roleplay usage policy', () => {
  test('blocks Starter after two lifetime generations', () => {
    const second = createRoleplayUsageReservationPolicy(
      'starter',
      { starterLifetimeCount: 1, totalLifetimeCount: 1 },
      now,
    )
    expect(second.updates.starterLifetimeCount).toBe(2)

    expectPolicyError(
      () => createRoleplayUsageReservationPolicy(
        'starter',
        { starterLifetimeCount: 2, totalLifetimeCount: 2 },
        now,
      ),
      402,
    )
  })

  test('blocks Champion at 100 and resets its counter in a new month', () => {
    const hundredth = createRoleplayUsageReservationPolicy(
      'champion',
      { championMonthKey: '2026-07', championMonthCount: 99 },
      now,
    )
    expect(hundredth.updates.championMonthCount).toBe(100)

    expectPolicyError(
      () => createRoleplayUsageReservationPolicy(
        'champion',
        { championMonthKey: '2026-07', championMonthCount: 100 },
        now,
      ),
      402,
    )

    const nextMonth = createRoleplayUsageReservationPolicy(
      'champion',
      { championMonthKey: '2026-07', championMonthCount: 100 },
      new Date('2026-08-01T00:00:00.000Z'),
    )
    expect(nextMonth.updates.championMonthCount).toBe(1)
  })

  test('keeps plan counters isolated when an account changes plans', () => {
    const champion = createRoleplayUsageReservationPolicy(
      'champion',
      {
        starterLifetimeCount: 2,
        championMonthKey: '2026-07',
        championMonthCount: 41,
      },
      now,
    )
    expect(champion.updates.championMonthCount).toBe(42)
    expect(champion.updates.starterLifetimeCount).toBeUndefined()
  })

  test('tracks Elite usage without imposing a numeric generation cap', () => {
    const elite = createRoleplayUsageReservationPolicy(
      'elite',
      { eliteMonthKey: '2026-07', eliteMonthCount: 4_000 },
      now,
    )
    expect(elite.updates.eliteMonthCount).toBe(4_001)
  })

  test.each(['starter', 'champion', 'elite'] as const)(
    'enforces the durable fair-use cooldown for the %s plan',
    tier => {
      const error = expectPolicyError(
        () => createRoleplayUsageReservationPolicy(
          tier,
          {
            lastReservedAt: {
              toMillis: () => now.getTime() - 30_000,
            },
          },
          now,
        ),
        429,
      )
      expect(error.timeRemaining).toBe(
        Math.ceil((ROLEPLAY_GENERATION_COOLDOWN_MS - 30_000) / 1000),
      )
    },
  )

  test('honors legacy counters while migrating usage documents', () => {
    expectPolicyError(
      () => createRoleplayUsageReservationPolicy(
        'starter',
        { lifetimeCount: 2 },
        now,
      ),
      402,
    )

    const champion = createRoleplayUsageReservationPolicy(
      'champion',
      { monthKey: '2026-07', monthCount: 27 },
      now,
    )
    expect(champion.updates.championMonthCount).toBe(28)
  })

  test('releases only the reserved plan bucket after an upstream failure', () => {
    const release = createRoleplayUsageReleasePolicy(
      'champion',
      '2026-07',
      {
        totalLifetimeCount: 12,
        starterLifetimeCount: 2,
        championMonthKey: '2026-07',
        championMonthCount: 10,
      },
    )
    expect(release.updates).toEqual({
      totalLifetimeCount: 11,
      championMonthCount: 9,
    })
  })
})
