'use client'

import { useState, useEffect } from 'react'
import { Datashape, performanceIndicators } from '../../../performanceIndicators'
import InstructionalArea from '../../../components/InstructionalArea'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function IAPage({ params }: { params: { category: string; ia: string } }) {
  const category = capitalizeWords(params.category)
  const ia = capitalizeWords(params.ia.replace(/-/g, ' '))
  const [filteredData, setFilteredData] = useState<Datashape[]>([])

  useEffect(() => {
    const filtered = performanceIndicators.filter((item) => 
      item.category.includes(category.toUpperCase() as any) && 
      item.area.toLowerCase().includes(ia.toLowerCase())
    )
    setFilteredData(filtered)
  }, [category, ia])

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Link
        href="/performance"
        className="mb-6 inline-flex items-center text-[#06C167] hover:text-[#05a75a] transition-colors duration-200"
      >
        <ChevronLeft className="mr-1" />
        Back to Clusters
      </Link>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">{category} - {ia}</h2>
      {filteredData.length > 0 ? (
        <InstructionalArea area={ia} indicators={filteredData} />
      ) : (
        <p className="text-gray-600">No performance indicators found for this instructional area.</p>
      )}
    </div>
  )
}

