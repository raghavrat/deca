'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { Datashape } from '../types'

const instructionalAreas = {
  'MANAGMENT': ['Business Law', 'Communication Skills', 'Customer Relations', 'Economics', 'Emotional Intelligence', 'Entrepreneurship', 'Financial Analysis', 'Human Resources Management', 'Information Management', 'Operations', 'Professional Development', 'Strategic Management'],
  'MARKETING': ['Channel Management', 'Marketing', 'Market Planning', 'Marketing-Information Management', 'Pricing', 'Product/Service Management', 'Promotion', 'Selling'],
  'FINANCE': ['Accounting', 'Business Finance', 'Financial-Information Management', 'Risk Management', 'Insurance'],
  'HOSPITIALITY': ['Lodging', 'Recreation, Amusements and Attractions', 'Restaurants and Food and Beverage Services', 'Travel and Tourism'],
  'ENTREPRENEUR': ['Business Law', 'Communication Skills', 'Customer Relations', 'Economics', 'Emotional Intelligence', 'Entrepreneurship', 'Financial Analysis', 'Human Resources Management', 'Information Management', 'Operations', 'Professional Development', 'Strategic Management']
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = params.category.toUpperCase()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="py-6">
      <h2 className="text-3xl font-bold mb-6">{category} Performance Indicators</h2>
      <div className="relative inline-block text-left">
        <div>
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
            id="options-menu"
            aria-haspopup="true"
            aria-expanded="true"
            onClick={() => setIsOpen(!isOpen)}
          >
            Select Instructional Area
            <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {isOpen && (
          <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {instructionalAreas[category].map((ia) => (
                <Link
                  key={ia}
                  href={`/${category.toLowerCase()}/${ia.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                >
                  {ia}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

