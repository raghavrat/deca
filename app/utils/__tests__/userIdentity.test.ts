import { isSafeExternalUserId, resolveClerkDataUid } from '../userIdentity'

describe('Clerk legacy identity mapping', () => {
  test('keeps a valid Firebase UID as the Firestore document key', () => {
    expect(resolveClerkDataUid('user_clerk123', 'firebase-user_123')).toBe('firebase-user_123')
  })

  test('uses the Clerk ID for new users', () => {
    expect(resolveClerkDataUid('user_clerk123', null)).toBe('user_clerk123')
  })

  test('rejects unsafe document IDs', () => {
    expect(isSafeExternalUserId('nested/user')).toBe(false)
    expect(resolveClerkDataUid('user_clerk123', 'nested/user')).toBe('user_clerk123')
  })
})
