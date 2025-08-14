'use client'

import { useState } from 'react'
import { Search, ChevronUp, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const clusters = ['MANAGEMENT', 'MARKETING', 'FINANCE', 'HOSPITALITY', 'ENTREPRENEURSHIP']
const instructionalAreas: Record<string, string[]> = {
  'MANAGEMENT': [
    'Business Law',
    'Communications',
    'Customer Relations',
    'Economics',
    'Emotional Intelligence',
    'Entrepreneurship',
    'Financial Analysis',
    'Human Resources Management',
    'Information Management',
    'Knowledge Management',
    'Marketing',
    'Operations',
    'Professional Development',
    'Project Management',
    'Quality Management',
    'Risk Management',
    'Strategic Management'
  ],
  'MARKETING': [
    'Business Law',
    'Channel Management',
    'Communications',
    'Customer Relations',
    'Economics',
    'Emotional Intelligence',
    'Entrepreneurship',
    'Financial Analysis',
    'Human Resources Management',
    'Information Management',
    'Market Planning',
    'Marketing',
    'Marketing-Information Management',
    'Operations',
    'Pricing',
    'Product/Service Management',
    'Professional Development',
    'Promotion',
    'Selling',
    'Strategic Management'
  ],
  'FINANCE': [
    'Business Law',
    'Communications',
    'Customer Relations',
    'Economics',
    'Emotional Intelligence',
    'Entrepreneurship',
    'Financial Analysis',
    'Financial-Information Management',
    'Human Resources Management',
    'Information Management',
    'Marketing',
    'Operations',
    'Professional Development',
    'Risk Management',
    'Strategic Management'
  ],
  'HOSPITALITY': [
    'Business Law',
    'Communications',
    'Customer Relations',
    'Economics',
    'Emotional Intelligence',
    'Entrepreneurship',
    'Financial Analysis',
    'Human Resources Management',
    'Information Management',
    'Knowledge Management',
    'Market Planning',
    'Marketing',
    'Operations',
    'Pricing',
    'Product/Service Management',
    'Professional Development',
    'Promotion',
    'Quality Management',
    'Risk Management',
    'Selling',
    'Strategic Management'
  ],
  'ENTREPRENEURSHIP': [
    'Business Law',
    'Channel Management',
    'Communications',
    'Customer Relations',
    'Economics',
    'Emotional Intelligence',
    'Entrepreneurship',
    'Financial Analysis',
    'Human Resources Management',
    'Information Management',
    'Market Planning',
    'Marketing',
    'Marketing-Information Management',
    'Operations',
    'Pricing',
    'Product/Service Management',
    'Professional Development',
    'Promotion',
    'Quality Management',
    'Risk Management',
    'Selling',
    'Strategic Management'
  ]
}

export default function PerformancePage() {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleClusterClick = (cluster: string) => {
    if (selectedCluster === cluster) {
      setIsOpen(!isOpen)
    } else {
      setSelectedCluster(cluster)
      setIsOpen(true)
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/performance/search?query=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const formatUrlSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[\/\-]/g, '') // Remove dashes and slashes
      .replace(/\s+/g, '-') // Replace spaces with dashes
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800 dark:text-white">Performance Indicators</h1>
      
      <div className="w-full max-w-md mb-8 flex items-center justify-between">
        <div className="flex-grow relative bg-white dark:bg-gray-800 rounded-[15px] border border-gray-200 dark:border-gray-700 shadow-sm mr-4">
          <input
            type="text"
            placeholder="Search performance indicators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-3 pl-12 text-gray-800 dark:text-white bg-white dark:bg-gray-800 rounded-[15px] focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
        </div>
        <button 
          onClick={handleSearch}
          className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 click-animation"
        >
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </button>
      </div>

      <div className="w-full max-w-md space-y-4 px-2 sm:px-0">
        {clusters.map((cluster) => (
          <div key={cluster} className="relative">
            <button
              onClick={() => handleClusterClick(cluster)}
              className={`w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-semibold py-4 px-6 rounded-[15px] shadow-md text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] dark:focus:ring-[#4d94ff] flex justify-between items-center click-animation ${
                selectedCluster === cluster ? 'bg-gray-50 dark:bg-gray-700' : ''
              }`}
            >
              <span>{cluster}</span>
              {selectedCluster === cluster && (
                isOpen ? <ChevronUp className="h-5 w-5 text-gray-400 dark:text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              )}
            </button>
            <div className={`mt-2 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen && selectedCluster === cluster 
                ? 'max-h-[2000px] opacity-100 transform translate-y-0' 
                : 'max-h-0 opacity-0 transform -translate-y-2'
            }`}>
              {instructionalAreas[cluster as keyof typeof instructionalAreas].map((ia) => (
                <Link
                  key={ia}
                  href={`/performance/${cluster.toLowerCase()}/${formatUrlSlug(ia)}`}
                  className="block w-full bg-[#0066cc] hover:bg-[#0052a3] text-white font-semibold py-3 px-6 rounded-[15px] shadow-md text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] click-animation"
                >
                  {ia}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

