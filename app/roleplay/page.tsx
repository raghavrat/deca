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
    color: 'bg-black dark:bg-white'
  },
  {
    name: 'MARKETING',
    displayName: 'Marketing',
    description: 'Market research, advertising campaigns, and brand management',
    color: 'bg-black dark:bg-white'
  },
  {
    name: 'FINANCE',
    displayName: 'Finance',
    description: 'Budgeting, financial analysis, and investment decisions',
    color: 'bg-black dark:bg-white'
  },
  {
    name: 'HOSPITALITY',
    displayName: 'Hospitality',
    description: 'Customer service, event planning, and hospitality operations',
    color: 'bg-black dark:bg-white'
  },
  {
    name: 'ENTREPRENEUR',
    displayName: 'Entrepreneurship',
    description: 'Startup planning, business development, and innovation',
    color: 'bg-black dark:bg-white'
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
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToCategories}
              className="flex items-center text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors mr-4"
            >
              <ChevronRight className="h-5 w-5 mr-1 rotate-180" />
              Back to Categories
            </button>
            <h1 className="text-3xl font-light text-black dark:text-white">
              {selectedCategoryData?.displayName} Events
            </h1>
          </div>

          <div className="mb-8 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedCategoryData?.description}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose a specific DECA event below for a more targeted roleplay experience, or select &quot;General Category Practice&quot; for broader scenarios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* General Category Option */}
            <Link
              href={`/roleplay/${selectedCategory.toLowerCase()}`}
              className="group block bg-white dark:bg-black border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-colors duration-200 focus:outline-none overflow-hidden click-animation"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-light text-black dark:text-white flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    General Category Practice
                  </h3>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-relaxed">
                  Practice with general {selectedCategoryData?.displayName.toLowerCase()} scenarios covering various business situations and challenges.
                </p>
              </div>
            </Link>

            {/* Specific Events */}
            {availableEvents.map((event) => (
              <Link
                key={event.id}
                href={`/roleplay/${selectedCategory.toLowerCase()}?event=${event.id}`}
                className="group block bg-white dark:bg-black border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-colors duration-200 focus:outline-none overflow-hidden click-animation"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-light text-black dark:text-white flex items-center">
                      <Trophy className="h-4 w-4 mr-2" />
                      {event.name}
                    </h3>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-relaxed mb-3">
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
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light mb-4 text-black dark:text-white">Practice Roleplays</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Practice DECA competition scenarios with AI-powered roleplay simulations. 
            Choose a category to see available events and generate realistic business scenarios.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 mb-6">
          <div className="flex border-b border-gray-300 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('practice')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center ${
                activeTab === 'practice'
                  ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Trophy className="w-5 h-5 mr-2" />
              Practice
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center ${
                activeTab === 'history'
                  ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
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
                className="group block bg-white dark:bg-black border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-colors duration-200 focus:outline-none overflow-hidden w-full text-left click-animation"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-light text-black dark:text-white">
                      {cluster.displayName}
                    </h3>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-relaxed mb-3">
                    {cluster.description}
                  </p>
                  <div className="text-xs text-black dark:text-white font-medium">
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading history...</p>
              </div>
            ) : roleplayHistory.length === 0 ? (
              <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-8 text-center">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-light text-black dark:text-white mb-2">No Practice Sessions Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start practicing roleplays to see your history here
                </p>
                <button
                  onClick={() => setActiveTab('practice')}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white text-black dark:text-white text-sm font-medium bg-white dark:bg-black transition-colors"
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
                    className="block bg-white dark:bg-black border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-colors p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Award className="w-5 h-5 text-black dark:text-white mr-2" />
                          <h3 className="font-light text-black dark:text-white">
                            {session.scenario?.eventCode || session.eventCode || 'Practice Session'}
                          </h3>
                          <span className="ml-3 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs">
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
                        <div className={`text-2xl font-light ${
                          session.scores.total >= 85 ? 'text-black dark:text-white' :
                          session.scores.total >= 70 ? 'text-black dark:text-white' :
                          session.scores.total >= 50 ? 'text-black dark:text-white' :
                          'text-black dark:text-white'
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