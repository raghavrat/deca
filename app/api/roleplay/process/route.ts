import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { adminAuth } from '../../../firebase/admin'
import { getFirestore } from 'firebase-admin/firestore'

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Handle large video payloads
    const body = await request.text()
    let data
    try {
      data = JSON.parse(body)
    } catch (e) {
      console.error('Failed to parse JSON:', e)
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    }
    
    const { audio, images, scenario, category, duration, userId, userEmail } = data

    if (!audio || !scenario || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    console.log('Images provided:', images?.length || 0)
    console.log('Scenario structure:', {
      hasEventSituation: !!scenario.eventSituation,
      hasPerformanceIndicators: !!scenario.performanceIndicators,
      hasCenturySkills: !!scenario.centurySkills,
      hasJudgeInstructions: !!scenario.judgeInstructions,
      hasParticipantInstructions: !!scenario.participantInstructions,
      eventCode: scenario.eventCode,
      careerCluster: scenario.careerCluster
    })

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

    // Extract audio data
    console.log('Processing audio...')
    console.log('Audio data length:', audio?.length || 0)
    
    const audioBase64 = audio.split(',')[1]
    const audioFormat = audio.includes('audio/webm') ? 'webm' : 'wav'
    console.log('Audio format detected:', audioFormat)
    
    // STEP 1: Transcribe audio with Gemini 2.0 Flash
    console.log('Step 1: Transcribing audio with Gemini...')
    
    let transcript
    try {
      const transcriptionResponse = await openai.chat.completions.create({
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
                type: 'input_audio' as any,
                input_audio: {
                  data: audioBase64,
                  format: audioFormat
                }
              }
            ] as any
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
        max_tokens: 2000
      } as any)
      
      const transcriptionResult = JSON.parse(transcriptionResponse.choices[0].message.content || '{}')
      transcript = transcriptionResult.transcript || []
      
      console.log('Transcription result:', {
        entries: transcript.length,
        quality: transcriptionResult.audioQuality,
        firstEntry: transcript[0],
        fullTranscript: transcript
      })
      
      if (transcript.length === 0 || transcriptionResult.audioQuality === 'silent') {
        throw new Error('No audio content detected in recording')
      }
    } catch (error: any) {
      console.error('Transcription error:', error)
      throw new Error(`Transcription failed: ${error.message}`)
    }
    
    // STEP 2: Grade with GPT OSS
    console.log('Step 2: Grading with GPT OSS...')
    
    const gradingPrompt = `You are an expert DECA competition judge. Grade this roleplay performance.

ROLEPLAY SCENARIO PROVIDED TO STUDENT:
${JSON.stringify(scenario, null, 2)}

STUDENT'S ACTUAL RESPONSE (TRANSCRIPT):
${transcript.map((t: any) => `[${t.timestamp}] ${t.text}`).join('\n')}

${images?.length > 0 ? '\nNote: Student showed visual aids/diagrams during presentation.' : ''}

GRADING TASK:
You MUST grade ALL of these Performance Indicators (each out of 14):
${scenario.performanceIndicators.map((pi: string, i: number) => `${i + 1}. ${pi}`).join('\n')}

You MUST grade ALL of these 21st Century Skills (each out of 6):
${scenario.centurySkills.map((skill: string, i: number) => `${i + 1}. ${skill}`).join('\n')}

Grade based on what the student said. If they didn't address something, give it 0-4 points.

Return EXACTLY this JSON structure with ALL indicators and skills:
{
  "scores": {
    "performanceIndicators": [
${scenario.performanceIndicators.map((pi: string) => `      {"indicator": "${pi}", "score": NUMBER_0_TO_14, "feedback": "Your feedback here"}`).join(',\n')}
    ],
    "centurySkills": [
${scenario.centurySkills.map((skill: string) => `      {"skill": "${skill}", "score": NUMBER_0_TO_6, "feedback": "Your feedback here"}`).join(',\n')}
    ],
    "overallImpression": {
      "score": NUMBER_0_TO_6,
      "feedback": "Overall assessment here"
    }
  },
  "timestampedFeedback": [
    {"timestamp": "00:00", "type": "positive", "feedback": "What was good"},
    {"timestamp": "00:30", "type": "improvement", "feedback": "What could improve"}
  ],
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"]
}`
    
    let result
    try {
      const gradingResponse = await openai.chat.completions.create({
        model: 'openai/gpt-oss-20b',
        messages: [
          {
            role: 'system',
            content: 'You are a professional DECA judge. Evaluate fairly based on the actual performance, not what could have been said.'
          },
          {
            role: 'user',
            content: gradingPrompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 3000,
        provider: {
          order: ['Fireworks']
        }
      } as any)
      
      const gradingResult = JSON.parse(gradingResponse.choices[0].message.content || '{}')
      
      console.log('Grading result structure:', {
        hasScores: !!gradingResult.scores,
        hasPerfIndicators: !!gradingResult.scores?.performanceIndicators,
        perfIndicatorsCount: gradingResult.scores?.performanceIndicators?.length || 0,
        hasCenturySkills: !!gradingResult.scores?.centurySkills,
        centurySkillsCount: gradingResult.scores?.centurySkills?.length || 0,
        hasOverallImpression: !!gradingResult.scores?.overallImpression
      })
      
      result = {
        transcript: transcript,
        actions: [],
        scores: gradingResult.scores || {},
        timestampedFeedback: gradingResult.timestampedFeedback || [],
        strengths: gradingResult.strengths || [],
        improvements: gradingResult.improvements || []
      }
      
      console.log('Final result scores:', result.scores)
      console.log('Grading complete')
    } catch (error: any) {
      console.error('Grading error:', error)
      throw new Error(`Grading failed: ${error.message}`)
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
    if (result.scores?.overallImpression) {
      totalScore += result.scores.overallImpression.score || 0
    }
    
    // Ensure scores object exists
    if (!result.scores) {
      result.scores = {
        performanceIndicators: [],
        centurySkills: [],
        overallImpression: { score: 0, feedback: '' },
        total: 0
      }
    }
    
    result.scores.total = totalScore

    // Get Firestore instance
    const adminDb = getFirestore()
    
    // Generate a unique ID for this roleplay session
    const sessionId = `roleplay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Save results to Firebase under user's email document
    const roleplayData = {
      sessionId,
      userId,
      scenario,  // This should include the FULL scenario object
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
    
    console.log('Saving roleplay data with scenario:', {
      hasScenario: !!roleplayData.scenario,
      scenarioKeys: Object.keys(roleplayData.scenario || {}),
      hasEventSituation: !!roleplayData.scenario?.eventSituation,
      hasJudgeInstructions: !!roleplayData.scenario?.judgeInstructions,
      hasParticipantInstructions: !!roleplayData.scenario?.participantInstructions
    })
    
    // Save to Firebase under user's email document
    await adminDb
      .collection('roleplays')
      .doc(userEmail)
      .set({
        [sessionId]: roleplayData
      }, { merge: true })
    
    console.log('Saved roleplay to Firebase with ID:', sessionId)
    
    // Return just the session ID
    return NextResponse.json({ 
      success: true,
      sessionId,
      userEmail,
      message: 'Roleplay processed and saved successfully'
    })
  } catch (error) {
    console.error('Error processing video:', error)
    return NextResponse.json(
      { error: 'Failed to process video', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const maxDuration = 60 // Allow up to 60 seconds for processing