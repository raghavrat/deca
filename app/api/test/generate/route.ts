import { NextRequest, NextResponse } from 'next/server'
import { type TestCategory } from '../../../data/testBlueprints'
import {
  getAuthoredPracticeQuestions,
  getPracticeQuestionBlueprint,
  type AuthoredPracticeQuestion,
} from '../../../data/practiceQuestionBank'
import { RequestError, requireSameOrigin, requireSession } from '../../../utils/serverAuth'
import { issueQuestionToken } from '../../../utils/testQuestionToken'

const categories = new Set<TestCategory>(['MANAGEMENT', 'MARKETING', 'FINANCE', 'HOSPITALITY', 'ENTREPRENEURSHIP'])
const QUESTION_BANK_VERSION = '2026-07-20'

function shuffled<T>(items: readonly T[]): T[] {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
  }
  return copy
}

function shuffledAnswers(question: AuthoredPracticeQuestion) {
  const entries = shuffled(question.answers.map((text, originalIndex) => ({ text, originalIndex })))
  return {
    answers: entries.map(({ text }) => ({ text })),
    answerType: entries.findIndex(entry => entry.originalIndex === question.correctAnswer),
  }
}

export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request)
    const user = await requireSession()

    const body: unknown = await request.json()
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { category: rawCategory, count: rawCount } = body as Record<string, unknown>
    const category = typeof rawCategory === 'string' ? rawCategory.toUpperCase() as TestCategory : null
    const count = typeof rawCount === 'number' && Number.isInteger(rawCount) ? rawCount : 8
    if (!category || !categories.has(category) || count < 4 || count > 10) {
      return NextResponse.json({ error: 'Invalid category or question count' }, { status: 400 })
    }

    if (!process.env.TEST_QUESTION_SIGNING_SECRET || process.env.TEST_QUESTION_SIGNING_SECRET.length < 32) {
      return NextResponse.json({ error: 'Question verification is not configured' }, { status: 500 })
    }

    const available = getAuthoredPracticeQuestions(category)
    if (available.length < count) {
      return NextResponse.json({ error: 'This practice category does not have enough reviewed questions' }, { status: 500 })
    }

    const questions = shuffled(available).slice(0, count).map(question => {
      const blueprint = getPracticeQuestionBlueprint(question.blueprintId)
      if (!blueprint) throw new Error(`Unknown practice-question blueprint: ${question.blueprintId}`)

      const answerSet = shuffledAnswers(question)
      return {
        id: question.id,
        text: question.text,
        answers: answerSet.answers,
        explanation: question.explanation,
        answerType: answerSet.answerType,
        category,
        learningObjective: blueprint.learningObjective,
        difficulty: question.difficulty,
        questionToken: issueQuestionToken({
          uid: user.uid,
          question: question.text,
          answerIndex: answerSet.answerType,
        }),
        provenance: {
          kind: 'first-party-authored',
          bankVersion: QUESTION_BANK_VERSION,
          blueprintId: question.blueprintId,
        },
      }
    })

    return NextResponse.json({
      questions,
      notice: 'Original Deca Pal-authored unofficial practice; not copied from or endorsed by DECA Inc.',
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    if (error instanceof RequestError) return NextResponse.json({ error: error.message }, { status: error.status })
    console.error('Practice question selection failed', error instanceof Error ? error.message : 'unknown error')
    return NextResponse.json({ error: 'Unable to load a practice set' }, { status: 500 })
  }
}
