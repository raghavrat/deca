import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { adminAuth, adminDb } from '../../../firebase/admin'

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
        return NextResponse.json(
          { 
            error: 'silent_audio', 
            message: 'No audio detected in your recording. Please ensure your microphone is working and try again.' 
          },
          { status: 400 }
        )
      }
    } catch (error: any) {
      console.error('Transcription error:', error)
      throw new Error(`Transcription failed: ${error.message}`)
    }
    
    // STEP 2: Grade with GPT OSS
    console.log('Step 2: Grading with GPT OSS...')
    
    // Simplified prompt for GPT OSS
    const studentTranscript = transcript.map((t: any) => t.text).join(' ')
    
    const gradingPrompt = `Grade this DECA roleplay transcript. Give each performance indicator a score 0-14 and each skill a score 0-6.

Performance Indicators:
${scenario.performanceIndicators.map((pi: string, i: number) => `PI${i + 1}: ${pi}`).join('\n')}

21st Century Skills:
${scenario.centurySkills.map((skill: string, i: number) => `S${i + 1}: ${skill}`).join('\n')}

Transcript: "${studentTranscript}"

Return JSON only:
{
  "scores": {
    "performanceIndicators": [
${scenario.performanceIndicators.map((pi: string, i: number) => `      {"indicator": "${pi}", "score": NUMBER, "feedback": "SHORT_FEEDBACK"}`).join(',\n')}
    ],
    "centurySkills": [
${scenario.centurySkills.map((skill: string, i: number) => `      {"skill": "${skill}", "score": NUMBER, "feedback": "SHORT_FEEDBACK"}`).join(',\n')}
    ],
    "overallImpression": {"score": NUMBER, "feedback": "SHORT_FEEDBACK"}
  },
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "timestampedFeedback": []
}`
    
    let result
    try {
      console.log('Sending grading request to GPT OSS...')
      console.log('Prompt length:', gradingPrompt.length, 'characters')
      
      const gradingResponse = await openai.chat.completions.create({
        model: 'openai/gpt-oss-20b',
        messages: [
          {
            role: 'system',
            content: 'You are a DECA judge. Score the student performance and return valid JSON only. Be concise.'
          },
          {
            role: 'user',
            content: gradingPrompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.5,
        max_tokens: 8000,
        provider: {
          order: ['Fireworks']
        }
      } as any)
      
      console.log('GPT OSS raw response:', JSON.stringify(gradingResponse, null, 2))
      const responseContent = gradingResponse.choices[0]?.message?.content
      console.log('Response content length:', responseContent?.length || 0, 'characters')
      console.log('Response content preview:', responseContent?.substring(0, 200))
      
      if (!responseContent) {
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
        console.error('GPT OSS returned insufficient content:', responseContent)
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
        gradingResult = JSON.parse(responseContent)
      } catch (parseError) {
        console.error('Failed to parse GPT OSS response as JSON:', responseContent)
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
      if (!gradingResult.scores?.performanceIndicators || 
          gradingResult.scores.performanceIndicators.length !== scenario.performanceIndicators.length) {
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
      console.error('Unexpected grading error:', error)
      // Only reached for unexpected errors since we handle specific cases above
      return NextResponse.json(
        { 
          error: 'grading_failed', 
          message: 'An unexpected error occurred during AI grading.',
          details: error.message || 'The AI judge encountered an unexpected issue. Please try submitting again.'
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