'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, User, FileText } from 'lucide-react'
import { RoleplaySession } from '../../types'

export default function RoleplayHistoryPage() {
  const [sessions, setSessions] = useState<RoleplaySession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/roleplay/save')
      
      if (!response.ok) {
        throw new Error('Failed to fetch roleplay sessions')
      }

      const data = await response.json()
      setSessions(data.sessions || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (startedAt: Date | string, completedAt?: Date | string) => {
    if (!completedAt) return 'In Progress'
    
    const start = new Date(startedAt)
    const end = new Date(completedAt)
    const durationMs = end.getTime() - start.getTime()
    const minutes = Math.floor(durationMs / 60000)
    
    if (minutes < 1) return '< 1 min'
    if (minutes < 60) return `${minutes} min`
    
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      MANAGEMENT: 'bg-blue-500',
      MARKETING: 'bg-green-500',
      FINANCE: 'bg-purple-500',
      HOSPITALITY: 'bg-orange-500',
      ENTREPRENEUR: 'bg-red-500'
    }
    return colors[category] || 'bg-gray-500'
  }

  const getCategoryDisplayName = (category: string) => {
    const names: { [key: string]: string } = {
      MANAGEMENT: 'Management',
      MARKETING: 'Marketing',
      FINANCE: 'Finance',
      HOSPITALITY: 'Hospitality',
      ENTREPRENEUR: 'Entrepreneurship'
    }
    return names[category] || category
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              href="/roleplay"
              className="flex items-center text-gray-600 hover:text-[#0066cc] transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Roleplays
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Roleplay History</h1>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-[15px] shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0066cc] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your roleplay history...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-[15px] mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && sessions.length === 0 && (
          <div className="bg-white rounded-[15px] shadow-md p-8 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No Roleplay Sessions Yet</h2>
            <p className="text-gray-500 mb-6">
              You haven't completed any roleplay sessions yet. Start practicing to see your history here!
            </p>
            <Link
              href="/roleplay"
              className="inline-flex items-center px-6 py-3 bg-[#0066cc] hover:bg-blue-700 text-white font-semibold rounded-[15px] shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] click-animation"
            >
              Start Your First Roleplay
            </Link>
          </div>
        )}

        {/* Sessions List */}
        {!loading && !error && sessions.length > 0 && (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-[15px] shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className={`${getCategoryColor(session.scenario.category)} h-2 w-full`}></div>
                
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1 mb-4 lg:mb-0">
                      <div className="flex items-center mb-2">
                        <span className={`inline-block px-2 py-1 text-xs font-semibold text-white rounded-full ${getCategoryColor(session.scenario.category)} mr-3`}>
                          {getCategoryDisplayName(session.scenario.category)}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {session.scenario.title}
                        </h3>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {session.scenario.scenario}
                      </p>
                      
                      <div className="flex flex-wrap items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(session.startedAt)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDuration(session.startedAt, session.completedAt)}
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {session.responses.length} interactions
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {
                          // TODO: Implement session details modal or page
                          alert('Session details coming soon!')
                        }}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 click-animation"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          // TODO: Implement export functionality
                          alert('Export functionality coming soon!')
                        }}
                        className="px-4 py-2 bg-[#0066cc] hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] click-animation"
                      >
                        Export
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {!loading && !error && sessions.length > 0 && (
          <div className="mt-8 bg-white rounded-[15px] shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0066cc]">{sessions.length}</div>
                <div className="text-sm text-gray-600">Total Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {sessions.filter(s => s.completedAt).length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(sessions.map(s => s.scenario.category)).size}
                </div>
                <div className="text-sm text-gray-600">Categories Practiced</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {sessions.reduce((total, session) => total + session.responses.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Interactions</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}