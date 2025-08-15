'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase/config'
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
        const usersCollection = collection(db, 'users')
        const q = query(
          usersCollection,
          orderBy('problemsCompleted', 'desc'),
          limit(100)
        )
        const querySnapshot = await getDocs(q)
        const leaderboardData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || 'Anonymous',
          problemsCompleted: doc.data().problemsCompleted || 0,
        }))
        setLeaderboard(leaderboardData)
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
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-800">
          {leaderboard.map((user, index) => (
            <li key={user.id} className="py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 last:border-b-0">
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
        </ul>
      )}
    </div>
  )
}
