'use client'

import Link from 'next/link'
import { Trophy } from 'lucide-react'
import {
  TEST_CATEGORIES,
  TEST_CATEGORY_LABELS,
  type TestCategory,
} from '../data/testBlueprints'

const categorySlug = (category: string) => category.toLowerCase().replaceAll('_', '-')

const CATEGORY_SHORT_LABELS: Record<TestCategory, string> = {
  BUSINESS_CORE: 'Core',
  MANAGEMENT: 'Management',
  ENTREPRENEURSHIP: 'Entrepreneurship',
  FINANCE: 'Finance',
  HOSPITALITY: 'Hospitality',
  MARKETING: 'Marketing',
  PERSONAL_FINANCE: 'Personal Finance',
}

export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-4xl font-light tracking-tight mb-4 text-center text-black dark:text-white">
        Practice Tests
      </h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center mb-8 max-w-2xl">
        Seven categories. 1,000 original questions each.
      </p>

      <div className="w-full max-w-2xl space-y-4">
        {TEST_CATEGORIES.map((category) => (
          <div
            key={category}
            className="border border-neutral-300 bg-white p-5 transition-colors hover:border-black dark:border-neutral-700 dark:bg-black dark:hover:border-white sm:flex sm:items-center sm:justify-between sm:gap-6"
          >
            <div className="mb-4 min-w-0 sm:mb-0">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {CATEGORY_SHORT_LABELS[category]}
              </p>
              <h2 className="mt-1 text-base font-medium text-black dark:text-white">
                {TEST_CATEGORY_LABELS[category]}
              </h2>
            </div>

            <div className="grid shrink-0 grid-cols-2 gap-2">
              <Link
                href={`/test/${categorySlug(category)}?count=10`}
                className="inline-flex min-h-11 items-center justify-center border border-neutral-300 px-4 text-sm font-medium text-black hover:border-black dark:border-neutral-700 dark:text-white dark:hover:border-white"
              >
                Quick 10
              </Link>
              <Link
                href={`/test/${categorySlug(category)}?count=100`}
                className="inline-flex min-h-11 items-center justify-center border border-black bg-black px-4 text-sm font-medium text-white hover:bg-transparent hover:text-black dark:border-white dark:bg-white dark:text-black dark:hover:bg-transparent dark:hover:text-white"
              >
                Full 100
              </Link>
            </div>
          </div>
        ))}
      </div>

      <Link href="/leaderboard" className="mt-8 inline-flex items-center btn-text">
        <Trophy className="h-4 w-4 mr-2" aria-hidden="true" />
        View Leaderboard
      </Link>
    </div>
  )
}
