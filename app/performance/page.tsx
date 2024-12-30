'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'

const clusters = ['MANAGMENT', 'MARKETING', 'FINANCE', 'HOSPITIALITY', 'ENTREPRENEUR']

const instructionalAreas: Record<string, string[]> = {
  'MANAGMENT': [
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
  'HOSPITIALITY': [
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
  'ENTREPRENEUR': [
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

  const handleClusterClick = (cluster: string) => {
    if (selectedCluster === cluster) {
      setIsOpen(!isOpen)
    } else {
      setSelectedCluster(cluster)
      setIsOpen(true)
    }
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">Performance Indicators</h1>
      
      <div className="w-full max-w-md space-y-4 px-2 sm:px-0">
        {clusters.map((cluster) => (
          <div key={cluster} className="relative">
            <button
              onClick={() => handleClusterClick(cluster)}
              className={`w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-[15px] shadow-md text-center transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06C167] flex justify-between items-center ${
                selectedCluster === cluster ? 'bg-gray-50' : ''
              }`}
            >
              <span>{cluster}</span>
              {selectedCluster === cluster && (
                isOpen ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>
            <div className={`mt-2 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${isOpen && selectedCluster === cluster ? 'max-h-[1000px] opacity-100 transform translate-y-0' : 'max-h-0 opacity-0 transform -translate-y-2'}`}>
              {instructionalAreas[cluster as keyof typeof instructionalAreas].map((ia) => (
                <Link
                  key={ia}
                  href={`/performance/${cluster.toLowerCase()}/${ia.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block w-full bg-[#06C167] hover:bg-[#05a75a] text-white font-semibold py-3 px-6 rounded-[15px] shadow-md text-center transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06C167]"
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

