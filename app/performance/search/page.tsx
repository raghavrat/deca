'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { performanceIndicators } from '../../performanceIndicators'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

const formatUrlSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[\/\-]/g, '') // Remove dashes and slashes
    .replace(/\s+/g, '-') // Replace spaces with dashes
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '')
  const [currentQuery, setCurrentQuery] = useState(searchParams.get('query') || '')
  const [showResults, setShowResults] = useState(!!searchParams.get('query'))

  const filteredPIs = currentQuery && showResults
    ? performanceIndicators.filter(pi => 
        pi.text.toLowerCase().includes(currentQuery.toLowerCase()) ||
        pi.indicator.toLowerCase().includes(currentQuery.toLowerCase())
      )
    : []

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/performance/search?query=${encodeURIComponent(searchQuery.trim())}`)
      setCurrentQuery(searchQuery.trim())
      setShowResults(true)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">Search Performance Indicators</h1>
      
      <div className="mb-8 flex items-center justify-between w-full">
        <div className="flex-grow relative bg-white rounded-[15px] border border-gray-200 shadow-sm mr-4">
          <input
            type="text"
            placeholder="Search performance indicators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-3 pl-12 text-gray-800 font-semibold bg-transparent rounded-[15px] focus:outline-none placeholder-gray-500"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        <button 
          onClick={handleSearch}
          className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 flex-shrink-0"
        >
          <Search className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <div className="space-y-4">
        {showResults && (
          currentQuery ? (
            filteredPIs.length > 0 ? (
              filteredPIs.map((pi, index) => {
                const areaName = pi.area.split(':')[1].trim()
                const urlSlug = formatUrlSlug(areaName)
                
                return (
                  <div key={index} className="p-4 sm:p-6 bg-white rounded-lg shadow-sm">
                    <h4 className="font-semibold text-[#0066cc] mb-2 break-words">{pi.indicator}</h4>
                    <p className="text-gray-700 whitespace-pre-wrap mb-2 text-sm sm:text-base">{pi.text}</p>
                    <Link 
                      href={`/performance/${pi.category[0].toLowerCase()}/${urlSlug}`}
                      className="text-sm text-[#0066cc] hover:text-[#0052a3] hover:underline inline-block"
                    >
                      View in {areaName}
                    </Link>
                  </div>
                )
              })
            ) : (
              <div className="text-center text-gray-500 py-4">
                No performance indicators found
              </div>
            )
          ) : (
            <div className="text-center text-gray-500 py-4">
              Start typing to search performance indicators
            </div>
          )
        )}
      </div>
    </div>
  )
} 