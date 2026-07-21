import FIXED_PRACTICE_QUESTION_BANK from './practiceQuestionBank.generated.json' with { type: 'json' }
import {
  EXAM_BLUEPRINTS,
  TEST_BLUEPRINTS,
  TEST_CATEGORIES,
  TEST_CATEGORY_LABELS,
  getInstructionalAreaBlueprints,
  type CompetitionLevel,
  type QuestionForm,
  type TestBlueprint,
  type TestCategory,
} from './testBlueprints.ts'

export type PracticeQuestionDifficulty = 'foundational' | 'intermediate' | 'advanced'
export type CognitiveOperation = 'identify' | 'classify' | 'apply' | 'diagnose' | 'compare' | 'calculate'

export interface AuthoredPracticeQuestion {
  id: string
  blueprintId: string
  objectiveId: string
  category: TestCategory
  examFamily: string
  competitionLevel: CompetitionLevel
  instructionalArea: string
  cognitiveOperation: CognitiveOperation
  stemForm: QuestionForm
  text: string
  answers: [string, string, string, string]
  correctAnswer: number
  explanation: string
  difficulty: PracticeQuestionDifficulty
  reviewStatus: 'automated-validated'
}

export const PRACTICE_QUESTION_BANK_VERSION = '2026-07-20-7000-v1'

const people = [
  'Avery', 'Jordan', 'Morgan', 'Riley', 'Cameron', 'Taylor', 'Parker', 'Casey',
  'Quinn', 'Rowan', 'Skyler', 'Reese', 'Dakota', 'Hayden', 'Emerson', 'Finley',
  'Alex', 'Jamie', 'Kendall', 'Sage', 'Drew', 'Robin', 'Blair', 'Devon',
  'Marin', 'Ellis', 'Lane', 'Noel', 'Shawn',
]

const organizations = [
  'Northline Services', 'Cedar Market', 'Harbor Works', 'Brightpath Studio',
  'Summit Supply', 'Juniper Foods', 'Riverbend Travel', 'Clearview Financial',
  'Oak Street Outfitters', 'Bluebird Events', 'Parkside Manufacturing', 'Lighthouse Lodging',
  'Greenway Media', 'Stonebridge Consulting', 'Meadowbrook Cafe', 'Redwood Technology',
  'Willow Health Products', 'Silverline Distribution', 'Maple City Arts', 'Trailhead Recreation',
  'Sunrise Home Goods', 'Horizon Learning', 'Crescent Mobility', 'Evergreen Community Center',
  'Pinecrest Design', 'Atlas Repair', 'Marigold Catering', 'Westfield Books',
  'Cloudline Software', 'Elm City Fitness', 'Beacon Property Services',
]

const personalSettings = [
  'monthly financial review', 'emergency-fund plan', 'education-cost plan',
  'transportation budget', 'first-apartment plan', 'career-training plan',
  'near-term savings plan', 'household spending review', 'credit-cost comparison',
  'insurance review', 'paycheck plan', 'long-term goal review',
  'technology-purchase plan', 'travel savings plan', 'income review',
  'banking comparison', 'debt-repayment plan', 'investment-goal review',
  'moving-cost plan', 'benefits comparison', 'holiday spending plan',
  'irregular-expense plan', 'financial-services review', 'risk-protection plan',
  'subscription review', 'used-vehicle plan', 'future housing plan',
  'savings-account review', 'borrowing decision', 'purchase comparison',
  'annual financial checkup',
]

const reviewContexts = [
  'a routine planning meeting', 'a customer-service review', 'an operating decision',
  'a staff training session', 'a monthly performance review', 'a new-project discussion',
  'an internal control review', 'a market-planning session', 'a budget discussion',
  'a process-improvement meeting', 'a new-employee orientation', 'a supplier review',
]

const familyContexts: Record<TestCategory, string> = {
  BUSINESS_CORE: 'general business work',
  MANAGEMENT: 'management and operations work',
  ENTREPRENEURSHIP: 'venture planning',
  FINANCE: 'financial-services work',
  HOSPITALITY: 'hospitality and tourism work',
  MARKETING: 'marketing work',
  PERSONAL_FINANCE: 'a personal financial decision',
}

const workUnits: Record<Exclude<TestCategory, 'PERSONAL_FINANCE'>, string> = {
  BUSINESS_CORE: 'business team',
  MANAGEMENT: 'management team',
  ENTREPRENEURSHIP: 'venture team',
  FINANCE: 'finance team',
  HOSPITALITY: 'guest-services team',
  MARKETING: 'marketing team',
}

const familyTags: Record<TestCategory, string> = {
  BUSINESS_CORE: 'business',
  MANAGEMENT: 'management',
  ENTREPRENEURSHIP: 'venture',
  FINANCE: 'finance',
  HOSPITALITY: 'hospitality',
  MARKETING: 'marketing',
  PERSONAL_FINANCE: 'personal-finance',
}

const reviewTags = [
  'planning', 'service', 'operations', 'training', 'performance', 'project',
  'control', 'market', 'budget', 'process', 'onboarding', 'supplier',
]

const personalReviewTags = [
  'budget', 'income', 'savings', 'spending', 'credit', 'insurance',
  'banking', 'investment', 'goals', 'benefits', 'tax', 'annual',
]

interface QuestionDraft {
  text: string
  answers: [string, string, string, string]
  correctAnswer: number
  explanation: string
  form: QuestionForm
  operation: CognitiveOperation
  difficulty: PracticeQuestionDifficulty
}

interface RenderContext {
  actor: string
  organization: string
}

const blueprintById = new Map(TEST_BLUEPRINTS.map(blueprint => [blueprint.id, blueprint]))

function render(value: string, context: RenderContext): string {
  return value
    .replaceAll('{actor}', context.actor)
    .replaceAll('{organization}', context.organization)
}

function lowerFirst(value: string): string {
  return value ? value[0].toLowerCase() + value.slice(1) : value
}

function withPeriod(value: string): string {
  return /[.!?]$/.test(value) ? value : `${value}.`
}

function possessive(value: string): string {
  return /s$/i.test(value) ? `${value}'` : `${value}'s`
}

function contextFor(categoryIndex: number, questionIndex: number): RenderContext {
  const category = TEST_CATEGORIES[categoryIndex]
  const baseOrganization = organizations[(questionIndex * 11 + categoryIndex * 3) % organizations.length]
  const organizationRoot = baseOrganization.split(' ')[0]
  const contextualOrganization = category === 'MANAGEMENT'
    ? `${organizationRoot} Industries`
    : category === 'ENTREPRENEURSHIP'
      ? `${organizationRoot} Ventures`
      : category === 'FINANCE'
        ? `${organizationRoot} Financial`
        : category === 'HOSPITALITY'
          ? `${organizationRoot} Hospitality`
          : category === 'MARKETING'
            ? `${organizationRoot} Brands`
            : baseOrganization
  return {
    actor: people[(questionIndex * 7 + categoryIndex * 5) % people.length],
    organization: contextualOrganization,
  }
}

function settingFor(category: TestCategory, context: RenderContext): string {
  return category === 'PERSONAL_FINANCE'
    ? `${context.actor}'s ${personalSettings[organizations.indexOf(context.organization)]}`
    : `${possessive(context.organization)} ${workUnits[category]}`
}

function renderExample(value: string, context: RenderContext, category: TestCategory): string {
  if (value.includes('{actor}')) {
    const actor = category === 'PERSONAL_FINANCE' ? context.actor : `${context.actor} at ${context.organization}`
    return render(value, { actor, organization: context.organization })
  }
  const rendered = render(value, context)
  return `${context.actor} observes how ${value.includes('{organization}') ? rendered : lowerFirst(rendered)}`
}

function capitalize(value: string): string {
  return value ? value[0].toUpperCase() + value.slice(1) : value
}

function getDistractors(
  category: TestCategory,
  instructionalArea: string,
  target: TestBlueprint,
  itemIndex: number,
): TestBlueprint[] {
  const pool = getInstructionalAreaBlueprints(category, instructionalArea).filter(item => item.id !== target.id)
  if (pool.length < 3) throw new Error(`Not enough distractor concepts for ${category}/${instructionalArea}`)
  const start = (itemIndex * 5) % pool.length
  return [0, 1, 2].map(offset => pool[(start + offset) % pool.length])
}

function placeCorrectAnswer(
  correct: string,
  distractors: readonly string[],
  itemIndex: number,
): { answers: [string, string, string, string]; correctAnswer: number } {
  const correctAnswer = (itemIndex * 3 + Math.floor(itemIndex / 7)) % 4
  const answers: string[] = []
  let distractorIndex = 0
  for (let index = 0; index < 4; index += 1) {
    if (index === correctAnswer) answers.push(correct)
    else {
      answers.push(distractors[distractorIndex])
      distractorIndex += 1
    }
  }
  return { answers: answers as [string, string, string, string], correctAnswer }
}

function conceptExplanation(blueprint: TestBlueprint): string {
  return `${blueprint.topic[0].toUpperCase()}${blueprint.topic.slice(1)} is ${blueprint.meaning}. ${withPeriod(blueprint.application)} This approach ${blueprint.benefit}.`
}

function buildConceptDraft(
  category: TestCategory,
  blueprint: TestBlueprint,
  categoryIndex: number,
  itemIndex: number,
  areaItemIndex: number,
): QuestionDraft {
  const context = contextFor(categoryIndex, itemIndex)
  const distractors = getDistractors(category, blueprint.instructionalArea, blueprint, itemIndex)
  const roll = (itemIndex * 37 + areaItemIndex * 19 + categoryIndex * 13) % 100
  const negative = itemIndex % 37 === 0
  const explanation = conceptExplanation(blueprint)
  const reviewTagPool = category === 'PERSONAL_FINANCE' ? personalReviewTags : reviewTags
  const reviewTag = reviewTagPool[(itemIndex + categoryIndex) % reviewTagPool.length]
  const reviewContext = category === 'PERSONAL_FINANCE'
    ? `a ${reviewTag} review`
    : reviewContexts[(itemIndex + categoryIndex) % reviewContexts.length]
  const setting = settingFor(category, context)

  if (negative) {
    const answerSet = placeCorrectAnswer(
      withPeriod(`${context.actor} ${blueprint.commonError}`),
      distractors.map(item => withPeriod(render(item.application, context))),
      itemIndex,
    )
    return {
      text: `For ${setting}, which action would most directly weaken ${blueprint.topic}?`,
      ...answerSet,
      explanation: `${withPeriod(`${context.actor} ${blueprint.commonError}`)} That action conflicts with ${blueprint.topic}, which is ${blueprint.meaning}.`,
      form: 'direct',
      operation: 'diagnose',
      difficulty: 'intermediate',
    }
  }

  if (roll < 18) {
    const answerSet = placeCorrectAnswer(
      withPeriod(blueprint.meaning),
      distractors.map(item => withPeriod(item.meaning)),
      itemIndex,
    )
    return {
      text: `For ${setting} during ${reviewContext}, which statement best explains ${blueprint.topic}?`,
      ...answerSet,
      explanation,
      form: 'direct',
      operation: 'identify',
      difficulty: 'foundational',
    }
  }

  if (roll < 36) {
    const answerSet = placeCorrectAnswer(
      blueprint.topic,
      distractors.map(item => item.topic),
      itemIndex,
    )
    return {
      text: category === 'PERSONAL_FINANCE'
        ? `For ${context.actor}'s ${reviewTag} review, ${blueprint.meaning} describes`
        : `During a ${familyTags[category]} ${reviewTag} review at ${context.organization}, ${blueprint.meaning} describes`,
      ...answerSet,
      explanation,
      form: 'completion',
      operation: 'identify',
      difficulty: 'foundational',
    }
  }

  if (roll < 66) {
    const answerSet = placeCorrectAnswer(
      blueprint.topic,
      distractors.map(item => item.topic),
      itemIndex,
    )
    return {
      text: `${withPeriod(capitalize(renderExample(blueprint.example, context, category)))} This ${familyTags[category]} ${reviewTag} example illustrates`,
      ...answerSet,
      explanation,
      form: 'classification',
      operation: 'classify',
      difficulty: 'intermediate',
    }
  }

  if (roll < 81) {
    const answerSet = placeCorrectAnswer(
      withPeriod(render(blueprint.application, context)),
      distractors.map(item => withPeriod(render(item.application, context))),
      itemIndex,
    )
    return {
      text: category === 'PERSONAL_FINANCE'
        ? `During ${setting}, which action best strengthens ${blueprint.topic}?`
        : `${context.actor} wants to strengthen ${blueprint.topic} for ${setting}. Which action is best?`,
      ...answerSet,
      explanation,
      form: 'application',
      operation: 'apply',
      difficulty: 'intermediate',
    }
  }

  if (roll < 92) {
    const answerSet = placeCorrectAnswer(
      withPeriod(render(blueprint.application, context)),
      distractors.map(item => withPeriod(render(item.application, context))),
      itemIndex,
    )
    return {
      text: `In a ${familyTags[category]} ${reviewTag} review, ${context.actor} ${blueprint.commonError}. What best corrects this?`,
      ...answerSet,
      explanation: `${withPeriod(`${context.actor} ${blueprint.commonError}`)} The stronger response is to ${lowerFirst(blueprint.application)} ${blueprint.topic[0].toUpperCase()}${blueprint.topic.slice(1)} ${blueprint.benefit}.`,
      form: 'diagnosis',
      operation: 'diagnose',
      difficulty: 'advanced',
    }
  }

  const optionContexts = distractors.map((_, index) => contextFor(categoryIndex, itemIndex + index + 1))
  const answerSet = placeCorrectAnswer(
    withPeriod(render(blueprint.example, context)),
    distractors.map((item, index) => withPeriod(render(item.example, optionContexts[index]))),
    itemIndex,
  )
  return {
    text: `For ${setting}, which situation best demonstrates ${blueprint.topic}?`,
    ...answerSet,
    explanation,
    form: 'comparison',
    operation: 'compare',
    difficulty: 'intermediate',
  }
}

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

function dollars(value: number): string {
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
}

function numericOptions(correct: number, alternatives: number[], formatter: (value: number) => string, itemIndex: number) {
  const distinct = alternatives.filter((value, index, values) => value !== correct && values.indexOf(value) === index).slice(0, 3)
  while (distinct.length < 3) distinct.push(correct + distinct.length + 1)
  return placeCorrectAnswer(formatter(correct), distinct.map(formatter), itemIndex)
}

function buildCalculationDraft(
  category: TestCategory,
  blueprint: TestBlueprint,
  categoryIndex: number,
  itemIndex: number,
  areaItemIndex: number,
): QuestionDraft {
  const context = contextFor(categoryIndex, itemIndex)
  const variant = areaItemIndex % 4

  if (blueprint.instructionalArea === 'Financial Analysis') {
    if (variant % 2 === 0) {
      const price = 28 + (areaItemIndex % 13)
      const variableCost = 9 + (areaItemIndex % 8)
      const units = 120 + (areaItemIndex % 9) * 10
      const contribution = (price - variableCost) * units
      const answerSet = numericOptions(
        contribution,
        [price * units, variableCost * units, price - variableCost],
        dollars,
        itemIndex,
      )
      return {
        text: `During ${familyContexts[category]}, ${context.organization} sells ${units} units at ${dollars(price)} each, with variable cost of ${dollars(variableCost)} per unit. What is total contribution margin?`,
        ...answerSet,
        explanation: `Unit contribution is ${dollars(price)} minus ${dollars(variableCost)}, or ${dollars(price - variableCost)}. Multiplying by ${units} units gives ${dollars(contribution)}.`,
        form: 'calculation', operation: 'calculate', difficulty: 'intermediate',
      }
    }
    const contribution = 12 + (areaItemIndex % 9)
    const breakEvenUnits = 180 + (areaItemIndex % 8) * 20
    const fixedCost = contribution * breakEvenUnits
    const answerSet = numericOptions(
      breakEvenUnits,
      [fixedCost, Math.round(fixedCost / (contribution + 4)), Math.round(fixedCost / (contribution - 3))],
      value => `${value.toLocaleString('en-US')} units`,
      itemIndex,
    )
    return {
      text: `During ${familyContexts[category]}, ${context.organization} has fixed costs of ${dollars(fixedCost)} and contribution margin of ${dollars(contribution)} per unit. How many units are required to break even?`,
      ...answerSet,
      explanation: `Break-even units equal fixed costs divided by unit contribution: ${dollars(fixedCost)} / ${dollars(contribution)} = ${breakEvenUnits.toLocaleString('en-US')} units.`,
      form: 'calculation', operation: 'calculate', difficulty: 'intermediate',
    }
  }

  if (blueprint.instructionalArea === 'Financial-Information Management') {
    const planned = 18_000 + (areaItemIndex % 12) * 1_000
    const difference = 700 + (areaItemIndex % 8) * 100
    const actual = variant % 2 === 0 ? planned + difference : planned - difference
    const variance = actual - planned
    const answerSet = placeCorrectAnswer(
      `${dollars(Math.abs(variance))} ${variance > 0 ? 'over budget' : 'under budget'}`,
      [
        `${dollars(Math.abs(variance))} ${variance > 0 ? 'under budget' : 'over budget'}`,
        `${dollars(actual)} over budget`,
        'No variance',
      ],
      itemIndex,
    )
    return {
      text: `During ${familyContexts[category]}, ${context.organization} budgeted ${dollars(planned)} for a cost and recorded ${dollars(actual)}. Using actual minus budget, what is the variance?`,
      ...answerSet,
      explanation: `${dollars(actual)} minus ${dollars(planned)} equals ${dollars(Math.abs(variance))}. The actual cost is ${variance > 0 ? 'above' : 'below'} budget, so it is ${variance > 0 ? 'over' : 'under'} budget.`,
      form: 'calculation', operation: 'calculate', difficulty: 'foundational',
    }
  }

  if (blueprint.instructionalArea === 'Operations' || blueprint.instructionalArea === 'Project Management') {
    const output = 240 + (areaItemIndex % 10) * 24
    const laborHours = 12 + (areaItemIndex % 6)
    const productivity = output / laborHours
    const answerSet = numericOptions(
      productivity,
      [output * laborHours, output - laborHours, laborHours / output],
      value => Number.isInteger(value) ? `${value.toLocaleString('en-US')} units per labor-hour` : `${value.toFixed(2)} units per labor-hour`,
      itemIndex,
    )
    return {
      text: `During ${familyContexts[category]}, ${context.organization} completes ${output} usable units with ${laborHours} labor-hours. What is labor productivity?`,
      ...answerSet,
      explanation: `Labor productivity is usable output divided by labor-hours: ${output} / ${laborHours} = ${Number.isInteger(productivity) ? productivity : productivity.toFixed(2)} units per labor-hour.`,
      form: 'calculation', operation: 'calculate', difficulty: 'foundational',
    }
  }

  if (blueprint.instructionalArea === 'Pricing') {
    const originalPrice = 80 + (areaItemIndex % 9) * 10
    const discountRate = 10 + (areaItemIndex % 4) * 5
    const discount = originalPrice * discountRate / 100
    const salePrice = originalPrice - discount
    const answerSet = numericOptions(
      salePrice,
      [discount, originalPrice + discount, originalPrice * (100 - discountRate)],
      dollars,
      itemIndex,
    )
    return {
      text: `During ${familyContexts[category]}, ${context.organization} marks down a ${dollars(originalPrice)} item by ${discountRate}%. What is the new selling price?`,
      ...answerSet,
      explanation: `The markdown is ${dollars(originalPrice)} x ${discountRate}% = ${dollars(discount)}. Subtracting it from the original price gives ${dollars(salePrice)}.`,
      form: 'calculation', operation: 'calculate', difficulty: 'foundational',
    }
  }

  if (blueprint.instructionalArea === 'Market Planning' || blueprint.instructionalArea === 'Marketing-Information Management' || blueprint.instructionalArea === 'Promotion' || blueprint.instructionalArea === 'Selling') {
    const total = 400 + (areaItemIndex % 10) * 100
    const rate = 8 + (areaItemIndex % 7) * 2
    const responses = total * rate / 100
    const answerSet = numericOptions(rate, [responses, 100 - rate, total / responses], value => `${value.toLocaleString('en-US')}%`, itemIndex)
    return {
      text: `During ${familyContexts[category]}, ${context.organization} receives ${responses.toLocaleString('en-US')} qualified responses from ${total.toLocaleString('en-US')} contacts. What is the qualified-response rate?`,
      ...answerSet,
      explanation: `The rate is qualified responses divided by contacts: ${responses} / ${total} x 100 = ${rate}%.`,
      form: 'calculation', operation: 'calculate', difficulty: 'foundational',
    }
  }

  if (blueprint.instructionalArea === 'Earning Income') {
    const hours = 24 + (areaItemIndex % 6) * 2
    const hourlyRate = 15 + (areaItemIndex % 8)
    const grossPay = hours * hourlyRate
    const answerSet = numericOptions(grossPay, [hourlyRate, hours + hourlyRate, grossPay - hourlyRate], dollars, itemIndex)
    return {
      text: `For ${familyContexts[category]}, ${context.actor} works ${hours} hours at ${dollars(hourlyRate)} per hour with no overtime. What is gross pay before deductions?`,
      ...answerSet,
      explanation: `Gross pay is hours multiplied by the hourly rate: ${hours} x ${dollars(hourlyRate)} = ${dollars(grossPay)}.`,
      form: 'calculation', operation: 'calculate', difficulty: 'foundational',
    }
  }

  if (blueprint.instructionalArea === 'Spending') {
    const packageAUnits = 8 + (areaItemIndex % 5)
    const packageAPrice = packageAUnits * (2 + (areaItemIndex % 4))
    const unitPrice = packageAPrice / packageAUnits
    const answerSet = numericOptions(unitPrice, [packageAPrice, packageAUnits, packageAPrice - packageAUnits], dollars, itemIndex)
    return {
      text: `For ${context.actor}, a package costs ${dollars(packageAPrice)} and contains ${packageAUnits} equal units. What is its unit price?`,
      ...answerSet,
      explanation: `Unit price is total package price divided by the number of units: ${dollars(packageAPrice)} / ${packageAUnits} = ${dollars(unitPrice)} per unit.`,
      form: 'calculation', operation: 'calculate', difficulty: 'foundational',
    }
  }

  if (blueprint.instructionalArea === 'Saving') {
    const principal = 1_000 + (areaItemIndex % 9) * 250
    const rate = 3 + (areaItemIndex % 5)
    const years = 2 + (areaItemIndex % 4)
    const interest = principal * rate / 100 * years
    const answerSet = numericOptions(interest, [principal * rate / 100, principal + interest, principal * years], dollars, itemIndex)
    return {
      text: `For ${familyContexts[category]}, ${context.actor} deposits ${dollars(principal)} at ${rate}% simple annual interest for ${years} years. How much interest is earned?`,
      ...answerSet,
      explanation: `Simple interest is principal x rate x time: ${dollars(principal)} x ${rate}% x ${years} = ${dollars(interest)}.`,
      form: 'calculation', operation: 'calculate', difficulty: 'intermediate',
    }
  }

  if (blueprint.instructionalArea === 'Investing') {
    const invested = 2_000 + (areaItemIndex % 8) * 500
    const gainRate = 4 + (areaItemIndex % 7) * 2
    const gain = invested * gainRate / 100
    const ending = invested + gain
    const answerSet = numericOptions(gainRate, [gain, ending, 100 - gainRate], value => `${value.toLocaleString('en-US')}%`, itemIndex)
    return {
      text: `For ${context.actor}, an investment rises from ${dollars(invested)} to ${dollars(ending)} with no deposits or withdrawals. What is the percentage return?`,
      ...answerSet,
      explanation: `Return is gain divided by the original investment: ${dollars(gain)} / ${dollars(invested)} x 100 = ${gainRate}%.`,
      form: 'calculation', operation: 'calculate', difficulty: 'intermediate',
    }
  }

  if (blueprint.instructionalArea === 'Managing Credit') {
    const principal = 1_200 + (areaItemIndex % 8) * 300
    const rate = 6 + (areaItemIndex % 7)
    const years = 2
    const interest = principal * rate / 100 * years
    const total = principal + interest
    const answerSet = numericOptions(total, [interest, principal * rate / 100, principal + rate], dollars, itemIndex)
    return {
      text: `For ${familyContexts[category]}, ${context.actor} borrows ${dollars(principal)} at ${rate}% simple annual interest for ${years} years with no fees. What is total repayment?`,
      ...answerSet,
      explanation: `Interest is ${dollars(principal)} x ${rate}% x ${years} = ${dollars(interest)}. Adding principal gives total repayment of ${dollars(total)}.`,
      form: 'calculation', operation: 'calculate', difficulty: 'intermediate',
    }
  }

  if (blueprint.instructionalArea === 'Managing Risk') {
    const coveredLoss = 3_000 + (areaItemIndex % 8) * 500
    const deductible = 250 + (areaItemIndex % 4) * 250
    const insurerPayment = coveredLoss - deductible
    const answerSet = numericOptions(insurerPayment, [deductible, coveredLoss, coveredLoss + deductible], dollars, itemIndex)
    return {
      text: `For ${familyContexts[category]}, ${context.actor} has a covered loss of ${dollars(coveredLoss)} and a ${dollars(deductible)} deductible. Ignoring other limits, how much does the insurer pay?`,
      ...answerSet,
      explanation: `The insured retains the ${dollars(deductible)} deductible. The insurer pays ${dollars(coveredLoss)} - ${dollars(deductible)} = ${dollars(insurerPayment)}.`,
      form: 'calculation', operation: 'calculate', difficulty: 'foundational',
    }
  }

  const base = 500 + (areaItemIndex % 10) * 100
  const rate = 5 + (areaItemIndex % 6) * 5
  const result = base * rate / 100
  const answerSet = numericOptions(result, [base, rate, base - result], dollars, itemIndex)
  return {
    text: `During ${familyContexts[category]}, ${context.organization} applies ${rate}% to a base amount of ${dollars(base)}. What is the resulting amount?`,
    ...answerSet,
    explanation: `${rate}% of ${dollars(base)} is ${dollars(base)} x ${rate}% = ${dollars(result)}.`,
    form: 'calculation', operation: 'calculate', difficulty: 'foundational',
  }
}

function shouldCalculate(category: TestCategory, instructionalArea: string, areaItemIndex: number): boolean {
  if (!quantitativeAreas.has(instructionalArea)) return false
  const interval = category === 'PERSONAL_FINANCE'
    ? 6
    : category === 'HOSPITALITY' || category === 'MANAGEMENT'
      ? 4
      : 3
  return areaItemIndex % interval === 0
}

function buildQuestion(
  category: TestCategory,
  blueprint: TestBlueprint,
  categoryIndex: number,
  itemIndex: number,
  areaItemIndex: number,
): AuthoredPracticeQuestion {
  const draft = shouldCalculate(category, blueprint.instructionalArea, areaItemIndex)
    ? buildCalculationDraft(category, blueprint, categoryIndex, itemIndex, areaItemIndex)
    : buildConceptDraft(category, blueprint, categoryIndex, itemIndex, areaItemIndex)

  return {
    id: `${category.toLowerCase().replaceAll('_', '-')}-v2-${String(itemIndex + 1).padStart(4, '0')}`,
    blueprintId: blueprint.id,
    objectiveId: blueprint.id,
    category,
    examFamily: TEST_CATEGORY_LABELS[category],
    competitionLevel: 'district',
    instructionalArea: blueprint.instructionalArea,
    cognitiveOperation: draft.operation,
    stemForm: draft.form,
    text: draft.text,
    answers: draft.answers,
    correctAnswer: draft.correctAnswer,
    explanation: draft.explanation,
    difficulty: draft.difficulty,
    reviewStatus: 'automated-validated',
  }
}

export function materializePracticeQuestionBank(): AuthoredPracticeQuestion[] {
  return TEST_CATEGORIES.flatMap((category, categoryIndex) => {
    let itemIndex = 0
    const questions = EXAM_BLUEPRINTS[category].flatMap(quota => {
      const count = quota.district * 10
      if (count === 0) return []
      const blueprints = getInstructionalAreaBlueprints(category, quota.instructionalArea)
      return Array.from({ length: count }, (_, areaItemIndex) => {
        const blueprint = blueprints[(areaItemIndex * 5 + Math.floor(areaItemIndex / blueprints.length)) % blueprints.length]
        const question = buildQuestion(category, blueprint, categoryIndex, itemIndex, areaItemIndex)
        itemIndex += 1
        return question
      })
    })
    if (questions.length !== 1_000) throw new Error(`${category} materialized ${questions.length} questions`)
    return questions
  })
}

// Runtime delivery reads only the committed, fixed records. The materializer is
// a maintainer tool and is never called when a learner opens a practice set.
export const PRACTICE_QUESTION_BANK = FIXED_PRACTICE_QUESTION_BANK as unknown as AuthoredPracticeQuestion[]

export function getAuthoredPracticeQuestions(category: TestCategory): AuthoredPracticeQuestion[] {
  return PRACTICE_QUESTION_BANK.filter(question => question.category === category)
}

function shuffledQuestions(
  items: readonly AuthoredPracticeQuestion[],
  random: () => number,
): AuthoredPracticeQuestion[] {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
  }
  return copy
}

export function selectAuthoredPracticeQuestions(
  category: TestCategory,
  count: number,
  random: () => number = Math.random,
): AuthoredPracticeQuestion[] {
  if (!Number.isInteger(count) || count < 1 || count > 100) {
    throw new Error('Practice-set size must be an integer from 1 through 100')
  }

  const available = getAuthoredPracticeQuestions(category)
  const allocations = EXAM_BLUEPRINTS[category].map((quota, index) => {
    const exact = quota.district * count / 100
    return { ...quota, index, count: Math.floor(exact), remainder: exact - Math.floor(exact) }
  })
  const remaining = count - allocations.reduce((total, allocation) => total + allocation.count, 0)
  const remainderOrder = [...allocations].sort(
    (left, right) => right.remainder - left.remainder || right.district - left.district || left.index - right.index,
  )
  for (let index = 0; index < remaining; index += 1) {
    remainderOrder[index].count += 1
  }

  const selected = allocations.flatMap(allocation => {
    const areaQuestions = available.filter(question => question.instructionalArea === allocation.instructionalArea)
    if (areaQuestions.length < allocation.count) {
      throw new Error(`Not enough ${category}/${allocation.instructionalArea} questions for this set`)
    }
    return shuffledQuestions(areaQuestions, random).slice(0, allocation.count)
  })

  if (selected.length !== count) throw new Error(`${category} selection returned ${selected.length} questions`)
  return shuffledQuestions(selected, random)
}

export function getPracticeQuestionBlueprint(blueprintId: string) {
  return blueprintById.get(blueprintId)
}
