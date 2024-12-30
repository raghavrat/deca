<<<<<<< HEAD
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">Deca Pal</h1>
      <div className="w-full max-w-md space-y-6 px-16">
        <Link href="/performance" className="block w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-[15px] shadow-md text-center transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06C167]">
          Performance Indicators
        </Link>
        <Link href="/test" className="block w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-[15px] shadow-md text-center transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06C167]">
          Take a Test
        </Link>
=======
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'

const clusters = ['MANAGMENT', 'MARKETING', 'FINANCE', 'HOSPITIALITY', 'ENTREPRENEUR']

const instructionalAreas = {
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

export default function Home() {
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
    <div className="py-12 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">Performance Indicators</h1>
      
      <div className="w-full max-w-md space-y-4">
        {clusters.map((cluster) => (
          <div key={cluster} className="relative">
            <button
              onClick={() => handleClusterClick(cluster)}
              className={`w-full bg-white hover:bg-blue-50 text-gray-800 font-semibold py-4 px-6 border border-gray-300 rounded-lg shadow-md text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex justify-between items-center ${
                selectedCluster === cluster ? 'bg-blue-50' : ''
              }`}
            >
              <span>{cluster}</span>
              {selectedCluster === cluster && (
                isOpen ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>
            {selectedCluster === cluster && isOpen && (
              <div className="mt-2 space-y-2">
                {instructionalAreas[cluster].map((ia) => (
                  <Link
                    key={ia}
                    href={`/${cluster.toLowerCase()}/${ia.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block w-full bg-white hover:bg-blue-50 text-gray-800 font-semibold py-3 px-6 border border-gray-300 rounded-lg shadow-sm text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    {ia}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
>>>>>>> 22ee48ed548d41ef82d536d121bc20d018918773
      </div>
    </div>
  )
}

