import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import type { DECAScenario, DECAEvent, ScoringCriteria } from '../../../types'
import { getEventById } from '../../../data/decaEvents'
import {
  CAREER_COMPETENCIES,
  FORMAT_RULES,
  chooseWeighted,
  chooseWeightedInstructionalArea,
  getRoleplayProfile,
  type FormatRules,
  type RoleplayProfile,
  type ScenarioArchetype,
} from '../../../data/roleplayProfiles'
import {
  PERSONAL_FINANCE_AREAS,
  getPersonalFinanceIndicators,
} from '../../../data/personalFinanceIndicators'
import { getPerformanceIndicatorsByAreas, getInstructionalAreasByCategory } from '../../../utils/instructionalAreas'
import {
  buildEventSystemPrompt,
  buildParticipantInstructions,
  getSolutionCriteria,
} from '../../../utils/roleplayPromptBuilder'
import { RateLimiter } from '../../../utils/rateLimiter'
import { RequestError, requireSameOrigin, requireSession } from '../../../utils/serverAuth'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const rateLimiter = new RateLimiter(5 * 60 * 1000)

const GENERAL_RULES: FormatRules = FORMAT_RULES['individual-series']
const GENERAL_ARCHETYPE: ScenarioArchetype = {
  id: 'category-practice',
  label: 'General category decision',
  weight: 100,
  participantRoles: ['department associate', 'assistant manager', 'business consultant'],
  judgeRoles: ['manager', 'owner', 'client'],
  settings: ['management meeting', 'client consultation'],
  tasks: ['analyze the facts', 'recommend a solution', 'explain implementation'],
  complications: ['a limited budget', 'a short deadline', 'competing stakeholder priorities'],
}

const CATEGORY_MAP: Record<string, DECAEvent['category']> = {
  FINANCE: 'FINANCE',
  MARKETING: 'MARKETING',
  HOSPITALITY: 'HOSPITALITY',
  MANAGEMENT: 'MANAGEMENT',
  MANAGMENT: 'MANAGEMENT',
  ENTREPRENEUR: 'ENTREPRENEUR',
  ENTREPRENEURSHIP: 'ENTREPRENEUR',
}

function shuffled<T>(items: T[]): T[] {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
  }
  return copy
}

function scoreBands(maxPoints: number): ScoringCriteria['levels'] {
  if (maxPoints === 17) return {
    exceeds: { points: '14-17', description: 'Highly effective and thorough demonstration.' },
    meets: { points: '10-13', description: 'Effective demonstration that meets expectations.' },
    below: { points: '5-9', description: 'Partially effective demonstration with important gaps.' },
    little: { points: '0-4', description: 'Little or no effective demonstration.' },
  }
  if (maxPoints === 12) return {
    exceeds: { points: '10-12', description: 'Highly effective and thorough demonstration.' },
    meets: { points: '7-9', description: 'Effective demonstration that meets expectations.' },
    below: { points: '4-6', description: 'Partially effective demonstration with important gaps.' },
    little: { points: '0-3', description: 'Little or no effective demonstration.' },
  }
  if (maxPoints === 10) return {
    exceeds: { points: '8-10', description: 'Highly effective and thorough demonstration.' },
    meets: { points: '6-7', description: 'Effective demonstration that meets expectations.' },
    below: { points: '3-5', description: 'Partially effective demonstration with important gaps.' },
    little: { points: '0-2', description: 'Little or no effective demonstration.' },
  }
  if (maxPoints === 8) return {
    exceeds: { points: '7-8', description: 'Highly effective and well supported.' },
    meets: { points: '5-6', description: 'Practical and generally effective.' },
    below: { points: '3-4', description: 'Some useful content, but important gaps remain.' },
    little: { points: '0-2', description: 'Little or no effective evidence.' },
  }
  if (maxPoints === 7) return {
    exceeds: { points: '6-7', description: 'Excellent impression and responses.' },
    meets: { points: '4-5', description: 'Professional impression and effective responses.' },
    below: { points: '2-3', description: 'Uneven impression or incomplete responses.' },
    little: { points: '0-1', description: 'Little evidence of readiness or responsiveness.' },
  }
  return {
    exceeds: { points: '5-6', description: 'Excellent demonstration.' },
    meets: { points: '4', description: 'Effective demonstration.' },
    below: { points: '2-3', description: 'Limited demonstration.' },
    little: { points: '0-1', description: 'Little or no demonstration.' },
  }
}

function rubricItem(name: string, maxPoints: number): ScoringCriteria {
  return { name, maxPoints, levels: scoreBands(maxPoints) }
}

function careerCompetenciesFor(profile?: RoleplayProfile): string[] {
  const indexes = profile?.format === 'team-decision' ? [0, 1, 4] : [0, 1, 2]
  return indexes.map(index => CAREER_COMPETENCIES[index])
}

function generalSystemPrompt(
  category: string,
  instructionalArea: string,
  performanceIndicators: string[],
): string {
  return `Create one original, unofficial DECA-style individual practice role-play for the ${category} category, focused on ${instructionalArea}.

Required performance indicators (the server will attach these; design the case so all can be demonstrated):
${performanceIndicators.map((indicator, index) => `${index + 1}. ${indicator}`).join('\n')}

Invent a fictional organization, a participant role and a judge role. Include concrete facts, realistic constraints, a decision, implementation expectations and enough information to answer without outside research. Ask exactly two open-ended judge questions. Do not copy or reconstruct an official DECA case and do not imply DECA endorsement.

Return ONLY valid JSON:
{
  "eventSituation": {
    "roleDescription": "Participant role, organization, judge role and objective",
    "companyBackground": "Organization and operating context",
    "businessChallenge": "Facts, constraints, tensions and deadline",
    "taskDescription": "Analysis, recommendation and implementation deliverables",
    "presentationContext": "Meeting setting, opening and conclusion"
  },
  "judgeInstructions": {
    "roleCharacterization": "Judge identity, priorities, concerns and matching facts",
    "questionsToAsk": ["Question one", "Question two"],
    "evaluationCriteria": "Conduct the meeting, ask both questions, then only thank the participant"
  }
}`
}

function isShortText(value: unknown, max = 4000): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= max
}

export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request)
    const user = await requireSession()
    const rateLimitKey = `user:${user.uid}`
    const rateLimitResult = rateLimiter.checkIdentifier(rateLimitKey)
    if (!rateLimitResult.allowed) {
      return NextResponse.json({
        error: 'Rate limit exceeded. Please wait a few minutes before generating another scenario.',
        timeRemaining: rateLimitResult.timeRemaining,
      }, { status: 429 })
    }
    rateLimiter.recordIdentifier(rateLimitKey)

    const payload = await request.json()
    const { category, eventId, selectedInstructionalArea } = payload as Record<string, unknown>
    if (typeof category !== 'string' || !CATEGORY_MAP[category]) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }
    if (eventId !== null && eventId !== undefined && (typeof eventId !== 'string' || eventId.length > 20)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 })
    }
    if (typeof selectedInstructionalArea !== 'string' || selectedInstructionalArea.length > 120) {
      return NextResponse.json({ error: 'Invalid instructional area' }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 })

    const selectedEvent = typeof eventId === 'string' ? getEventById(eventId) : undefined
    if (eventId && !selectedEvent) return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 })
    if (selectedEvent && selectedEvent.category !== CATEGORY_MAP[category]) {
      return NextResponse.json({ error: 'Event does not belong to this category' }, { status: 400 })
    }

    const profile = selectedEvent ? getRoleplayProfile(selectedEvent.id) : undefined
    if (selectedEvent && !profile) {
      return NextResponse.json({ error: 'This event does not have a role-play profile' }, { status: 400 })
    }
    const rules = profile ? FORMAT_RULES[profile.format] : GENERAL_RULES
    const availableAreas = profile?.format === 'personal-financial-literacy'
      ? PERSONAL_FINANCE_AREAS
      : getInstructionalAreasByCategory(category)
    if (!availableAreas.length) {
      return NextResponse.json({ error: 'No instructional areas found for this category' }, { status: 400 })
    }

    let actualInstructionalArea: string
    if (selectedInstructionalArea === 'RANDOM') {
      actualInstructionalArea = profile
        ? chooseWeightedInstructionalArea(profile, availableAreas.map(area => area.name)) || availableAreas[0].name
        : availableAreas[Math.floor(Math.random() * availableAreas.length)].name
    } else {
      if (!availableAreas.some(area => area.name === selectedInstructionalArea)) {
        return NextResponse.json({ error: 'Invalid instructional area' }, { status: 400 })
      }
      actualInstructionalArea = selectedInstructionalArea
    }

    const areaIndicators = profile?.format === 'personal-financial-literacy'
      ? getPersonalFinanceIndicators(actualInstructionalArea)
      : getPerformanceIndicatorsByAreas(category, [actualInstructionalArea])
    if (areaIndicators.length < rules.performanceIndicatorCount) {
      return NextResponse.json({ error: 'Not enough performance indicators for this instructional area' }, { status: 400 })
    }
    const selectedIndicators = shuffled(Array.from(new Set(areaIndicators))).slice(0, rules.performanceIndicatorCount)
    const archetype = profile ? chooseWeighted(profile.archetypes) : GENERAL_ARCHETYPE
    const systemPrompt = selectedEvent && profile
      ? buildEventSystemPrompt({
        event: selectedEvent,
        profile,
        archetype,
        instructionalArea: actualInstructionalArea,
        performanceIndicators: selectedIndicators,
      })
      : generalSystemPrompt(category, actualInstructionalArea, selectedIndicators)

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://decapal.org',
        'X-Title': 'DECA Pal',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate the ${archetype.label} practice case now.` },
        ],
        temperature: 0.85,
        max_tokens: 4200,
        provider: { order: ['Fireworks'], data_collection: 'deny', zdr: true },
      }),
    })
    if (!response.ok) throw new Error(`OpenRouter request failed with status ${response.status}`)

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (typeof content !== 'string' || !content.trim()) throw new Error('No content received from OpenRouter API')

    let scenarioData: Record<string, any>
    try {
      let jsonContent = content.trim()
      if (jsonContent.startsWith('```json')) jsonContent = jsonContent.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      else if (jsonContent.startsWith('```')) jsonContent = jsonContent.replace(/^```\s*/, '').replace(/\s*```$/, '')
      if (!jsonContent.trim().endsWith('}')) throw new Error('AI response appears to be truncated')
      scenarioData = JSON.parse(jsonContent)
    } catch (error) {
      throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : 'invalid JSON'}`)
    }

    const situationKeys = ['roleDescription', 'companyBackground', 'businessChallenge', 'taskDescription', 'presentationContext']
    const validSituation = scenarioData.eventSituation && situationKeys.every(key => isShortText(scenarioData.eventSituation[key]))
    const judge = scenarioData.judgeInstructions
    const validJudge = judge && isShortText(judge.roleCharacterization) && isShortText(judge.evaluationCriteria) &&
      Array.isArray(judge.questionsToAsk) && judge.questionsToAsk.length === 2 &&
      judge.questionsToAsk.every((question: unknown) => isShortText(question, 1000))
    if (!validSituation || !validJudge) throw new Error('AI response did not match the required scenario format')

    const competencies = careerCompetenciesFor(profile)
    const solutionCriteria = getSolutionCriteria(selectedEvent?.id || 'GENERAL')
    const scenario: DECAScenario = {
      id: `scenario_${randomUUID()}`,
      eventCode: selectedEvent?.id || 'GENERAL',
      careerCluster: selectedEvent?.careerCluster || 'Business',
      careerPathway: selectedEvent?.careerPathway || `${category} Management`,
      participantInstructions: profile
        ? buildParticipantInstructions(profile)
        : [
          `Review the Career Competencies, Performance Indicators and Event Situation. You have up to ${rules.prepMinutes} minutes to prepare.`,
          `You have up to ${rules.presentationMinutes} minutes to present to the judge.`,
          'This is an original unofficial practice scenario and is not an official DECA competitive event case.',
        ],
      centurySkills: competencies,
      performanceIndicators: selectedIndicators,
      practiceMetadata: profile ? {
        format: profile.format,
        archetypeId: archetype.id,
        archetypeLabel: archetype.label,
        instructionalArea: actualInstructionalArea,
        researchBasis: `${profile.historicalSample.publicCases} public DECA case-bank entries (${profile.historicalSample.yearRange.join('–')}); descriptive variety weighting only`,
      } : undefined,
      eventSituation: scenarioData.eventSituation,
      judgeInstructions: scenarioData.judgeInstructions,
      scoringRubric: {
        performanceIndicators: selectedIndicators.map(indicator => rubricItem(indicator, rules.performanceIndicatorMax)),
        solution: solutionCriteria.map(criterion => rubricItem(criterion, rules.solutionMax)),
        centurySkills: competencies.map(skill => rubricItem(skill, rules.careerCompetencyMax)),
        overallImpression: rubricItem("Overall impression and responses to the judge's questions", rules.overallImpressionMax),
      },
      createdAt: new Date(),
    }

    return NextResponse.json({ scenario })
  } catch (error) {
    if (error instanceof RequestError) return NextResponse.json({ error: error.message }, { status: error.status })
    console.error('Error generating roleplay scenario', error instanceof Error ? error.message : 'unknown error')
    return NextResponse.json({ error: 'Failed to generate roleplay scenario' }, { status: 500 })
  }
}
