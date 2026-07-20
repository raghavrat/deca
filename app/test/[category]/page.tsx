'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface PracticeQuestion {
  id: string
  text: string
  answers: Array<{ text: string }>
  explanation: string
  answerType: number
  category: string
  learningObjective: string
  difficulty: 'foundational' | 'intermediate' | 'advanced'
  questionToken: string
  provenance: {
    kind: 'first-party-authored'
    bankVersion: string
    blueprintId: string
  }
}
type PageProps = {
  params: Promise<{ category: string }>
}

export default function TestPage({ params }: PageProps) {
  const { user, loading: authLoading } = useAuth()
  const [category, setCategory] = useState('')
  const [questions, setQuestions] = useState<PracticeQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const generateSet = async (requestedCategory: string) => {
    setLoading(true)
    setError(null)
    setQuestions([])
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowResults(false)
    try {
      const response = await fetch('/api/test/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: requestedCategory, count: 8 }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to generate a practice set')
      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('No original questions were returned')
      }
      setQuestions(data.questions)
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : 'Unable to generate a practice set')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authLoading) return

    const initialize = async () => {
      const resolved = await params
      const requestedCategory = resolved.category.toUpperCase()
      setCategory(requestedCategory)
      if (user) {
        await generateSet(requestedCategory)
      } else {
        setLoading(false)
        setError('Please sign in to start a practice set')
      }
    }
    void initialize()
  }, [authLoading, params, user])

  const recordAttempt = async (question: PracticeQuestion, selected: number) => {
    if (!user) return
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
        // The local practice result remains usable if progress sync is temporarily unavailable.
      }
    }
  }

  const currentQuestion = questions[currentIndex]
  const handleSubmit = () => {
    if (selectedAnswer === null || !currentQuestion) return
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
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" aria-hidden="true" />
          <p className="text-gray-600 dark:text-gray-400">Creating an original {category.toLowerCase()} practice set…</p>
        </div>
      </main>
    )
  }

  if (error || !currentQuestion) {
    const completed = questions.length > 0 && currentIndex >= questions.length
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-xl border border-gray-300 dark:border-gray-700 p-8 text-center">
          <h1 className="text-3xl font-light mb-4">{completed ? 'Practice set complete' : 'Could not create this set'}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {completed ? `You completed ${questions.length} original practice questions.` : error}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => void generateSet(category)}
              className="px-6 py-3 border border-black dark:border-white bg-black dark:bg-white text-white dark:text-black"
            >
              Generate another set
            </button>
            <Link href="/test" className="px-6 py-3 border border-gray-300 dark:border-gray-700">Choose another category</Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        <Link href="/test" className="inline-flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
          Practice categories
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-light text-black dark:text-white">{currentQuestion.category} Practice</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Question {currentIndex + 1} of {questions.length} · {currentQuestion.difficulty}</p>
          </div>
          <div className="inline-flex items-center text-xs text-gray-600 dark:text-gray-400">
            <ShieldCheck className="h-4 w-4 mr-2" aria-hidden="true" />
            Original first-party question bank
          </div>
        </div>

        <div className="border border-gray-300 dark:border-gray-700 p-6 mb-6">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">Learning objective</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">{currentQuestion.learningObjective}</p>
          <h2 className="text-xl font-light mb-6 text-black dark:text-white">{currentQuestion.text}</h2>

          <div className="space-y-3">
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
                  className={`w-full text-left p-4 border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black dark:focus-visible:ring-white ${
                    isCorrect
                      ? 'bg-green-700 text-white border-green-700'
                      : isIncorrectSelection
                        ? 'bg-red-700 text-white border-red-700'
                        : selectedAnswer === index
                          ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                          : 'border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white'
                  }`}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span> {answer.text}
                  {isCorrect && <span className="block mt-2 text-sm font-semibold">Correct answer</span>}
                  {isIncorrectSelection && <span className="block mt-2 text-sm font-semibold">Your answer</span>}
                </button>
              )
            })}
          </div>

          {showResults && (
            <div className="mt-6 border-t border-gray-300 dark:border-gray-700 pt-5" aria-live="polite">
              <h3 className="font-medium mb-2">Why</h3>
              <p className="text-gray-700 dark:text-gray-300">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>

        {!showResults ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="w-full bg-black dark:bg-white text-white dark:text-black border border-black dark:border-white font-medium py-4 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check answer
          </button>
        ) : (
          <button
            type="button"
            onClick={nextQuestion}
            className="w-full border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white font-medium py-4 px-6"
          >
            {currentIndex + 1 === questions.length ? 'Finish set' : 'Next question'}
          </button>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-5">
          Written from Deca Pal-authored business concept blueprints. Not an official DECA exam and not endorsed by DECA Inc.
        </p>
      </div>
    </main>
  )
}
