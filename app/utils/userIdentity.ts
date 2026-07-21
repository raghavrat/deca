const MAX_EXTERNAL_ID_LENGTH = 128

export function isSafeExternalUserId(value: unknown): value is string {
  return typeof value === 'string' &&
    value.length > 0 &&
    value.length <= MAX_EXTERNAL_ID_LENGTH &&
    !value.includes('/')
}
export function resolveClerkDataUid(clerkUserId: string, externalId: unknown): string {
  return isSafeExternalUserId(externalId) ? externalId : clerkUserId
}
