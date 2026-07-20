import { FieldValue } from 'firebase-admin/firestore'
import { NextResponse } from 'next/server'
import { adminDb } from '../../../firebase/admin'
import { RateLimiter } from '../../../utils/rateLimiter'
import { RequestError, requireSameOrigin, requireSession } from '../../../utils/serverAuth'
import { verifyQuestionToken } from '../../../utils/testQuestionToken'

const progressRateLimiter = new RateLimiter(2_000)

export async function POST(request: Request) {
  try {
    requireSameOrigin(request)
    const user = await requireSession()
    const rateLimitKey = `user:${user.uid}`
    const limit = progressRateLimiter.checkIdentifier(rateLimitKey)
    if (!limit.allowed) {
      return NextResponse.json({ error: 'Please wait before submitting another answer' }, { status: 429 })
    }

    const body: unknown = await request.json()
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid answer' }, { status: 400 })
    }
    const { question, questionToken, selectedAnswer } = body as {
      question?: unknown
      questionToken?: unknown
      selectedAnswer?: unknown
    }
    if (typeof question !== 'string' || question.length > 2_000 ||
        typeof questionToken !== 'string' || questionToken.length > 4_000 ||
        !Number.isInteger(selectedAnswer) || Number(selectedAnswer) < 0 || Number(selectedAnswer) > 3) {
      return NextResponse.json({ error: 'Invalid answer' }, { status: 400 })
    }

    const verification = verifyQuestionToken(questionToken, {
      uid: user.uid,
      question,
      selectedAnswer: Number(selectedAnswer),
    })
    if (!verification.valid) {
      return NextResponse.json({ error: 'Question verification failed' }, { status: 400 })
    }
    if (!verification.correct) {
      return NextResponse.json({ correct: false }, { status: 400 })
    }
    if (!adminDb) throw new RequestError(500, 'Server configuration error')

    progressRateLimiter.recordIdentifier(rateLimitKey)
    await adminDb.collection('users').doc(user.uid).update({
      problemsCompleted: FieldValue.increment(1),
    })

    return NextResponse.json({ correct: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    if (error instanceof RequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Unable to update progress' }, { status: 500 })
  }
}
