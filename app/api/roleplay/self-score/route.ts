import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { FORMAT_RULES, getRoleplayProfile } from '../../../data/roleplayProfiles'
import { getSolutionCriteria } from '../../../utils/roleplayPromptBuilder'
import { saveRoleplayForUser } from '../../../utils/roleplayStore'
import { RequestError, requireSameOrigin, requireSession } from '../../../utils/serverAuth'

const MAX_REQUEST_CHARS = 500_000

function boundedScore(value: unknown, maximum: number): number {
  const numeric = typeof value === 'number' ? value : Number.NaN
  return Number.isFinite(numeric) ? Math.max(0, Math.min(maximum, Math.round(numeric))) : 0
}

export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request)
    const user = await requireSession()

    const contentLength = Number(request.headers.get('content-length') || 0)
    if (contentLength > MAX_REQUEST_CHARS) {
      return NextResponse.json({ error: 'Self-score submission is too large' }, { status: 413 })
    }

    const body = await request.text()
    if (body.length > MAX_REQUEST_CHARS) {
      return NextResponse.json({ error: 'Self-score submission is too large' }, { status: 413 })
    }

    let payload: Record<string, unknown>
    try {
      payload = JSON.parse(body)
      if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) throw new Error('Invalid body')
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    }

    const { scenario, category, duration, scores } = payload
    if (typeof scenario !== 'object' || scenario === null || Array.isArray(scenario) ||
        typeof scores !== 'object' || scores === null || Array.isArray(scores) ||
        typeof category !== 'string' || category.length > 100 ||
        typeof duration !== 'number' || !Number.isFinite(duration) || duration < 0 || duration > 1800) {
      return NextResponse.json({ error: 'Invalid self-score submission' }, { status: 400 })
    }

    const scenarioData = scenario as Record<string, unknown>
    const eventCode = typeof scenarioData.eventCode === 'string' ? scenarioData.eventCode : 'GENERAL'
    const profile = getRoleplayProfile(eventCode)
    const rules = profile ? FORMAT_RULES[profile.format] : FORMAT_RULES['individual-series']
    const performanceIndicators = scenarioData.performanceIndicators
    const centurySkills = scenarioData.centurySkills
    const eventSituation = scenarioData.eventSituation

    if (!Array.isArray(performanceIndicators) ||
        performanceIndicators.length !== rules.performanceIndicatorCount ||
        !performanceIndicators.every(item => typeof item === 'string' && item.length <= 1000) ||
        !Array.isArray(centurySkills) ||
        centurySkills.length !== rules.careerCompetencyCount ||
        !centurySkills.every(item => typeof item === 'string' && item.length <= 1000) ||
        typeof eventSituation !== 'object' || eventSituation === null || Array.isArray(eventSituation)) {
      return NextResponse.json({ error: 'Invalid scenario data' }, { status: 400 })
    }

    const scoreData = scores as Record<string, unknown>
    const solutionCriteria = getSolutionCriteria(eventCode)
    const performanceIndicatorScores = performanceIndicators.map((indicator, index) => ({
      indicator,
      score: boundedScore(scoreData[`indicator-${index}`], rules.performanceIndicatorMax),
      feedback: 'Self-scored by the participant.',
    }))
    const solutionScores = solutionCriteria.map((criterion, index) => ({
      criterion,
      score: boundedScore(scoreData[`solution-${index}`], rules.solutionMax),
      feedback: 'Self-scored by the participant.',
    }))
    const centurySkillScores = centurySkills.map((skill, index) => ({
      skill,
      score: boundedScore(scoreData[`skill-${index}`], rules.careerCompetencyMax),
      feedback: 'Self-scored by the participant.',
    }))
    const overallImpression = {
      score: boundedScore(scoreData.overall, rules.overallImpressionMax),
      feedback: 'Self-scored by the participant.',
    }
    const total = [
      ...performanceIndicatorScores,
      ...solutionScores,
      ...centurySkillScores,
      overallImpression,
    ].reduce((sum, item) => sum + item.score, 0)

    const sessionId = `roleplay_${randomUUID()}`
    const timestamp = new Date().toISOString()
    await saveRoleplayForUser(user, sessionId, {
      sessionId,
      userId: user.uid,
      evaluationMode: 'self-score',
      scenario: scenarioData,
      category,
      duration,
      transcript: [],
      actions: [],
      scores: {
        performanceIndicators: performanceIndicatorScores,
        solution: solutionScores,
        centurySkills: centurySkillScores,
        overallImpression,
        total,
      },
      timestampedFeedback: [],
      strengths: [],
      improvements: [],
      processedAt: timestamp,
      createdAt: timestamp,
    })

    return NextResponse.json({ success: true, sessionId })
  } catch (error) {
    if (error instanceof RequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('Error saving self-scored roleplay')
    return NextResponse.json({ error: 'Failed to save self-scored roleplay' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
