export type TestCategory = 'MANAGEMENT' | 'MARKETING' | 'FINANCE' | 'HOSPITALITY' | 'ENTREPRENEURSHIP'

export interface TestBlueprint {
  id: string
  category: TestCategory
  topic: string
  learningObjective: string
  conceptNotes: string[]
  allowedQuestionForms: Array<'decision' | 'calculation' | 'diagnosis' | 'sequence' | 'comparison'>
}

/**
 * First-party concept blueprints for original practice questions. They contain
 * general business facts and learning goals, not DECA/MBA Research exam text,
 * official scenarios, answer choices, or proprietary explanations.
 */
export const TEST_BLUEPRINTS: TestBlueprint[] = [
  {
    id: 'mgmt-delegation', category: 'MANAGEMENT', topic: 'Delegation and accountability',
    learningObjective: 'Choose an appropriate delegation approach while preserving accountability.',
    conceptNotes: ['A manager remains accountable for delegated work.', 'Clear outcomes, authority, deadlines, and check-ins improve delegation.', 'Delegation should match an employee’s readiness and workload.'],
    allowedQuestionForms: ['decision', 'diagnosis', 'sequence'],
  },
  {
    id: 'mgmt-operations', category: 'MANAGEMENT', topic: 'Process improvement',
    learningObjective: 'Diagnose a process bottleneck using cycle-time and error information.',
    conceptNotes: ['A bottleneck constrains total process throughput.', 'Changing a non-bottleneck may not improve total output.', 'A useful improvement measure should connect to time, quality, cost, or capacity.'],
    allowedQuestionForms: ['calculation', 'diagnosis', 'decision'],
  },
  {
    id: 'mgmt-projects', category: 'MANAGEMENT', topic: 'Project planning',
    learningObjective: 'Prioritize project work using dependencies, scope, risk, and deadlines.',
    conceptNotes: ['A dependency must be completed before dependent work can proceed.', 'Scope changes should be evaluated for schedule, cost, and quality effects.', 'Risks should have owners and response plans.'],
    allowedQuestionForms: ['decision', 'sequence', 'comparison'],
  },
  {
    id: 'mgmt-hr', category: 'MANAGEMENT', topic: 'Employee performance',
    learningObjective: 'Select a fair, job-related response to a performance gap.',
    conceptNotes: ['Performance expectations should be observable and job-related.', 'A manager should distinguish skill gaps, unclear expectations, and resource constraints.', 'Feedback is stronger when timely, specific, and tied to next steps.'],
    allowedQuestionForms: ['diagnosis', 'decision', 'sequence'],
  },
  {
    id: 'mgmt-ethics', category: 'MANAGEMENT', topic: 'Ethical decision making',
    learningObjective: 'Evaluate a management decision using stakeholders, transparency, and consistent standards.',
    conceptNotes: ['Ethical analysis considers affected stakeholders and foreseeable consequences.', 'Conflicts of interest should be disclosed and managed.', 'A defensible decision applies standards consistently and can be explained transparently.'],
    allowedQuestionForms: ['decision', 'comparison', 'diagnosis'],
  },
  {
    id: 'mgmt-data', category: 'MANAGEMENT', topic: 'Management information',
    learningObjective: 'Choose decision-relevant information and recognize a weak metric.',
    conceptNotes: ['A useful metric is relevant, reliable, timely, and clearly defined.', 'Averages can conceal important variation.', 'Correlation by itself does not prove causation.'],
    allowedQuestionForms: ['diagnosis', 'comparison', 'decision'],
  },

  {
    id: 'mkt-segmentation', category: 'MARKETING', topic: 'Market segmentation',
    learningObjective: 'Identify a useful target segment from customer needs and behavior.',
    conceptNotes: ['A useful segment is measurable, reachable, substantial, and meaningfully distinct.', 'Targeting chooses which segment or segments to serve.', 'Positioning defines the intended place in the target customer’s mind.'],
    allowedQuestionForms: ['comparison', 'decision', 'diagnosis'],
  },
  {
    id: 'mkt-research', category: 'MARKETING', topic: 'Marketing research',
    learningObjective: 'Select a research method that fits a business question and identify bias.',
    conceptNotes: ['Primary data is collected for the current decision; secondary data already exists.', 'A leading question can bias responses.', 'A sample should reasonably represent the population of interest.'],
    allowedQuestionForms: ['decision', 'diagnosis', 'comparison'],
  },
  {
    id: 'mkt-pricing', category: 'MARKETING', topic: 'Pricing decisions',
    learningObjective: 'Evaluate price, unit cost, demand, and positioning in a pricing decision.',
    conceptNotes: ['Contribution per unit equals selling price minus variable cost per unit.', 'A discount can raise unit sales while lowering contribution per unit.', 'Price should be consistent with customer value and positioning.'],
    allowedQuestionForms: ['calculation', 'decision', 'comparison'],
  },
  {
    id: 'mkt-promotion', category: 'MARKETING', topic: 'Promotion measurement',
    learningObjective: 'Match a promotional objective with a meaningful outcome measure.',
    conceptNotes: ['Awareness, engagement, leads, conversion, and retention measure different stages.', 'A vanity metric may rise without improving the business objective.', 'Experiments are stronger when groups differ mainly in the tested variable.'],
    allowedQuestionForms: ['diagnosis', 'decision', 'calculation'],
  },
  {
    id: 'mkt-channels', category: 'MARKETING', topic: 'Distribution channels',
    learningObjective: 'Compare channel choices using reach, control, service, and cost.',
    conceptNotes: ['Direct channels often offer more control but require operating capability.', 'Intermediaries can add reach, assortment, logistics, or local knowledge.', 'Channel conflict occurs when members’ goals or territories collide.'],
    allowedQuestionForms: ['comparison', 'decision', 'diagnosis'],
  },
  {
    id: 'mkt-customer', category: 'MARKETING', topic: 'Customer retention',
    learningObjective: 'Choose a response that addresses customer value and the cause of churn.',
    conceptNotes: ['Retention efforts should address the cause of dissatisfaction, not only offer discounts.', 'Customer lifetime value depends on margin, retention, and servicing cost.', 'Complaint patterns can reveal process or product problems.'],
    allowedQuestionForms: ['decision', 'diagnosis', 'comparison'],
  },

  {
    id: 'fin-statements', category: 'FINANCE', topic: 'Financial statements',
    learningObjective: 'Connect a business event to its effects on financial statements.',
    conceptNotes: ['The balance sheet reports assets, liabilities, and equity at a point in time.', 'The income statement reports revenue and expenses over a period.', 'Profit and cash flow can differ because of timing and noncash items.'],
    allowedQuestionForms: ['diagnosis', 'comparison', 'calculation'],
  },
  {
    id: 'fin-cash', category: 'FINANCE', topic: 'Cash-flow management',
    learningObjective: 'Diagnose a cash shortfall despite positive reported profit.',
    conceptNotes: ['Sales made on credit can increase profit before cash is collected.', 'Inventory purchases can use cash before the related sale occurs.', 'A cash forecast tracks expected timing of receipts and payments.'],
    allowedQuestionForms: ['diagnosis', 'calculation', 'decision'],
  },
  {
    id: 'fin-break-even', category: 'FINANCE', topic: 'Break-even analysis',
    learningObjective: 'Calculate and interpret contribution margin and break-even volume.',
    conceptNotes: ['Contribution per unit equals price minus variable cost per unit.', 'Break-even units equal fixed costs divided by contribution per unit.', 'The calculation assumes the stated price, cost, and sales mix remain applicable.'],
    allowedQuestionForms: ['calculation', 'comparison', 'decision'],
  },
  {
    id: 'fin-credit', category: 'FINANCE', topic: 'Credit decisions',
    learningObjective: 'Compare borrowing choices using total cost, timing, and risk.',
    conceptNotes: ['Interest rate, fees, term, and payment timing affect total borrowing cost.', 'A lower payment can result from a longer term and still cost more overall.', 'Borrowers should evaluate repayment capacity and consequences of default.'],
    allowedQuestionForms: ['calculation', 'comparison', 'decision'],
  },
  {
    id: 'fin-investment', category: 'FINANCE', topic: 'Investment risk and return',
    learningObjective: 'Match a financial choice to liquidity needs, time horizon, and risk tolerance.',
    conceptNotes: ['Higher expected return generally involves greater risk.', 'Diversification reduces concentration risk but does not eliminate all risk.', 'A short time horizon usually increases the importance of liquidity and stability.'],
    allowedQuestionForms: ['comparison', 'decision', 'diagnosis'],
  },
  {
    id: 'fin-controls', category: 'FINANCE', topic: 'Internal financial controls',
    learningObjective: 'Identify a control that reduces error or misuse without blocking operations.',
    conceptNotes: ['Segregation of duties separates authorization, custody, and recordkeeping when practical.', 'Reconciliation compares independent records.', 'Documentation and access controls create accountability.'],
    allowedQuestionForms: ['diagnosis', 'decision', 'sequence'],
  },

  {
    id: 'hosp-recovery', category: 'HOSPITALITY', topic: 'Guest recovery',
    learningObjective: 'Choose a service-recovery response proportionate to a documented failure.',
    conceptNotes: ['Effective recovery acknowledges the issue, resolves the immediate need, and addresses the cause.', 'Empathy does not require promising an unavailable remedy.', 'The response should respect safety, policy, and authorization limits.'],
    allowedQuestionForms: ['decision', 'sequence', 'diagnosis'],
  },
  {
    id: 'hosp-capacity', category: 'HOSPITALITY', topic: 'Capacity and demand',
    learningObjective: 'Balance capacity, demand, service quality, and revenue.',
    conceptNotes: ['Unsold perishable capacity, such as a room-night, cannot be stored for later sale.', 'Overbooking decisions should consider expected cancellations and service-recovery cost.', 'Demand forecasts should use relevant patterns and known events.'],
    allowedQuestionForms: ['calculation', 'decision', 'comparison'],
  },
  {
    id: 'hosp-safety', category: 'HOSPITALITY', topic: 'Food and guest safety',
    learningObjective: 'Prioritize immediate safety controls and appropriate escalation.',
    conceptNotes: ['Immediate hazards should be controlled before normal service resumes.', 'Allergy and contamination concerns require accurate communication and established procedures.', 'Staff should escalate matters beyond their authority or training.'],
    allowedQuestionForms: ['sequence', 'decision', 'diagnosis'],
  },
  {
    id: 'hosp-quality', category: 'HOSPITALITY', topic: 'Service quality',
    learningObjective: 'Use operating evidence to diagnose an inconsistent guest experience.',
    conceptNotes: ['Service standards should be observable and trainable.', 'Averages can conceal differences by shift, location, or service stage.', 'Root-cause analysis distinguishes symptoms from underlying causes.'],
    allowedQuestionForms: ['diagnosis', 'decision', 'comparison'],
  },
  {
    id: 'hosp-revenue', category: 'HOSPITALITY', topic: 'Hospitality revenue',
    learningObjective: 'Evaluate a revenue decision using price, occupancy, contribution, and guest mix.',
    conceptNotes: ['Revenue equals price multiplied by units sold.', 'A higher occupancy rate does not necessarily produce higher profit.', 'Restrictions and packages can affect both demand and service cost.'],
    allowedQuestionForms: ['calculation', 'comparison', 'decision'],
  },
  {
    id: 'hosp-itinerary', category: 'HOSPITALITY', topic: 'Travel experience planning',
    learningObjective: 'Build a feasible guest or traveler plan from timing, accessibility, and preference constraints.',
    conceptNotes: ['A feasible itinerary includes travel time and operating hours.', 'Accessibility and stated traveler needs are requirements, not optional extras.', 'Contingency time can reduce disruption risk.'],
    allowedQuestionForms: ['sequence', 'decision', 'comparison'],
  },

  {
    id: 'ent-customer', category: 'ENTREPRENEURSHIP', topic: 'Customer discovery',
    learningObjective: 'Distinguish evidence about customer problems from unsupported founder assumptions.',
    conceptNotes: ['Customer discovery tests assumptions before heavy investment.', 'Behavioral evidence is often stronger than general statements of interest.', 'Questions should avoid steering interviewees toward the founder’s preferred answer.'],
    allowedQuestionForms: ['diagnosis', 'decision', 'comparison'],
  },
  {
    id: 'ent-model', category: 'ENTREPRENEURSHIP', topic: 'Business models',
    learningObjective: 'Connect customer value, revenue, cost, and delivery choices in a business model.',
    conceptNotes: ['A value proposition explains why a target customer would choose the offering.', 'Revenue describes how money is earned; profit also accounts for costs.', 'Key activities and partners should support delivery of the promised value.'],
    allowedQuestionForms: ['diagnosis', 'comparison', 'decision'],
  },
  {
    id: 'ent-unit', category: 'ENTREPRENEURSHIP', topic: 'Unit economics',
    learningObjective: 'Calculate and interpret basic unit contribution before scaling.',
    conceptNotes: ['Unit contribution equals unit revenue minus variable unit cost.', 'Growth can worsen losses when each incremental sale has negative contribution.', 'Customer acquisition cost should be evaluated against expected customer contribution.'],
    allowedQuestionForms: ['calculation', 'diagnosis', 'decision'],
  },
  {
    id: 'ent-funding', category: 'ENTREPRENEURSHIP', topic: 'Funding choices',
    learningObjective: 'Compare funding alternatives by repayment, ownership, control, and risk.',
    conceptNotes: ['Debt normally requires repayment and may require collateral or covenants.', 'Equity exchanges ownership for capital and normally does not require scheduled repayment.', 'Bootstrapping can preserve control but constrain the speed or scope of growth.'],
    allowedQuestionForms: ['comparison', 'decision', 'calculation'],
  },
  {
    id: 'ent-experiment', category: 'ENTREPRENEURSHIP', topic: 'Venture experiments',
    learningObjective: 'Design a low-cost experiment with a decision rule for a risky assumption.',
    conceptNotes: ['A useful experiment tests a specific assumption.', 'A decision rule should be set before results are interpreted.', 'A minimum viable test should gather learning without building unnecessary features.'],
    allowedQuestionForms: ['sequence', 'decision', 'diagnosis'],
  },
  {
    id: 'ent-growth', category: 'ENTREPRENEURSHIP', topic: 'Responsible growth',
    learningObjective: 'Identify operational and cash risks created by rapid growth.',
    conceptNotes: ['Growth can increase working-capital needs before cash arrives.', 'Capacity, quality controls, and staffing should scale with demand.', 'A forecast should include downside assumptions and trigger points.'],
    allowedQuestionForms: ['diagnosis', 'decision', 'calculation'],
  },
]

export function getTestBlueprints(category: TestCategory): TestBlueprint[] {
  return TEST_BLUEPRINTS.filter(blueprint => blueprint.category === category)
}
