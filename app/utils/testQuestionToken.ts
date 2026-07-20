import 'server-only'

import { createHash, createHmac, randomUUID, timingSafeEqual } from 'crypto'

interface QuestionTokenPayload {
  version: 1
  id: string
  uid: string
  questionDigest: string
  answerIndex: number
  expiresAt: number
}

const base64url = (value: string | Buffer) => Buffer.from(value).toString('base64url')

export function getQuestionSigningSecret(): string {
  const secret = process.env.TEST_QUESTION_SIGNING_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('TEST_QUESTION_SIGNING_SECRET must contain at least 32 characters')
  }
  return secret
}

export function digestQuestion(question: string): string {
  return createHash('sha256').update(question.trim().replace(/\s+/g, ' ')).digest('base64url')
}

export function issueQuestionToken(
  input: { uid: string; question: string; answerIndex: number; ttlMs?: number },
  secret = getQuestionSigningSecret(),
): string {
  const payload: QuestionTokenPayload = {
    version: 1,
    id: randomUUID(),
    uid: input.uid,
    questionDigest: digestQuestion(input.question),
    answerIndex: input.answerIndex,
    expiresAt: Date.now() + (input.ttlMs || 30 * 60 * 1000),
  }
  const encoded = base64url(JSON.stringify(payload))
  const signature = createHmac('sha256', secret).update(encoded).digest('base64url')
  return `${encoded}.${signature}`
}

export function verifyQuestionToken(
  token: string,
  input: { uid: string; question: string; selectedAnswer: number; now?: number },
  secret = getQuestionSigningSecret(),
): { valid: boolean; correct: boolean; tokenId?: string } {
  try {
    const [encoded, suppliedSignature, extra] = token.split('.')
    if (!encoded || !suppliedSignature || extra) return { valid: false, correct: false }
    const expectedSignature = createHmac('sha256', secret).update(encoded).digest('base64url')
    const supplied = Buffer.from(suppliedSignature)
    const expected = Buffer.from(expectedSignature)
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
      return { valid: false, correct: false }
    }
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as QuestionTokenPayload
    const now = input.now || Date.now()
    if (payload.version !== 1 || payload.uid !== input.uid || payload.expiresAt < now ||
        payload.questionDigest !== digestQuestion(input.question) ||
        !Number.isInteger(payload.answerIndex) || payload.answerIndex < 0 || payload.answerIndex > 3) {
      return { valid: false, correct: false }
    }
    return {
      valid: true,
      correct: payload.answerIndex === input.selectedAnswer,
      tokenId: payload.id,
    }
  } catch {
    return { valid: false, correct: false }
  }
}
