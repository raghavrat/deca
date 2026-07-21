export const TEST_CATEGORIES = [
  'BUSINESS_CORE',
  'MANAGEMENT',
  'ENTREPRENEURSHIP',
  'FINANCE',
  'HOSPITALITY',
  'MARKETING',
  'PERSONAL_FINANCE',
] as const

export type TestCategory = typeof TEST_CATEGORIES[number]

export type CompetitionLevel = 'district' | 'association' | 'icdc'
export type QuestionForm = 'direct' | 'completion' | 'classification' | 'application' | 'diagnosis' | 'comparison' | 'calculation'

export interface BlueprintQuota {
  instructionalArea: string
  district: number
  association: number
  icdc: number
}

export interface TestBlueprint {
  id: string
  category: TestCategory
  examFamily: string
  instructionalArea: string
  topic: string
  learningObjective: string
  meaning: string
  example: string
  application: string
  commonError: string
  benefit: string
  allowedQuestionForms: QuestionForm[]
}

export const TEST_CATEGORY_LABELS: Record<TestCategory, string> = {
  BUSINESS_CORE: 'Business Administration Core',
  MANAGEMENT: 'Business Management + Administration',
  ENTREPRENEURSHIP: 'Entrepreneurship',
  FINANCE: 'Finance Cluster',
  HOSPITALITY: 'Hospitality + Tourism Cluster',
  MARKETING: 'Marketing Cluster',
  PERSONAL_FINANCE: 'Personal Financial Literacy',
}

export const TEST_CATEGORY_DESCRIPTIONS: Record<TestCategory, string> = {
  BUSINESS_CORE: 'The shared foundational exam used by Principles events.',
  MANAGEMENT: 'Operations, projects, strategy, knowledge, quality, and organizational risk.',
  ENTREPRENEURSHIP: 'Venture creation, validation, finance, operations, marketing, and growth.',
  FINANCE: 'Financial analysis, records, services, controls, professional practice, and risk.',
  HOSPITALITY: 'Guest experience, service operations, information, selling, and tourism.',
  MARKETING: 'Research, products, promotion, channels, pricing, planning, and selling.',
  PERSONAL_FINANCE: 'Earning, spending, saving, investing, credit, and personal risk decisions.',
}

export const EXAM_BLUEPRINTS: Record<TestCategory, readonly BlueprintQuota[]> = {
  BUSINESS_CORE: [
    { instructionalArea: 'Business Law', district: 1, association: 1, icdc: 4 },
    { instructionalArea: 'Communications', district: 15, association: 15, icdc: 11 },
    { instructionalArea: 'Customer Relations', district: 5, association: 5, icdc: 4 },
    { instructionalArea: 'Economics', district: 7, association: 7, icdc: 12 },
    { instructionalArea: 'Emotional Intelligence', district: 22, association: 22, icdc: 19 },
    { instructionalArea: 'Entrepreneurship', district: 0, association: 0, icdc: 1 },
    { instructionalArea: 'Financial Analysis', district: 16, association: 16, icdc: 13 },
    { instructionalArea: 'Human Resources Management', district: 1, association: 1, icdc: 1 },
    { instructionalArea: 'Information Management', district: 10, association: 10, icdc: 11 },
    { instructionalArea: 'Marketing', district: 1, association: 1, icdc: 1 },
    { instructionalArea: 'Operations', district: 11, association: 11, icdc: 13 },
    { instructionalArea: 'Professional Development', district: 11, association: 11, icdc: 9 },
    { instructionalArea: 'Strategic Management', district: 0, association: 0, icdc: 1 },
  ],
  MANAGEMENT: [
    { instructionalArea: 'Business Law', district: 5, association: 5, icdc: 5 },
    { instructionalArea: 'Communications', district: 7, association: 6, icdc: 6 },
    { instructionalArea: 'Customer Relations', district: 2, association: 2, icdc: 1 },
    { instructionalArea: 'Economics', district: 6, association: 5, icdc: 4 },
    { instructionalArea: 'Emotional Intelligence', district: 9, association: 8, icdc: 6 },
    { instructionalArea: 'Entrepreneurship', district: 1, association: 0, icdc: 0 },
    { instructionalArea: 'Financial Analysis', district: 7, association: 6, icdc: 5 },
    { instructionalArea: 'Human Resources Management', district: 1, association: 0, icdc: 0 },
    { instructionalArea: 'Information Management', district: 7, association: 6, icdc: 6 },
    { instructionalArea: 'Knowledge Management', district: 6, association: 7, icdc: 8 },
    { instructionalArea: 'Marketing', district: 1, association: 1, icdc: 1 },
    { instructionalArea: 'Operations', district: 21, association: 24, icdc: 26 },
    { instructionalArea: 'Professional Development', district: 6, association: 5, icdc: 4 },
    { instructionalArea: 'Project Management', district: 6, association: 7, icdc: 8 },
    { instructionalArea: 'Quality Management', district: 3, association: 4, icdc: 5 },
    { instructionalArea: 'Risk Management', district: 4, association: 5, icdc: 5 },
    { instructionalArea: 'Strategic Management', district: 8, association: 9, icdc: 10 },
  ],
  ENTREPRENEURSHIP: [
    { instructionalArea: 'Business Law', district: 4, association: 4, icdc: 3 },
    { instructionalArea: 'Channel Management', district: 3, association: 3, icdc: 3 },
    { instructionalArea: 'Communications', district: 1, association: 0, icdc: 1 },
    { instructionalArea: 'Customer Relations', district: 1, association: 1, icdc: 1 },
    { instructionalArea: 'Economics', district: 3, association: 3, icdc: 2 },
    { instructionalArea: 'Emotional Intelligence', district: 6, association: 6, icdc: 4 },
    { instructionalArea: 'Entrepreneurship', district: 14, association: 13, icdc: 14 },
    { instructionalArea: 'Financial Analysis', district: 10, association: 9, icdc: 11 },
    { instructionalArea: 'Human Resources Management', district: 5, association: 4, icdc: 4 },
    { instructionalArea: 'Information Management', district: 4, association: 3, icdc: 2 },
    { instructionalArea: 'Market Planning', district: 5, association: 6, icdc: 6 },
    { instructionalArea: 'Marketing', district: 1, association: 1, icdc: 1 },
    { instructionalArea: 'Marketing-Information Management', district: 2, association: 3, icdc: 2 },
    { instructionalArea: 'Operations', district: 13, association: 13, icdc: 14 },
    { instructionalArea: 'Pricing', district: 2, association: 3, icdc: 2 },
    { instructionalArea: 'Product/Service Management', district: 4, association: 4, icdc: 4 },
    { instructionalArea: 'Professional Development', district: 5, association: 5, icdc: 4 },
    { instructionalArea: 'Promotion', district: 6, association: 7, icdc: 8 },
    { instructionalArea: 'Quality Management', district: 1, association: 1, icdc: 1 },
    { instructionalArea: 'Risk Management', district: 2, association: 3, icdc: 4 },
    { instructionalArea: 'Selling', district: 1, association: 1, icdc: 1 },
    { instructionalArea: 'Strategic Management', district: 7, association: 7, icdc: 8 },
  ],
  FINANCE: [
    { instructionalArea: 'Business Law', district: 7, association: 8, icdc: 7 },
    { instructionalArea: 'Communications', district: 5, association: 4, icdc: 3 },
    { instructionalArea: 'Customer Relations', district: 5, association: 5, icdc: 4 },
    { instructionalArea: 'Economics', district: 6, association: 5, icdc: 4 },
    { instructionalArea: 'Emotional Intelligence', district: 9, association: 8, icdc: 6 },
    { instructionalArea: 'Entrepreneurship', district: 1, association: 0, icdc: 0 },
    { instructionalArea: 'Financial Analysis', district: 24, association: 28, icdc: 30 },
    { instructionalArea: 'Financial-Information Management', district: 9, association: 10, icdc: 12 },
    { instructionalArea: 'Human Resources Management', district: 1, association: 0, icdc: 0 },
    { instructionalArea: 'Information Management', district: 6, association: 5, icdc: 5 },
    { instructionalArea: 'Marketing', district: 1, association: 1, icdc: 1 },
    { instructionalArea: 'Operations', district: 6, association: 5, icdc: 4 },
    { instructionalArea: 'Professional Development', district: 13, association: 14, icdc: 15 },
    { instructionalArea: 'Risk Management', district: 6, association: 7, icdc: 9 },
    { instructionalArea: 'Strategic Management', district: 1, association: 0, icdc: 0 },
  ],
  HOSPITALITY: [
    { instructionalArea: 'Business Law', district: 3, association: 3, icdc: 2 },
    { instructionalArea: 'Communications', district: 5, association: 4, icdc: 3 },
    { instructionalArea: 'Customer Relations', district: 8, association: 9, icdc: 9 },
    { instructionalArea: 'Economics', district: 6, association: 6, icdc: 5 },
    { instructionalArea: 'Emotional Intelligence', district: 9, association: 9, icdc: 7 },
    { instructionalArea: 'Entrepreneurship', district: 1, association: 0, icdc: 0 },
    { instructionalArea: 'Financial Analysis', district: 8, association: 7, icdc: 7 },
    { instructionalArea: 'Human Resources Management', district: 2, association: 1, icdc: 1 },
    { instructionalArea: 'Information Management', district: 14, association: 15, icdc: 15 },
    { instructionalArea: 'Knowledge Management', district: 0, association: 1, icdc: 1 },
    { instructionalArea: 'Market Planning', district: 1, association: 1, icdc: 2 },
    { instructionalArea: 'Marketing', district: 1, association: 1, icdc: 2 },
    { instructionalArea: 'Operations', district: 13, association: 13, icdc: 13 },
    { instructionalArea: 'Pricing', district: 1, association: 1, icdc: 1 },
    { instructionalArea: 'Product/Service Management', district: 6, association: 7, icdc: 9 },
    { instructionalArea: 'Professional Development', district: 8, association: 7, icdc: 6 },
    { instructionalArea: 'Promotion', district: 2, association: 3, icdc: 3 },
    { instructionalArea: 'Quality Management', district: 1, association: 1, icdc: 1 },
    { instructionalArea: 'Risk Management', district: 1, association: 1, icdc: 2 },
    { instructionalArea: 'Selling', district: 7, association: 8, icdc: 9 },
    { instructionalArea: 'Strategic Management', district: 3, association: 2, icdc: 2 },
  ],
  MARKETING: [
    { instructionalArea: 'Business Law', district: 2, association: 2, icdc: 1 },
    { instructionalArea: 'Channel Management', district: 5, association: 6, icdc: 7 },
    { instructionalArea: 'Communications', district: 5, association: 4, icdc: 3 },
    { instructionalArea: 'Customer Relations', district: 2, association: 2, icdc: 1 },
    { instructionalArea: 'Economics', district: 6, association: 5, icdc: 4 },
    { instructionalArea: 'Emotional Intelligence', district: 9, association: 8, icdc: 6 },
    { instructionalArea: 'Entrepreneurship', district: 1, association: 0, icdc: 0 },
    { instructionalArea: 'Financial Analysis', district: 6, association: 5, icdc: 4 },
    { instructionalArea: 'Human Resources Management', district: 1, association: 0, icdc: 0 },
    { instructionalArea: 'Information Management', district: 5, association: 4, icdc: 3 },
    { instructionalArea: 'Market Planning', district: 4, association: 4, icdc: 5 },
    { instructionalArea: 'Marketing', district: 1, association: 1, icdc: 1 },
    { instructionalArea: 'Marketing-Information Management', district: 11, association: 14, icdc: 16 },
    { instructionalArea: 'Operations', district: 6, association: 5, icdc: 4 },
    { instructionalArea: 'Pricing', district: 3, association: 4, icdc: 4 },
    { instructionalArea: 'Product/Service Management', district: 11, association: 13, icdc: 15 },
    { instructionalArea: 'Professional Development', district: 6, association: 5, icdc: 5 },
    { instructionalArea: 'Promotion', district: 9, association: 11, icdc: 13 },
    { instructionalArea: 'Selling', district: 6, association: 7, icdc: 8 },
    { instructionalArea: 'Strategic Management', district: 1, association: 0, icdc: 0 },
  ],
  PERSONAL_FINANCE: [
    { instructionalArea: 'Earning Income', district: 25, association: 20, icdc: 16 },
    { instructionalArea: 'Spending', district: 14, association: 14, icdc: 14 },
    { instructionalArea: 'Saving', district: 15, association: 14, icdc: 13 },
    { instructionalArea: 'Investing', district: 15, association: 19, icdc: 21 },
    { instructionalArea: 'Managing Credit', district: 16, association: 19, icdc: 21 },
    { instructionalArea: 'Managing Risk', district: 15, association: 14, icdc: 15 },
  ],
}

type ConceptSeed = readonly [
  slug: string,
  term: string,
  meaning: string,
  example: string,
  application: string,
  commonError: string,
  benefit: string,
]

const AREA_CONCEPTS: Record<string, readonly ConceptSeed[]> = {
  'Business Law': [
    ['contract', 'a contract', 'an agreement whose required elements make its promises enforceable', '{actor} accepts a clearly stated offer and both parties exchange something of value', 'Put the offer, acceptance, obligations, and authorized signatures in a clear written agreement', 'relies on an informal promise while the parties disagree about the essential terms', 'gives the parties a documented basis for understanding and enforcing their obligations'],
    ['negligence', 'negligence', 'a failure to use reasonable care that foreseeably causes harm', '{actor} ignores a known spill and a visitor is injured before the area is secured', 'Correct known hazards promptly and document routine safety inspections', 'assumes a hazard can be ignored because no one has complained yet', 'reduces preventable harm and the organization\'s exposure to loss'],
    ['agency', 'an agency relationship', 'authority given to one party to act on behalf of another', '{actor} negotiates within the purchasing limits formally granted by {organization}', 'Define the representative\'s authority and communicate its limits to affected parties', 'lets a representative make commitments beyond the authority that was granted', 'clarifies which commitments can bind the organization'],
    ['intellectual-property', 'intellectual property', 'legal interests associated with original creations, inventions, branding, and confidential know-how', '{organization} documents ownership before licensing an original software tool', 'Confirm ownership and permission before copying, licensing, or publishing protected material', 'assumes anything visible online can be reused commercially without permission', 'protects valuable creations while reducing infringement risk'],
    ['consumer-protection', 'consumer protection', 'rules and practices intended to prevent deception and unfair treatment in the marketplace', '{organization} discloses required fees and material limitations before a customer buys', 'Make claims accurate, disclose material terms, and provide the promised remedy process', 'hides a mandatory fee until after the customer has committed to the purchase', 'supports informed choices and reduces disputes about misleading practices'],
    ['compliance', 'compliance', 'the process of following applicable laws, regulations, policies, and documented obligations', '{actor} checks an approved requirement list before launching a new process', 'Assign requirement owners, keep evidence, and review controls when rules or operations change', 'treats a signed policy as proof that employees consistently follow it', 'makes legal and policy obligations part of routine operations'],
  ],
  Communications: [
    ['active-listening', 'active listening', 'careful attention that checks understanding before responding', '{actor} paraphrases a customer\'s concern and asks a focused follow-up question', 'Remove distractions, paraphrase the main point, and confirm important details', 'plans a response while the other person is still explaining the problem', 'reduces misunderstanding and reveals information needed for a useful response'],
    ['audience-adaptation', 'audience adaptation', 'adjusting content, detail, tone, and examples for the intended recipient', '{actor} explains a technical change differently to executives and new employees', 'Identify what the audience already knows and choose language and evidence that fit its needs', 'uses the same unexplained technical terms for every audience', 'makes the message easier for the intended audience to understand and use'],
    ['channel-selection', 'communication-channel selection', 'choosing a medium that fits urgency, complexity, sensitivity, and documentation needs', '{actor} uses a live conversation for a sensitive issue and sends a written summary afterward', 'Match the channel to the message\'s urgency, sensitivity, complexity, and recordkeeping needs', 'uses a public group message to discuss private performance information', 'improves speed and clarity while protecting sensitive information'],
    ['feedback-loop', 'a feedback loop', 'a response process that confirms whether a message was understood and acted upon', '{actor} asks the recipient to restate a critical deadline and later confirms completion', 'Invite questions and verify the recipient\'s understanding of key actions', 'assumes silence means the message was understood exactly as intended', 'catches misunderstandings before they become operating errors'],
    ['concise-writing', 'concise business writing', 'communication that presents necessary information clearly without avoidable detail', '{actor} places the requested decision, evidence, and deadline at the start of an email', 'Lead with the purpose, organize supporting facts, and remove repetition', 'buries the requested action beneath unrelated background information', 'helps readers identify and act on the important information quickly'],
    ['nonverbal-cues', 'nonverbal communication', 'meaning conveyed through posture, expression, eye contact, gesture, spacing, and vocal qualities', '{actor} notices a listener\'s confusion and pauses to clarify the explanation', 'Observe nonverbal reactions while considering context and asking rather than assuming', 'treats one gesture as certain proof of a person\'s motive', 'helps a communicator notice when a message may need clarification'],
  ],
  'Customer Relations': [
    ['service-recovery', 'service recovery', 'a structured response that acknowledges and resolves a service failure', '{actor} apologizes, fixes the immediate problem, and records the cause for follow-up', 'Acknowledge the failure, provide an authorized remedy, and address the underlying cause', 'offers a discount without fixing the problem that caused the complaint', 'can restore trust while preventing the same failure from recurring'],
    ['expectation-setting', 'expectation setting', 'clear communication about what a customer will receive and when', '{actor} confirms the scope, price, delivery window, and customer responsibilities before work begins', 'State realistic commitments and notify the customer promptly when conditions change', 'promises the fastest possible completion without checking capacity', 'reduces surprises and gives the customer reliable information for decisions'],
    ['complaint-documentation', 'complaint documentation', 'consistent recording of customer issues, facts, actions, and outcomes', '{actor} records the time, affected order, stated concern, remedy, and follow-up owner', 'Capture objective facts and route patterns to the team able to correct them', 'records only whether the customer seemed upset', 'reveals recurring problems and supports accountable follow-up'],
    ['customer-empathy', 'customer empathy', 'understanding a customer\'s perspective without making unsupported promises', '{actor} recognizes the disruption a delay caused before explaining available options', 'Acknowledge the customer\'s impact and offer feasible choices within authority', 'dismisses the concern because the employee did not cause the original problem', 'helps the response address the customer\'s actual need'],
    ['retention', 'customer retention', 'the continued relationship created by delivering value and resolving reasons customers leave', '{organization} analyzes cancellation reasons and corrects a repeated onboarding problem', 'Use behavior and feedback to correct the main cause of avoidable customer loss', 'sends the same coupon to every former customer without studying why they left', 'preserves valuable relationships by improving the experience that drives loyalty'],
    ['customer-privacy', 'customer privacy', 'responsible collection, use, access, and retention of personal information', '{actor} limits access to customer records to employees with a work-related need', 'Collect only needed information and apply documented access and retention controls', 'shares a customer record internally because every employee works for the same company', 'protects customers and reduces misuse of personal information'],
  ],
  Economics: [
    ['opportunity-cost', 'opportunity cost', 'the value of the best alternative given up when a choice is made', '{organization} uses its limited floor space for product pickup instead of an additional display area', 'Compare the chosen use of a scarce resource with its best forgone alternative', 'counts only the cash paid and ignores the best alternative use of the resource', 'makes the full trade-off behind a decision visible'],
    ['supply-demand', 'supply and demand', 'the interaction of seller availability and buyer willingness that influences market price and quantity', 'demand rises while short-run supply stays fixed, placing upward pressure on price', 'Evaluate how a change affects both buyers\' willingness and sellers\' ability to provide the product', 'assumes higher demand always increases the available supply immediately', 'helps explain changes in market prices and quantities'],
    ['inflation', 'inflation', 'a sustained increase in the general price level that reduces money\'s purchasing power', 'the same budget buys fewer typical goods after prices rise broadly over time', 'Compare money values across time using purchasing power rather than nominal dollars alone', 'calls one product\'s temporary price increase proof that all prices are rising', 'supports more realistic budgets and comparisons across time'],
    ['competition', 'market competition', 'rivalry among sellers seeking customers by improving value, price, service, or differentiation', 'several providers improve service after customers gain more alternatives', 'Monitor alternatives available to customers and strengthen a defensible source of value', 'copies every competitor action without considering the target customer', 'encourages businesses to improve the value offered to customers'],
    ['productivity', 'productivity', 'the amount of useful output produced from a given amount of input', '{organization} completes more accurate orders with the same labor hours', 'Measure useful output relative to labor, time, equipment, or other resources used', 'counts faster work as improvement even though defects increase sharply', 'shows whether resources are producing more usable value'],
    ['business-cycle', 'a business cycle', 'broad expansions and contractions in economic activity over time', '{organization} prepares for weaker demand as employment and spending slow across the economy', 'Use multiple economic indicators and scenario ranges instead of assuming one trend will continue', 'treats one slow sales week as proof of a national recession', 'helps organizations plan for changing economic conditions without relying on one signal'],
  ],
  'Emotional Intelligence': [
    ['self-awareness', 'self-awareness', 'accurate recognition of one\'s emotions, strengths, limits, and effects on others', '{actor} notices frustration rising and delays a difficult reply until they can respond objectively', 'Name the emotion and its likely effect before choosing a response', 'assumes strong feelings cannot influence professional judgment', 'creates space for a deliberate response instead of an automatic reaction'],
    ['self-management', 'self-management', 'regulation of impulses and behavior so actions remain aligned with goals and standards', '{actor} stays calm during criticism and asks for specific examples', 'Pause, evaluate the facts, and choose behavior that supports the intended outcome', 'responds immediately to a tense message while still angry', 'keeps temporary emotion from controlling an important interaction'],
    ['empathy', 'empathy', 'understanding another person\'s perspective and emotional experience', '{actor} considers how a schedule change affects an employee before discussing alternatives', 'Ask about the other person\'s experience and reflect the concern accurately', 'claims to know exactly how another person feels without listening', 'helps decisions account for how people actually experience a situation'],
    ['adaptability', 'adaptability', 'constructive adjustment of behavior and plans when circumstances change', '{actor} revises the workflow after a supplier delay while protecting the key deadline', 'Identify what changed, preserve the goal, and adjust the method using current facts', 'continues the original plan only because it was approved first', 'allows progress when the original assumptions no longer hold'],
    ['conflict-resolution', 'conflict resolution', 'a process for addressing disagreement through facts, interests, and workable agreements', '{actor} separates the people from the issue and identifies the shared deadline', 'Clarify interests, define the issue, compare options, and document the agreement', 'tries to win the argument by attacking the other person\'s character', 'turns disagreement into a specific, workable path forward'],
    ['initiative', 'initiative', 'responsible action taken without waiting for unnecessary direction', '{actor} notices a recurring error, gathers evidence, and proposes a solution within their authority', 'Act on a clear need within authority while informing affected people', 'changes a controlled process without evidence, permission, or notice', 'moves useful work forward while preserving accountability'],
    ['relationship-management', 'relationship management', 'the use of trust, communication, and cooperation to sustain productive interactions', '{actor} follows through on a commitment and addresses a missed expectation directly', 'Keep commitments, communicate early, and address problems respectfully', 'avoids a colleague after a misunderstanding and hopes it disappears', 'builds dependable cooperation across repeated interactions'],
    ['stress-management', 'stress management', 'the use of healthy, deliberate methods to maintain effectiveness under pressure', '{actor} prioritizes urgent work, takes a brief reset, and asks for help with a capacity conflict', 'Identify the stressor, choose a practical response, and use support before performance deteriorates', 'hides an impossible workload until deadlines have already failed', 'protects judgment and performance during demanding periods'],
  ],
  Entrepreneurship: [
    ['opportunity-recognition', 'opportunity recognition', 'identifying a meaningful unmet need that a venture may be able to serve', '{actor} observes a repeated customer problem and tests whether enough people will pay for a solution', 'Define the problem, target customer, current alternatives, and evidence of willingness to act', 'starts building because the founder personally likes the idea', 'focuses venture effort on a problem with evidence of customer value'],
    ['feasibility', 'feasibility analysis', 'an evidence-based review of whether a venture can work operationally, financially, and in its market', '{actor} tests demand, cost, capability, legal needs, and funding before committing major resources', 'Evaluate market, technical, operating, financial, and legal assumptions before launch', 'uses a large market-size estimate as proof the specific venture will succeed', 'reveals critical assumptions before they become expensive commitments'],
    ['value-proposition', 'a value proposition', 'a clear reason a defined customer would choose an offering over alternatives', '{organization} explains the customer problem solved, the benefit delivered, and why its approach is different', 'Connect a specific customer need to a credible benefit and point of difference', 'lists every product feature without explaining the customer benefit', 'gives the target customer a clear reason to consider the offering'],
    ['business-model', 'a business model', 'the connected choices through which a venture creates, delivers, and captures value', '{actor} aligns the target customer, offering, channel, revenue source, activities, and costs', 'Test whether value delivery, revenue, costs, resources, and partners reinforce one another', 'treats a product idea as complete without identifying how the venture will earn and spend money', 'shows how the venture can repeatedly deliver value and sustain itself'],
    ['bootstrapping', 'bootstrapping', 'building a venture primarily with founder resources and operating cash rather than outside capital', '{actor} uses preorders and early revenue to fund a limited initial launch', 'Stage spending around validated demand and preserve cash for the next critical assumption', 'spends all available cash on scale before the offer is validated', 'can preserve ownership and force disciplined use of scarce resources'],
    ['ownership-choice', 'a business ownership choice', 'selection of a legal and control structure that affects authority, liability, tax treatment, and funding', '{actor} compares control, liability exposure, administration, and capital needs before choosing a structure', 'Evaluate the owners\' goals and obtain qualified advice for jurisdiction-specific consequences', 'chooses a structure only because its name sounds professional', 'aligns control and responsibility with the venture\'s actual needs'],
  ],
  'Financial Analysis': [
    ['cash-vs-profit', 'the distinction between profit and cash flow', 'the difference between accounting performance and the timing of cash receipts and payments', '{organization} reports a profit while cash is tied up in unpaid customer invoices and inventory', 'Review both income and the timing of operating cash movements', 'assumes a profitable sale always produces cash immediately', 'reveals whether the organization can meet obligations despite reported profit'],
    ['contribution-margin', 'contribution margin', 'sales revenue remaining after variable costs to cover fixed costs and profit', '{actor} subtracts variable cost per unit from selling price before evaluating added sales', 'Calculate unit price minus unit variable cost and evaluate the result against fixed needs', 'subtracts fixed cost from each unit without considering expected volume', 'shows how each additional unit contributes toward fixed costs and profit'],
    ['break-even', 'break-even analysis', 'the calculation of the sales level at which total revenue equals total cost', '{actor} divides fixed costs by unit contribution to estimate required unit sales', 'State the price, variable cost, fixed cost, and relevant sales mix before calculating', 'divides fixed cost by selling price and ignores variable cost', 'identifies the volume required before the operation begins earning profit'],
    ['liquidity', 'liquidity', 'the ability to meet near-term obligations with available or readily convertible resources', '{organization} compares current assets and upcoming payments before approving a cash commitment', 'Examine the timing and availability of cash and near-cash resources against obligations', 'uses long-term profit potential as proof that tomorrow\'s bills can be paid', 'shows whether the organization can handle near-term payment demands'],
    ['profitability', 'profitability', 'the organization\'s ability to generate earnings relative to sales, assets, or invested resources', '{actor} compares operating profit with revenue across periods', 'Use a consistent profit measure and comparison base when evaluating performance', 'treats higher revenue as proof of higher profit without reviewing costs', 'shows how effectively activity is converted into earnings'],
    ['budget-variance', 'a budget variance', 'the difference between a planned amount and the corresponding actual result', '{actor} compares actual shipping expense with the approved shipping budget', 'Calculate actual minus planned using a consistent sign convention and investigate material causes', 'changes the original budget after seeing actual results to eliminate the difference', 'directs attention to meaningful departures from plan'],
    ['ratio-analysis', 'ratio analysis', 'comparison of related financial amounts to reveal relationships and trends', '{actor} compares a liquidity ratio across several periods and with relevant peers', 'Use consistently defined ratios together with trends and operating context', 'treats one ratio as a complete explanation of the organization\'s condition', 'makes relationships easier to compare across time or organizations'],
    ['return-on-investment', 'return on investment', 'the gain or benefit from an investment compared with the resources committed', '{actor} compares the expected net benefit of equipment with its required investment', 'Define the benefit, cost, time horizon, and risks before comparing alternatives', 'selects the largest dollar benefit without considering the investment required', 'connects an investment\'s expected benefit with the resources needed to obtain it'],
  ],
  'Human Resources Management': [
    ['job-analysis', 'job analysis', 'systematic identification of a role\'s work, responsibilities, conditions, and required qualifications', '{actor} observes the work and interviews incumbents before revising a job description', 'Gather evidence about actual tasks and distinguish essential requirements from preferences', 'copies another company\'s job description without studying the local role', 'creates a defensible basis for recruiting, selection, training, and evaluation'],
    ['recruiting', 'recruiting', 'attracting a qualified and appropriately diverse pool of applicants', '{organization} chooses recruiting channels based on the skills and audience needed for the role', 'Use job-related requirements and channels that can reach qualified candidates', 'uses one familiar source even though it repeatedly produces too few qualified applicants', 'improves the chance that suitable candidates learn about the opportunity'],
    ['selection', 'employee selection', 'the job-related process used to evaluate and choose among applicants', '{actor} uses structured questions and the same scoring criteria for every finalist', 'Use validated, job-related evidence and consistent evaluation standards', 'changes interview questions based on whether the interviewer personally likes a candidate', 'supports fairer and more reliable hiring decisions'],
    ['onboarding', 'onboarding', 'planned integration of a new employee into the role, team, systems, and organization', '{organization} provides role expectations, access, training, contacts, and scheduled check-ins', 'Sequence essential information, practice, resources, and early feedback', 'gives the new employee a policy link and assumes no further support is needed', 'shortens time to effective performance and reduces avoidable confusion'],
    ['training', 'employee training', 'structured development of knowledge and skills needed for current work', '{actor} demonstrates a task, lets the employee practice, and observes performance', 'Tie instruction and practice to a verified performance need', 'sends every employee to the same course without identifying the skill gap', 'builds job capability when the cause is a knowledge or skill gap'],
    ['performance-feedback', 'performance feedback', 'timely, specific information about observed work and needed next steps', '{actor} describes an observable result, explains its impact, and agrees on a follow-up action', 'Use job-related evidence, listen for causes, and document a clear improvement plan', 'labels the employee\'s personality instead of discussing observable behavior', 'helps the employee understand expectations and improve specific work'],
  ],
  'Information Management': [
    ['data-quality', 'data quality', 'the fitness of information for use based on accuracy, completeness, consistency, relevance, and timeliness', '{actor} verifies missing and inconsistent customer records before using them in a forecast', 'Define data standards and correct errors close to their source', 'assumes a large dataset must be accurate because it has many records', 'makes analysis and operating decisions more dependable'],
    ['access-control', 'access control', 'restriction of information and system actions to authorized users with a legitimate need', '{organization} grants employees only the record permissions required for their roles', 'Use role-based access, strong authentication, and prompt removal of unneeded privileges', 'gives every employee administrator access to simplify support', 'reduces unauthorized viewing and harmful changes'],
    ['backup-recovery', 'backup and recovery', 'protected copies and tested procedures used to restore information after loss or disruption', '{actor} restores a test copy to confirm that backups are complete and usable', 'Keep protected copies separate and test restoration on a defined schedule', 'assumes a backup succeeded because no error message appeared', 'reduces downtime and permanent data loss after an incident'],
    ['data-privacy', 'data privacy', 'responsible handling of personal information according to stated purposes and controls', '{organization} limits collection to information needed for the service and deletes it under a schedule', 'Document purpose, access, retention, sharing, and deletion before collecting personal data', 'keeps personal information indefinitely in case it becomes useful later', 'reduces unnecessary exposure and respects the individual\'s information interests'],
    ['information-relevance', 'decision-relevant information', 'information that directly helps answer the decision being made', '{actor} selects recent defect data by production step when diagnosing a quality problem', 'Start with the decision and request data with the needed scope, detail, and timing', 'adds unrelated metrics because a larger report appears more thorough', 'focuses attention on evidence that can change the decision'],
    ['data-visualization', 'data visualization', 'graphical presentation that makes important patterns and comparisons easier to understand', '{actor} uses a time-series chart to show how weekly demand changed', 'Choose a chart that fits the comparison and label units, scale, and source clearly', 'uses a distorted axis that exaggerates a small change', 'helps readers see relationships that are difficult to detect in raw tables'],
  ],
  Marketing: [
    ['marketing-concept', 'the marketing concept', 'an organization-wide focus on satisfying target customers while meeting organizational goals', '{organization} begins with customer needs and coordinates its offer around delivering superior value', 'Use customer evidence to align the product, price, access, and communication decisions', 'starts with excess inventory and pressures every customer to buy it', 'connects organizational success with sustained customer value'],
    ['target-market', 'a target market', 'the defined group of customers an organization chooses to serve', '{actor} selects customers with a shared need, ability to buy, and reachable behavior', 'Define the selected customer group precisely enough to guide decisions', 'describes the target as everyone who might ever use the product', 'focuses resources on customers the organization can serve effectively'],
    ['marketing-mix', 'the marketing mix', 'coordinated product, price, place, and promotion decisions for a target market', '{actor} aligns service features, price, access channels, and message with one target segment', 'Evaluate how the four decisions work together rather than optimizing each alone', 'changes the message while ignoring an offer that does not meet the customer need', 'creates a coherent market offer instead of disconnected tactics'],
    ['customer-value', 'customer value', 'the customer\'s perceived benefits compared with the money, time, effort, and risk required', '{organization} reduces setup effort while preserving the benefit customers value most', 'Increase meaningful benefits or reduce relevant customer costs without weakening the promise', 'assumes the lowest price always creates the greatest value for every customer', 'helps explain why a customer chooses one alternative over another'],
  ],
  Operations: [
    ['bottleneck', 'a process bottleneck', 'the step whose limited capacity constrains the output of the overall process', '{organization} finds that work queues before the slowest review step while later stations wait', 'Measure capacity and flow at each step before improving the constraint', 'speeds up a nonconstrained step that already produces more work than the bottleneck can accept', 'focuses improvement where it can raise total throughput'],
    ['inventory-control', 'inventory control', 'the methods used to maintain needed stock while limiting shortages, excess, loss, and record errors', '{actor} records each receipt and issue and investigates differences from physical counts', 'Set reorder rules, protect stock, update records promptly, and verify them physically', 'orders extra stock whenever space is available without reviewing demand', 'supports product availability without tying up unnecessary resources'],
    ['capacity-planning', 'capacity planning', 'matching available people, equipment, space, and time with expected demand', '{actor} compares forecast demand with service capacity by day and shift', 'Measure usable capacity, demand patterns, constraints, and options for peaks', 'uses average monthly demand to schedule every hour identically', 'reduces avoidable waits, idle resources, and missed demand'],
    ['scheduling', 'operations scheduling', 'assigning work and resources across time while respecting priorities and constraints', '{actor} sequences jobs by due date, required equipment, and setup time', 'Include dependencies, resource availability, service commitments, and reasonable buffers', 'accepts every requested deadline before checking existing workload', 'coordinates work so commitments are more likely to be met'],
    ['procurement', 'procurement', 'the process of obtaining needed goods and services under appropriate value, quality, timing, and control requirements', '{organization} compares total cost, reliability, quality, and terms before selecting a supplier', 'Define requirements, evaluate qualified suppliers, authorize the purchase, and monitor performance', 'selects the lowest unit price without considering defects or delivery reliability', 'helps the organization obtain suitable inputs on dependable terms'],
    ['standard-work', 'standard work', 'the documented current best method for completing a recurring process consistently', '{actor} records the sequence, quality checks, safety steps, and expected result for a task', 'Document, train, observe, and update the method when evidence supports improvement', 'treats an undocumented habit as a permanent standard', 'reduces unwanted variation while providing a baseline for improvement'],
    ['continuous-improvement', 'continuous improvement', 'ongoing small, evidence-based changes to processes and results', '{actor} tests one workflow change, measures the result, and standardizes it only after improvement is shown', 'Define the problem, test a limited change, measure it, and retain what works', 'launches several changes at once and cannot tell which one affected the result', 'builds repeatable gains while controlling the risk of change'],
    ['process-layout', 'process layout', 'the physical or digital arrangement of work steps, people, equipment, and movement', '{organization} moves frequently linked workstations closer to reduce travel and handoffs', 'Map the flow of people, materials, and information before changing the arrangement', 'places equipment by appearance even though work must cross the room repeatedly', 'can reduce wasted movement, delays, and handling'],
  ],
  'Professional Development': [
    ['goal-setting', 'professional goal setting', 'defining a specific desired result, measure, deadline, and action path', '{actor} sets a six-month skill goal with practice milestones and evidence of proficiency', 'Write a specific outcome and review progress at scheduled checkpoints', 'uses a vague goal to become better someday without a measure or deadline', 'turns development intentions into observable progress'],
    ['prioritization', 'work prioritization', 'ordering work by importance, urgency, dependencies, risk, and commitments', '{actor} completes a required report due in an hour before a routine task due next week', 'Compare deadlines, consequences, dependencies, and effort before sequencing work', 'starts with the easiest task regardless of its importance or deadline', 'directs limited time toward the work with the greatest immediate consequence'],
    ['networking', 'professional networking', 'building reciprocal work relationships through useful, respectful interaction over time', '{actor} follows up after an industry event with a relevant resource and genuine interest', 'Offer value, keep commitments, and maintain contact without treating people as transactions', 'contacts a new connection only to demand an immediate favor', 'creates relationships that can support learning and future collaboration'],
    ['continuing-education', 'continuing education', 'ongoing learning used to maintain and expand career knowledge and capability', '{actor} compares a changing job requirement with current skills and completes targeted training', 'Use career evidence to choose learning that closes a meaningful skill gap', 'collects credentials without considering whether they support the intended work', 'keeps skills relevant as work and technology change'],
    ['professional-ethics', 'professional ethics', 'consistent application of honest, fair, responsible standards in work decisions', '{actor} discloses a conflict of interest before participating in a supplier decision', 'Identify stakeholders, duties, conflicts, consequences, and a transparent course of action', 'hides a conflict because the preferred decision might still benefit the company', 'protects trust and makes decisions easier to defend consistently'],
    ['feedback-use', 'using feedback', 'evaluating credible performance information and applying it to improvement', '{actor} asks for examples, identifies a pattern, and practices a revised approach', 'Separate the message from defensiveness and convert useful evidence into a specific action', 'rejects all criticism that is uncomfortable to hear', 'turns external observations into targeted professional growth'],
  ],
  'Strategic Management': [
    ['mission', 'a mission', 'a statement of the organization\'s present purpose, customers, and value', '{organization} uses its purpose to decide which proposed activities fit the business', 'Write a clear present-purpose statement and use it to screen major choices', 'lists a short-term sales target as the organization\'s entire purpose', 'keeps major choices connected to why the organization exists'],
    ['vision', 'a vision', 'a description of the future state the organization aims to create', '{organization} describes the long-term position it wants to achieve and uses it to guide priorities', 'Make the desired future clear enough to guide long-term choices', 'rewrites the future direction whenever a weekly result changes', 'gives people a shared direction beyond current operations'],
    ['swot', 'a SWOT analysis', 'a structured review of internal strengths and weaknesses and external opportunities and threats', '{actor} separates an internal capability gap from a new external competitor', 'Classify evidence by whether it is internal or external and favorable or unfavorable', 'labels every positive fact an opportunity even when it is an internal strength', 'organizes strategic evidence without confusing internal and external conditions'],
    ['strategic-objective', 'a strategic objective', 'a measurable priority that translates direction into a defined result and time frame', '{organization} sets a two-year retention target with an owner and measures', 'Connect a measurable outcome, deadline, owner, and strategic reason', 'announces an aspiration without a measure, owner, or time frame', 'turns broad direction into accountable progress'],
    ['competitive-advantage', 'competitive advantage', 'a valuable capability or position that enables superior performance and is difficult to match', '{organization} develops a trusted service system that customers value and competitors cannot copy quickly', 'Invest in a customer-valued difference supported by capabilities and evidence', 'calls any temporary discount a lasting advantage', 'supports performance that is more defensible than a short-lived tactic'],
    ['strategy-implementation', 'strategy implementation', 'the translation of strategic choices into resources, responsibilities, actions, and controls', '{actor} assigns owners, budgets, milestones, and measures to an approved growth strategy', 'Align structure, people, resources, projects, and measures with the chosen direction', 'publishes the strategy and assumes normal operations will deliver it automatically', 'converts a strategic decision into coordinated organizational action'],
  ],
  'Knowledge Management': [
    ['tacit-knowledge', 'tacit knowledge', 'experience-based know-how that is difficult to express fully in documents', '{actor} observes an expert handle unusual cases and discusses the judgment behind each choice', 'Use mentoring, observation, practice, and reflection to transfer experience-based judgment', 'expects a short checklist to capture every judgment an expert has developed', 'helps others acquire practical know-how that documents alone cannot convey'],
    ['explicit-knowledge', 'explicit knowledge', 'knowledge that can be recorded, organized, and shared in a stable form', '{organization} maintains a searchable procedure with version history and an owner', 'Document repeatable knowledge with context, ownership, and revision controls', 'stores procedures in personal files that coworkers cannot find', 'makes repeatable knowledge easier to locate and use consistently'],
    ['lessons-learned', 'lessons learned', 'documented insight about what worked, what failed, and how future work should change', '{actor} records evidence and recommendations after a project closes', 'Capture specific causes, effects, and reusable recommendations while evidence is fresh', 'records only that the project was successful without explaining why', 'prevents teams from relearning the same lesson through repeated mistakes'],
    ['knowledge-retention', 'knowledge retention', 'preservation of critical organizational know-how when roles or employees change', '{organization} identifies single-expert processes and cross-trains another qualified employee', 'Prioritize critical, concentrated knowledge and use documentation plus guided practice', 'waits until an expert\'s final day to ask for everything they know', 'reduces operating disruption when knowledgeable people leave or change roles'],
    ['knowledge-access', 'knowledge access', 'the ability of authorized people to find reliable information when they need it', '{actor} uses consistent tags, owners, and search terms for approved resources', 'Organize content around user tasks and remove obsolete or duplicate versions', 'creates many folders without naming standards or ownership', 'reduces search time and the use of outdated information'],
    ['community-practice', 'a community of practice', 'a group that improves shared expertise through recurring exchange and problem solving', '{organization} brings employees with similar work together to compare cases and methods', 'Give practitioners a recurring forum, useful problems, and a way to capture shared learning', 'requires attendance but provides no shared topic or problem to solve', 'spreads effective practices across people who perform related work'],
  ],
  'Project Management': [
    ['scope', 'project scope', 'the defined work, deliverables, boundaries, and acceptance conditions of a project', '{actor} documents what the project will produce and what is explicitly outside the effort', 'Agree on deliverables, boundaries, assumptions, and acceptance before detailed execution', 'allows each stakeholder to add work without evaluating time or cost', 'creates a shared basis for planning and controlling the project'],
    ['dependency', 'a project dependency', 'a relationship in which one activity or result relies on another', '{actor} schedules testing after the required system configuration is complete', 'Map predecessor relationships before promising milestone dates', 'starts dependent work before its required input exists', 'produces a schedule that respects the actual order of work'],
    ['critical-path', 'the critical path', 'the longest dependency path that determines the project\'s earliest completion date', '{actor} identifies tasks whose delay would move the final deadline', 'Calculate dependency paths and focus schedule control on tasks with no available slack', 'calls the most expensive task critical without analyzing schedule dependencies', 'shows where delay would directly affect project completion'],
    ['risk-register', 'a project risk register', 'a maintained record of uncertain events, probability, impact, owners, and responses', '{actor} assigns an owner and trigger to a supplier-delay risk', 'Record material risks, planned responses, triggers, owners, and review dates', 'lists risks once at kickoff and never reviews them again', 'turns uncertainty into monitored and owned response work'],
    ['change-control', 'project change control', 'a process for evaluating and authorizing proposed changes to scope, schedule, cost, or quality', '{actor} estimates a requested feature\'s effects before approval', 'Document the request, analyze effects, decide through the authorized process, and update plans', 'adds approved-sounding work immediately without evaluating consequences', 'prevents hidden changes from silently breaking project commitments'],
    ['stakeholder-plan', 'stakeholder planning', 'identification of affected parties and the engagement each needs throughout a project', '{actor} gives decision makers milestone choices and affected users early demonstrations', 'Assess influence, impact, information needs, and involvement for each stakeholder group', 'sends the same detailed update to every person regardless of role', 'improves decisions and adoption by involving the right people at the right time'],
  ],
  'Quality Management': [
    ['quality-standard', 'a quality standard', 'a defined, measurable requirement for an output or process', '{organization} specifies the acceptable dimensions and testing method for a component', 'State observable acceptance criteria and how they will be measured', 'uses a vague instruction to make the product good', 'gives employees and reviewers a consistent definition of acceptable work'],
    ['root-cause', 'root-cause analysis', 'investigation of the underlying condition that produces a recurring problem', '{actor} traces repeated shipping errors to an unclear product-code field in order entry', 'Use evidence to move from the visible defect to the controllable cause', 'replaces the last employee involved without studying the process', 'supports a correction that prevents recurrence instead of treating symptoms'],
    ['prevention', 'quality prevention', 'designing work so defects are less likely to occur', '{organization} validates required fields before an order can be submitted', 'Remove likely error opportunities through process design, training, and controls', 'relies entirely on finding mistakes after the customer receives the output', 'reduces the cost and customer impact of defects before they occur'],
    ['inspection', 'quality inspection', 'checking outputs against defined requirements to detect nonconformance', '{actor} measures a sample using the approved specification before shipment', 'Use a defined method, appropriate sample, calibrated tools, and recorded results', 'changes acceptance limits when a batch would otherwise fail', 'identifies unacceptable output before it moves farther through the process'],
    ['process-variation', 'process variation', 'differences in process results that may come from normal conditions or a specific unusual cause', '{actor} reviews results over time before reacting to one isolated measurement', 'Use time-ordered evidence to distinguish a stable pattern from a special event', 'changes the process after every small fluctuation', 'prevents overreaction while highlighting unusual conditions that need investigation'],
    ['corrective-action', 'corrective action', 'a documented change that removes the cause of a detected nonconformity', '{organization} fixes the source of a labeling error and verifies that the error rate falls', 'Contain the immediate issue, correct its cause, assign ownership, and verify effectiveness', 'closes the issue immediately after rewriting the affected label', 'confirms that a fix actually prevents the problem from returning'],
  ],
  'Risk Management': [
    ['risk-identification', 'risk identification', 'systematic recognition of uncertain events that could affect objectives', '{actor} maps operating, financial, people, supplier, technology, and external exposures', 'Review objectives, processes, assumptions, dependencies, incidents, and emerging conditions', 'considers only risks that have already caused a loss', 'creates a broader view of uncertainty before selecting responses'],
    ['risk-assessment', 'risk assessment', 'evaluation of a risk\'s likelihood, impact, timing, and existing controls', '{actor} ranks a likely moderate delay differently from a rare catastrophic outage', 'Use consistent criteria and document both probability and consequence', 'ranks risks only by how recently someone mentioned them', 'helps direct resources toward the most material exposures'],
    ['risk-avoidance', 'risk avoidance', 'ending or declining an activity so a particular exposure is not undertaken', '{organization} rejects a product use whose safety risk cannot be controlled acceptably', 'Use avoidance when the activity is optional and remaining exposure exceeds tolerance', 'calls a warning sign risk avoidance while continuing the same activity', 'removes exposure to a risk tied directly to the avoided activity'],
    ['risk-mitigation', 'risk mitigation', 'reducing the likelihood or impact of a risk through controls or changed activity', '{organization} adds supplier monitoring and a qualified backup for a critical input', 'Select controls that address the risk cause or reduce its consequence', 'adds a general policy that does not affect the identified exposure', 'lowers the chance or severity of disruption while the activity continues'],
    ['risk-transfer', 'risk transfer', 'shifting specified financial consequences or responsibilities to another party by agreement', '{organization} purchases coverage for a defined loss while retaining uncovered amounts', 'Confirm what is transferred, excluded, limited, and still retained', 'assumes a contract removes every operational and reputational consequence', 'limits selected financial consequences while clarifying retained exposure'],
    ['business-continuity', 'business continuity', 'preparation to sustain or restore critical operations during disruption', '{organization} defines recovery priorities, alternate resources, contacts, and tested procedures', 'Identify critical services, recovery targets, dependencies, alternatives, and exercise results', 'stores a recovery plan beside the only system it is meant to restore', 'reduces downtime and confusion when normal operations are interrupted'],
  ],
  'Channel Management': [
    ['direct-channel', 'a direct channel', 'distribution in which the producer sells to the final customer without an independent intermediary', '{organization} sells through its own website and service team', 'Use direct distribution when customer access, control, data, and operating capability support it', 'chooses direct distribution without planning fulfillment or customer support', 'can increase control over the customer relationship and market information'],
    ['indirect-channel', 'an indirect channel', 'distribution that uses wholesalers, retailers, agents, platforms, or other intermediaries', '{organization} uses regional distributors to reach customers it cannot serve efficiently itself', 'Choose intermediaries whose reach and services offset the added cost and reduced control', 'adds intermediaries without defining roles, economics, or customer ownership', 'can expand reach and add specialized distribution capabilities'],
    ['channel-conflict', 'channel conflict', 'disagreement among distribution members over goals, roles, territory, customers, or rewards', '{organization}\'s website undercuts the prices promised to its independent retailers', 'Define channel roles, pricing boundaries, customer ownership, and a dispute process', 'ignores complaints because competition among partners always improves results', 'protects cooperation and reduces harmful overlap among channel members'],
    ['distribution-intensity', 'distribution intensity', 'the number and type of outlets authorized to carry an offering', '{actor} chooses limited outlets for a specialized product requiring expert service', 'Match intensive, selective, or exclusive coverage to customer convenience and brand/service needs', 'uses maximum outlet coverage for every product regardless of positioning', 'aligns market availability with customer expectations and required control'],
    ['channel-logistics', 'channel logistics', 'coordination of product, information, and related movement through distribution', '{actor} aligns order data, inventory visibility, transport, and delivery commitments', 'Share accurate demand and inventory information and measure end-to-end service', 'optimizes one warehouse while customer delivery performance worsens', 'improves availability and reliability across the complete channel'],
    ['intermediary-value', 'intermediary value', 'the utility an intermediary adds through assortment, reach, financing, information, service, or efficiency', '{actor} keeps a distributor because its local service reduces delivery time and customer effort', 'Compare the intermediary\'s total added value with its cost and control trade-offs', 'removes an intermediary based only on its margin without replacing its services', 'explains why a channel member may improve the offer despite adding a step'],
  ],
  'Market Planning': [
    ['segmentation', 'market segmentation', 'division of a broad market into groups with meaningfully different needs or behavior', '{actor} groups customers by purchase situation and desired benefit rather than arbitrary labels', 'Use measurable, reachable, substantial differences that can guide a distinct response', 'creates tiny groups that cannot be measured or served differently', 'reveals customer groups that may respond to different value offers'],
    ['targeting', 'market targeting', 'evaluation and selection of the segment or segments an organization will serve', '{organization} compares segment fit, attractiveness, access, competition, and capability', 'Select segments the organization can reach and serve with a defensible value proposition', 'chooses the largest segment without considering fit or competition', 'focuses resources on the most suitable customer opportunities'],
    ['positioning', 'market positioning', 'the intended distinctive place an offering should hold in the target customer\'s mind', '{organization} consistently emphasizes dependable rapid service for time-sensitive buyers', 'Choose a relevant, credible difference and support it throughout the marketing mix', 'claims several conflicting positions in different messages', 'helps the target customer understand why the offering is a suitable choice'],
    ['situation-analysis', 'a market situation analysis', 'an evidence-based review of customers, competitors, company capabilities, and external conditions', '{actor} combines customer research, competitor evidence, internal performance, and trend data', 'Separate verified evidence from assumptions and identify implications for the plan', 'uses last year\'s sales alone as a complete picture of the market', 'creates a realistic starting point for objectives and strategy'],
    ['marketing-objective', 'a marketing objective', 'a specific measurable market result to be achieved within a defined period', '{organization} sets a target for qualified trial among a named segment by year end', 'State the audience, outcome, measure, baseline, target, and deadline', 'lists an activity such as posting more often without defining the result sought', 'gives tactics a measurable outcome to support'],
    ['marketing-budget', 'a marketing budget', 'the planned allocation of resources to activities intended to achieve marketing objectives', '{actor} funds tactics according to expected contribution, timing, and measurement needs', 'Connect spending to objectives, assumptions, timing, and evaluation rules', 'divides funds equally among channels regardless of audience or performance', 'makes resource trade-offs explicit and supports performance evaluation'],
  ],
  'Marketing-Information Management': [
    ['primary-research', 'primary research', 'new data collected specifically for the current marketing question', '{actor} interviews recent nonbuyers to learn why they did not complete a purchase', 'Use primary research when existing information cannot answer the defined question adequately', 'collects new data before checking whether reliable relevant information already exists', 'provides evidence tailored to the current decision'],
    ['secondary-research', 'secondary research', 'existing information originally collected for another purpose', '{actor} reviews industry reports and internal sales records before designing a survey', 'Evaluate source credibility, date, definitions, fit, and limitations before use', 'uses an old national statistic as an exact estimate for a local niche', 'can answer background questions quickly and refine the need for new research'],
    ['sampling', 'sampling', 'selection of part of a population to produce evidence about the larger group', '{actor} draws participants from all major customer segments rather than only easy-to-reach followers', 'Define the population and use a selection method that limits systematic exclusion', 'surveys only the most enthusiastic customers and generalizes to every buyer', 'can provide useful population evidence without contacting every member'],
    ['questionnaire-bias', 'questionnaire bias', 'systematic distortion caused by question wording, order, choices, or administration', '{actor} replaces a leading satisfaction question with neutral wording and balanced choices', 'Use neutral, single-focus questions and test whether respondents interpret them consistently', 'asks respondents whether they agree the excellent new feature should be retained', 'improves the validity of responses by reducing pressure toward one answer'],
    ['observation-research', 'observational research', 'systematic recording of behavior or conditions without relying only on self-report', '{actor} records where customers pause in a store while avoiding personal identification', 'Define observable behaviors, a consistent recording method, and appropriate privacy limits', 'infers customer motives with certainty from one observed action', 'reveals what people do while keeping claims within what was observed'],
    ['experiment', 'a marketing experiment', 'a controlled comparison used to estimate the effect of a changed marketing variable', '{actor} varies one message while keeping audience selection and timing comparable', 'Define the outcome, comparison groups, tested variable, and decision rule before observing results', 'changes price, message, audience, and timing together and credits one factor', 'provides stronger causal evidence than an uncontrolled before-and-after comparison'],
  ],
  Pricing: [
    ['cost-plus', 'cost-plus pricing', 'setting price by adding a chosen amount or percentage to cost', '{actor} calculates unit cost and applies a standard markup', 'Use complete relevant cost information and test the result against customer value and competition', 'assumes any cost-based price will be acceptable to customers', 'provides a simple link between cost and the proposed price'],
    ['value-based', 'value-based pricing', 'setting price primarily from the customer\'s perceived value and available alternatives', '{organization} studies the economic benefit its service creates for the target customer', 'Estimate customer value by segment and confirm willingness to pay with evidence', 'sets a premium price based only on the seller\'s confidence', 'aligns price with the benefit the customer expects to receive'],
    ['competitive-pricing', 'competition-oriented pricing', 'setting price with significant attention to competitors\' prices and market position', '{actor} compares equivalent offers and adjusts for meaningful differences in service', 'Compare genuinely similar alternatives and preserve the intended position and economics', 'matches the lowest observed price without comparing features or costs', 'keeps price responsive to the alternatives customers can choose'],
    ['markdown', 'a markdown', 'a reduction from an item\'s previous selling price', '{organization} lowers the price of seasonal inventory near the end of demand', 'Measure the reduction from the original selling price and evaluate margin and inventory effects', 'calls a lower wholesale purchase cost a customer markdown', 'can stimulate demand or clear inventory when the trade-off is understood'],
    ['price-elasticity', 'price elasticity of demand', 'the responsiveness of quantity demanded to a change in price', '{actor} compares the percentage change in unit demand with the percentage change in price', 'Use comparable periods and consider other factors that could have changed demand', 'attributes every sales change to price even though distribution also changed', 'helps estimate how customers may respond to a price adjustment'],
    ['contribution-pricing', 'contribution-based pricing analysis', 'evaluation of how price and variable cost affect the amount each sale contributes', '{actor} compares proposed prices using unit contribution and expected volume', 'Calculate price minus variable unit cost and test volume assumptions', 'selects the price with the most unit sales even when contribution becomes negative', 'connects a price decision with the resources available to cover fixed costs and profit'],
  ],
  'Product/Service Management': [
    ['product-life-cycle', 'the product life cycle', 'the pattern of introduction, growth, maturity, and decline that can shape market decisions', '{actor} adjusts investment as category growth slows and competition intensifies', 'Use current sales, customer, competitor, and category evidence rather than assuming a fixed timetable', 'declares a product mature only because it has existed for several years', 'provides a framework for adapting decisions as market conditions evolve'],
    ['branding', 'branding', 'the creation and management of identifying meaning, expectations, and associations for an offering', '{organization} delivers a consistent promise through its name, design, service, and communication', 'Define a relevant promise and support it consistently through customer experience', 'changes the logo and assumes customer trust will change automatically', 'helps customers recognize the offering and understand what to expect'],
    ['packaging', 'packaging', 'the container and presentation choices that protect, inform, enable use, and communicate an offering', '{actor} redesigns a package to reduce damage and make instructions easier to find', 'Balance protection, usability, information, cost, sustainability, and brand needs', 'selects a package only because it stands out on a screen', 'supports product protection and customer use while communicating important information'],
    ['service-design', 'service design', 'planned coordination of people, processes, evidence, and touchpoints that create a service experience', '{organization} maps the customer journey and fixes a confusing handoff between teams', 'Design the end-to-end experience around customer needs and operating capability', 'trains front-line staff while leaving a broken booking process unchanged', 'aligns customer experience with the processes required to deliver it'],
    ['product-mix', 'a product mix', 'the complete set of product lines and individual offerings sold by an organization', '{actor} evaluates overlap, role, demand, margin, and strategic fit across offerings', 'Review how each offering contributes to customer needs and portfolio goals', 'keeps every low-performing item because a larger assortment is always better', 'helps allocate resources across complementary and competing offerings'],
    ['new-product-development', 'new-product development', 'a staged process for developing and validating a new offering before and after launch', '{actor} tests the problem, concept, prototype, economics, and market response before scaling', 'Use evidence and decision gates to reduce the largest uncertainty at each stage', 'commits full production before confirming customer need or technical feasibility', 'reduces avoidable investment while improving the fit of a new offering'],
  ],
  Promotion: [
    ['advertising', 'advertising', 'paid, controlled nonpersonal communication delivered through selected media', '{organization} pays to place a message before a defined audience on a media platform', 'Match the audience, objective, message, medium, frequency, and measurement plan', 'chooses the cheapest placement without evidence the target audience uses it', 'provides controlled reach beyond one-to-one communication'],
    ['sales-promotion', 'sales promotion', 'a short-term incentive intended to encourage trial, purchase, or channel action', '{organization} offers a limited trial bundle to reduce first-purchase hesitation', 'Define the behavior, time limit, eligible audience, economics, and post-promotion measure', 'runs permanent discounts and still describes them as a limited incentive', 'can accelerate a specific near-term behavior when the economics are controlled'],
    ['public-relations', 'public relations', 'planned management of relationships and communication with important publics', '{actor} provides accurate, timely information and responds consistently during a community concern', 'Identify affected publics, communicate credible facts, and maintain two-way feedback', 'hides a known issue until outside attention disappears', 'supports informed relationships and organizational credibility'],
    ['personal-selling', 'personal selling', 'interactive communication used to understand needs and help a customer evaluate an offering', '{actor} asks questions, connects benefits to needs, and addresses concerns honestly', 'Diagnose the customer need before presenting relevant value and next steps', 'recites every feature before learning what the customer needs', 'allows the message and solution to adapt to the individual buyer'],
    ['promotional-objective', 'a promotional objective', 'a measurable communication or behavior result for a defined audience and period', '{organization} targets qualified awareness among a named segment before launch', 'Specify the audience, desired response, measure, baseline, target, and deadline', 'uses more promotion as an objective without defining an audience or result', 'creates a standard for choosing and evaluating promotional tactics'],
    ['media-selection', 'media selection', 'choice of communication channels based on audience, message, timing, cost, and objective', '{actor} selects media using target-audience reach and cost per qualified response', 'Compare audience fit, context, reach, frequency, timing, cost, and measurement quality', 'selects a popular platform because it has the largest total user count', 'places the message where the intended audience is more likely to receive it effectively'],
  ],
  Selling: [
    ['prospecting', 'prospecting', 'identifying and qualifying potential customers who may have a suitable need and ability to buy', '{actor} prioritizes leads using fit, need, authority, timing, and reasonable potential value', 'Define qualification evidence and focus effort on prospects the offering can serve', 'treats every contact as equally likely to buy', 'uses selling time on opportunities with stronger evidence of fit'],
    ['needs-discovery', 'needs discovery', 'the use of questions and listening to understand the customer\'s situation, goals, and constraints', '{actor} asks how the customer currently handles the problem and what a good outcome requires', 'Use open and focused questions, listen, summarize, and confirm priorities', 'asks only questions designed to lead the customer to a predetermined package', 'creates the evidence needed to recommend a relevant solution'],
    ['feature-benefit', 'feature-benefit translation', 'connection of an offering\'s characteristic to a result the customer values', '{actor} explains how automated alerts reduce the customer\'s missed deadlines', 'Link each relevant feature to the customer\'s stated need and expected outcome', 'lists technical features without explaining why they matter', 'turns product information into customer-relevant value'],
    ['objection-handling', 'objection handling', 'a respectful process for clarifying and responding to a customer concern', '{actor} confirms whether a price concern is about budget, value, timing, or comparison', 'Listen, clarify, acknowledge, respond with evidence, and confirm whether the concern remains', 'argues that the customer is wrong before understanding the objection', 'addresses the actual barrier instead of answering an assumed concern'],
    ['closing', 'a sales close', 'a clear request for an appropriate commitment or next step after value and concerns are addressed', '{actor} summarizes the agreed fit and asks whether the customer is ready to proceed', 'Use a direct next step that matches the customer\'s decision stage', 'pressures the customer for a final purchase before needs are understood', 'turns a suitable sales conversation into a mutually understood action'],
    ['follow-up', 'sales follow-up', 'post-conversation or post-purchase contact that confirms commitments and supports the relationship', '{actor} sends the promised information, confirms implementation, and records the next review date', 'Complete promised actions promptly and check whether the solution is delivering expected value', 'disappears after the sale unless the customer complains', 'reinforces trust and reveals needs that affect satisfaction or future business'],
  ],
  'Financial-Information Management': [
    ['reconciliation', 'account reconciliation', 'comparison of independent records to identify and resolve differences', '{actor} compares the cash ledger with the bank record and investigates unmatched items', 'Match periods and accounts, document differences, and approve corrections', 'forces totals to agree by entering an unexplained adjustment', 'detects recording errors and unexplained transactions'],
    ['audit-trail', 'an audit trail', 'a traceable record linking a transaction from authorization through processing and reporting', '{organization} retains the request, approval, receipt, entry, and later correction history', 'Use unique references, timestamps, approvals, and protected change history', 'allows entries to be overwritten without recording who changed them', 'supports accountability and efficient investigation of transactions'],
    ['segregation-duties', 'segregation of duties', 'division of authorization, custody, recording, and review so one person does not control an entire transaction', '{organization} separates payment approval from check preparation and reconciliation', 'Separate incompatible duties and add independent review when staffing is limited', 'lets one employee create a vendor, approve payment, and reconcile the account', 'reduces the opportunity for an error or misuse to remain hidden'],
    ['receivables', 'accounts-receivable management', 'control of amounts customers owe from credit sales', '{actor} ages unpaid invoices and follows a documented collection schedule', 'Use accurate billing, aging, dispute handling, collection steps, and credit terms', 'waits until year end to review overdue customer balances', 'improves collection timing and identifies credit problems earlier'],
    ['record-retention', 'financial record retention', 'controlled preservation and disposal of financial evidence according to business and legal needs', '{organization} applies a documented schedule and suspends deletion when a valid hold applies', 'Classify records, set authorized retention periods, protect access, and document disposal', 'keeps every duplicate forever because storage is inexpensive', 'preserves necessary evidence while limiting cost and unnecessary exposure'],
    ['management-reporting', 'management financial reporting', 'organized financial information prepared to support internal planning, control, and decisions', '{actor} gives a manager relevant trends, variances, definitions, and decision implications', 'Match the report\'s scope, timing, detail, and measures to the decision maker\'s need', 'sends every available ledger field without explaining the important differences', 'turns financial records into information managers can use'],
  ],
  'Earning Income': [
    ['total-compensation', 'total compensation', 'wages or salary plus the value of employer-provided benefits and other rewards', '{actor} compares two offers using pay, health coverage, retirement contributions, leave, and schedule', 'Compare both cash pay and benefits that matter to the worker\'s needs', 'chooses an offer using hourly pay alone even though hours and benefits differ', 'provides a fuller comparison of what work returns to the employee'],
    ['gross-net-income', 'the distinction between gross and net income', 'the difference between earnings before deductions and the amount received after deductions', '{actor} compares the gross amount on a pay statement with the smaller deposited amount', 'Review earnings and each deduction before using take-home pay in a spending plan', 'uses gross pay as the exact amount available to spend', 'creates a realistic estimate of money available after deductions'],
    ['withholding', 'payroll withholding', 'amounts an employer subtracts from pay and sends or holds for specified obligations', '{actor} reviews the categories withheld from a paycheck rather than treating every deduction as a fee', 'Check the pay statement and obtain qualified help for current tax or legal questions', 'assumes all withheld amounts are optional savings', 'helps explain why deposited pay differs from gross earnings'],
    ['human-capital', 'human capital', 'the knowledge, skills, health, and experience that affect a person\'s productive capability', '{actor} compares training cost with expected career options and skill demand', 'Invest in education or experience after evaluating cost, fit, completion, and likely benefit', 'enrolls in expensive training without checking whether employers value the skill', 'can expand a person\'s ability to create value and earn income'],
    ['income-diversity', 'income diversification', 'earning income from more than one source so one source is not solely relied upon', '{actor} adds suitable part-time freelance work without risking the primary job', 'Evaluate time, reliability, taxes, costs, conflicts, and risk for each source', 'assumes every second income source is profitable before counting expenses', 'can reduce dependence on one source while adding complexity that must be managed'],
    ['employee-benefits', 'employee benefits', 'nonwage compensation such as insurance, retirement support, leave, or services', '{actor} compares eligibility, employee cost, coverage, and value rather than the benefit name alone', 'Evaluate the benefit\'s actual terms and relevance to the worker\'s situation', 'counts every listed benefit at its maximum advertised value', 'supports a more accurate comparison of employment offers'],
  ],
  Spending: [
    ['spending-plan', 'a spending plan', 'a forward-looking allocation of expected income among needs, wants, goals, and obligations', '{actor} assigns expected take-home income before the month begins and updates actual results', 'Base the plan on realistic net income and include irregular as well as recurring costs', 'allocates the same money to several categories and treats each amount as available', 'helps align current choices with obligations and longer-term goals'],
    ['needs-wants', 'the distinction between needs and wants', 'classification of essential requirements separately from optional preferences', '{actor} protects housing and required transportation before expanding entertainment spending', 'Consider the consequence of going without the item in the person\'s actual situation', 'assumes a product category is always a need regardless of price or alternative', 'helps prioritize limited resources without claiming all preferences are unimportant'],
    ['unit-price', 'unit-price comparison', 'comparison of cost for the same standard quantity across alternatives', '{actor} converts two package prices to cost per ounce before choosing', 'Use the same unit and include likely waste or unusable quantity when relevant', 'chooses the larger package without calculating its cost per usable unit', 'makes differently sized offers easier to compare fairly'],
    ['payment-method', 'payment-method evaluation', 'comparison of a payment option\'s cost, timing, protection, convenience, and risk', '{actor} reviews fees, fraud protection, account balance, and repayment terms before paying', 'Choose a method after considering total cost, protections, access, and ability to pay', 'uses credit because it delays payment without considering interest or repayment', 'connects convenience with the full consequences of the payment choice'],
    ['purchase-research', 'purchase research', 'collection and comparison of reliable information before a significant buying decision', '{actor} compares total cost, quality, warranty, seller credibility, and return terms', 'Define decision criteria and verify claims using independent, current information', 'relies on one sponsored review without checking its incentives', 'reduces the chance that a purchase is based on incomplete or biased information'],
    ['opportunity-cost-spending', 'the opportunity cost of spending', 'the best alternative use of money that is given up by a purchase', '{actor} compares a discretionary purchase with progress toward an emergency-savings goal', 'Identify the highest-value alternative the same money could support', 'considers only whether enough cash exists today', 'makes the trade-off between current consumption and other goals explicit'],
  ],
  Saving: [
    ['emergency-fund', 'an emergency fund', 'liquid savings reserved for unexpected necessary expenses or income disruption', '{actor} keeps a separate accessible balance for urgent unplanned costs', 'Set a realistic target and replenish withdrawals while keeping the money accessible and low risk', 'invests all emergency money in a volatile asset that may be down when needed', 'reduces the need to borrow when an unexpected essential expense occurs'],
    ['savings-goal', 'a savings goal', 'a defined future amount, purpose, deadline, and contribution plan', '{actor} divides a target purchase amount by the remaining months and automates that contribution', 'Specify the amount and date, then track contributions and adjust when assumptions change', 'saves whatever remains without defining the goal or contribution needed', 'turns a future purchase or reserve into a measurable plan'],
    ['simple-interest', 'simple interest', 'interest calculated on the original principal rather than on accumulated interest', '{actor} calculates interest from principal, stated rate, and time', 'Match the rate and time units before multiplying principal by rate and time', 'adds prior interest to principal when the account uses simple interest', 'makes the interest amount predictable when principal, rate, and time are known'],
    ['compound-growth', 'compound growth', 'growth that earns returns on both original principal and previously accumulated returns', '{actor} leaves earned interest in an account so later interest is calculated on a larger balance', 'Compare effective rates, compounding frequency, time, fees, and risk', 'assumes compounding guarantees a particular return regardless of the stated rate or risk', 'allows reinvested earnings to contribute to later growth'],
    ['liquid-savings', 'liquid savings', 'money that can be accessed quickly with limited loss of value or penalty', '{actor} keeps near-term tuition money in an accessible low-volatility account', 'Match liquidity and stability to when the money will be needed', 'locks all near-term money into an illiquid asset for a slightly higher expected return', 'makes funds available for goals and obligations with short time horizons'],
    ['automatic-saving', 'automatic saving', 'a recurring transfer that moves money to savings without requiring a new decision each period', '{actor} schedules a transfer for the day after each paycheck arrives', 'Set an affordable recurring amount and review it when income or goals change', 'automates more than the account can support and repeatedly causes overdrafts', 'makes consistent saving easier by acting before discretionary spending occurs'],
  ],
  Investing: [
    ['risk-return', 'the risk-return relationship', 'the general trade-off in which higher expected return usually involves greater uncertainty or loss potential', '{actor} questions an investment promising high return with no risk', 'Compare expected return with volatility, loss potential, liquidity, fees, and time horizon', 'selects the highest advertised return and assumes principal is guaranteed', 'keeps return expectations connected to the risk required to pursue them'],
    ['diversification', 'diversification', 'spreading investments across different exposures to reduce concentration risk', '{actor} holds investments across industries and asset types instead of one employer\'s stock', 'Diversify across risks that do not all respond the same way to one event', 'buys several funds that all hold nearly identical assets', 'reduces the damage one holding or exposure can cause to the entire portfolio'],
    ['time-horizon', 'an investment time horizon', 'the length of time before invested money is expected to be needed', '{actor} uses a more stable choice for a near-term goal and accepts more variation for a distant goal', 'Match risk and liquidity to the goal date and flexibility of withdrawals', 'uses a volatile long-term asset for a bill due next month', 'aligns investment risk with the time available to recover from losses'],
    ['stock-bond', 'the distinction between stocks and bonds', 'the difference between ownership interests and debt obligations issued to investors', '{actor} recognizes that a stockholder owns an interest while a bondholder lends money', 'Compare claim type, risk, return source, priority, term, and liquidity', 'assumes both instruments guarantee the same payment and ownership rights', 'helps an investor understand the fundamentally different claims being purchased'],
    ['investment-fees', 'investment fees', 'charges that reduce the return retained by an investor', '{actor} compares expense ratios and transaction charges alongside performance', 'Compare all recurring and one-time costs over the expected holding period', 'ignores a small annual percentage because it looks unimportant for one year', 'reveals how costs compound against long-term investment growth'],
    ['inflation-investing', 'inflation risk', 'the chance that investment growth will not preserve purchasing power as prices rise', '{actor} compares the expected return after accounting for changes in purchasing power', 'Evaluate real rather than nominal growth for long-term goals', 'treats a positive dollar return as proof that purchasing power increased', 'keeps long-term planning focused on what future money can buy'],
  ],
  'Managing Credit': [
    ['apr', 'annual percentage rate', 'a standardized annual measure used to communicate borrowing cost under stated terms', '{actor} compares borrowing offers using APR together with fees, term, and payment details', 'Verify whether offers use comparable assumptions and calculate total repayment', 'compares only the monthly payment and ignores term and fees', 'supports a more consistent comparison of credit costs'],
    ['credit-report', 'a credit report', 'a record of credit accounts, payment history, inquiries, and related identifying information', '{actor} reviews a report for errors before applying for an apartment', 'Check reports through authorized channels and dispute inaccurate information with evidence', 'assumes a credit score and credit report are the same document', 'helps a consumer verify information used in many credit decisions'],
    ['credit-utilization', 'credit utilization', 'the portion of available revolving credit currently being used', '{actor} reduces a card balance rather than opening several accounts to hide it', 'Track reported balances and available limits while avoiding unnecessary debt', 'uses more of the limit because unused credit is treated as wasted money', 'helps explain one element lenders may use when evaluating revolving-credit behavior'],
    ['loan-term', 'a loan term', 'the period over which borrowed money is scheduled to be repaid', '{actor} notices that a longer term lowers payments but increases total interest under the stated rate', 'Compare payment, total cost, rate, fees, and flexibility across the full term', 'chooses the longest term automatically because its payment is smallest', 'shows the trade-off between payment size and how long interest may accrue'],
    ['secured-credit', 'secured credit', 'borrowing supported by collateral the lender may claim under the agreement after default', '{actor} understands that an auto loan may place the financed vehicle at risk', 'Identify the collateral, default terms, total cost, and ability to repay', 'assumes collateral removes the borrower\'s duty to make payments', 'clarifies why the lender may face less loss while the borrower risks the pledged asset'],
    ['repayment-capacity', 'repayment capacity', 'the borrower\'s realistic ability to make required payments from available income and resources', '{actor} tests a proposed payment against net income, essential expenses, other debts, and emergencies', 'Use a conservative spending plan and allow room for irregular costs and income changes', 'uses the maximum amount a lender offers as proof the payment is affordable', 'reduces the chance that new credit will crowd out essential obligations'],
  ],
  'Managing Risk': [
    ['insurance-premium', 'an insurance premium', 'the amount paid to keep specified insurance coverage in force', '{actor} compares premium cost with coverage, exclusions, deductible, and limits', 'Evaluate the full policy terms rather than premium alone', 'chooses the lowest premium without checking what losses are excluded', 'shows the recurring cost of transferring specified financial risk'],
    ['deductible', 'an insurance deductible', 'the amount or portion an insured person must bear before specified coverage pays', '{actor} keeps enough emergency savings to cover the chosen deductible', 'Choose a deductible by balancing premium savings with ability to absorb a loss', 'selects the highest deductible without considering available cash', 'makes the retained part of an insured loss explicit'],
    ['coverage-limit', 'a coverage limit', 'the maximum amount an insurance policy will pay for a specified covered loss', '{actor} compares the limit with the size of the financial exposure being insured', 'Review limits, sublimits, exclusions, conditions, and likely loss size', 'assumes the insurer will pay every cost once the deductible is met', 'shows how much financial consequence may remain with the insured'],
    ['risk-reduction', 'personal risk reduction', 'action that lowers the likelihood or severity of a potential personal loss', '{actor} uses strong unique passwords and account alerts to reduce identity-theft exposure', 'Choose a control that directly affects the identified cause or consequence', 'buys insurance and assumes no prevention steps are still needed', 'can prevent a loss or reduce its harm before insurance is involved'],
    ['identity-protection', 'identity protection', 'practices that reduce unauthorized use of personal and financial information', '{actor} verifies a message through a known channel before sharing an account code', 'Limit disclosure, secure accounts, monitor activity, and respond promptly to warning signs', 'uses the same password everywhere because it is easier to remember', 'reduces opportunities for account takeover and speeds detection of misuse'],
    ['fraud-warning', 'a fraud warning sign', 'a fact pattern that suggests deception or unauthorized activity may be occurring', '{actor} pauses when a caller creates urgency and demands payment by an unusual irreversible method', 'Stop, verify independently, protect credentials, and report through appropriate channels', 'follows the caller\'s verification link because the message looks official', 'creates time to verify a request before money or information is lost'],
  ],
}

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const categoryPrefixes: Record<TestCategory, string> = {
  BUSINESS_CORE: 'core',
  MANAGEMENT: 'mgmt',
  ENTREPRENEURSHIP: 'ent',
  FINANCE: 'fin',
  HOSPITALITY: 'hosp',
  MARKETING: 'mkt',
  PERSONAL_FINANCE: 'pfl',
}

const allForms: QuestionForm[] = ['direct', 'completion', 'classification', 'application', 'diagnosis', 'comparison']
const quantitativeAreas = new Set([
  'Financial Analysis',
  'Financial-Information Management',
  'Operations',
  'Project Management',
  'Market Planning',
  'Marketing-Information Management',
  'Pricing',
  'Promotion',
  'Selling',
  'Earning Income',
  'Spending',
  'Saving',
  'Investing',
  'Managing Credit',
  'Managing Risk',
])

export const TEST_BLUEPRINTS: TestBlueprint[] = TEST_CATEGORIES.flatMap(category =>
  EXAM_BLUEPRINTS[category].flatMap(quota => {
    if (quota.district === 0) return []
    const concepts = AREA_CONCEPTS[quota.instructionalArea]
    if (!concepts || concepts.length < 4) {
      throw new Error(`At least four first-party concepts are required for ${quota.instructionalArea}`)
    }
    return concepts.map(([slug, term, meaning, example, application, commonError, benefit]) => ({
      id: `${categoryPrefixes[category]}-${slugify(quota.instructionalArea)}-${slug}`,
      category,
      examFamily: TEST_CATEGORY_LABELS[category],
      instructionalArea: quota.instructionalArea,
      topic: term,
      learningObjective: `Apply ${term} accurately in an original ${quota.instructionalArea.toLowerCase()} context.`,
      meaning,
      example,
      application,
      commonError,
      benefit,
      allowedQuestionForms: quantitativeAreas.has(quota.instructionalArea)
        ? [...allForms, 'calculation']
        : allForms,
    }))
  }),
)

export function getTestBlueprints(category: TestCategory): TestBlueprint[] {
  return TEST_BLUEPRINTS.filter(blueprint => blueprint.category === category)
}

export function getInstructionalAreaBlueprints(category: TestCategory, instructionalArea: string): TestBlueprint[] {
  return TEST_BLUEPRINTS.filter(
    blueprint => blueprint.category === category && blueprint.instructionalArea === instructionalArea,
  )
}

export function isTestCategory(value: string): value is TestCategory {
  return (TEST_CATEGORIES as readonly string[]).includes(value)
}
