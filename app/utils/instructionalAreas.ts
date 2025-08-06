import { performanceIndicators } from '../performanceIndicators'

export interface InstructionalArea {
  name: string
  code: string
  description: string
  piCount: number
}

/**
 * Get all unique instructional areas for a given category
 */
export function getInstructionalAreasByCategory(category: string): InstructionalArea[] {
  const categoryMapping: { [key: string]: string } = {
    'FINANCE': 'FINANCE',
    'MARKETING': 'MARKETING',
    'HOSPITALITY': 'HOSPITALITY',
    'MANAGEMENT': 'MANAGEMENT',
    'ENTREPRENEUR': 'ENTREPRENEURSHIP'
  }
  
  const mappedCategory = categoryMapping[category] || 'MANAGEMENT'
  
  // Get all PIs for this category
  const categoryPIs = performanceIndicators.filter(pi => 
    pi.category.includes(mappedCategory as any)
  )
  
  // Group by instructional area
  const areaMap = new Map<string, InstructionalArea>()
  
  categoryPIs.forEach(pi => {
    const areaName = pi.area.replace('Instructional Area: ', '').trim()
    
    if (!areaMap.has(areaName)) {
      // Extract code from the first PI in this area (e.g., "BL" from "BL:163")
      const codeMatch = pi.indicator.match(/\(([A-Z]+):\d+\)/)
      const code = codeMatch ? codeMatch[1] : areaName.substring(0, 2).toUpperCase()
      
      areaMap.set(areaName, {
        name: areaName,
        code: code,
        description: `Performance indicators related to ${areaName.toLowerCase()}`,
        piCount: 0
      })
    }
    
    // Increment PI count for this area
    const area = areaMap.get(areaName)!
    area.piCount++
  })
  
  // Convert to array and sort by name
  return Array.from(areaMap.values()).sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Get performance indicators for specific instructional areas
 */
export function getPerformanceIndicatorsByAreas(category: string, selectedAreas: string[]): string[] {
  const categoryMapping: { [key: string]: string } = {
    'FINANCE': 'FINANCE',
    'MARKETING': 'MARKETING',
    'HOSPITALITY': 'HOSPITALITY',
    'MANAGEMENT': 'MANAGEMENT',
    'ENTREPRENEUR': 'ENTREPRENEURSHIP'
  }
  
  const mappedCategory = categoryMapping[category] || 'MANAGEMENT'
  
  return performanceIndicators
    .filter(pi => {
      // Must be in the right category
      if (!pi.category.includes(mappedCategory as any)) return false
      
      // Must be in one of the selected instructional areas
      const areaName = pi.area.replace('Instructional Area: ', '').trim()
      return selectedAreas.includes(areaName)
    })
    .map(pi => pi.indicator.trim())
}