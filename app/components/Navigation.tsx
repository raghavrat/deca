'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronUp, Users, BookOpen, BarChart3 } from 'lucide-react'

// First, define the type for valid clusters
type Cluster = 'MANAGEMENT' | 'MARKETING' | 'FINANCE' | 'HOSPITALITY' | 'ENTREPRENEUR';

// Update the clusters array to be typed
const clusters: Cluster[] = ['MANAGEMENT', 'MARKETING', 'FINANCE', 'HOSPITALITY', 'ENTREPRENEUR'];

// Type the instructionalAreas object
const instructionalAreas: Record<Cluster, string[]> = {
  'MANAGEMENT': ['Business Law', 'Communication Skills', /* ... */],
  'MARKETING': ['Channel Management', 'Marketing', /* ... */],
  'FINANCE': ['Accounting', 'Business Finance', /* ... */],
  'HOSPITALITY': ['Lodging', 'Recreation, Amusements and Attractions', /* ... */],
  'ENTREPRENEUR': ['Business Law', 'Communication Skills', /* ... */]
}

export default function Navigation() {
  const pathname = usePathname()
  const [openCluster, setOpenCluster] = useState<Cluster | null>(null)

  const toggleCluster = (cluster: Cluster) => {
    setOpenCluster(openCluster === cluster ? null : cluster)
  }

  return (
    <nav className="w-64 bg-gray-800 text-white p-4 h-screen overflow-y-auto">
      <Link href="/" className="block mb-6 text-2xl font-bold">Home</Link>
      
      {/* Main Navigation Links */}
      <div className="mb-6 space-y-2">
        <Link
          href="/performance"
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            pathname.startsWith('/performance')
              ? 'bg-blue-600'
              : 'hover:bg-gray-700'
          }`}
        >
          <BookOpen className="h-4 w-4 mr-3" />
          Performance Indicators
        </Link>
        
        <Link
          href="/test"
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            pathname.startsWith('/test')
              ? 'bg-blue-600'
              : 'hover:bg-gray-700'
          }`}
        >
          <BarChart3 className="h-4 w-4 mr-3" />
          Practice Tests
        </Link>
        
        <Link
          href="/roleplay"
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            pathname.startsWith('/roleplay')
              ? 'bg-blue-600'
              : 'hover:bg-gray-700'
          }`}
        >
          <Users className="h-4 w-4 mr-3" />
          Practice Roleplays
        </Link>
      </div>

      {/* Categories Section */}
      <div className="border-t border-gray-700 pt-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Categories</h3>
        <ul className="space-y-2">
          {clusters.map((cluster) => (
          <li key={cluster}>
            <button
              onClick={() => toggleCluster(cluster)}
              className={`w-full text-left px-4 py-2 rounded-md flex items-center justify-between ${
                pathname.startsWith(`/${cluster.toLowerCase()}`)
                  ? 'bg-blue-600'
                  : 'hover:bg-gray-700'
              }`}
            >
              {cluster}
              {openCluster === cluster ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {openCluster === cluster && (
              <ul className="ml-4 mt-2 space-y-1">
                {instructionalAreas[cluster].map((ia) => (
                  <li key={ia}>
                    <Link
                      href={`/${cluster.toLowerCase()}/${ia.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block px-4 py-2 text-sm hover:bg-gray-700 rounded-md"
                    >
                      {ia}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

