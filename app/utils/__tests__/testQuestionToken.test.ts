jest.mock('server-only', () => ({}), { virtual: true })

import { issueQuestionToken, verifyQuestionToken } from '../testQuestionToken'

const secret = 'test-only-question-signing-secret-that-is-long-enough'

describe('signed practice-question tokens', () => {
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
