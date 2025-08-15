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
      <h1 className="text-4xl font-light mb-8 text-center text-black dark:text-white">Performance Indicators</h1>
      
      <div className="w-full max-w-md mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search performance indicators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="input-minimal w-full pr-10"
          />
          <button 
            onClick={handleSearch}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="w-full max-w-md space-y-4">
        {clusters.map((cluster) => (
          <div key={cluster} className="relative">
            <button
              onClick={() => handleClusterClick(cluster)}
              className={`w-full py-4 px-6 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white text-black dark:text-white font-light text-center transition-all duration-200 flex justify-between items-center ${
                selectedCluster === cluster && isOpen ? 'border-black dark:border-white' : ''
              }`}
            >
              <span className="text-sm font-medium tracking-wide">{cluster}</span>
              {selectedCluster === cluster && (
                isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
              )}
            </button>
            <div className={`mt-2 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen && selectedCluster === cluster 
                ? 'max-h-[2000px] opacity-100' 
                : 'max-h-0 opacity-0'
            }`}>
              {instructionalAreas[cluster as keyof typeof instructionalAreas].map((ia) => (
                <Link
                  key={ia}
                  href={`/performance/${cluster.toLowerCase()}/${formatUrlSlug(ia)}`}
                  className="block w-full py-3 px-6 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white text-black dark:text-white text-sm text-center transition-colors duration-200"
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