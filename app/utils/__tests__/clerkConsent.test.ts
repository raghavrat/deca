import {
  getPendingClerkSignupConsent,
  hasCompletedClerkConsent,
  PRIVACY_POLICY_VERSION,
} from '../clerkConsent'

const acceptedAt = '2026-07-23T15:00:00.000Z'
const now = new Date('2026-07-23T15:01:00.000Z')

describe('Clerk consent state', () => {
  test('recognizes completed consent', () => {
    expect(hasCompletedClerkConsent(
      { age13Confirmed: true },
      new Date(acceptedAt),
    )).toBe(true)
  })

  test('returns a pending consent captured before Clerk signup', () => {
    expect(getPendingClerkSignupConsent({
      age13Confirmed: true,
      termsAcceptedAt: acceptedAt,
      privacyPolicyVersion: PRIVACY_POLICY_VERSION,
    }, null, now)).toEqual(new Date(acceptedAt))
  })

  test('does not auto-finalize a migrated account that requires consent', () => {
    expect(getPendingClerkSignupConsent({
      age13Confirmed: true,
      termsAcceptedAt: acceptedAt,
      privacyPolicyVersion: PRIVACY_POLICY_VERSION,
      migrationRequiresConsent: true,
    }, null, now)).toBeNull()
  })

  test('rejects incomplete, stale-policy, invalid, or future metadata', () => {
    expect(getPendingClerkSignupConsent({}, null, now)).toBeNull()
    expect(getPendingClerkSignupConsent({
      age13Confirmed: true,
      termsAcceptedAt: acceptedAt,
      privacyPolicyVersion: 'outdated',
    }, null, now)).toBeNull()
    expect(getPendingClerkSignupConsent({
      age13Confirmed: true,
      termsAcceptedAt: 'not-a-date',
      privacyPolicyVersion: PRIVACY_POLICY_VERSION,
    }, null, now)).toBeNull()
    expect(getPendingClerkSignupConsent({
      age13Confirmed: true,
      termsAcceptedAt: '2026-07-23T15:07:00.000Z',
      privacyPolicyVersion: PRIVACY_POLICY_VERSION,
    }, null, now)).toBeNull()
  })
})
