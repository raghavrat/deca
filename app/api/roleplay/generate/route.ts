import { NextRequest, NextResponse } from 'next/server'
import { DECAScenario } from '../../../types'
import { getEventById } from '../../../data/decaEvents'
import { getPerformanceIndicatorsByAreas, getInstructionalAreasByCategory } from '../../../utils/instructionalAreas'
import { RateLimiter } from '../../../utils/rateLimiter'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

// Create a rate limiter instance: 1 request per 5 minutes
const rateLimiter = new RateLimiter(5 * 60 * 1000) // 5 minutes in milliseconds

export async function POST(request: NextRequest) {
  try {
    // Check rate limit using IP/fingerprint-based rate limiting
    const rateLimitResult = rateLimiter.checkRateLimit(request)
    
    if (!rateLimitResult.allowed) {
      console.log(`Rate limit blocked request for ${rateLimitResult.identifier}, ${rateLimitResult.timeRemaining}s remaining`)
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please wait a few minutes before generating another scenario.',
          timeRemaining: rateLimitResult.timeRemaining
        },
        { status: 429 }
      )
    }

    console.log('Processing roleplay generation request')

    const { category, eventId, selectedInstructionalArea } = await request.json()

    console.log('DEBUG: Request data:', { category, eventId, selectedInstructionalArea })

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 })
    }

    // Get event details if eventId is provided
    let selectedEvent = null
    if (eventId) {
      selectedEvent = getEventById(eventId)
      if (!selectedEvent) {
        return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 })
      }
    }

    // Determine the correct number of performance indicators based on event type
    const getPICount = (eventId: string | null, eventName: string | null): number => {
      // PFL and Principles events use 4 PIs
      if (eventId === 'PFL' || eventName?.toLowerCase().includes('principles')) {
        return 4
      }

      // Team events use 7 PIs (when implemented)
      // TODO: Add team event detection when team events are added
      // if (eventName?.toLowerCase().includes('team') || isTeamEvent(eventId)) {
      //   return 7
      // }

      // Individual events use 5 PIs (default)
      return 5
    }

    const piCount = getPICount(eventId, selectedEvent?.name || null)
    console.log(`Using ${piCount} performance indicators for event: ${selectedEvent?.name || category}`)

    // Get PIs for selected instructional area
    let relevantPIs: string[]
    let actualInstructionalArea: string
    
    const { performanceIndicators } = await import('../../../performanceIndicators')
    const categoryMapping: { [key: string]: string } = {
      'FINANCE': 'FINANCE',
      'MARKETING': 'MARKETING',
      'HOSPITALITY': 'HOSPITALITY',
      'MANAGEMENT': 'MANAGEMENT',
      'MANAGMENT': 'MANAGEMENT',
      'ENTREPRENEUR': 'ENTREPRENEURSHIP',
      'ENTREPRENEURSHIP': 'ENTREPRENEURSHIP'
    }
    const mappedCategory = categoryMapping[category] || 'MANAGEMENT'
    
    // Handle random instructional area selection
    if (selectedInstructionalArea === 'RANDOM' || !selectedInstructionalArea) {
      const availableAreas = getInstructionalAreasByCategory(category)
      if (availableAreas.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableAreas.length)
        actualInstructionalArea = availableAreas[randomIndex].name
        console.log(`Randomly selected instructional area: ${actualInstructionalArea}`)
      } else {
        // Fallback if no areas found
        return NextResponse.json({ error: 'No instructional areas found for this category' }, { status: 400 })
      }
    } else {
      actualInstructionalArea = selectedInstructionalArea
    }
    
    // Get all PIs from the selected instructional area
    const areaPIs = getPerformanceIndicatorsByAreas(category, [actualInstructionalArea])
    console.log(`Found ${areaPIs.length} PIs for instructional area: ${actualInstructionalArea}`)
    
    // Get all other PIs from the category (excluding the selected area)
    const otherPIs = performanceIndicators
      .filter(pi => {
        if (!pi.category.includes(mappedCategory as any)) return false
        const areaName = pi.area.replace('Instructional Area: ', '').trim()
        return areaName !== actualInstructionalArea
      })
      .map(pi => pi.indicator.trim())
    
    // Shuffle the other PIs
    const shuffledOtherPIs = otherPIs.sort(() => Math.random() - 0.5)
    
    // Combine: all PIs from selected area + additional PIs to reach target
    if (areaPIs.length >= 100) {
      // If area has 100+ PIs, use all area PIs + 20 random others
      relevantPIs = [...areaPIs, ...shuffledOtherPIs.slice(0, 20)]
    } else {
      // Otherwise, use all area PIs + enough others to reach 100 total
      const remainingCount = Math.max(100 - areaPIs.length, 0)
      relevantPIs = [...areaPIs, ...shuffledOtherPIs.slice(0, remainingCount)]
    }
    
    console.log(`Using ${areaPIs.length} PIs from ${actualInstructionalArea} + ${relevantPIs.length - areaPIs.length} other PIs`)

    // Create official DECA format system prompt
    const systemPrompt = selectedEvent
      ? `You are a DECA competition scenario generator. Generate a realistic business roleplay scenario for the ${selectedEvent.name} (${selectedEvent.id}) event following the official DECA format.

Event Information:
- Event: ${selectedEvent.name}
- Career Cluster: ${selectedEvent.careerCluster}
- Career Pathway: ${selectedEvent.careerPathway}
- Description: ${selectedEvent.description}

AVAILABLE PERFORMANCE INDICATORS (select exactly ${piCount} that are most relevant to your scenario):
${relevantPIs.map((pi, index) => `${index + 1}. ${pi}`).join('\n')}

You must return ONLY valid JSON in the following official DECA format. Do not include any markdown formatting, explanations, or text outside the JSON:
{
  "eventCode": "${selectedEvent.id}",
  "careerCluster": "${selectedEvent.careerCluster}",
  "careerPathway": "${selectedEvent.careerPathway}",
  "participantInstructions": [
    "The event will be presented to you through your reading of the 21st Century Skills, Performance Indicators and Event Situation. You will have up to 10 minutes to review this information and prepare your presentation. You may make notes to use during your presentation.",
    "You will have up to 10 minutes to make your presentation to the judge (you may have more than one judge).",
    "You will be evaluated on how well you meet the performance indicators of this event.",
    "Turn in all of your notes and event materials when you have completed the event."
  ],
  "centurySkills": [
    "Critical Thinking – Reason effectively and use systems thinking.",
    "Problem Solving – Make judgments and decisions, and solve problems.",
    "Communication – Communicate clearly.",
    "Creativity and Innovation – Show evidence of creativity."
  ],
  "performanceIndicators": ["YOU MUST COPY EXACTLY ${piCount} INDICATORS FROM THE LIST PROVIDED - DO NOT CREATE YOUR OWN"],
  "eventSituation": {
    "roleDescription": "You are to assume the role of [specific job title] at [company name], a [company description]. The [stakeholder] (judge) [situation context].",
    "companyBackground": "Detailed 2-3 paragraph description of the company, its history, current market position, and relevant business context.",
    "businessChallenge": "Specific business challenge or decision that needs to be addressed, including why it's important and what factors are involved.",
    "taskDescription": "Clear description of what the participant needs to analyze, decide, or recommend to address the business challenge.",
    "presentationContext": "You will present your analysis and recommendation to the [stakeholder] (judge) in a role-play to take place in the [setting]. The [stakeholder] (judge) will begin the role-play by greeting you and asking to hear your ideas. After you have presented your recommendation and have answered the [stakeholder's] (judge's) questions, the [stakeholder] (judge) will conclude the role-play by thanking you for your work."
  },
  "judgeInstructions": {
    "roleCharacterization": "You are to assume the role of [stakeholder title] of [company name]. [Detailed description of the judge's character, motivations, concerns, and perspective on the business challenge.]",
    "questionsToAsk": ["Generate 3 specific questions the judge should ask each participant during the roleplay"],
    "evaluationCriteria": "The participant will present ideas to you in a role-play to take place in your [location]. You will begin the role-play by greeting the participant and asking to hear about his/her ideas. Once the participant has presented an analysis and have answered your questions, you will conclude the role-play by thanking the participant for the work. You are not to make any comments after the event is over except to thank the participant."
  }
}

CRITICAL INSTRUCTIONS FOR PERFORMANCE INDICATORS:
1. First, create the complete business scenario (company background, business challenge, task description, etc.)
2. Then for "performanceIndicators" field, you MUST copy EXACTLY ${piCount} indicators word-for-word from the numbered list I provided above
3. DO NOT write placeholder text like "Select indicators" or create your own indicators
4. The performanceIndicators array should contain exactly ${piCount} strings, each one copied directly from my list
5. Example of correct format: ["Explain the nature of business ethics", "Demonstrate ethical work habits", ...] - with actual indicators from the list

Make sure the scenario is:
- Realistic and relevant to modern business
- Appropriate for high school DECA competitors
- Challenging but achievable
- Focused on the ${selectedEvent.name} event requirements
- Performance indicators directly match the business challenge created
- Follows official DECA competition format exactly`
      : `You are a DECA competition scenario generator. Generate a realistic business roleplay scenario for the ${category} category following the official DECA format.

AVAILABLE PERFORMANCE INDICATORS (select exactly ${piCount} that are most relevant to your scenario):
${relevantPIs.map((pi, index) => `${index + 1}. ${pi}`).join('\n')}

You must return ONLY valid JSON in the following official DECA format. Do not include any markdown formatting, explanations, or text outside the JSON:
{
  "eventCode": "GENERAL",
  "careerCluster": "Business",
  "careerPathway": "${category} Management",
  "participantInstructions": [
    "The event will be presented to you through your reading of the 21st Century Skills, Performance Indicators and Event Situation. You will have up to 10 minutes to review this information and prepare your presentation. You may make notes to use during your presentation.",
    "You will have up to 10 minutes to make your presentation to the judge (you may have more than one judge).",
    "You will be evaluated on how well you meet the performance indicators of this event.",
    "Turn in all of your notes and event materials when you have completed the event."
  ],
  "centurySkills": [
    "Critical Thinking – Reason effectively and use systems thinking.",
    "Problem Solving – Make judgments and decisions, and solve problems.",
    "Communication – Communicate clearly.",
    "Creativity and Innovation – Show evidence of creativity."
  ],
  "performanceIndicators": ["YOU MUST COPY EXACTLY ${piCount} INDICATORS FROM THE LIST PROVIDED - DO NOT CREATE YOUR OWN"],
  "eventSituation": {
    "roleDescription": "You are to assume the role of [specific job title] at [company name], a [company description]. The [stakeholder] (judge) [situation context].",
    "companyBackground": "Detailed 2-3 paragraph description of the company, its history, current market position, and relevant business context.",
    "businessChallenge": "Specific business challenge or decision that needs to be addressed, including why it's important and what factors are involved.",
    "taskDescription": "Clear description of what the participant needs to analyze, decide, or recommend to address the business challenge.",
    "presentationContext": "You will present your analysis and recommendation to the [stakeholder] (judge) in a role-play to take place in the [setting]. The [stakeholder] (judge) will begin the role-play by greeting you and asking to hear your ideas. After you have presented your recommendation and have answered the [stakeholder's] (judge's) questions, the [stakeholder] (judge) will conclude the role-play by thanking you for your work."
  },
  "judgeInstructions": {
    "roleCharacterization": "You are to assume the role of [stakeholder title] of [company name]. [Detailed description of the judge's character, motivations, concerns, and perspective on the business challenge.]",
    "questionsToAsk": ["Generate 3 specific questions the judge should ask each participant during the roleplay"],
    "evaluationCriteria": "The participant will present ideas to you in a role-play to take place in your [location]. You will begin the role-play by greeting the participant and asking to hear about his/her ideas. Once the participant has presented an analysis and has answered your questions, you will conclude the role-play by thanking the participant for the work. You are not to make any comments after the event is over except to thank the participant."
  }
}

CRITICAL INSTRUCTIONS FOR PERFORMANCE INDICATORS:
1. First, create the complete business scenario (company background, business challenge, task description, etc.)
2. Then for "performanceIndicators" field, you MUST copy EXACTLY ${piCount} indicators word-for-word from the numbered list I provided above
3. DO NOT write placeholder text like "Select indicators" or create your own indicators
4. The performanceIndicators array should contain exactly ${piCount} strings, each one copied directly from my list
5. Example of correct format: ["Explain the nature of business ethics", "Demonstrate ethical work habits", ...] - with actual indicators from the list

Make sure the scenario is:
- Realistic and relevant to modern business
- Appropriate for high school DECA competitors
- Challenging but achievable
- Focused on the ${category} category
- Performance indicators directly match the business challenge created
- Follows official DECA competition format exactly`

    const userPrompt = selectedEvent
      ? `Create a ${selectedEvent.name} roleplay scenario where the core business challenge and tasks directly involve ${actualInstructionalArea.toLowerCase()} concepts and skills. The participant's main objective and the solutions they need to propose should be centered around ${actualInstructionalArea.toLowerCase()}. After creating the scenario, select ${piCount} performance indicators: Choose ${piCount - 2} to ${piCount - 1} indicators that are directly from the ${actualInstructionalArea.toLowerCase()} area, and 1-2 complementary indicators from other areas that would naturally support solving this business challenge.`
      : `Create a DECA ${category.toLowerCase()} roleplay scenario where the core business challenge and tasks directly involve ${actualInstructionalArea.toLowerCase()} concepts and skills. The participant's main objective and the solutions they need to propose should be centered around ${actualInstructionalArea.toLowerCase()}. After creating the scenario, select ${piCount} performance indicators: Choose ${piCount - 2} to ${piCount - 1} indicators that are directly from the ${actualInstructionalArea.toLowerCase()} area, and 1-2 complementary indicators from other areas that would naturally support solving this business challenge.`
    
    console.log('DEBUG: User prompt PI count:', { piCount, expectedCount: piCount })

    const requestBody = {
      model: 'openai/gpt-oss-20b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 5000,
      provider: {
        order: ['Fireworks']
      }
    }

    const requestHeaders = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://decapal.org',
      'X-Title': 'DECA Pal'
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content received from OpenRouter API')
    }

    // Parse the JSON response from the AI
    console.log('Raw AI response length:', content.length)
    console.log('Raw AI response preview:', content.substring(0, 200) + '...')

    let scenarioData
    try {
      // Try to extract JSON from the response if it's wrapped in markdown
      let jsonContent = content.trim()
      
      // Remove markdown code blocks if present
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      // Clean up any remaining whitespace
      jsonContent = jsonContent.trim()

      // Check if the JSON appears to be truncated
      if (!jsonContent.endsWith('}')) {
        console.log('JSON appears to be truncated - does not end with }')
        throw new Error('AI response appears to be truncated. The JSON is incomplete.')
      }

      console.log('Cleaned JSON content length:', jsonContent.length)
      console.log('Cleaned JSON content preview:', jsonContent.substring(0, 200) + '...')
      console.log('Cleaned JSON content ending:', jsonContent.substring(jsonContent.length - 100))
      
      scenarioData = JSON.parse(jsonContent)
      console.log('Successfully parsed JSON:', Object.keys(scenarioData))
      
      // Validate and fix performance indicators
      if (scenarioData.performanceIndicators) {
        // Check if PIs are placeholder strings
        const hasPlaceholder = scenarioData.performanceIndicators.some((pi: any) => 
          typeof pi === 'string' && (
            pi.toLowerCase().includes('select') || 
            pi.toLowerCase().includes('choose') ||
            pi.includes('[') ||
            pi.length > 200 // Suspiciously long PI
          )
        )
        
        if (hasPlaceholder || scenarioData.performanceIndicators.length !== piCount) {
          console.log('Invalid PIs detected, selecting random ones from the list')
          // Select random PIs from the relevant list
          const shuffled = [...relevantPIs].sort(() => Math.random() - 0.5)
          scenarioData.performanceIndicators = shuffled.slice(0, piCount)
        }
      }
      
      // Validate centurySkills - ensure they're the standard 4
      const standardCenturySkills = [
        "Critical Thinking – Reason effectively and use systems thinking.",
        "Problem Solving – Make judgments and decisions, and solve problems.",
        "Communication – Communicate clearly.",
        "Creativity and Innovation – Show evidence of creativity."
      ]
      
      if (!scenarioData.centurySkills || scenarioData.centurySkills.length !== 4) {
        scenarioData.centurySkills = standardCenturySkills
      }
      
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError)
      console.log('Full content that failed to parse:', content)

      // Check if it's a truncation issue
      if (parseError instanceof SyntaxError && parseError.message.includes('Unterminated')) {
        throw new Error('AI response was truncated. Please try again - the response may have exceeded token limits.')
      }

      // If JSON parsing fails, return an error instead of fallback
      const errorMessage = parseError instanceof Error ? parseError.message : String(parseError)
      throw new Error('Failed to parse AI response as JSON. Error: ' + errorMessage)
    }

    const scenario: DECAScenario = {
      id: `scenario_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      eventCode: scenarioData.eventCode,
      careerCluster: scenarioData.careerCluster,
      careerPathway: scenarioData.careerPathway,
      participantInstructions: scenarioData.participantInstructions,
      centurySkills: scenarioData.centurySkills,
      performanceIndicators: scenarioData.performanceIndicators,
      eventSituation: scenarioData.eventSituation,
      judgeInstructions: scenarioData.judgeInstructions,
      scoringRubric: {
        performanceIndicators: scenarioData.performanceIndicators.map((indicator: string) => ({
          name: indicator,
          maxPoints: 14,
          levels: {
            exceeds: { points: "12-14", description: "Participant demonstrated the performance indicator in an extremely professional manner; greatly exceeds business standards; would rank in the top 10% of business personnel performing this performance indicator." },
            meets: { points: "9-11", description: "Participant demonstrated the performance indicator in an acceptable and effective manner; meets at least minimal business standards; there would be no need for additional formalized training at this time; would rank in the 70-89th percentile of business personnel performing this performance indicator." },
            below: { points: "5-8", description: "Participant demonstrated the performance indicator with limited effectiveness; performance generally fell below minimal business standards; additional training would be required to improve knowledge, attitude and/or skills; would rank in the 50-69th percentile of business personnel performing this performance indicator." },
            little: { points: "0-4", description: "Participant demonstrated the performance indicator with little or no effectiveness; a great deal of formal training would be needed immediately; perhaps this person should seek other employment; would rank in the 0-49th percentile of business personnel performing this performance indicator." }
          }
        })),
        centurySkills: scenarioData.centurySkills.map((skill: string) => ({
          name: skill,
          maxPoints: 6,
          levels: {
            exceeds: { points: "5-6", description: "Excellent demonstration of 21st century skill" },
            meets: { points: "4", description: "Good demonstration of 21st century skill" },
            below: { points: "2-3", description: "Limited demonstration of 21st century skill" },
            little: { points: "0-1", description: "Little to no demonstration of 21st century skill" }
          }
        })),
        overallImpression: {
          name: "Overall impression and responses to the judge's questions",
          maxPoints: 6,
          levels: {
            exceeds: { points: "5-6", description: "Excellent overall performance and responses" },
            meets: { points: "4", description: "Good overall performance and responses" },
            below: { points: "2-3", description: "Limited overall performance and responses" },
            little: { points: "0-1", description: "Poor overall performance and responses" }
          }
        }
      },
      createdAt: new Date()
    }

    // Record the request in the rate limiter after successful generation
    rateLimiter.recordRequest(request)
    
    console.log('Successfully generated scenario')
    return NextResponse.json({ scenario })

  } catch (error) {
    console.error('Error generating roleplay scenario:', error)
    return NextResponse.json(
      { error: 'Failed to generate roleplay scenario' },
      { status: 500 }
    )
  }
}