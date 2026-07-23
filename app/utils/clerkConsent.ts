export const PRIVACY_POLICY_VERSION = '2026-07-20'

type ClerkConsentMetadata = Record<string, unknown> | null | undefined

export function hasCompletedClerkConsent(
  metadata: ClerkConsentMetadata,
  legalAcceptedAt: Date | number | null | undefined,
): boolean {
  return metadata?.age13Confirmed === true && legalAcceptedAt != null
}

export function getPendingClerkSignupConsent(
  metadata: ClerkConsentMetadata,
  legalAcceptedAt: Date | number | null | undefined,
  now = new Date(),
): Date | null {
  if (
    legalAcceptedAt != null ||
    metadata?.age13Confirmed !== true ||
    metadata.migrationRequiresConsent === true ||
    metadata.privacyPolicyVersion !== PRIVACY_POLICY_VERSION ||
    typeof metadata.termsAcceptedAt !== 'string'
  ) {
    return null
  }

  const acceptedAt = new Date(metadata.termsAcceptedAt)
  if (
    Number.isNaN(acceptedAt.getTime()) ||
    acceptedAt.getTime() > now.getTime() + 5 * 60 * 1000
  ) {
    return null
  }

  return acceptedAt
}
