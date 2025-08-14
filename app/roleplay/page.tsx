'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Users, Trophy, History, Calendar, Award, Clock } from 'lucide-react'
import { getEventsByCategory } from '../data/decaEvents'
import { useAuth } from '../context/AuthContext'

const clusters = [
  {
    name: 'MANAGEMENT',
    displayName: 'Management',
    description: 'Leadership, team coordination, and organizational challenges',
    color: 'bg-blue-500'
  },
  {
    name: 'MARKETING',
    displayName: 'Marketing',
    description: 'Market research, advertising campaigns, and brand management',
    color: 'bg-green-500'
  },
  {
    name: 'FINANCE',
    displayName: 'Finance',
    description: 'Budgeting, financial analysis, and investment decisions',
    color: 'bg-purple-500'
  },
  {
    name: 'HOSPITALITY',
    displayName: 'Hospitality',
    description: 'Customer service, event planning, and hospitality operations',
    color: 'bg-orange-500'
  },
  {
    name: 'ENTREPRENEUR',
    displayName: 'Entrepreneurship',
    description: 'Startup planning, business development, and innovation',
    color: 'bg-red-500'
  }
]

interface RoleplaySession {
  sessionId: string
  category: string
  eventCode?: string
  scores: {
    total: number
  }
  createdAt: string
  scenario?: {
    eventCode: string
    careerCluster: string
  }
}

export default function RoleplayPage() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showEvents, setShowEvents] = useState(false)
  const [activeTab, setActiveTab] = useState<'practice' | 'history'>('practice')
  const [roleplayHistory, setRoleplayHistory] = useState<RoleplaySession[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName)
    setShowEvents(true)
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
    setShowEvents(false)
  }

  // Fetch roleplay history when history tab is selected
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user || activeTab !== 'history') return
      
      setLoadingHistory(true)
      try {
        const response = await fetch(`/api/roleplay/history?email=${encodeURIComponent(user.email!)}`)
        if (response.ok) {
          const data = await response.json()
          setRoleplayHistory(data.sessions || [])
        }
      } catch (error) {
        console.error('Error fetching history:', error)
      } finally {
        setLoadingHistory(false)
      }
    }

    fetchHistory()
  }, [activeTab, user])

  const selectedCategoryData = clusters.find(c => c.name === selectedCategory)
  const availableEvents = selectedCategory ? getEventsByCategory(selectedCategory) : []

  if (showEvents && selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToCategories}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-[#0066cc] dark:hover:text-[#4d94ff] transition-colors mr-4"
            >
              <ChevronRight className="h-5 w-5 mr-1 rotate-180" />
              Back to Categories
            </button>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {selectedCategoryData?.displayName} Events
            </h1>
          </div>

          <div className="mb-8 bg-white dark:bg-gray-800 rounded-[15px] shadow-md p-6">
            <div className={`${selectedCategoryData?.color} h-2 w-full rounded-t-[15px] -mx-6 -mt-6 mb-4`}></div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedCategoryData?.description}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose a specific DECA event below for a more targeted roleplay experience, or select "General Category Practice" for broader scenarios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* General Category Option */}
            <Link
              href={`/roleplay/${selectedCategory.toLowerCase()}`}
              className="group block bg-white dark:bg-gray-800 rounded-[15px] shadow-md hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] overflow-hidden click-animation"
            >
              <div className="bg-gray-500 h-2 w-full"></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    General Category Practice
                  </h3>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#0066cc] dark:group-hover:text-[#4d94ff] transition-colors" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Practice with general {selectedCategoryData?.displayName.toLowerCase()} scenarios covering various business situations and challenges.
                </p>
              </div>
            </Link>

            {/* Specific Events */}
            {availableEvents.map((event) => (
              <Link
                key={event.id}
                href={`/roleplay/${selectedCategory.toLowerCase()}?event=${event.id}`}
                className="group block bg-white dark:bg-gray-800 rounded-[15px] shadow-md hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] overflow-hidden click-animation"
              >
                <div className={`${selectedCategoryData?.color} h-2 w-full`}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                      <Trophy className="h-4 w-4 mr-2" />
                      {event.name}
                    </h3>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#0066cc] dark:group-hover:text-[#4d94ff] transition-colors" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                    {event.description}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Event ID:</span> {event.id}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">Practice Roleplays</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Practice DECA competition scenarios with AI-powered roleplay simulations. 
            Choose a category to see available events and generate realistic business scenarios.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('practice')}
              className={`flex-1 px-6 py-3 font-medium transition-colors flex items-center justify-center ${
                activeTab === 'practice'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <Trophy className="w-5 h-5 mr-2" />
              Practice
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-6 py-3 font-medium transition-colors flex items-center justify-center ${
                activeTab === 'history'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <History className="w-5 h-5 mr-2" />
              History
            </button>
          </div>
        </div>

        {/* Practice Tab Content */}
        {activeTab === 'practice' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {clusters.map((cluster) => (
              <button
                key={cluster.name}
                onClick={() => handleCategoryClick(cluster.name)}
                className="group block bg-white dark:bg-gray-800 rounded-[15px] shadow-md hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] overflow-hidden w-full text-left click-animation"
              >
                <div className={`${cluster.color} h-2 w-full`}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {cluster.displayName}
                    </h3>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#0066cc] dark:group-hover:text-[#4d94ff] transition-colors" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                    {cluster.description}
                  </p>
                  <div className="text-xs text-[#0066cc] dark:text-[#4d94ff] font-medium">
                    {getEventsByCategory(cluster.name).length} events available
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* History Tab Content */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {loadingHistory ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading history...</p>
              </div>
            ) : roleplayHistory.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No Practice Sessions Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start practicing roleplays to see your history here
                </p>
                <button
                  onClick={() => setActiveTab('practice')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                >
                  Start Practicing
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {roleplayHistory.map((session) => (
                  <Link
                    key={session.sessionId}
                    href={`/roleplay/review?id=${session.sessionId}`}
                    className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Award className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                          <h3 className="font-semibold text-gray-800 dark:text-white">
                            {session.scenario?.eventCode || session.eventCode || 'Practice Session'}
                          </h3>
                          <span className="ml-3 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                            {session.scenario?.careerCluster || session.category}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                          <Clock className="w-4 h-4 ml-4 mr-1" />
                          <span>{new Date(session.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          session.scores.total >= 85 ? 'text-green-600 dark:text-green-400' :
                          session.scores.total >= 70 ? 'text-blue-600 dark:text-blue-400' :
                          session.scores.total >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {session.scores.total}/100
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Score</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}