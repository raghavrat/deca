'use client'

import LeaderboardDisplay from '../components/LeaderboardDisplay'
import { Trophy } from 'lucide-react'

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 pt-8 md:pt-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0066cc]/10 rounded-full mb-4">
            <Trophy className="h-8 w-8 text-[#0066cc] dark:text-[#4d94ff]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Test Leaderboard</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            See how you rank against other DECA students. Complete tests to improve your position on the leaderboard!
          </p>
        </div>
        
        <LeaderboardDisplay />
      </div>
    </div>
  )
}