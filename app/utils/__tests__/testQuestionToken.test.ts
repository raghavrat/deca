jest.mock('server-only', () => ({}), { virtual: true })

import { getQuestionSigningSecret, issueQuestionToken, verifyQuestionToken } from '../testQuestionToken'

const secret = 'test-only-question-signing-secret-that-is-long-enough'

describe('signed practice-question tokens', () => {
  const originalSigningSecret = process.env.TEST_QUESTION_SIGNING_SECRET
  const originalFirebaseCredential = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64

  afterEach(() => {
    if (originalSigningSecret === undefined) delete process.env.TEST_QUESTION_SIGNING_SECRET
    else process.env.TEST_QUESTION_SIGNING_SECRET = originalSigningSecret

    if (originalFirebaseCredential === undefined) delete process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
    else process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 = originalFirebaseCredential
  })

  test('prefers a dedicated signing secret', () => {
    process.env.TEST_QUESTION_SIGNING_SECRET = secret
    process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 = 'server-only-firebase-credential'

    expect(getQuestionSigningSecret()).toBe(secret)
  })

  test('derives a stable signing key from the server credential when needed', () => {
    delete process.env.TEST_QUESTION_SIGNING_SECRET
    process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 = 'server-only-firebase-credential'

    const first = getQuestionSigningSecret()
    expect(first).toHaveLength(43)
    expect(getQuestionSigningSecret()).toBe(first)
    expect(first).not.toContain(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64)
  })

  test('accepts the signed question and correct answer', () => {
    const token = issueQuestionToken({ uid: 'user-1', question: 'Original question text', answerIndex: 2, ttlMs: 60_000 }, secret)
    expect(verifyQuestionToken(token, {
      uid: 'user-1',
      question: 'Original question text',
      selectedAnswer: 2,
    }, secret)).toMatchObject({ valid: true, correct: true })
  })

  test('distinguishes a valid incorrect answer', () => {
    const token = issueQuestionToken({ uid: 'user-1', question: 'Original question text', answerIndex: 2 }, secret)
    expect(verifyQuestionToken(token, {
      uid: 'user-1',
      question: 'Original question text',
      selectedAnswer: 1,
    }, secret)).toMatchObject({ valid: true, correct: false })
  })

  test('rejects tampering, another user, another question, and expiration', () => {
    const token = issueQuestionToken({ uid: 'user-1', question: 'Original question text', answerIndex: 2, ttlMs: 1 }, secret)
    expect(verifyQuestionToken(`${token}x`, { uid: 'user-1', question: 'Original question text', selectedAnswer: 2 }, secret).valid).toBe(false)
    expect(verifyQuestionToken(token, { uid: 'user-2', question: 'Original question text', selectedAnswer: 2 }, secret).valid).toBe(false)
    expect(verifyQuestionToken(token, { uid: 'user-1', question: 'Changed question text', selectedAnswer: 2 }, secret).valid).toBe(false)
    expect(verifyQuestionToken(token, {
      uid: 'user-1', question: 'Original question text', selectedAnswer: 2, now: Date.now() + 10_000,
    }, secret).valid).toBe(false)
  })
})
