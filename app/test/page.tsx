'use client'

import Link from 'next/link'
import { Trophy } from 'lucide-react'

const clusters = ['MANAGEMENT', 'MARKETING', 'FINANCE', 'HOSPITALITY', 'ENTREPRENEURSHIP']

export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-light tracking-tight mb-8 text-center text-black dark:text-white">Practice Tests</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-8 max-w-2xl">
        Choose a category to test your knowledge of DECA performance indicators
      </p>
      <div className="w-full max-w-md space-y-4">
        {clusters.map((cluster) => (
          <Link
            key={cluster}
            href={`/test/${cluster.toLowerCase()}`}
            className="group block w-full text-center py-4 px-6 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-200"
          >
            <span className="text-sm font-medium tracking-wide text-black dark:text-white">{cluster} Test</span>
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <Link
          href="/leaderboard"
          className="inline-flex items-center btn-text"
        >
          <Trophy className="h-4 w-4 mr-2" />
          View Leaderboard
        </Link>
      </div>
    </div>
  )
}