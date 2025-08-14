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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Leaderboard</h2>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Top users by problems completed.
      </p>

      {loading && (
        <div className="text-center text-gray-500 dark:text-gray-400">Loading leaderboard...</div>
      )}
      {error && <div className="text-center text-red-500 dark:text-red-400">{error}</div>}

      {!loading && !error && (
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
          {leaderboard.map((user, index) => (
            <li key={user.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-md font-bold text-gray-600 dark:text-gray-400 w-8 text-center">
                  {index + 1}
                </div>
                <div className="ml-3">
                  <div className="text-md font-medium text-gray-800 dark:text-white">{user.name}</div>
                </div>
              </div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {user.problemsCompleted}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
