'use client'

import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BarChart3, Target, Clock, TrendingUp } from 'lucide-react'

interface QuestionStats {
  totalQuestions: number
  byCategory: {
    [key: string]: number
  }
  lastAttempt?: string
  streak?: number
}

export default function AccountPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<QuestionStats>({
    totalQuestions: 0,
    byCategory: {}
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      // Load stats from localStorage
      const savedStats = localStorage.getItem(`questionStats_${user.uid}`)
      if (savedStats) {
        setStats(JSON.parse(savedStats))
      }
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getCategoryDisplayName = (category: string) => {
    const displayNames: { [key: string]: string } = {
      'MANAGMENT': 'Management',
      'MARKETING': 'Marketing',
      'FINANCE': 'Finance',
      'HOSPITIALITY': 'Hospitality',
      'ENTREPRENEUR': 'Entrepreneurship'
    }
    return displayNames[category] || category
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Account Dashboard</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stats.totalQuestions}</h3>
            <p className="text-gray-600 text-sm">Total Questions Completed</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stats.streak || 0}</h3>
            <p className="text-gray-600 text-sm">Day Streak</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              {stats.lastAttempt ? new Date(stats.lastAttempt).toLocaleDateString() : 'No attempts yet'}
            </h3>
            <p className="text-gray-600 text-sm">Last Activity</p>
          </div>
          </div>

      </div>
    </div>
  )
}