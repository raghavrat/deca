import { DECAEvent } from '../types'

export const DECA_EVENTS: DECAEvent[] = [
  // Finance Events
  {
    id: 'ACT',
    name: 'Accounting Applications Series',
    category: 'FINANCE',
    careerCluster: 'Finance',
    careerPathway: 'Accounting',
    description: 'Individual roleplay event focusing on accounting principles and applications in business scenarios'
  },
  {
    id: 'BFS',
    name: 'Business Finance Series',
    category: 'FINANCE',
    careerCluster: 'Finance',
    careerPathway: 'Business Finance',
    description: 'Individual roleplay event focusing on business financial management and analysis'
  },
  {
    id: 'PFL',
    name: 'Personal Financial Literacy',
    category: 'FINANCE',
    careerCluster: 'Finance',
    careerPathway: 'Financial Planning',
    description: 'Individual roleplay event focusing on personal finance management and financial literacy'
  },
  {
    id: 'PFN',
    name: 'Principles of Finance',
    category: 'FINANCE',
    careerCluster: 'Finance',
    careerPathway: 'Financial Services',
    description: 'Individual roleplay event covering fundamental finance principles and concepts'
  },

  // Marketing Events
  {
    id: 'AAM',
    name: 'Apparel and Accessories Marketing Series',
    category: 'MARKETING',
    careerCluster: 'Marketing',
    careerPathway: 'Marketing Management',
    description: 'Individual roleplay event focusing on marketing strategies for apparel and accessories retail'
  },
  {
    id: 'ASM',
    name: 'Automotive Services Marketing Series',
    category: 'MARKETING',
    careerCluster: 'Marketing',
    careerPathway: 'Marketing Management',
    description: 'Individual roleplay event focusing on marketing strategies for automotive services and dealerships'
  },
  {
    id: 'BSM',
    name: 'Business Services Marketing Series',
    category: 'MARKETING',
    careerCluster: 'Marketing',
    careerPathway: 'Marketing Management',
    description: 'Individual roleplay event focusing on marketing strategies for business-to-business services'
  },
  {
    id: 'FMS',
    name: 'Food Marketing Series',
    category: 'MARKETING',
    careerCluster: 'Marketing',
    careerPathway: 'Marketing Management',
    description: 'Individual roleplay event focusing on marketing strategies for food products and services'
  },
  {
    id: 'MCS',
    name: 'Marketing Communications Series',
    category: 'MARKETING',
    careerCluster: 'Marketing',
    careerPathway: 'Marketing Communications',
    description: 'Individual roleplay event focusing on integrated marketing communications and promotional strategies'
  },
  {
    id: 'PMK',
    name: 'Principles of Marketing',
    category: 'MARKETING',
    careerCluster: 'Marketing',
    careerPathway: 'Marketing Management',
    description: 'Individual roleplay event covering fundamental marketing principles and concepts'
  },
  {
    id: 'RMS',
    name: 'Retail Merchandising Series',
    category: 'MARKETING',
    careerCluster: 'Marketing',
    careerPathway: 'Merchandising',
    description: 'Individual roleplay event focusing on retail merchandising strategies and operations'
  },
  {
    id: 'SEM',
    name: 'Sports and Entertainment Marketing Series',
    category: 'MARKETING',
    careerCluster: 'Marketing',
    careerPathway: 'Marketing Communications',
    description: 'Individual roleplay event focusing on marketing strategies for sports and entertainment industries'
  },

  // Hospitality Events
  {
    id: 'HLM',
    name: 'Hotel and Lodging Management Series',
    category: 'HOSPITALITY',
    careerCluster: 'Hospitality and Tourism',
    careerPathway: 'Lodging Management',
    description: 'Individual roleplay event focusing on hotel and lodging operations management'
  },
  {
    id: 'PHT',
    name: 'Principles of Hospitality and Tourism',
    category: 'HOSPITALITY',
    careerCluster: 'Hospitality and Tourism',
    careerPathway: 'Hospitality Management',
    description: 'Individual roleplay event covering fundamental hospitality and tourism principles'
  },
  {
    id: 'QSRM',
    name: 'Quick Serve Restaurant Management Series',
    category: 'HOSPITALITY',
    careerCluster: 'Hospitality and Tourism',
    careerPathway: 'Restaurant Management',
    description: 'Individual roleplay event focusing on quick service restaurant operations and management'
  },
  {
    id: 'RFSM',
    name: 'Restaurant and Food Service Management Series',
    category: 'HOSPITALITY',
    careerCluster: 'Hospitality and Tourism',
    careerPathway: 'Restaurant and Food Service Management',
    description: 'Individual roleplay event focusing on restaurant and food service operations management'
  },

  // Management Events
  {
    id: 'HRM',
    name: 'Human Resources Management Series',
    category: 'MANAGEMENT',
    careerCluster: 'Business Management and Administration',
    careerPathway: 'Human Resources Management',
    description: 'Individual roleplay event focusing on human resources management practices and employee relations'
  },
  {
    id: 'PBM',
    name: 'Principles of Business Management and Administration',
    category: 'MANAGEMENT',
    careerCluster: 'Business Management and Administration',
    careerPathway: 'General Management',
    description: 'Individual roleplay event covering fundamental business management and administration principles'
  },

  // Entrepreneurship Events
  {
    id: 'ENT',
    name: 'Entrepreneurship Series',
    category: 'ENTREPRENEUR',
    careerCluster: 'Business Management and Administration',
    careerPathway: 'Entrepreneurship',
    description: 'Individual roleplay event focusing on entrepreneurial decision-making and startup challenges'
  },
  {
    id: 'PEN',
    name: 'Principles of Entrepreneurship',
    category: 'ENTREPRENEUR',
    careerCluster: 'Business Management and Administration',
    careerPathway: 'Entrepreneurship',
    description: 'Individual roleplay event covering fundamental entrepreneurship principles and concepts'
  }
]

export const getEventsByCategory = (category: string): DECAEvent[] => {
  return DECA_EVENTS.filter(event => event.category === category)
}

export const getEventById = (id: string): DECAEvent | undefined => {
  return DECA_EVENTS.find(event => event.id === id)
}