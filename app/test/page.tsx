'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'

const clusters = ['MANAGEMENT', 'MARKETING', 'FINANCE', 'HOSPITALITY', 'ENTREPRENEURSHIP']

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Practice Tests</h1>
      <div className="w-full max-w-md space-y-4">
        {clusters.map((cluster) => (
          <Link
            key={cluster}
            href={`/test/${cluster.toLowerCase()}`}
            className="block w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-[15px] shadow-md text-center transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc]"
          >
            {cluster} Test
          </Link>
        ))}
      </div>
    </div>
  )
}

