'use client'

import { useState, useEffect, Suspense } from 'react'
import { Datashape, performanceIndicators } from '../../../performanceIndicators'
import { getIndicatorAnchorId } from '../../../utils/piSlug'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import InstructionalArea with loading
const InstructionalArea = dynamic(
  () => import('../../../components/InstructionalArea'),
  {
    loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-96"></div>,
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
  const [hash, setHash] = useState('')

  useEffect(() => {
    paramsPromise.then((params) => {
      setCategory(capitalizeWords(params.category))
      setIa(getOriginalName(params.ia))
    })
    searchParamsPromise.then((sp) => {
      if (typeof window !== 'undefined') {
        setHash(window.location.hash.replace('#', ''))
      } else if (sp && typeof sp['hash'] === 'string') {
        setHash(sp['hash'])
      }
    })
  }, [paramsPromise, searchParamsPromise])

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

  useEffect(() => {
    if (!isLoading && filteredData.length > 0 && hash) {
      const attemptScroll = () => {
        const el = document.getElementById(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
      // Try immediately and again after next paint in case of dynamic load
      attemptScroll()
      const id = window.setTimeout(attemptScroll, 0)
      return () => window.clearTimeout(id)
    }
  }, [isLoading, filteredData, hash])

  if (!category || !ia) return null

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Link href="/performance" className="mb-6 inline-flex items-center nav-link">
        <ChevronLeft className="mr-1" />
        Back to Clusters
      </Link>
      <h2 className="text-3xl font-light mb-6 text-black dark:text-white">{category} - {ia}</h2>
      <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-96"></div>}>
        {isLoading ? (
          <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-96"></div>
        ) : filteredData.length > 0 ? (
          <InstructionalArea area={ia} indicators={filteredData} />
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No performance indicators found for this instructional area.</p>
        )}
      </Suspense>
    </div>
  )
}

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}