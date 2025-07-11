'use client'

import { useState, useEffect, Suspense } from 'react'
import { Datashape, performanceIndicators } from '../../../performanceIndicators'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import InstructionalArea with loading
const InstructionalArea = dynamic(
  () => import('../../../components/InstructionalArea'),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>,
    ssr: false
  }
)

type PageProps = {
  params: Promise<{
    category: string
    ia: string
  }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const getOriginalName = (slug: string) => {
  // Map of URL slugs to their original display names
  const nameMap: { [key: string]: string } = {
    'productservice-management': 'Product/Service Management',
    'marketinginformation-management': 'Marketing-Information Management',
    'financialinformation-management': 'Financial-Information Management'
  }

  // Return the mapped name if it exists, otherwise reconstruct from slug
  return nameMap[slug] || slug
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function IAPage({ params: paramsPromise, searchParams: searchParamsPromise }: PageProps) {
  const [category, setCategory] = useState('')
  const [ia, setIa] = useState('')
  const [filteredData, setFilteredData] = useState<Datashape[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    paramsPromise.then((params) => {
      setCategory(capitalizeWords(params.category))
      setIa(getOriginalName(params.ia))
    })
  }, [paramsPromise])

  useEffect(() => {
    if (category && ia) {
      setIsLoading(true)
      try {
        const filtered = performanceIndicators.filter((item) => {
          const normalizedArea = item.area.toLowerCase().replace(/[\/\-]/g, '').replace(/\s+/g, ' ')
          const normalizedIa = ia.toLowerCase().replace(/[\/\-]/g, '').replace(/\s+/g, ' ')
          return item.category.includes(category.toUpperCase() as any) && 
                 normalizedArea.includes(normalizedIa)
        })
        setFilteredData(filtered)
      } finally {
        setIsLoading(false)
      }
    }
  }, [category, ia])

  if (!category || !ia) return null

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Link href="/performance" className="mb-6 inline-flex items-center text-[#0066cc] hover:text-[#0052a3] transition-colors duration-200">
        <ChevronLeft className="mr-1" />
        Back to Clusters
      </Link>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">{category} - {ia}</h2>
      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
        {isLoading ? (
          <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
        ) : filteredData.length > 0 ? (
          <InstructionalArea area={ia} indicators={filteredData} />
        ) : (
          <p className="text-gray-600">No performance indicators found for this instructional area.</p>
        )}
      </Suspense>
    </div>
  )
}

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}