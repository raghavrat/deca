'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronUp } from 'lucide-react'

const clusters = ['MANAGMENT', 'MARKETING', 'FINANCE', 'HOSPITIALITY', 'ENTREPRENEUR']

const instructionalAreas = {
  'MANAGMENT': ['Business Law', 'Communication Skills', 'Customer Relations', 'Economics', 'Emotional Intelligence', 'Entrepreneurship', 'Financial Analysis', 'Human Resources Management', 'Information Management', 'Operations', 'Professional Development', 'Strategic Management'],
  'MARKETING': ['Channel Management', 'Marketing', 'Market Planning', 'Marketing-Information Management', 'Pricing', 'Product/Service Management', 'Promotion', 'Selling'],
  'FINANCE': ['Accounting', 'Business Finance', 'Financial-Information Management', 'Risk Management', 'Insurance'],
  'HOSPITIALITY': ['Lodging', 'Recreation, Amusements and Attractions', 'Restaurants and Food and Beverage Services', 'Travel and Tourism'],
  'ENTREPRENEUR': ['Business Law', 'Communication Skills', 'Customer Relations', 'Economics', 'Emotional Intelligence', 'Entrepreneurship', 'Financial Analysis', 'Human Resources Management', 'Information Management', 'Operations', 'Professional Development', 'Strategic Management']
}

export default function Navigation() {
  const pathname = usePathname()
  const [openCluster, setOpenCluster] = useState<string | null>(null)

  const toggleCluster = (cluster: string) => {
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

