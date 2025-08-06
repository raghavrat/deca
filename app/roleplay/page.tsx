'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Users, Trophy } from 'lucide-react'
import { getEventsByCategory } from '../data/decaEvents'

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

export default function RoleplayPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showEvents, setShowEvents] = useState(false)

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName)
    setShowEvents(true)
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
    setShowEvents(false)
  }

  const selectedCategoryData = clusters.find(c => c.name === selectedCategory)
  const availableEvents = selectedCategory ? getEventsByCategory(selectedCategory) : []

  if (showEvents && selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToCategories}
              className="flex items-center text-gray-600 hover:text-[#0066cc] transition-colors mr-4"
            >
              <ChevronRight className="h-5 w-5 mr-1 rotate-180" />
              Back to Categories
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              {selectedCategoryData?.displayName} Events
            </h1>
          </div>

          <div className="mb-8 bg-white rounded-[15px] shadow-md p-6">
            <div className={`${selectedCategoryData?.color} h-2 w-full rounded-t-[15px] -mx-6 -mt-6 mb-4`}></div>
            <p className="text-gray-600 mb-4">{selectedCategoryData?.description}</p>
            <p className="text-sm text-gray-500">
              Choose a specific DECA event below for a more targeted roleplay experience, or select "General Category Practice" for broader scenarios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* General Category Option */}
            <Link
              href={`/roleplay/${selectedCategory.toLowerCase()}`}
              className="group block bg-white rounded-[15px] shadow-md hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] overflow-hidden click-animation"
            >
              <div className="bg-gray-500 h-2 w-full"></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    General Category Practice
                  </h3>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#0066cc] transition-colors" />
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Practice with general {selectedCategoryData?.displayName.toLowerCase()} scenarios covering various business situations and challenges.
                </p>
              </div>
            </Link>

            {/* Specific Events */}
            {availableEvents.map((event) => (
              <Link
                key={event.id}
                href={`/roleplay/${selectedCategory.toLowerCase()}?event=${event.id}`}
                className="group block bg-white rounded-[15px] shadow-md hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] overflow-hidden click-animation"
              >
                <div className={`${selectedCategoryData?.color} h-2 w-full`}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <Trophy className="h-4 w-4 mr-2" />
                      {event.name}
                    </h3>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#0066cc] transition-colors" />
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {event.description}
                  </p>
                  <div className="text-xs text-gray-500">
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Practice Roleplays</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Practice DECA competition scenarios with AI-powered roleplay simulations. 
            Choose a category to see available events and generate realistic business scenarios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {clusters.map((cluster) => (
            <button
              key={cluster.name}
              onClick={() => handleCategoryClick(cluster.name)}
              className="group block bg-white rounded-[15px] shadow-md hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] overflow-hidden w-full text-left click-animation"
            >
              <div className={`${cluster.color} h-2 w-full`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {cluster.displayName}
                  </h3>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#0066cc] transition-colors" />
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  {cluster.description}
                </p>
                <div className="text-xs text-[#0066cc] font-medium">
                  {getEventsByCategory(cluster.name).length} events available
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/roleplay/history"
            className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-[15px] shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 click-animation"
          >
            View Roleplay History
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}