'use client'

import Link from 'next/link'
import { Trophy } from 'lucide-react'

const clusters = ['MANAGEMENT', 'MARKETING', 'FINANCE', 'HOSPITALITY', 'ENTREPRENEURSHIP']

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Practice Tests</h1>
      <p className="text-lg text-gray-600 text-center mb-8 max-w-2xl">
        Choose a category to test your knowledge of DECA performance indicators
      </p>
      <div className="w-full max-w-md space-y-4">
        {clusters.map((cluster) => (
          <Link
            key={cluster}
            href={`/test/${cluster.toLowerCase()}`}
            className="block w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-[15px] shadow-md text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] click-animation"
          >
            {cluster} Test
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <Link
          href="/leaderboard"
          className="inline-flex items-center px-6 py-3 bg-[#0066cc] hover:bg-blue-700 text-white font-semibold rounded-[15px] shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] click-animation"
        >
          <Trophy className="h-5 w-5 mr-2" />
          View Leaderboard
        </Link>
      </div>
    </div>
  )
}

