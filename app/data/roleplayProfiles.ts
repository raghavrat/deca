import type { DECAEvent } from '../types'

export type RoleplayFormat = 'individual-series' | 'principles' | 'team-decision' | 'personal-financial-literacy'

export interface HistoricalInstructionalArea {
  name: string
  count: number
  percent: number
}

export interface ScenarioArchetype {
  id: string
  label: string
  weight: number
  participantRoles: string[]
  judgeRoles: string[]
  settings: string[]
  tasks: string[]
  complications: string[]
}

export interface RoleplayProfile {
  eventCode: string
  format: RoleplayFormat
  officialScope: string
  promptDirectives: string[]
  historicalSample: {
    publicCases: number
    yearRange: [number, number]
    instructionalAreas: HistoricalInstructionalArea[]
  }
  archetypes: ScenarioArchetype[]
  officialPage: string
}

export interface FormatRules {
  participantCount: number
  preliminaryAppearances: string
  prepMinutes: number
  presentationMinutes: number
  performanceIndicatorCount: number
  performanceIndicatorMax: number
  solutionMax: number
  careerCompetencyCount: number
  careerCompetencyMax: number
  overallImpressionMax: number
  situationLabel: 'Event Situation' | 'Case Study Situation'
}

export const CAREER_COMPETENCIES = [
  'Critical Thinking - Think critically to understand and solve problems.',
  'Communication - Communicate clearly, effectively and with reason.',
  'Decision Making - Consider the impacts of decisions.',
  'Innovation - Demonstrate a creative and innovative mindset.',
  'Collaboration - Participate and advocate in groups to achieve common goals.',
] as const

export const FORMAT_RULES: Record<RoleplayFormat, FormatRules> = {
  'individual-series': {
    participantCount: 1,
    preliminaryAppearances: 'Two preliminary role-plays; a third role-play for finalists',
    prepMinutes: 10,
    presentationMinutes: 10,
    performanceIndicatorCount: 5,
    performanceIndicatorMax: 10,
    solutionMax: 8,
    careerCompetencyCount: 3,
    careerCompetencyMax: 6,
    overallImpressionMax: 8,
    situationLabel: 'Event Situation',
  },
  principles: {
    participantCount: 1,
    preliminaryAppearances: 'One preliminary role-play; a second role-play for finalists',
    prepMinutes: 10,
    presentationMinutes: 10,
    performanceIndicatorCount: 4,
    performanceIndicatorMax: 12,
    solutionMax: 8,
    careerCompetencyCount: 3,
    careerCompetencyMax: 6,
    overallImpressionMax: 10,
    situationLabel: 'Event Situation',
  },
  'team-decision': {
    participantCount: 2,
    preliminaryAppearances: 'One preliminary case study; a second case study for finalists',
    prepMinutes: 30,
    presentationMinutes: 15,
    // 2026–27 format. The 2025–26 format used seven PIs; DECA replaced two of
    // those scoring slots with a separate three-part Solution section.
    performanceIndicatorCount: 5,
    performanceIndicatorMax: 10,
    solutionMax: 8,
    careerCompetencyCount: 3,
    careerCompetencyMax: 6,
    overallImpressionMax: 8,
    situationLabel: 'Case Study Situation',
  },
  'personal-financial-literacy': {
    participantCount: 1,
    preliminaryAppearances: 'One preliminary role-play; a second role-play for finalists',
    prepMinutes: 10,
    presentationMinutes: 10,
    performanceIndicatorCount: 3,
    performanceIndicatorMax: 17,
    solutionMax: 8,
    careerCompetencyCount: 3,
    careerCompetencyMax: 6,
    overallImpressionMax: 7,
    situationLabel: 'Event Situation',
  },
}

const archetype = (
  id: string,
  label: string,
  weight: number,
  participantRoles: string[],
  judgeRoles: string[],
  settings: string[],
  tasks: string[],
  complications: string[],
): ScenarioArchetype => ({ id, label, weight, participantRoles, judgeRoles, settings, tasks, complications })

const profile = (
  eventCode: string,
  format: RoleplayFormat,
  officialScope: string,
  publicCases: number,
  instructionalAreas: HistoricalInstructionalArea[],
  archetypes: ScenarioArchetype[],
  promptDirectives: string[] = [],
  firstYear = 2017,
  slug?: string,
): RoleplayProfile => ({
  eventCode,
  format,
  officialScope,
  promptDirectives,
  historicalSample: { publicCases, yearRange: [firstYear, 2026], instructionalAreas },
  archetypes,
  officialPage: `https://www.deca.org/compete/${slug || eventCode.toLowerCase()}`,
})

const mix = (...rows: Array<[string, number, number]>): HistoricalInstructionalArea[] =>
  rows.map(([name, count, percent]) => ({ name, count, percent }))

export const ROLEPLAY_PROFILES: Record<string, RoleplayProfile> = {
  ACT: profile('ACT', 'individual-series', 'Apply accounting data to planning: organize records, build and interpret reports, explain financial statements and use analysis for business decisions.', 37,
    mix(['Financial Analysis', 29, 78], ['Professional Development', 6, 16], ['Information Management', 2, 5]), [
      archetype('transaction-cycle', 'Accounting cycle and transaction analysis', 30, ['accounting associate', 'staff accountant'], ['owner', 'accounting manager'], ['small-business office', 'controller meeting'], ['classify transactions', 'show effects on the accounting equation', 'explain the accounting cycle'], ['incomplete records', 'a classification disagreement', 'a deadline before month-end close']),
      archetype('statements', 'Financial statements and management interpretation', 30, ['accountant', 'senior accounting analyst'], ['owner', 'company president'], ['finance office', 'management review'], ['interpret statements', 'compare periods', 'explain decision impacts'], ['one unusual transaction', 'conflicting trend signals', 'limited cash despite reported profit']),
      archetype('controls', 'Internal controls and accuracy', 20, ['accounting manager', 'accounting consultant'], ['owner', 'controller'], ['growing business', 'audit-preparation meeting'], ['identify control gaps', 'recommend segregation of duties', 'design a reconciliation process'], ['small staff', 'missing documentation', 'pressure to move quickly']),
      archetype('planning', 'Budgeting and reporting decision', 20, ['cost accountant', 'accounting consultant'], ['department manager', 'business owner'], ['budget meeting', 'expansion planning session'], ['organize cost data', 'prepare a simple forecast', 'recommend an option'], ['fixed budget cap', 'seasonal demand', 'a tradeoff between margin and growth']),
    ], ['Require internally consistent numbers and enough data for at least one calculation.', 'Never ask for tax, audit or legal conclusions beyond a student accounting case.'], 2017, 'accounting-applications-series'),

  BFS: profile('BFS', 'individual-series', 'Use high-level financial and business planning, reports, statement analysis and corporate-finance reasoning to guide management decisions.', 41,
    mix(['Financial Analysis', 33, 80], ['Economics', 4, 10], ['Professional Development', 4, 10]), [
      archetype('capital-budget', 'Capital budgeting and funding choice', 25, ['finance manager', 'financial analyst'], ['president', 'owner'], ['capital review', 'expansion meeting'], ['compare financing options', 'estimate financial impact', 'recommend a funding path'], ['interest-rate change', 'cash constraint', 'different risk tolerances']),
      archetype('statement-decision', 'Financial-statement decision support', 30, ['financial analyst', 'corporate finance associate'], ['president', 'vice president of finance'], ['quarterly review', 'board-prep meeting'], ['interpret ratios and trends', 'identify causes', 'recommend corrective action'], ['revenue growth with weaker cash flow', 'one-time expense', 'industry benchmark gap']),
      archetype('cash-risk', 'Cash-flow and risk management', 25, ['treasury analyst', 'finance manager'], ['controller', 'owner'], ['cash planning meeting', 'risk review'], ['build a cash response', 'rank risks', 'set monitoring measures'], ['seasonality', 'late-paying customer', 'supplier price shock']),
      archetype('finance-communication', 'Explain a finance decision to management', 20, ['financial planner', 'finance business partner'], ['department leader', 'client'], ['management briefing', 'client meeting'], ['translate financial data', 'compare alternatives', 'address objections'], ['nonfinancial audience', 'limited budget', 'short decision window']),
    ], ['Make every financial recommendation traceable to the supplied figures.', 'Do not turn BFS into personal financial advice.'], 2017, 'business-finance-series'),

  PFL: profile('PFL', 'personal-financial-literacy', 'Apply reliable information and systematic decision making to an individual or household financial choice.', 21,
    mix(['Managing Credit', 7, 33], ['Earning Income', 4, 19], ['Spending', 4, 19], ['Investing', 2, 10], ['Managing Risk', 2, 10], ['Saving', 2, 10]), [
      archetype('credit', 'Credit and borrowing decision', 33, ['financial advisor', 'loan officer'], ['client', 'customer'], ['advisor office', 'bank consultation'], ['compare borrowing costs', 'explain credit consequences', 'recommend a repayment approach'], ['introductory rate', 'limited cash', 'thin credit history']),
      archetype('income', 'Income and compensation decision', 19, ['human resources specialist', 'financial counselor'], ['new employee', 'client'], ['workplace orientation', 'counseling meeting'], ['interpret a pay statement', 'compare compensation', 'explain taxes or deductions'], ['variable hours', 'benefit tradeoff', 'unexpected deduction']),
      archetype('spending', 'Budgeting and spending tradeoff', 19, ['financial counselor', 'consumer educator'], ['client', 'student customer'], ['counseling office', 'community workshop'], ['build a spending plan', 'separate needs from wants', 'compare alternatives'], ['short-term goal', 'unexpected cost', 'social pressure']),
      archetype('investing', 'Saving and investing choice', 10, ['investment counselor', 'financial advisor'], ['new investor', 'client'], ['nonprofit counseling office', 'advisor meeting'], ['explain risk and return', 'compare diversified options', 'identify fees and time horizon'], ['low risk tolerance', 'short deadline', 'misleading social-media advice']),
      archetype('risk', 'Insurance and personal risk', 10, ['insurance agent', 'financial educator'], ['new client', 'young adult'], ['insurance consultation', 'community center'], ['identify exposures', 'compare coverage and deductibles', 'recommend risk controls'], ['budget limit', 'coverage exclusion', 'identity-theft concern']),
      archetype('saving', 'Savings goal and emergency plan', 9, ['financial advisor', 'bank representative'], ['client', 'customer'], ['bank office', 'financial coaching session'], ['set a measurable goal', 'compare savings vehicles', 'create an automatic plan'], ['irregular income', 'competing goal', 'low starting balance']),
    ], ['Keep the facts age-appropriate and educational, not individualized legal, tax or investment advice.', 'Use plain language and realistic personal-dollar amounts.'], 2017, 'personal-financial-literacy'),

  PFN: profile('PFN', 'principles', 'Use entry-level concepts from accounting, banking services, business finance, insurance, securities and investments.', 21,
    mix(['Customer Relations', 7, 33], ['Information Management', 4, 19], ['Communications', 2, 10], ['Economics', 2, 10]), [
      archetype('bank-customer', 'Bank customer explanation', 35, ['bank teller', 'customer service representative'], ['customer', 'new customer'], ['bank branch', 'credit-union lobby'], ['explain a basic product', 'clarify a policy', 'recommend a next step'], ['confused customer', 'fee concern', 'privacy-sensitive question']),
      archetype('coworker-training', 'Explain a finance process to a coworker', 25, ['junior teller', 'finance assistant'], ['new employee', 'coworker'], ['workstation', 'orientation meeting'], ['explain a procedure', 'model accurate communication', 'identify escalation points'], ['new system', 'busy period', 'incomplete form']),
      archetype('basic-analysis', 'Foundational finance comparison', 20, ['financial services employee', 'finance assistant'], ['supervisor', 'client'], ['branch office', 'team meeting'], ['compare two options', 'explain a simple calculation', 'state risks'], ['limited information', 'misunderstood term', 'time constraint']),
      archetype('insurance-investing', 'Insurance or investment fundamentals', 20, ['customer representative', 'financial services trainee'], ['customer', 'supervisor'], ['service desk', 'advisor office'], ['explain core terminology', 'identify customer needs', 'describe responsible next steps'], ['risk misconception', 'online misinformation', 'budget constraint']),
    ], ['Use a first-year participant role and foundational concepts; avoid specialist-level finance modeling.'], 2017, 'principles-of-finance'),

  AAM: profile('AAM', 'individual-series', 'Perform retail marketing and management for apparel, accessories and personal-wear merchandise in retail or wholesale settings.', 41,
    mix(['Customer Relations', 8, 20], ['Product/Service Management', 8, 20], ['Selling', 6, 15], ['Market Planning', 4, 10], ['Promotion', 4, 10]), [
      archetype('assortment', 'Assortment and merchandise decision', 25, ['merchandising manager', 'buyer'], ['director of merchandising', 'senior vice president'], ['buying office', 'line review'], ['choose an assortment', 'justify depth and breadth', 'plan launch timing'], ['trend uncertainty', 'limited open-to-buy', 'size or inventory imbalance']),
      archetype('selling-service', 'Customer experience and selling', 25, ['store manager', 'sales manager'], ['district manager', 'store owner'], ['apparel store', 'service review'], ['improve selling behaviors', 'resolve a customer issue', 'protect brand loyalty'], ['return-policy tension', 'out-of-stock item', 'accessibility need']),
      archetype('brand-promotion', 'Brand launch and promotion', 25, ['brand manager', 'marketing manager'], ['director of marketing', 'vice president'], ['brand office', 'campaign review'], ['define target market', 'create launch message', 'select channels'], ['small budget', 'influencer controversy', 'short seasonal window']),
      archetype('retail-plan', 'Retail market and operations plan', 25, ['assistant manager', 'retail strategist'], ['owner', 'district manager'], ['store office', 'expansion meeting'], ['analyze local demand', 'recommend store changes', 'set success measures'], ['new competitor', 'changing foot traffic', 'inventory constraint']),
    ], ['Use apparel/accessory-specific customer behavior, seasonality, sizing, style or inventory realities.'], 2017, 'apparel-and-accessories-marketing-series'),

  ASM: profile('ASM', 'individual-series', 'Perform marketing and management tasks for auto dealers, service stations, repair/service businesses or auto-parts stores.', 37,
    mix(['Customer Relations', 9, 24], ['Promotion', 8, 22], ['Communications', 4, 11], ['Market Planning', 4, 11]), [
      archetype('service-trust', 'Service recovery and customer trust', 30, ['service center manager', 'assistant manager'], ['general manager', 'owner'], ['dealership service lane', 'repair shop office'], ['explain a repair or policy', 'resolve dissatisfaction', 'retain the customer'], ['delayed part', 'unexpected cost', 'safety concern']),
      archetype('traffic-promotion', 'Traffic-building promotion', 25, ['marketing manager', 'dealership marketing specialist'], ['general manager', 'director of marketing'], ['dealership', 'auto-service chain'], ['select a target segment', 'design an offer', 'plan measurement'], ['manufacturer rules', 'low margin', 'seasonal demand']),
      archetype('sales-consultation', 'Vehicle or service selling strategy', 20, ['sales manager', 'customer experience manager'], ['district manager', 'owner'], ['showroom', 'sales meeting'], ['improve needs discovery', 'handle objections', 'recommend follow-up'], ['online price comparison', 'financing concern', 'trade-in expectation']),
      archetype('market-operations', 'Automotive market and service operations', 25, ['general manager', 'parts manager'], ['owner', 'regional manager'], ['service center', 'parts store'], ['respond to market change', 'improve capacity', 'communicate a service change'], ['electric-vehicle shift', 'technician shortage', 'inventory delay']),
    ], ['Use accurate automotive-retail/service terminology without requiring mechanical expertise.'], 2017, 'automotive-services-marketing-series'),

  BSM: profile('BSM', 'individual-series', 'Market fee- or contract-based services to business customers, with emphasis on client value, trust and long-term relationships.', 41,
    mix(['Customer Relations', 9, 22], ['Market Planning', 8, 20], ['Promotion', 8, 20], ['Product/Service Management', 4, 10]), [
      archetype('b2b-acquisition', 'B2B client acquisition', 30, ['business development manager', 'sales manager'], ['owner', 'director of sales'], ['client pitch', 'agency office'], ['define the buying organization', 'build a value proposition', 'plan lead generation'], ['long sales cycle', 'multiple decision-makers', 'established competitor']),
      archetype('service-package', 'Service packaging and pricing', 25, ['service marketing manager', 'general manager'], ['owner', 'senior vice president'], ['service firm', 'product meeting'], ['redesign service tiers', 'explain pricing', 'protect service quality'], ['scope creep', 'capacity limit', 'price-sensitive client']),
      archetype('client-retention', 'Client retention and recovery', 25, ['account manager', 'customer success manager'], ['regional manager', 'client executive'], ['renewal meeting', 'service review'], ['diagnose dissatisfaction', 'propose recovery', 'set follow-up measures'], ['missed service level', 'communication gap', 'renewal deadline']),
      archetype('market-expansion', 'Business-services market expansion', 20, ['marketing manager', 'market analyst'], ['company president', 'owner'], ['strategy meeting', 'new-market review'], ['select a segment', 'choose channels', 'estimate practical rollout'], ['limited proof points', 'local regulations', 'small promotion budget']),
    ], ['Keep the buyer a business or organization rather than a mass-market retail shopper.'], 2017, 'business-services-marketing-series'),

  FMS: profile('FMS', 'individual-series', 'Perform marketing and management for retail and wholesale establishments primarily selling food.', 41,
    mix(['Customer Relations', 8, 20], ['Economics', 6, 15], ['Product/Service Management', 6, 15], ['Marketing', 5, 12], ['Selling', 4, 10]), [
      archetype('category-product', 'Food category or product decision', 25, ['category manager', 'product manager'], ['director of merchandising', 'senior vice president'], ['grocery office', 'category review'], ['manage assortment', 'position a product', 'plan in-store execution'], ['short shelf life', 'supplier shortage', 'dietary trend']),
      archetype('shopper-trust', 'Shopper relations and trust', 25, ['store manager', 'customer experience manager'], ['owner', 'regional manager'], ['grocery store', 'customer-service review'], ['address a concern', 'communicate product information', 'preserve loyalty'], ['recall rumor', 'label confusion', 'price complaint']),
      archetype('food-economics', 'Pricing and food-market economics', 20, ['marketing analyst', 'general manager'], ['chief marketing officer', 'owner'], ['pricing meeting', 'food retailer'], ['respond to cost changes', 'recommend pricing', 'explain customer impact'], ['inflation', 'food waste', 'competitor discount']),
      archetype('promotion-selling', 'Food promotion and selling', 30, ['marketing specialist', 'branding manager'], ['marketing director', 'store owner'], ['campaign review', 'store launch'], ['define target shopper', 'design a promotion', 'set sales measures'], ['seasonal demand', 'limited sampling budget', 'health claim restrictions']),
    ], ['Use food-retail realities such as perishability, safety, labeling, seasonality and category margins.'], 2017, 'food-marketing-series'),

  MCS: profile('MCS', 'individual-series', 'Inform, persuade or remind target markets through coordinated marketing communications and measurable messages.', 41,
    mix(['Promotion', 16, 39], ['Marketing', 7, 17], ['Market Planning', 6, 15], ['Customer Relations', 4, 10], ['Product/Service Management', 4, 10]), [
      archetype('campaign', 'Integrated campaign recommendation', 35, ['marketing communications manager', 'campaign strategist'], ['director of marketing', 'vice president'], ['campaign briefing', 'agency presentation'], ['define audience and objective', 'build message strategy', 'choose coordinated channels'], ['tight budget', 'short launch window', 'competing audience needs']),
      archetype('reputation', 'Reputation and crisis communication', 20, ['public relations manager', 'communications director'], ['company president', 'executive director'], ['crisis meeting', 'media-response briefing'], ['assess stakeholders', 'draft response approach', 'protect credibility'], ['viral criticism', 'incomplete facts', 'employee leak']),
      archetype('content-channel', 'Content and channel plan', 25, ['social media manager', 'communications specialist'], ['director of marketing', 'brand owner'], ['content review', 'brand planning session'], ['develop content pillars', 'match channels to audience', 'set cadence and metrics'], ['platform change', 'small creative team', 'brand-safety concern']),
      archetype('research-measurement', 'Audience insight and campaign measurement', 20, ['marketing analyst', 'communications consultant'], ['senior vice president', 'client'], ['results review', 'research briefing'], ['interpret campaign data', 'identify insight', 'recommend optimization'], ['conflicting metrics', 'weak conversion', 'limited sample']),
    ], ['Make message, audience, channels, timing and measurement explicit.'], 2017, 'marketing-communications-series'),

  PMK: profile('PMK', 'principles', 'Use first-year concepts from marketing communications, marketing management, research, merchandising and professional selling.', 21,
    mix(['Professional Development', 6, 29], ['Operations', 4, 19], ['Economics', 3, 14], ['Communications', 2, 10], ['Customer Relations', 2, 10]), [
      archetype('frontline-communication', 'Frontline marketing communication', 30, ['employee', 'marketing assistant'], ['supervisor', 'store manager'], ['retail floor', 'team briefing'], ['explain a change', 'choose a communication method', 'respond professionally'], ['upset customer', 'new policy', 'limited notice']),
      archetype('customer-service', 'Customer relations fundamentals', 25, ['sales associate', 'customer service employee'], ['customer', 'supervisor'], ['store', 'service counter'], ['identify a need', 'resolve a basic concern', 'follow policy'], ['out-of-stock product', 'return request', 'misunderstood promotion']),
      archetype('basic-promotion', 'Basic promotion or merchandising choice', 25, ['marketing trainee', 'store employee'], ['manager', 'owner'], ['small business', 'store meeting'], ['identify target market', 'recommend a simple tactic', 'explain expected result'], ['small budget', 'local competitor', 'short time frame']),
      archetype('workplace-readiness', 'Marketing workplace readiness', 20, ['new employee', 'marketing intern'], ['supervisor', 'coworker'], ['orientation', 'department meeting'], ['demonstrate professional behavior', 'organize a task', 'explain a core concept'], ['conflicting priorities', 'new technology', 'customer deadline']),
    ], ['Keep the participant at entry level and make the concepts explainable by a first-year DECA member.'], 2017, 'principles-of-marketing'),

  RMS: profile('RMS', 'individual-series', 'Perform marketing and management functions applicable to general retail establishments.', 41,
    mix(['Promotion', 8, 20], ['Market Planning', 7, 17], ['Product/Service Management', 6, 15], ['Economics', 4, 10], ['Marketing', 4, 10]), [
      archetype('assortment-inventory', 'Assortment and inventory strategy', 30, ['merchandising specialist', 'buyer'], ['director of merchandising', 'senior vice president'], ['merchandise review', 'buying office'], ['select products', 'plan inventory levels', 'manage product lifecycle'], ['excess stock', 'supplier delay', 'seasonal transition']),
      archetype('retail-promotion', 'Retail promotion plan', 25, ['marketing specialist', 'brand manager'], ['director of marketing', 'district vice president'], ['campaign meeting', 'store office'], ['define target shopper', 'design promotion', 'plan measurement'], ['low traffic', 'small budget', 'channel conflict']),
      archetype('store-experience', 'Store operations and customer experience', 20, ['general manager', 'assistant manager'], ['district manager', 'store owner'], ['retail store', 'operations review'], ['improve service flow', 'resolve policy issue', 'train staff'], ['labor shortage', 'accessibility barrier', 'returns spike']),
      archetype('market-pricing', 'Retail market or pricing decision', 25, ['retail analyst', 'category manager'], ['senior vice president', 'owner'], ['strategy review', 'pricing meeting'], ['analyze competition', 'recommend price or channel strategy', 'protect margin'], ['new competitor', 'online comparison', 'cost increase']),
    ], ['Use retail metrics and tradeoffs such as traffic, conversion, units, margin, inventory and omnichannel behavior.'], 2017, 'retail-merchandising-series'),

  SEM: profile('SEM', 'individual-series', 'Perform marketing and management for sports, entertainment, recreation, hobbies and cultural or leisure events.', 41,
    mix(['Customer Relations', 6, 15], ['Market Planning', 6, 15], ['Selling', 6, 15], ['Economics', 4, 10], ['Product/Service Management', 4, 10], ['Promotion', 4, 10]), [
      archetype('sponsorship-sales', 'Sponsorship or partnership sale', 25, ['sales manager', 'partnership manager'], ['marketing director', 'team owner'], ['sponsor pitch', 'venue office'], ['match sponsor objectives', 'build benefits', 'handle objections'], ['category exclusivity', 'reputation risk', 'limited inventory']),
      archetype('fan-experience', 'Fan or guest experience', 25, ['event manager', 'recreation manager'], ['general manager', 'athletic director'], ['arena', 'festival or cultural venue'], ['improve experience', 'resolve a customer issue', 'plan service recovery'], ['weather disruption', 'long lines', 'social-media complaint']),
      archetype('event-promotion', 'Event or entertainment promotion', 25, ['promotions manager', 'marketing manager'], ['director of marketing', 'senior vice president'], ['campaign meeting', 'event office'], ['select audience', 'create promotion', 'set ticket or attendance goals'], ['late ticket sales', 'small budget', 'competing event']),
      archetype('distribution-pricing', 'Ticketing, distribution or pricing strategy', 25, ['revenue manager', 'channel manager'], ['owner', 'general manager'], ['ticketing review', 'tour planning'], ['choose channels', 'recommend pricing', 'balance reach and revenue'], ['resale concerns', 'capacity constraint', 'variable demand']),
    ], ['Use realistic rights, sponsorship, attendance, ticketing, fan-engagement or event-delivery constraints.'], 2017, 'sports-and-entertainment-marketing-series'),

  HLM: profile('HLM', 'individual-series', 'Perform marketing and management in hotels, motels, lodging, conventions, and lodging-related food and beverage services.', 39,
    mix(['Customer Relations', 8, 21], ['Marketing', 6, 15], ['Selling', 5, 13], ['Operations', 4, 10], ['Product/Service Management', 4, 10], ['Promotion', 4, 10]), [
      archetype('guest-recovery', 'Guest service and recovery', 25, ['front desk manager', 'rooms manager'], ['general manager', 'guest'], ['hotel front office', 'manager office'], ['resolve a guest issue', 'protect loyalty', 'prevent recurrence'], ['overbooking', 'room unavailable', 'service failure']),
      archetype('revenue-service', 'Revenue and service design', 25, ['revenue manager', 'general manager'], ['owner', 'investor'], ['revenue meeting', 'property review'], ['adjust package or pricing', 'forecast demand', 'preserve guest value'], ['low season', 'new competitor', 'cost increase']),
      archetype('group-event-sales', 'Group, convention or event sales', 25, ['sales manager', 'convention services manager'], ['director of sales', 'client'], ['site visit', 'group-sales pitch'], ['build a package', 'address client needs', 'coordinate departments'], ['limited rooms', 'food-and-beverage minimum', 'date conflict']),
      archetype('property-operations', 'Lodging operations decision', 25, ['operations manager', 'general manager'], ['owner', 'district manager'], ['property office', 'staff briefing'], ['improve a process', 'allocate staff', 'communicate a change'], ['labor shortage', 'renovation', 'technology outage']),
    ], ['Include hotel measures or realities such as occupancy, ADR, RevPAR, service recovery, room inventory or group blocks when relevant.'], 2017, 'hotel-and-lodging-management-series'),

  PHT: profile('PHT', 'principles', 'Use first-year concepts from hotel, restaurant, tourism and travel careers.', 21,
    mix(['Communications', 6, 29], ['Economics', 6, 29], ['Customer Relations', 4, 19], ['Professional Development', 3, 14], ['Emotional Intelligence', 2, 10]), [
      archetype('guest-communication', 'Guest communication fundamentals', 30, ['front desk employee', 'tourism employee'], ['guest', 'supervisor'], ['hotel desk', 'visitor center'], ['explain information', 'choose a communication method', 'confirm understanding'], ['language barrier', 'service change', 'busy period']),
      archetype('restaurant-service', 'Restaurant service fundamentals', 25, ['server', 'host'], ['customer', 'restaurant manager'], ['restaurant', 'service briefing'], ['respond to a guest', 'explain a policy', 'demonstrate hospitality'], ['wait-time complaint', 'allergy question', 'reservation issue']),
      archetype('travel-tourism', 'Travel and tourism fundamentals', 25, ['travel assistant', 'visitor-services employee'], ['traveler', 'supervisor'], ['travel agency', 'tourism office'], ['identify traveler needs', 'explain an option', 'recommend a practical next step'], ['weather concern', 'budget limit', 'schedule change']),
      archetype('hospitality-readiness', 'Hospitality workplace readiness', 20, ['new employee', 'hospitality trainee'], ['manager', 'coworker'], ['orientation', 'staff meeting'], ['prioritize service', 'demonstrate professionalism', 'explain a core concept'], ['competing guest requests', 'new procedure', 'staff shortage']),
    ], ['Use entry-level roles and solvable service situations rather than advanced property finance.'], 2017, 'principles-of-hospitality'),

  QSRM: profile('QSRM', 'individual-series', 'Perform marketing and management functions in quick-service restaurant operations.', 41,
    mix(['Promotion', 10, 24], ['Customer Relations', 8, 20], ['Economics', 5, 12], ['Operations', 4, 10], ['Product/Service Management', 4, 10]), [
      archetype('traffic-promotion', 'Traffic and promotion plan', 25, ['assistant manager', 'marketing specialist'], ['franchise owner', 'senior vice president'], ['quick-service restaurant', 'campaign review'], ['design an offer', 'target a daypart', 'measure transactions'], ['low-traffic period', 'thin margin', 'competitor opening']),
      archetype('speed-operations', 'Speed, labor and operations', 25, ['restaurant manager', 'operations manager'], ['district manager', 'owner'], ['restaurant office', 'shift review'], ['improve throughput', 'schedule resources', 'maintain quality'], ['drive-thru bottleneck', 'staff shortage', 'equipment outage']),
      archetype('guest-recovery', 'Guest recovery and loyalty', 25, ['assistant manager', 'customer experience manager'], ['general manager', 'customer'], ['service counter', 'manager office'], ['resolve a complaint', 'apply policy', 'prevent recurrence'], ['incorrect order', 'mobile-app failure', 'viral post']),
      archetype('menu-pricing', 'Menu, pricing or product decision', 25, ['product manager', 'general manager'], ['owner', 'director of marketing'], ['menu review', 'franchise meeting'], ['evaluate menu item', 'recommend price', 'plan rollout'], ['ingredient inflation', 'nutrition concern', 'limited kitchen capacity']),
    ], ['Emphasize speed, consistency, dayparts, drive-thru/digital ordering, franchise constraints and food safety.'], 2017, 'quick-serve-restaurant-management-series'),

  RFSM: profile('RFSM', 'individual-series', 'Perform marketing and management in full-service restaurants and food-service businesses.', 39,
    mix(['Customer Relations', 8, 21], ['Promotion', 7, 18], ['Marketing', 6, 15], ['Product/Service Management', 6, 15], ['Operations', 4, 10]), [
      archetype('dining-experience', 'Dining experience and service recovery', 25, ['general manager', 'service manager'], ['restaurant owner', 'guest'], ['full-service restaurant', 'manager office'], ['resolve a service issue', 'coach staff', 'restore loyalty'], ['reservation failure', 'long ticket time', 'special-occasion guest']),
      archetype('menu-concept', 'Menu or concept management', 25, ['food and beverage manager', 'general manager'], ['owner', 'regional manager'], ['menu review', 'concept meeting'], ['evaluate offerings', 'recommend change', 'plan guest communication'], ['food-cost increase', 'dietary demand', 'brand inconsistency']),
      archetype('restaurant-promotion', 'Restaurant marketing and promotion', 25, ['marketing manager', 'restaurant manager'], ['owner', 'director of marketing'], ['campaign meeting', 'community partnership pitch'], ['define audience', 'design promotion', 'set covers or revenue goal'], ['slow daypart', 'limited budget', 'community concern']),
      archetype('foodservice-operations', 'Food-service operations decision', 25, ['operations manager', 'general manager'], ['owner', 'district manager'], ['restaurant office', 'staff meeting'], ['improve flow', 'allocate labor', 'protect quality and safety'], ['staffing shortage', 'vendor delay', 'large event booking']),
    ], ['Distinguish full-service dining from quick service through reservations, table service, menu breadth, events and guest pacing.'], 2017, 'restaurant-and-food-service-management-series'),

  HRM: profile('HRM', 'individual-series', 'Perform staffing, recruitment, selection, training, performance appraisal, compensation and safety-training tasks.', 39,
    mix(['Human Resources Management', 13, 33], ['Emotional Intelligence', 12, 31], ['Communications', 8, 20], ['Customer Relations', 2, 5]), [
      archetype('staffing-selection', 'Staffing, recruitment and selection', 25, ['human resources manager', 'recruiting specialist'], ['company president', 'director of recruitment'], ['recruiting review', 'manager consultation'], ['define hiring process', 'choose sourcing or selection methods', 'reduce bias'], ['urgent vacancy', 'small candidate pool', 'hard-to-fill shift']),
      archetype('training-performance', 'Training and performance management', 25, ['human resources generalist', 'training manager'], ['department manager', 'director of human resources'], ['performance meeting', 'training review'], ['diagnose skill gap', 'design support', 'set evaluation measures'], ['inconsistent ratings', 'remote team', 'limited training budget']),
      archetype('employee-relations', 'Employee relations and engagement', 30, ['human resources manager', 'employee-relations specialist'], ['owner', 'company president'], ['HR consultation', 'leadership meeting'], ['analyze employee concern', 'recommend fair response', 'plan communication'], ['conflicting accounts', 'morale decline', 'confidentiality constraint']),
      archetype('comp-safety-policy', 'Compensation, safety or workplace policy', 20, ['HR manager', 'compensation or safety specialist'], ['executive leader', 'operations manager'], ['policy briefing', 'management review'], ['explain policy', 'compare options', 'plan implementation'], ['budget limit', 'legal-review boundary', 'multisite workforce']),
    ], ['Do not ask the participant to provide definitive legal advice; focus on fair process, policy, documentation and escalation.'], 2017, 'human-resources-management-series'),

  PBM: profile('PBM', 'principles', 'Use first-year concepts from administrative services, business information management, general management, HR and operations.', 21,
    mix(['Customer Relations', 8, 38], ['Economics', 4, 19], ['Emotional Intelligence', 4, 19], ['Communications', 3, 14], ['Information Management', 2, 10]), [
      archetype('customer-process', 'Customer and process fundamentals', 35, ['customer service employee', 'administrative assistant'], ['customer', 'supervisor'], ['office', 'service desk'], ['respond professionally', 'explain a process', 'document the next step'], ['upset customer', 'unclear policy', 'missing information']),
      archetype('workplace-communication', 'Workplace communication and teamwork', 25, ['employee', 'office assistant'], ['new employee', 'manager'], ['staff meeting', 'orientation'], ['select communication channel', 'organize information', 'resolve misunderstanding'], ['remote coworker', 'time pressure', 'conflicting messages']),
      archetype('basic-operations', 'Basic operations decision', 20, ['operations trainee', 'administrative employee'], ['supervisor', 'city manager'], ['operations briefing', 'office'], ['identify bottleneck', 'recommend an improvement', 'explain impact'], ['limited staff', 'new system', 'service deadline']),
      archetype('professional-conduct', 'Professional and ethical conduct', 20, ['employee', 'human resources assistant'], ['manager', 'coworker'], ['workplace', 'coaching conversation'], ['demonstrate emotional intelligence', 'apply a policy', 'recommend escalation'], ['confidential information', 'conflict between coworkers', 'customer pressure']),
    ], ['Keep the participant in a first-year, entry-level role and reward clear explanation of core concepts.'], 2017, 'principles-of-business-management-and-administration'),

  ENT: profile('ENT', 'individual-series', 'Recognize opportunities, determine needs, identify markets, use research, identify capital sources and apply management skills.', 35,
    mix(['Entrepreneurship', 9, 26], ['Marketing', 6, 17], ['Product/Service Management', 6, 17], ['Channel Management', 4, 11]), [
      archetype('opportunity-validation', 'Opportunity and market validation', 25, ['entrepreneur', 'small-business consultant'], ['business partner', 'potential investor'], ['concept meeting', 'incubator'], ['define customer problem', 'test demand', 'recommend go/no-go'], ['limited research', 'strong competitor', 'changing customer behavior']),
      archetype('funding-finance', 'Funding and financial choice', 25, ['business owner', 'entrepreneur'], ['investor', 'lender'], ['funding meeting', 'owner consultation'], ['compare capital sources', 'explain use of funds', 'address investor risk'], ['limited collateral', 'ownership dilution', 'uncertain cash flow']),
      archetype('product-growth', 'Product, channel or growth strategy', 25, ['founder', 'product owner'], ['business partner', 'advisor'], ['growth review', 'strategy meeting'], ['choose expansion path', 'manage product offering', 'select channel'], ['capacity limit', 'new market', 'brand consistency']),
      archetype('venture-operations', 'Venture operations and people', 25, ['owner', 'entrepreneurial manager'], ['consultant', 'business partner'], ['small-business office', 'operations meeting'], ['design a process', 'prioritize resources', 'build a staffing response'], ['rapid growth', 'supplier failure', 'key employee departure']),
    ], ['Make the participant act as an owner or trusted entrepreneurial adviser and require a decision under uncertainty.'], 2018, 'entrepreneurship-series'),

  PEN: profile('PEN', 'principles', 'Use first-year concepts important to entrepreneurs and small-business owners.', 7,
    mix(['Information Management', 5, 71], ['Customer Relations', 2, 29]), [
      archetype('customer-information', 'Customer information and service', 30, ['new entrepreneur', 'small-business owner'], ['employee', 'customer'], ['new small business', 'owner meeting'], ['identify information needed', 'explain a customer process', 'protect trust'], ['limited records', 'privacy concern', 'first complaint']),
      archetype('opportunity-basics', 'Opportunity recognition basics', 25, ['aspiring entrepreneur', 'new owner'], ['mentor', 'investor'], ['startup workshop', 'concept meeting'], ['identify need', 'describe target customer', 'state value proposition'], ['small budget', 'seasonal demand', 'local competitor']),
      archetype('startup-resources', 'Startup resources and funding basics', 20, ['new entrepreneur', 'business owner'], ['mentor', 'potential investor'], ['startup meeting', 'community lender'], ['list needed resources', 'compare simple funding options', 'prioritize spending'], ['limited savings', 'equipment need', 'uncertain demand']),
      archetype('small-business-operations', 'Small-business operations basics', 25, ['owner', 'entrepreneur'], ['employee', 'business mentor'], ['new storefront', 'home-based business'], ['organize a process', 'set service standards', 'plan simple measurement'], ['first hire', 'supplier delay', 'technology choice']),
    ], ['The public case sample is small; use the official scope, not the observed 71% figure alone.', 'Keep the case introductory and concrete.'], 2024, 'principles-of-entrepreneurship'),

  BLTDM: profile('BLTDM', 'team-decision', 'Analyze U.S. business law involving contracts, product liability, employment or ownership while weighing ethical values that can reasonably be argued from more than one side.', 21,
    mix(['Communications', 6, 29], ['Customer Relations', 5, 24], ['Economics', 4, 19], ['Emotional Intelligence', 4, 19]), [
      archetype('contracts-policy', 'Contract and policy decision', 25, ['manager and assistant manager', 'business advisory team'], ['owner', 'company president'], ['executive meeting', 'owner office'], ['identify contractual issues', 'compare response options', 'recommend policy and communication'], ['ambiguous term', 'valued relationship', 'deadline']),
      archetype('employment-ethics', 'Employment and ethics decision', 25, ['management team', 'HR-business team'], ['president', 'senior vice president'], ['leadership meeting', 'workplace review'], ['separate legal and ethical concerns', 'weigh stakeholder impacts', 'recommend fair process'], ['conflicting values', 'incomplete facts', 'reputation risk']),
      archetype('product-liability', 'Product liability and customer response', 20, ['risk-management team', 'operations managers'], ['owner', 'director of corporate development'], ['incident review', 'executive office'], ['identify exposure', 'protect customers', 'design communication and remedy'], ['uncertain cause', 'social-media attention', 'supplier dispute']),
      archetype('ownership-governance', 'Ownership or governance choice', 15, ['business consultants', 'management partners'], ['entrepreneur', 'company owner'], ['governance meeting', 'startup office'], ['compare structures', 'explain stakeholder implications', 'recommend safeguards'], ['growth plan', 'different risk tolerance', 'control concern']),
      archetype('ethical-tradeoff', 'Competing-values ethical decision', 15, ['management team', 'ethics committee'], ['president', 'customer'], ['executive review', 'stakeholder meeting'], ['state competing values', 'apply a decision framework', 'recommend transparent action'], ['profitable but controversial option', 'community impact', 'no perfect solution']),
    ], ['Present legal issues for student analysis, not as definitive legal advice.', 'Give both team members meaningful roles and require a jointly reasoned recommendation.'], 2017, 'business-law-and-ethics-team-decision-making'),

  BTDM: profile('BTDM', 'team-decision', 'Use forecasting, planning, buying, displaying, selling and customer service to get merchandise into customers hands.', 21,
    mix(['Product/Service Management', 9, 43], ['Economics', 4, 19], ['Market Planning', 4, 19], ['Selling', 4, 19]), [
      archetype('assortment-forecast', 'Assortment and demand forecast', 30, ['buying team', 'merchandise managers'], ['senior vice president', 'director of merchandising'], ['line review', 'buying office'], ['forecast demand', 'select assortment', 'plan inventory'], ['seasonal uncertainty', 'open-to-buy limit', 'new trend']),
      archetype('vendor-buying', 'Vendor and buying negotiation', 25, ['buyers', 'category management team'], ['vice president', 'supplier executive'], ['vendor review', 'merchandising office'], ['compare vendors', 'set buying terms', 'manage risk'], ['minimum order', 'delivery concern', 'exclusive offer']),
      archetype('pricing-promotion', 'Merchandise pricing and promotion', 25, ['merchandising team', 'retail managers'], ['CEO', 'senior vice president'], ['pricing review', 'campaign meeting'], ['set pricing logic', 'design promotion', 'protect margin'], ['excess inventory', 'competitor discount', 'brand rule']),
      archetype('inventory-channel', 'Inventory and channel decision', 20, ['inventory planning team', 'merchandise managers'], ['director of merchandising', 'operations executive'], ['omnichannel review', 'distribution meeting'], ['allocate inventory', 'choose channels', 'define service measures'], ['store-online imbalance', 'warehouse capacity', 'return rate']),
    ], ['Make the case merchandise-specific and require joint analysis of demand, inventory, margin and customer impact.'], 2017, 'buying-and-merchandising-team-decision-making'),

  ETDM: profile('ETDM', 'team-decision', 'Apply opportunity recognition, market research, capital sourcing and management skills to a venture decision.', 17,
    mix(['Promotion', 6, 35], ['Product/Service Management', 4, 24], ['Marketing', 3, 18], ['Entrepreneurship', 2, 12], ['Human Resources Management', 2, 12]), [
      archetype('venture-launch', 'Venture launch decision', 25, ['co-founders', 'entrepreneurial team'], ['investor', 'entrepreneurial consultant'], ['incubator pitch', 'founder meeting'], ['validate opportunity', 'prioritize launch steps', 'define metrics'], ['limited capital', 'uncertain demand', 'short runway']),
      archetype('growth-promotion', 'Growth and promotion strategy', 30, ['co-owners', 'growth team'], ['investor', 'business adviser'], ['growth review', 'strategy session'], ['select target market', 'design promotion', 'plan scalable delivery'], ['viral attention', 'capacity limit', 'brand inconsistency']),
      archetype('product-pivot', 'Product or service pivot', 25, ['founders', 'product team'], ['investor', 'consultant'], ['product review', 'board update'], ['interpret feedback', 'compare pivot options', 'recommend roadmap'], ['sunk cost', 'new competitor', 'mixed customer signals']),
      archetype('people-capital', 'People and capital allocation', 20, ['founders', 'management team'], ['investor', 'firm founder'], ['funding meeting', 'operations review'], ['choose hiring priorities', 'allocate funds', 'manage founder risk'], ['first key hire', 'cash shortage', 'co-founder disagreement']),
    ], ['The participants are two decision-makers; require both strategic and operational reasoning.'], 2019, 'entrepreneurship-team-decision-making'),

  FTDM: profile('FTDM', 'team-decision', 'Analyze decisions in services offered by financial institutions, including statements, management impacts and financial data interpretation.', 21,
    mix(['Financial Analysis', 17, 81], ['Customer Relations', 2, 10], ['Operations', 2, 10]), [
      archetype('client-analysis', 'Client financial-services recommendation', 30, ['financial advisory team', 'banking team'], ['client', 'bank president'], ['client meeting', 'bank office'], ['analyze client facts', 'compare financial products', 'recommend and explain risk'], ['competing goals', 'liquidity need', 'limited risk tolerance']),
      archetype('credit-lending', 'Credit or lending decision', 25, ['credit analysis team', 'loan officers'], ['vice president of the bank', 'client'], ['credit committee', 'loan consultation'], ['analyze repayment capacity', 'structure option', 'identify controls'], ['thin history', 'changing rates', 'collateral concern']),
      archetype('institution-risk', 'Financial-institution risk decision', 25, ['risk management team', 'financial analysts'], ['bank president', 'senior executive'], ['risk committee', 'executive briefing'], ['identify exposure', 'quantify tradeoffs', 'recommend mitigation'], ['market volatility', 'concentration risk', 'regulatory boundary']),
      archetype('bank-operations', 'Financial-services operations', 20, ['operations team', 'branch management team'], ['new bank president', 'vice president'], ['operations review', 'branch meeting'], ['improve process', 'protect customer data', 'set service measures'], ['fraud pattern', 'technology outage', 'customer wait times']),
    ], ['Include coherent quantitative facts and make every recommendation explain risk, return, liquidity or operational impact.'], 2017, 'financial-services-team-decision-making'),

  HTDM: profile('HTDM', 'team-decision', 'Apply hospitality marketing and management across hotels, lodging, conventions, and food and beverage services.', 21,
    mix(['Customer Relations', 6, 29], ['Promotion', 5, 24], ['Product/Service Management', 4, 19], ['Economics', 2, 10], ['Marketing', 2, 10]), [
      archetype('service-recovery', 'Hospitality service recovery', 30, ['guest-services managers', 'hospitality management team'], ['general manager', 'property owner'], ['hotel office', 'guest-experience review'], ['diagnose failure', 'design recovery', 'prevent recurrence'], ['group complaint', 'overbooking', 'public review']),
      archetype('package-promotion', 'Hospitality package and promotion', 25, ['marketing managers', 'sales team'], ['chief marketing officer', 'general manager'], ['campaign review', 'property meeting'], ['design package', 'select audience', 'coordinate delivery'], ['low season', 'limited room inventory', 'partner constraint']),
      archetype('service-design', 'Hospitality product or service design', 25, ['operations managers', 'property management team'], ['owner', 'senior vice president'], ['service-design meeting', 'resort office'], ['define guest need', 'build service concept', 'plan rollout'], ['staffing limit', 'different guest segments', 'cost cap']),
      archetype('revenue-operations', 'Revenue and operations decision', 20, ['revenue and operations team', 'hotel managers'], ['owner', 'general manager'], ['revenue review', 'operations meeting'], ['balance occupancy and rate', 'allocate capacity', 'protect experience'], ['event compression', 'renovation', 'labor shortage']),
    ], ['Make the two participants coordinate a guest-centered solution across at least two departments.'], 2017, 'hospitality-services-team-decision-making'),

  MTDM: profile('MTDM', 'team-decision', 'Apply broad marketing and management functions in a non-retail environment.', 21,
    mix(['Promotion', 8, 38], ['Market Planning', 3, 14], ['Communications', 2, 10], ['Customer Relations', 2, 10], ['Product/Service Management', 2, 10]), [
      archetype('strategy-plan', 'Strategic marketing plan', 25, ['marketing management team', 'strategy managers'], ['owner', 'company president'], ['strategy presentation', 'executive office'], ['analyze situation', 'choose target and positioning', 'set actions and metrics'], ['new entrant', 'limited budget', 'conflicting objectives']),
      archetype('launch-promotion', 'Launch and promotion decision', 30, ['marketing managers', 'brand team'], ['director', 'managing partner'], ['launch meeting', 'campaign briefing'], ['define offer', 'plan promotion', 'coordinate channels'], ['short lead time', 'low awareness', 'capacity concern']),
      archetype('research-segmentation', 'Research and segmentation choice', 20, ['marketing research team', 'marketing managers'], ['president', 'executive director'], ['research briefing', 'planning meeting'], ['interpret evidence', 'select segment', 'recommend next research'], ['small sample', 'conflicting data', 'new audience']),
      archetype('service-channel', 'Service, channel or customer strategy', 25, ['marketing managers', 'customer strategy team'], ['owner', 'library or nonprofit director'], ['management meeting', 'service review'], ['redesign customer journey', 'select access channel', 'improve retention'], ['service complaint', 'digital shift', 'resource constraint']),
    ], ['Avoid retail-merchandising details; the organization can be a service, nonprofit, place, institution or broad commercial business.'], 2017, 'marketing-management-team-decision-making'),

  STDM: profile('STDM', 'team-decision', 'Apply marketing to amateur/professional sports, entertainment, recreation, hobbies and cultural events.', 21,
    mix(['Promotion', 8, 38], ['Economics', 4, 19], ['Channel Management', 3, 14], ['Customer Relations', 2, 10], ['Market Planning', 2, 10]), [
      archetype('event-promotion', 'Sports or entertainment promotion', 30, ['marketing directors', 'event marketing team'], ['team owner', 'athletic director'], ['campaign pitch', 'venue office'], ['grow attendance', 'choose channels', 'set activation plan'], ['weak sales', 'competing event', 'small media budget']),
      archetype('sponsorship', 'Sponsorship and partnership strategy', 25, ['partnership managers', 'marketing team'], ['owner', 'executive director'], ['sponsorship pitch', 'rights-holder office'], ['align objectives', 'build inventory', 'measure sponsor value'], ['category conflict', 'athlete controversy', 'limited assets']),
      archetype('ticket-channel', 'Ticketing, channel and pricing choice', 20, ['ticket strategy team', 'revenue managers'], ['director of operations', 'team president'], ['ticketing review', 'tour meeting'], ['choose distribution', 'recommend pricing', 'manage access'], ['resale concern', 'capacity constraint', 'variable demand']),
      archetype('fan-community', 'Fan experience and community response', 25, ['fan engagement team', 'event managers'], ['athletic director', 'owner'], ['venue review', 'community meeting'], ['improve experience', 'address stakeholder concern', 'plan communication'], ['weather risk', 'crowd-flow issue', 'community criticism']),
    ], ['Use specific properties, rights, audiences and event constraints; make both team members contribute.'], 2017, 'sports-and-entertainment-marketing-team-decision-making'),

  TTDM: profile('TTDM', 'team-decision', 'Apply marketing and management to passenger transportation, travel service, destination promotion, tours, ticket agencies and tourism services.', 21,
    mix(['Promotion', 8, 38], ['Marketing', 5, 24], ['Customer Relations', 4, 19], ['Market Planning', 2, 10], ['Product/Service Management', 2, 10]), [
      archetype('destination-promotion', 'Destination marketing campaign', 30, ['destination marketing team', 'tourism managers'], ['chief marketing officer', 'executive director'], ['tourism-board pitch', 'destination office'], ['select visitor segment', 'build campaign', 'manage resident impact'], ['off-season demand', 'overtourism concern', 'small budget']),
      archetype('travel-package', 'Travel package or itinerary design', 25, ['travel product team', 'tour managers'], ['owner', 'vice president'], ['product review', 'travel-agency meeting'], ['design itinerary', 'price package', 'coordinate partners'], ['weather season', 'capacity limit', 'mixed traveler needs']),
      archetype('traveler-recovery', 'Traveler service recovery', 20, ['travel services team', 'guest-relations managers'], ['customer', 'operations director'], ['travel office', 'incident meeting'], ['resolve disruption', 'communicate options', 'restore trust'], ['cancellation', 'missed connection', 'supplier responsibility']),
      archetype('tourism-strategy', 'Tourism product and market strategy', 25, ['tourism management team', 'market planners'], ['park director', 'destination owner'], ['strategy meeting', 'attraction office'], ['analyze visitor demand', 'recommend product changes', 'set measures'], ['seasonality', 'sustainability concern', 'new competitor']),
    ], ['Account for traveler logistics, partner dependencies, seasonality, accessibility and destination/community impacts.'], 2017, 'travel-and-tourism-team-decision-making'),
}

export function getRoleplayProfile(eventCode: string): RoleplayProfile | undefined {
  return ROLEPLAY_PROFILES[eventCode.toUpperCase()]
}

export function chooseWeighted<T extends { weight: number }>(items: T[], random = Math.random): T {
  const total = items.reduce((sum, item) => sum + Math.max(0, item.weight), 0)
  if (total <= 0) return items[0]
  let target = random() * total
  for (const item of items) {
    target -= Math.max(0, item.weight)
    if (target < 0) return item
  }
  return items[items.length - 1]
}

const normalizedArea = (value: string) => value
  .toLowerCase()
  .replace(/\bskills\b/g, '')
  .replace(/communications\b/g, 'communication')
  .replace(/[^a-z0-9]/g, '')

export function chooseWeightedInstructionalArea(
  profileData: RoleplayProfile,
  availableAreas: string[],
  random = Math.random,
): string | undefined {
  const weighted = profileData.historicalSample.instructionalAreas
    .map(observed => ({
      weight: observed.count,
      name: availableAreas.find(area => normalizedArea(area) === normalizedArea(observed.name)),
    }))
    .filter((item): item is { weight: number; name: string } => Boolean(item.name))

  if (weighted.length) return chooseWeighted(weighted, random).name
  if (!availableAreas.length) return undefined
  return availableAreas[Math.floor(random() * availableAreas.length)]
}

export function getFormatRules(event: DECAEvent): FormatRules {
  const profileData = getRoleplayProfile(event.id)
  if (!profileData) throw new Error(`Missing roleplay profile for ${event.id}`)
  return FORMAT_RULES[profileData.format]
}
