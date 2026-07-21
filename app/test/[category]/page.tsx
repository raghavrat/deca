'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface PracticeQuestion {
  id: string
  text: string
  answers: Array<{ text: string }>
  explanation: string
  answerType: number
  category: string
  categoryLabel: string
  examFamily: string
  instructionalArea: string
  stemForm: string
  learningObjective: string
  difficulty: 'foundational' | 'intermediate' | 'advanced'
  questionToken: string | null
  provenance: {
    kind: 'first-party-authored'
    bankVersion: string
    blueprintId: string
  }
}

type PageProps = {
  params: Promise<{ category: string }>
  searchParams: Promise<{ count?: string }>
}

export default function TestPage({ params, searchParams }: PageProps) {
  const { user } = useAuth()
  const [category, setCategory] = useState('')
  const [questions, setQuestions] = useState<PracticeQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [setSize, setSetSize] = useState(10)
  const [correctCount, setCorrectCount] = useState(0)

  const loadSet = useCallback(async (requestedCategory: string, requestedCount: number) => {
    setLoading(true)
    setError(null)
    setQuestions([])
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowResults(false)
    setCorrectCount(0)

    try {
      const response = await fetch('/api/test/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: requestedCategory, count: requestedCount }),
      })
      const contentType = response.headers.get('content-type') || ''
      const data: unknown = contentType.includes('application/json') ? await response.json() : null
      const payload = typeof data === 'object' && data !== null
        ? data as { error?: unknown; questions?: unknown }
        : null

      if (!response.ok) {
        const apiError = typeof payload?.error === 'string' ? payload.error : null
        throw new Error(apiError || 'The practice service is temporarily unavailable.')
      }
      if (!Array.isArray(payload?.questions) || payload.questions.length === 0) {
        throw new Error('No questions were returned.')
      }

      setSetSize(requestedCount)
      setQuestions(payload.questions as PracticeQuestion[])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load a practice set.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const initialize = async () => {
      const [resolved, query] = await Promise.all([params, searchParams])
      const requestedCategory = resolved.category.toUpperCase().replaceAll('-', '_')
      const requestedCount = query.count === '100' ? 100 : 10
      setCategory(requestedCategory)
      await loadSet(requestedCategory, requestedCount)
    }
    void initialize()
  }, [params, searchParams, loadSet])

  const recordAttempt = async (question: PracticeQuestion, selected: number) => {
    if (!user || !question.questionToken) return

    const statsKey = `questionStats_${user.uid}`
    const existingStats = localStorage.getItem(statsKey)
    const stats = existingStats ? JSON.parse(existingStats) : {
      totalQuestions: 0,
      byCategory: {},
      lastAttempt: null,
      streak: 0,
    }

    stats.totalQuestions += 1
    stats.byCategory[category] = typeof stats.byCategory[category] === 'object'
      ? { ...stats.byCategory[category], total: (stats.byCategory[category].total || 0) + 1 }
      : (stats.byCategory[category] || 0) + 1

    const today = new Date().toDateString()
    const lastAttemptDate = stats.lastAttempt ? new Date(stats.lastAttempt).toDateString() : null
    if (lastAttemptDate !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      stats.streak = lastAttemptDate === yesterday.toDateString() ? (stats.streak || 0) + 1 : 1
    }

    stats.lastAttempt = new Date().toISOString()
    localStorage.setItem(statsKey, JSON.stringify(stats))

    if (selected === question.answerType) {
      try {
        await fetch('/api/account/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: question.text,
            questionToken: question.questionToken,
            selectedAnswer: selected,
          }),
        })
      } catch {
        // Keep the local result if progress sync is temporarily unavailable.
      }
    }
  }

  const currentQuestion = questions[currentIndex]

  const handleSubmit = () => {
    if (selectedAnswer === null || !currentQuestion) return
    if (selectedAnswer === currentQuestion.answerType) {
      setCorrectCount(count => count + 1)
    }
    setShowResults(true)
    void recordAttempt(currentQuestion, selectedAnswer)
  }

  const nextQuestion = () => {
    setSelectedAnswer(null)
    setShowResults(false)
    setCurrentIndex(index => index + 1)
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center" role="status">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-black dark:border-white" />
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Loading questions</p>
        </div>
      </main>
    )
  }

  if (error || !currentQuestion) {
    const completed = questions.length > 0 && currentIndex >= questions.length

    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-xl border border-neutral-300 p-8 text-center dark:border-neutral-700">
          <h1 className="mb-4 text-3xl font-light">
            {completed ? 'Set complete' : 'Could not load this set'}
          </h1>
          <p className="mb-6 text-neutral-600 dark:text-neutral-400">
            {completed ? `${correctCount} correct out of ${questions.length}` : error}
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void loadSet(category, setSize)}
              className="border border-black bg-black px-6 py-3 text-white hover:bg-transparent hover:text-black dark:border-white dark:bg-white dark:text-black dark:hover:bg-transparent dark:hover:text-white"
            >
              New set
            </button>
            <Link href="/test" className="border border-neutral-300 px-6 py-3 dark:border-neutral-700">
              Practice tests
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <Link href="/test" className="mb-6 inline-flex items-center text-sm hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          Practice tests
        </Link>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-light text-black dark:text-white">
              {currentQuestion.categoryLabel}
            </h1>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Question {currentIndex + 1} of {questions.length} · {currentQuestion.difficulty} · {correctCount} correct
            </p>
          </div>
          <div className="inline-flex items-center text-xs text-neutral-600 dark:text-neutral-400">
            <ShieldCheck className="mr-2 h-4 w-4" aria-hidden="true" />
            Original question bank
          </div>
        </div>

        <section className="mb-6 border border-neutral-300 bg-white p-6 dark:border-neutral-700 dark:bg-black" aria-labelledby="question-heading">
          <p className="mb-3 text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {currentQuestion.instructionalArea}
          </p>
          <h2 id="question-heading" className="mb-6 text-xl font-light text-black dark:text-white">
            {currentQuestion.text}
          </h2>

          <div className="space-y-4">
            {currentQuestion.answers.map((answer, index) => {
              const isCorrect = showResults && currentQuestion.answerType === index
              const isIncorrectSelection = showResults && selectedAnswer === index && !isCorrect

              return (
                <button
                  key={`${currentQuestion.id}-${index}`}
                  type="button"
                  onClick={() => !showResults && setSelectedAnswer(index)}
                  disabled={showResults}
                  aria-pressed={selectedAnswer === index}
                  className={`w-full border p-4 text-left transition-colors duration-200 focus:outline-none ${isCorrect
                    ? 'border-green-700 bg-green-700 text-white'
                    : isIncorrectSelection
                      ? 'border-red-700 bg-red-700 text-white'
                      : selectedAnswer === index
                        ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                        : 'border-neutral-300 bg-white text-black hover:border-black dark:border-neutral-700 dark:bg-black dark:text-white dark:hover:border-white'
                  }`}
                >
                  <span className="mr-2 font-medium">{String.fromCharCode(65 + index)}.</span>
                  {answer.text}
                  {isCorrect && <span className="sr-only"> Correct answer</span>}
                  {isIncorrectSelection && <span className="sr-only"> Incorrect answer</span>}
                </button>
              )
            })}
          </div>

          {showResults && (
            <div className="mt-6 border-t border-neutral-300 pt-5 dark:border-neutral-700" aria-live="polite">
              <h3 className="mb-2 font-medium">Explanation</h3>
              <p className="leading-7 text-neutral-700 dark:text-neutral-300">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </section>

        {!showResults ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="w-full border border-black bg-black px-6 py-4 text-sm font-medium text-white transition-colors hover:bg-transparent hover:text-black disabled:cursor-not-allowed disabled:opacity-50 dark:border-white dark:bg-white dark:text-black dark:hover:bg-transparent dark:hover:text-white"
          >
            Check answer
          </button>
        ) : (
          <button
            type="button"
            onClick={nextQuestion}
            className="w-full border border-neutral-300 bg-white px-6 py-4 text-sm font-medium text-black transition-colors hover:border-black dark:border-neutral-700 dark:bg-black dark:text-white dark:hover:border-white"
          >
            {currentIndex + 1 === questions.length ? 'View results' : 'Next question'}
          </button>
        )}

        <p className="mt-5 text-center text-xs text-neutral-500 dark:text-neutral-400">
          Independent practice. Not affiliated with or endorsed by DECA Inc. or MBA Research.
        </p>
      </div>
    </main>
  )
}
