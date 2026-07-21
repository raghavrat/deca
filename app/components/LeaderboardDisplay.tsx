'use client'

import { useState, useEffect } from 'react'
import { Trophy } from 'lucide-react'

interface LeaderboardEntry {
  id: string
  name: string
  problemsCompleted: number
}

export default function LeaderboardDisplay() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard')
        if (!response.ok) throw new Error('Leaderboard request failed')
        const data = await response.json()
        setLeaderboard(data.leaderboard || [])
      } catch (err) {
        console.error('Error fetching leaderboard:', err)
        setError('Failed to load leaderboard. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  return (
    <div className="bg-white dark:bg-black p-6">
      <div className="flex items-center mb-4">
        <Trophy className="h-6 w-6 text-black dark:text-white mr-2" />
        <h2 className="text-2xl font-light text-black dark:text-white">Leaderboard</h2>
      </div>
      <p className="text-sm text-black dark:text-white mb-4">
        Top users by problems completed.
      </p>

      {loading && (
        <div className="text-center text-sm text-black dark:text-white">Loading leaderboard...</div>
      )}
      {error && <div className="text-center text-sm text-black dark:text-white">{error}</div>}

      {!loading && !error && (
        leaderboard.length === 0 ? (
          <p className="text-sm text-neutral-700 dark:text-neutral-300">No students have opted in to the leaderboard yet.</p>
        ) : <ol className="divide-y divide-neutral-200 dark:divide-neutral-800" aria-label="Leaderboard rankings">
          {leaderboard.map((user, index) => (
            <li key={user.id} className="py-3 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 last:border-b-0">
              <div className="flex items-center">
                <div className="text-sm font-light text-black dark:text-white w-8 text-center">
                  {index + 1}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-light text-black dark:text-white">{user.name}</div>
                </div>
              </div>
              <div className="text-sm font-light text-black dark:text-white">
                {user.problemsCompleted}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
