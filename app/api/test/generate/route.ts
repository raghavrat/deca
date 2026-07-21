import { NextRequest, NextResponse } from 'next/server'
import {
  TEST_CATEGORIES,
  TEST_CATEGORY_LABELS,
  isTestCategory,
  type TestCategory,
} from '../../../data/testBlueprints'
import {
  getAuthoredPracticeQuestions,
  getPracticeQuestionBlueprint,
  PRACTICE_QUESTION_BANK_VERSION,
  selectAuthoredPracticeQuestions,
  type AuthoredPracticeQuestion,
} from '../../../data/practiceQuestionBank'
import { RequestError, requireSameOrigin, requireSession } from '../../../utils/serverAuth'
import { getQuestionSigningSecret, issueQuestionToken } from '../../../utils/testQuestionToken'

const categories = new Set<TestCategory>(TEST_CATEGORIES)

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
    const normalizedCategory = typeof rawCategory === 'string'
      ? rawCategory.trim().toUpperCase().replaceAll('-', '_')
      : ''
    const category = isTestCategory(normalizedCategory) ? normalizedCategory : null
    const count = typeof rawCount === 'number' && Number.isInteger(rawCount) ? rawCount : 10
    if (!category || !categories.has(category) || count < 4 || count > 100) {
      return NextResponse.json({ error: 'Invalid category or question count' }, { status: 400 })
    }

    let signingSecret: string | null = null
    try {
      signingSecret = getQuestionSigningSecret()
    } catch {
      // Public practice remains available; only signed progress verification is disabled.
    }

    const available = getAuthoredPracticeQuestions(category)
    if (available.length < count) {
      return NextResponse.json({ error: 'This practice category does not have enough validated questions' }, { status: 500 })
    }

    const questions = selectAuthoredPracticeQuestions(category, count).map(question => {
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
        categoryLabel: TEST_CATEGORY_LABELS[category],
        examFamily: question.examFamily,
        instructionalArea: question.instructionalArea,
        stemForm: question.stemForm,
        learningObjective: blueprint.learningObjective,
        difficulty: question.difficulty,
        questionToken: signingSecret
          ? issueQuestionToken({
              uid: user.uid,
              question: question.text,
              answerIndex: answerSet.answerType,
            }, signingSecret)
          : null,
        provenance: {
          kind: 'first-party-authored',
          bankVersion: PRACTICE_QUESTION_BANK_VERSION,
          blueprintId: question.blueprintId,
        },
      }
    })

    return NextResponse.json({
      questions,
      bankSize: 7_000,
      categoryBankSize: available.length,
      notice: 'Selected from a fixed, independently authored practice bank; not an official exam or endorsed by DECA Inc. or MBA Research.',
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    if (error instanceof RequestError) return NextResponse.json({ error: error.message }, { status: error.status })
    console.error('Practice question selection failed', error instanceof Error ? error.message : 'unknown error')
    return NextResponse.json({ error: 'Unable to load a practice set' }, { status: 500 })
  }
}
