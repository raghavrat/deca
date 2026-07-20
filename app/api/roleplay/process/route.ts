import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { RequestError, requireSameOrigin, requireSession } from '../../../utils/serverAuth'
import { saveRoleplayForUser } from '../../../utils/roleplayStore'
import { RateLimiter } from '../../../utils/rateLimiter'
import { FORMAT_RULES, getRoleplayProfile } from '../../../data/roleplayProfiles'
import { getSolutionCriteria } from '../../../utils/roleplayPromptBuilder'

const MAX_REQUEST_CHARS = 18_000_000
const MAX_AUDIO_BASE64_CHARS = 16_000_000
const MAX_TRANSCRIPT_CHARS = 60_000
const submissionRateLimiter = new RateLimiter(60_000)

function boundedText(value: unknown, maxLength: number, fallback = ''): string {
  return typeof value === 'string' && value.length <= maxLength ? value : fallback
}

function boundedScore(value: unknown, maximum: number): number {
  const numeric = typeof value === 'number' ? value : Number.NaN
  return Number.isFinite(numeric) ? Math.max(0, Math.min(maximum, Math.round(numeric))) : 0
}

export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request)
    const user = await requireSession()
    const rateLimitKey = `user:${user.uid}`
    const rateLimitResult = submissionRateLimiter.checkIdentifier(rateLimitKey)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Please wait before submitting another recording', timeRemaining: rateLimitResult.timeRemaining },
        { status: 429 },
      )
    }
    submissionRateLimiter.recordIdentifier(rateLimitKey)

    const contentLength = Number(request.headers.get('content-length') || 0)
    if (contentLength > MAX_REQUEST_CHARS) {
      return NextResponse.json({ error: 'Audio upload is too large' }, { status: 413 })
    }

    const body = await request.text()
    if (body.length > MAX_REQUEST_CHARS) {
      return NextResponse.json({ error: 'Audio upload is too large' }, { status: 413 })
    }

    let data: Record<string, unknown>
    try {
      data = JSON.parse(body)
      if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        throw new Error('Invalid body')
      }
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    }
    
    const { audio, scenario, category, duration } = data

    if (typeof audio !== 'string' ||
        audio.length > MAX_AUDIO_BASE64_CHARS ||
        typeof scenario !== 'object' || scenario === null || Array.isArray(scenario) ||
        typeof category !== 'string' || category.length > 100 ||
        typeof duration !== 'number' || !Number.isFinite(duration) || duration < 0 || duration > 1200) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const scenarioData = scenario as Record<string, any>
    const roleplayProfile = typeof scenarioData.eventCode === 'string'
      ? getRoleplayProfile(scenarioData.eventCode)
      : undefined
    const formatRules = roleplayProfile
      ? FORMAT_RULES[roleplayProfile.format]
      : FORMAT_RULES['individual-series']
    const solutionCriteria = getSolutionCriteria(
      typeof scenarioData.eventCode === 'string' ? scenarioData.eventCode : 'GENERAL',
    )
    const eventSituation = scenarioData.eventSituation
    const situationFields = ['roleDescription', 'companyBackground', 'businessChallenge', 'taskDescription']
    if (typeof eventSituation !== 'object' || eventSituation === null || Array.isArray(eventSituation) ||
        !situationFields.every(field => boundedText(eventSituation[field], 4000).trim().length > 0) ||
        (scenarioData.eventCode !== undefined && !boundedText(scenarioData.eventCode, 30)) ||
        (scenarioData.careerCluster !== undefined && !boundedText(scenarioData.careerCluster, 200)) ||
        !Array.isArray(scenarioData.performanceIndicators) ||
        scenarioData.performanceIndicators.length !== formatRules.performanceIndicatorCount ||
        !scenarioData.performanceIndicators.every((item: unknown) => typeof item === 'string' && item.length <= 1000) ||
        !Array.isArray(scenarioData.centurySkills) ||
        scenarioData.centurySkills.length !== formatRules.careerCompetencyCount ||
        !scenarioData.centurySkills.every((item: unknown) => typeof item === 'string' && item.length <= 1000)) {
      return NextResponse.json({ error: 'Invalid scenario data' }, { status: 400 })
    }

    // Step 1: Transcribe audio with Gemini 2.0 Flash
    const transcriptionPrompt = `Please transcribe this audio recording EXACTLY as spoken. 
    
CRITICAL INSTRUCTIONS:
- ONLY transcribe what you hear in the audio
- Do NOT make up any content
- If the audio is silent, return: [SILENCE]
- If unclear, mark as: [UNCLEAR]
- Include natural speech patterns (um, uh, pauses)
- Use timestamps every 10-15 seconds or at natural breaks

Return ONLY a JSON object with this format:
{
  "transcript": [
    {"timestamp": "00:00", "text": "exact words spoken"},
    {"timestamp": "00:15", "text": "more exact words"}
  ],
  "audioQuality": "clear|muffled|silent",
  "totalDuration": "MM:SS"
}`

    const audioMatch = audio.match(/^data:audio\/(webm|wav|x-wav)(?:;codecs=[^;,]+)?;base64,([A-Za-z0-9+/=]+)$/)
    if (!audioMatch) {
      return NextResponse.json({ error: 'Unsupported audio format' }, { status: 415 })
    }
    const audioFormat = audioMatch[1] === 'webm' ? 'webm' : 'wav'
    const audioBase64 = audioMatch[2]
    
    // STEP 1: Transcribe audio with Gemini 2.0 Flash
    let transcript
    try {
      const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
      const apiKey = process.env.OPENROUTER_API_KEY
      
      if (!apiKey) {
        throw new Error('OpenRouter API key not configured')
      }
      
      const transcriptionRequestBody = {
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: transcriptionPrompt
              },
              {
                type: 'input_audio',
                input_audio: {
                  data: audioBase64,
                  format: audioFormat
                }
              }
            ]
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
        max_tokens: 2000,
        provider: {
          data_collection: 'deny',
          zdr: true,
        },
      }
      
      const requestHeaders = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://decapal.org',
        'X-Title': 'DECA Pal'
      }
      
      const transcriptionResponse = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(transcriptionRequestBody)
      })
      
      if (!transcriptionResponse.ok) {
        throw new Error(`Transcription service returned ${transcriptionResponse.status}`)
      }
      
      const transcriptionData = await transcriptionResponse.json()
      const transcriptionContent = transcriptionData.choices[0]?.message?.content
      
      if (typeof transcriptionContent !== 'string' || transcriptionContent.length > 1_000_000) {
        throw new Error('Invalid transcription response')
      }
      const transcriptionResult = JSON.parse(transcriptionContent || '{}')
      const transcriptCandidate = transcriptionResult.transcript
      if (!Array.isArray(transcriptCandidate) || transcriptCandidate.length > 250) {
        throw new Error('Invalid transcription response')
      }
      transcript = transcriptCandidate.filter((entry: unknown): entry is { timestamp: string; text: string } => {
        if (typeof entry !== 'object' || entry === null) return false
        const item = entry as Record<string, unknown>
        return typeof item.timestamp === 'string' && item.timestamp.length <= 20 &&
          typeof item.text === 'string' && item.text.length <= 2000
      })

      const transcriptLength = transcript.reduce((total, entry) => total + entry.text.length, 0)
      if (transcript.length !== transcriptCandidate.length || transcriptLength > MAX_TRANSCRIPT_CHARS) {
        throw new Error('Invalid transcription response')
      }
      
      if (transcript.length === 0 || transcriptionResult.audioQuality === 'silent') {
        return NextResponse.json(
          { 
            error: 'silent_audio', 
            message: 'No audio detected in your recording. Please ensure your microphone is working and try again.' 
          },
          { status: 400 }
        )
      }
    } catch {
      return NextResponse.json(
        { error: 'transcription_failed', message: 'The audio could not be transcribed. Please try again.' },
        { status: 502 },
      )
    }
    
    // STEP 2: Grade with GPT OSS
    // Validate scenario data
    if (!scenarioData.eventSituation || !scenarioData.performanceIndicators || !scenarioData.centurySkills) {
      return NextResponse.json(
        { 
          error: 'grading_failed', 
          message: 'Scenario data is incomplete',
          details: 'The roleplay scenario information is missing. Please try generating a new scenario.'
        },
        { status: 400 }
      )
    }
    
    // Build the student transcript
    const studentTranscript = transcript.map((t: { text: string }) => t.text).join(' ')
    
    // Build a comprehensive grading prompt
    const systemPrompt = `You are an experienced DECA judge evaluating a student's original practice roleplay performance using the current 100-point event-family evaluation structure.

SCORING GUIDELINES:
- ${scenarioData.performanceIndicators.length} Performance Indicators: 0-${formatRules.performanceIndicatorMax} points each
- Solution: ${solutionCriteria.join(', ')}; 0-${formatRules.solutionMax} points each
- ${scenarioData.centurySkills.length} Career Competencies: 0-${formatRules.careerCompetencyMax} points each
- Overall Impression and responses: 0-${formatRules.overallImpressionMax} points
- The maximum total is exactly 100 points.

Evaluate based ONLY on what the student actually said. Do not infer unspoken content. Give specific, concise evidence for every score.`

    const userPrompt = `Evaluate this DECA roleplay performance:

SCENARIO INFORMATION:
Event: ${scenarioData.eventCode || 'General'}
Career Cluster: ${scenarioData.careerCluster || 'Business'}

SITUATION THE STUDENT WAS GIVEN:
Role: ${scenarioData.eventSituation.roleDescription}
Company Background: ${scenarioData.eventSituation.companyBackground}
Business Challenge: ${scenarioData.eventSituation.businessChallenge}
Task Required: ${scenarioData.eventSituation.taskDescription}

PERFORMANCE INDICATORS TO EVALUATE:
${scenarioData.performanceIndicators.map((pi: string, i: number) => `${i+1}. ${pi}`).join('\n')}

SOLUTION CRITERIA TO EVALUATE:
${solutionCriteria.map((criterion, i) => `${i+1}. ${criterion}`).join('\n')}

CAREER COMPETENCIES TO EVALUATE:
${scenarioData.centurySkills.map((skill: string, i: number) => `${i+1}. ${skill}`).join('\n')}

STUDENT'S ACTUAL RESPONSE (TRANSCRIPT):
"${studentTranscript}"

Based on the student's response above, provide scores and feedback in this exact JSON format:
{
  "scores": {
    "performanceIndicators": [
${scenarioData.performanceIndicators.map((pi: string) => `      {"indicator": ${JSON.stringify(pi)}, "score": <integer 0-${formatRules.performanceIndicatorMax}>, "feedback": "<specific evidence-based feedback>"}`).join(',\n')}
    ],
    "solution": [
${solutionCriteria.map(criterion => `      {"criterion": ${JSON.stringify(criterion)}, "score": <integer 0-${formatRules.solutionMax}>, "feedback": "<specific evidence-based feedback>"}`).join(',\n')}
    ],
    "centurySkills": [
${scenarioData.centurySkills.map((skill: string) => `      {"skill": ${JSON.stringify(skill)}, "score": <integer 0-${formatRules.careerCompetencyMax}>, "feedback": "<brief evidence-based feedback>"}`).join(',\n')}
    ],
    "overallImpression": {
      "score": <integer 0-${formatRules.overallImpressionMax}>,
      "feedback": "<overall performance feedback>"
    }
  },
  "strengths": ["<specific strength 1>", "<specific strength 2>", "<specific strength 3>"],
  "improvements": ["<specific area for improvement 1>", "<specific area for improvement 2>", "<specific area for improvement 3>"],
  "timestampedFeedback": []
}`
    
    let result
    try {
      // Make the API call (matching the working generation endpoint)
      const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
      const apiKey = process.env.OPENROUTER_API_KEY
      
      if (!apiKey) {
        throw new Error('OpenRouter API key not configured')
      }
      
      const requestBody = {
        model: 'openai/gpt-oss-20b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,  // Slightly lower than generation but not too low
        max_tokens: 5000,  // Same as generation
        provider: {
          order: ['Fireworks'],
          data_collection: 'deny',
          zdr: true,
        }
        // NOTE: Removed response_format constraint - let the model respond naturally
      }
      
      const requestHeaders = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://decapal.org',
        'X-Title': 'DECA Pal'
      }
      
      const gradingResponse = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(requestBody)
      })
      
      if (!gradingResponse.ok) {
        throw new Error(`Grading service returned ${gradingResponse.status}`)
      }
      
      const data = await gradingResponse.json()
      const responseContent = data.choices[0]?.message?.content
      if (typeof responseContent !== 'string' || !responseContent) {
        console.error('GPT OSS returned no content - model may be unavailable')
        return NextResponse.json(
          { 
            error: 'grading_failed', 
            message: 'The AI grading model did not respond. This may be a temporary issue with the service.',
            details: 'The grading model (GPT OSS) is currently not responding. Please try again in a few moments, or contact support if the issue persists.'
          },
          { status: 503 }
        )
      }
      
      if (responseContent.length < 100) {
        return NextResponse.json(
          { 
            error: 'grading_failed', 
            message: 'The AI grading model returned an incomplete response.',
            details: 'The grading was incomplete. This is usually temporary - please try submitting your performance again.'
          },
          { status: 500 }
        )
      }
      
      let gradingResult
      try {
        if (responseContent.length > 2_000_000) throw new Error('Response too large')
        gradingResult = JSON.parse(responseContent)
      } catch {
        return NextResponse.json(
          { 
            error: 'grading_failed', 
            message: 'The AI grading model returned an invalid response format.',
            details: 'The grading model response could not be processed. This is a temporary issue - please try submitting again.'
          },
          { status: 500 }
        )
      }
      
      // Validate the response structure
      if (!Array.isArray(gradingResult.scores?.performanceIndicators) ||
          gradingResult.scores.performanceIndicators.length !== scenarioData.performanceIndicators.length ||
          !Array.isArray(gradingResult.scores?.solution) ||
          gradingResult.scores.solution.length !== solutionCriteria.length ||
          !Array.isArray(gradingResult.scores?.centurySkills) ||
          gradingResult.scores.centurySkills.length !== scenarioData.centurySkills.length ||
          typeof gradingResult.scores?.overallImpression !== 'object' ||
          gradingResult.scores.overallImpression === null) {
        console.error('Invalid grading structure - missing or incomplete performance indicators')
        return NextResponse.json(
          { 
            error: 'grading_failed', 
            message: 'The AI grading model returned an incomplete evaluation.',
            details: 'The grading did not include all performance indicators. Please try submitting again.'
          },
          { status: 500 }
        )
      }
      
      const performanceIndicatorScores = scenarioData.performanceIndicators.map((indicator: string, index: number) => {
        const score = gradingResult.scores.performanceIndicators[index] as Record<string, unknown>
        return {
          indicator,
          score: boundedScore(score?.score, formatRules.performanceIndicatorMax),
          feedback: boundedText(score?.feedback, 2000, 'No detailed feedback was returned.'),
        }
      })
      const solutionScores = solutionCriteria.map((criterion: string, index: number) => {
        const score = gradingResult.scores.solution[index] as Record<string, unknown>
        return {
          criterion,
          score: boundedScore(score?.score, formatRules.solutionMax),
          feedback: boundedText(score?.feedback, 2000, 'No detailed feedback was returned.'),
        }
      })
      const centurySkillScores = scenarioData.centurySkills.map((skill: string, index: number) => {
        const score = gradingResult.scores.centurySkills[index] as Record<string, unknown>
        return {
          skill,
          score: boundedScore(score?.score, formatRules.careerCompetencyMax),
          feedback: boundedText(score?.feedback, 2000, 'No detailed feedback was returned.'),
        }
      })
      const overallImpression = gradingResult.scores.overallImpression as Record<string, unknown>
      const safeList = (value: unknown) => Array.isArray(value)
        ? value.slice(0, 5).map(item => boundedText(item, 1000)).filter(Boolean)
        : []

      result = {
        transcript: transcript,
        actions: [],
        scores: {
          performanceIndicators: performanceIndicatorScores,
          solution: solutionScores,
          centurySkills: centurySkillScores,
          overallImpression: {
            score: boundedScore(overallImpression.score, formatRules.overallImpressionMax),
            feedback: boundedText(overallImpression.feedback, 2000, 'No overall feedback was returned.'),
          },
          total: 0,
        },
        timestampedFeedback: [],
        strengths: safeList(gradingResult.strengths),
        improvements: safeList(gradingResult.improvements)
      }
      
    } catch {
      // Only reached for unexpected errors since we handle specific cases above
      return NextResponse.json(
        { 
          error: 'grading_failed', 
          message: 'An unexpected error occurred during AI grading.',
          details: 'The AI judge encountered an unexpected issue. Please try submitting again.'
        },
        { status: 500 }
      )
    }

    // Calculate total score
    let totalScore = 0
    if (result.scores?.performanceIndicators) {
      result.scores.performanceIndicators.forEach((pi: any) => {
        totalScore += pi.score || 0
      })
    }
    if (result.scores?.centurySkills) {
      result.scores.centurySkills.forEach((skill: any) => {
        totalScore += skill.score || 0
      })
    }
    if (result.scores?.solution) {
      result.scores.solution.forEach((criterion: any) => {
        totalScore += criterion.score || 0
      })
    }
    if (result.scores?.overallImpression) {
      totalScore += result.scores.overallImpression.score || 0
    }
    
    // Ensure scores object exists
    if (!result.scores) {
      result.scores = {
        performanceIndicators: [],
        solution: [],
        centurySkills: [],
        overallImpression: { score: 0, feedback: '' },
        total: 0
      }
    }
    
    result.scores.total = totalScore

    
    // Generate a unique ID for this roleplay session
    const sessionId = `roleplay_${randomUUID()}`
    
    // Save results to Firebase under user's email document
    const roleplayData = {
      sessionId,
      userId: user.uid,
      scenario: scenarioData,
      category,
      duration,
      transcript: result.transcript || [],
      actions: result.actions || [],
      scores: result.scores,
      timestampedFeedback: result.timestampedFeedback || [],
      strengths: result.strengths || [],
      improvements: result.improvements || [],
      processedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
    
    await saveRoleplayForUser(user, sessionId, roleplayData)
    
    // Return just the session ID
    return NextResponse.json({ 
      success: true,
      sessionId,
      message: 'Roleplay processed and saved successfully'
    })
  } catch (error) {
    if (error instanceof RequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('Error processing audio')
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const maxDuration = 60 // Allow up to 60 seconds for processing
