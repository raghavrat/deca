'use client'

import { useState, useMemo, useEffect, useRef, Suspense } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { performanceIndicators } from '../../performanceIndicators'
import Link from 'next/link'
import { getIndicatorAnchorId } from '../../utils/piSlug'
import { useSearchParams, useRouter } from 'next/navigation'

const formatUrlSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[\/\-]/g, '') // Remove dashes and slashes
    .replace(/\s+/g, '-') // Replace spaces with dashes
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '')
  const [currentQuery, setCurrentQuery] = useState(searchParams.get('query') || '')
  const [showResults, setShowResults] = useState(!!searchParams.get('query'))
  const [selectedInstructionalArea, setSelectedInstructionalArea] = useState('all')
  const [selectedCluster, setSelectedCluster] = useState('all')
  const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false)
  const [isClusterDropdownOpen, setIsClusterDropdownOpen] = useState(false)
  const areaDropdownRef = useRef<HTMLDivElement>(null)
  const clusterDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (areaDropdownRef.current && !areaDropdownRef.current.contains(event.target as Node)) {
        setIsAreaDropdownOpen(false)
      }
      if (clusterDropdownRef.current && !clusterDropdownRef.current.contains(event.target as Node)) {
        setIsClusterDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get search results first (without area/cluster filters for initial filtering)
  const searchResults = useMemo(() => {
    if (!currentQuery || !showResults) return []
    
    return performanceIndicators
      .map(pi => {
        const query = currentQuery.toLowerCase()
        const indicatorMatch = pi.indicator.toLowerCase().includes(query)
        const textMatch = pi.text.toLowerCase().includes(query)
        
        return {
          ...pi,
          score: indicatorMatch ? 2 : (textMatch ? 1 : 0)
        }
      })
      .filter(pi => pi.score > 0)
      .sort((a, b) => b.score - a.score)
  }, [currentQuery, showResults])

  // Get unique instructional areas and clusters from search results
  const availableFilters = useMemo(() => {
    const areas = new Set<string>()
    const clusters = new Set<string>()
    
    searchResults.forEach(pi => {
      const areaName = pi.area.split(':')[1].trim()
      areas.add(areaName)
      pi.category.forEach(cat => clusters.add(cat))
    })
    
    return {
      areas: Array.from(areas).sort(),
      clusters: Array.from(clusters).sort()
    }
  }, [searchResults])

  // Apply filters to search results
  const filteredPIs = useMemo(() => {
    return searchResults.filter(pi => {
      const areaName = pi.area.split(':')[1].trim()
      const areaMatch = selectedInstructionalArea === 'all' || areaName === selectedInstructionalArea
      const clusterMatch = selectedCluster === 'all' || pi.category.includes(selectedCluster as any)
      return areaMatch && clusterMatch
    })
  }, [searchResults, selectedInstructionalArea, selectedCluster])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/performance/search?query=${encodeURIComponent(searchQuery.trim())}`)
      setCurrentQuery(searchQuery.trim())
      setShowResults(true)
      // Reset filters on new search
      setSelectedInstructionalArea('all')
      setSelectedCluster('all')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-light mb-12 text-center text-black dark:text-white">Search Performance Indicators</h1>
      
      <div className="mb-4 flex items-center justify-between w-full">
        <div className="flex-grow relative mr-4">
          <input
            type="text"
            placeholder="Search performance indicators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="input-minimal w-full px-4 py-3 pl-12 text-black dark:text-white bg-transparent border-0 border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-black dark:focus:border-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
        </div>
        <button 
          onClick={handleSearch}
          className="p-3 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors duration-200"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>

      {showResults && currentQuery && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-600 dark:text-gray-400">
              {filteredPIs.length} result{filteredPIs.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          <div className="flex items-center gap-3 justify-end">
            {/* Cluster Filter */}
            <div className="relative" ref={clusterDropdownRef}>
              <button
                onClick={() => setIsClusterDropdownOpen(!isClusterDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-colors duration-200"
              >
                <span className="text-black dark:text-white text-sm font-medium">
                  {selectedCluster === 'all' ? 'All Clusters' : selectedCluster}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-600 dark:text-gray-400 transition-transform ${isClusterDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isClusterDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 z-10 max-h-96 overflow-y-auto">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setSelectedCluster('all')
                        setIsClusterDropdownOpen(false)
                      }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                        selectedCluster === 'all' 
                          ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-medium' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      All Clusters
                    </button>
                    <div className="border-t border-gray-300 dark:border-gray-700 my-1"></div>
                    {availableFilters.clusters.map(cluster => (
                      <button
                        key={cluster}
                        onClick={() => {
                          setSelectedCluster(cluster)
                          setIsClusterDropdownOpen(false)
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                          selectedCluster === cluster 
                            ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-medium' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {cluster}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Instructional Area Filter */}
            <div className="relative" ref={areaDropdownRef}>
              <button
                onClick={() => setIsAreaDropdownOpen(!isAreaDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-colors duration-200"
              >
                <span className="text-black dark:text-white text-sm font-medium">
                  {selectedInstructionalArea === 'all' ? 'All Areas' : selectedInstructionalArea}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-600 dark:text-gray-400 transition-transform ${isAreaDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isAreaDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 z-10 max-h-96 overflow-y-auto">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setSelectedInstructionalArea('all')
                        setIsAreaDropdownOpen(false)
                      }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                        selectedInstructionalArea === 'all' 
                          ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-medium' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      All Areas
                    </button>
                    <div className="border-t border-gray-300 dark:border-gray-700 my-1"></div>
                    {availableFilters.areas.map(area => (
                      <button
                        key={area}
                        onClick={() => {
                          setSelectedInstructionalArea(area)
                          setIsAreaDropdownOpen(false)
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                          selectedInstructionalArea === area 
                            ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-medium' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {showResults && (
          currentQuery ? (
            filteredPIs.length > 0 ? (
              filteredPIs.map((pi, index) => {
                const areaName = pi.area.split(':')[1].trim()
                const urlSlug = formatUrlSlug(areaName)
                const anchor = getIndicatorAnchorId(pi.indicator)
                
                return (
                  <div key={index} className="p-4 sm:p-6 bg-white dark:bg-black border border-gray-300 dark:border-gray-700">
                    <h4 className="font-light text-black dark:text-white mb-2 break-words">{pi.indicator}</h4>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-2 text-sm sm:text-base">{pi.text}</p>
                    <Link 
                      href={`/performance/${pi.category[0].toLowerCase()}/${urlSlug}#${anchor}`}
                      className="text-sm font-medium nav-link inline-block"
                    >
                      View in {areaName}
                    </Link>
                  </div>
                )
              })
            ) : (
              <div className="text-center text-gray-500 py-4">
                No performance indicators found
              </div>
            )
          ) : (
            <div className="text-center text-gray-500 py-4">
              Start typing to search performance indicators
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
} 