import { DECAEvent } from '../types'

export const DECA_EVENTS: DECAEvent[] = [
  // Finance Events
  {
    id: 'ACT',
    name: 'Accounting Applications Series',
    category: 'FINANCE',
    careerCluster: 'Finance',
    careerPathway: 'Accounting',
    description: 'Individual roleplay event focusing on accounting principles and applications in business scenarios',
    prepTime: 10,
    roleplayDuration: 10
  },
  {
    id: 'BFS',
    name: 'Business Finance Series',
    category: 'FINANCE',
    careerCluster: 'Finance',
    careerPathway: 'Business Finance',
    description: 'Individual roleplay event focusing on business financial management and analysis',
    prepTime: 10,
    roleplayDuration: 10
  },
  {
    id: 'PFL',
    name: 'Personal Financial Literacy',
    category: 'FINANCE',
    careerCluster: 'Finance',
    careerPathway: 'Financial Planning',
    description: 'Individual roleplay event focusing on personal finance management and financial literacy',
    prepTime: 10,
    roleplayDuration: 10
  },
  {
    id: 'PFN',
    name: 'Principles of Finance',
    category: 'FINANCE',
    careerCluster: 'Finance',
    careerPathway: 'Financial Services',
    description: 'Individual roleplay event covering fundamental finance principles and concepts',
    prepTime: 10,
    roleplayDuration: 10
  },

  // Marketing Events
  {
    id: 'AAM',
    name: 'Apparel and Accessories Marketing Series',
    category: 'MARKETING',
    careerCluster: 'Marketing',
    careerPathway: 'Marketing Management',
    description: 'Individual roleplay event focusing on marketing strategies for apparel and accessories retail',
    prepTime: 10,
    roleplayDuration: 10
  },
  {
    id: 'ASM',
    name: 'Automotive Services Marketing Series',
    category: 'MARKETING',
    careerCluster: 'Marketing',
    careerPathway: 'Marketing Management',
    description: 'Individual roleplay event focusing on marketing strategies for automotive services and dealerships',
    prepTime: 10,
    roleplayDuration: 10
  },
  {
    id: 'BSM',
    name: 'Business Services Marketing Series',
    category: 'MARKETING',
    careerCluster: 'Marketing',
    careerPathway: 'Marketing Management',
    description: 'Individual roleplay event focusing on marketing strategies for business-to-business services',
    prepTime: 10,
    roleplayDuration: 10
  },
  {
    id: 'FMS',
    name: 'Food Marketing Series',
    category: 'MARKETING',
    careerCluster: 'Marketing',
    careerPathway: 'Marketing Management',
    description: 'Individual roleplay event focusing on marketing strategies for food products and services',
    prepTime: 10,
    roleplayDuration: 10
  },
  {
    id: 'MCS',
    name: 'Marketing Communications Series',
    category: 'MARKETING',
    careerCluster: 'Marketing',
    careerPathway: 'Marketing Communications',
    description: 'Individual roleplay event focusing on integrated marketing communications and promotional strategies',
    prepTime: 10,
    roleplayDuration: 10
  },
  {
    id: 'PMK',
    name: 'Principles of Marketing',
    category: 'MARKETING',
    careerCluster: 'Marketing',
    careerPathway: 'Marketing Management',
    description: 'Individual roleplay event covering fundamental marketing principles and concepts',
    prepTime: 10,
    roleplayDuration: 10
  },
  {
    id: 'RMS',
    name: 'Retail Merchandising Series',
    category: 'MARKETING',
    careerCluster: 'Marketing',
    careerPathway: 'Merchandising',
    description: 'Individual roleplay event focusing on retail merchandising strategies and operations',
    prepTime: 10,
    roleplayDuration: 10
  },
  {
    id: 'SEM',
    name: 'Sports and Entertainment Marketing Series',
    category: 'MARKETING',
    careerCluster: 'Marketing',
    careerPathway: 'Marketing Communications',
    description: 'Individual roleplay event focusing on marketing strategies for sports and entertainment industries',
    prepTime: 10,
    roleplayDuration: 10
  },

  // Hospitality Events
  {
    id: 'HLM',
    name: 'Hotel and Lodging Management Series',
    category: 'HOSPITALITY',
    careerCluster: 'Hospitality and Tourism',
    careerPathway: 'Lodging Management',
    description: 'Individual roleplay event focusing on hotel and lodging operations management',
    prepTime: 10,
    roleplayDuration: 10
  },
  {
    id: 'PHT',
    name: 'Principles of Hospitality and Tourism',
    category: 'HOSPITALITY',
    careerCluster: 'Hospitality and Tourism',
    careerPathway: 'Hospitality Management',
    description: 'Individual roleplay event covering fundamental hospitality and tourism principles',
    prepTime: 10,
    roleplayDuration: 10
  },
  {
    id: 'QSRM',
    name: 'Quick Serve Restaurant Management Series',
    category: 'HOSPITALITY',
    careerCluster: 'Hospitality and Tourism',
    careerPathway: 'Restaurant Management',
    description: 'Individual roleplay event focusing on quick service restaurant operations and management',
    prepTime: 10,
    roleplayDuration: 10
  },
  {
    id: 'RFSM',
    name: 'Restaurant and Food Service Management Series',
    category: 'HOSPITALITY',
    careerCluster: 'Hospitality and Tourism',
    careerPathway: 'Restaurant and Food Service Management',
    description: 'Individual roleplay event focusing on restaurant and food service operations management',
    prepTime: 10,
    roleplayDuration: 10
  },

  // Management Events
  {
    id: 'HRM',
    name: 'Human Resources Management Series',
    category: 'MANAGEMENT',
    careerCluster: 'Business Management and Administration',
    careerPathway: 'Human Resources Management',
    description: 'Individual roleplay event focusing on human resources management practices and employee relations',
    prepTime: 10,
    roleplayDuration: 10
  },
  {
    id: 'PBM',
    name: 'Principles of Business Management and Administration',
    category: 'MANAGEMENT',
    careerCluster: 'Business Management and Administration',
    careerPathway: 'General Management',
    description: 'Individual roleplay event covering fundamental business management and administration principles',
    prepTime: 10,
    roleplayDuration: 10
  },

  // Entrepreneurship Events
  {
    id: 'ENT',
    name: 'Entrepreneurship Series',
    category: 'ENTREPRENEUR',
    careerCluster: 'Business Management and Administration',
    careerPathway: 'Entrepreneurship',
    description: 'Individual roleplay event focusing on entrepreneurial decision-making and startup challenges',
    prepTime: 10,
    roleplayDuration: 10
  },
  {
    id: 'PEN',
    name: 'Principles of Entrepreneurship',
    category: 'ENTREPRENEUR',
    careerCluster: 'Business Management and Administration',
    careerPathway: 'Entrepreneurship',
    description: 'Individual roleplay event covering fundamental entrepreneurship principles and concepts',
    prepTime: 10,
    roleplayDuration: 10
  },

  // Team Decision Making Events
  {
    id: 'BLTDM',
    name: 'Business Law and Ethics Team Decision Making',
    category: 'MANAGEMENT',
    careerCluster: 'Business Management and Administration',
    careerPathway: 'Business Law',
    description: 'Team event focusing on legal and ethical decision-making in business scenarios',
    prepTime: 30,
    roleplayDuration: 15
  },
  {
    id: 'BTDM',
    name: 'Buying and Merchandising Team Decision Making',
    category: 'MARKETING',
    careerCluster: 'Marketing',
    careerPathway: 'Merchandising',
    description: 'Team event focusing on buying decisions and merchandising strategies in retail',
    prepTime: 30,
    roleplayDuration: 15
  },
  {
    id: 'ETDM',
    name: 'Entrepreneurship Team Decision Making',
    category: 'ENTREPRENEUR',
    careerCluster: 'Business Management and Administration',
    careerPathway: 'Entrepreneurship',
    description: 'Team event focusing on entrepreneurial ventures and startup decision-making',
    prepTime: 30,
    roleplayDuration: 15
  },
  {
    id: 'FTDM',
    name: 'Financial Services Team Decision Making',
    category: 'FINANCE',
    careerCluster: 'Finance',
    careerPathway: 'Financial Services',
    description: 'Team event focusing on financial services industry decisions and client solutions',
    prepTime: 30,
    roleplayDuration: 15
  },
  {
    id: 'HTDM',
    name: 'Hospitality Services Team Decision Making',
    category: 'HOSPITALITY',
    careerCluster: 'Hospitality and Tourism',
    careerPathway: 'Hospitality Management',
    description: 'Team event focusing on hospitality service decisions and guest experience management',
    prepTime: 30,
    roleplayDuration: 15
  },
  {
    id: 'MTDM',
    name: 'Marketing Management Team Decision Making',
    category: 'MARKETING',
    careerCluster: 'Marketing',
    careerPathway: 'Marketing Management',
    description: 'Team event focusing on marketing strategy and management decisions',
    prepTime: 30,
    roleplayDuration: 15
  },
  {
    id: 'STDM',
    name: 'Sports and Entertainment Marketing Team Decision Making',
    category: 'MARKETING',
    careerCluster: 'Marketing',
    careerPathway: 'Marketing Communications',
    description: 'Team event focusing on sports and entertainment industry marketing decisions',
    prepTime: 30,
    roleplayDuration: 15
  },
  {
    id: 'TTDM',
    name: 'Travel and Tourism Team Decision Making',
    category: 'HOSPITALITY',
    careerCluster: 'Hospitality and Tourism',
    careerPathway: 'Travel and Tourism',
    description: 'Team event focusing on travel and tourism industry decisions and destination management',
    prepTime: 30,
    roleplayDuration: 15
  }
]

export const getEventsByCategory = (category: string): DECAEvent[] => {
  return DECA_EVENTS.filter(event => event.category === category)
}

export const getEventById = (id: string): DECAEvent | undefined => {
  return DECA_EVENTS.find(event => event.id === id)
}