'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronUp } from 'lucide-react'

// First, define the type for valid clusters
type Cluster = 'MANAGMENT' | 'MARKETING' | 'FINANCE' | 'HOSPITIALITY' | 'ENTREPRENEUR';

// Update the clusters array to be typed
const clusters: Cluster[] = ['MANAGMENT', 'MARKETING', 'FINANCE', 'HOSPITIALITY', 'ENTREPRENEUR'];

// Type the instructionalAreas object
const instructionalAreas: Record<Cluster, string[]> = {
  'MANAGMENT': ['Business Law', 'Communication Skills', /* ... */],
  'MARKETING': ['Channel Management', 'Marketing', /* ... */],
  'FINANCE': ['Accounting', 'Business Finance', /* ... */],
  'HOSPITIALITY': ['Lodging', 'Recreation, Amusements and Attractions', /* ... */],
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
    </nav>
  )
}

