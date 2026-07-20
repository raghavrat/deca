import type { DECAEvent } from '../types'
import {
  CAREER_COMPETENCIES,
  FORMAT_RULES,
  type RoleplayProfile,
  type ScenarioArchetype,
} from '../data/roleplayProfiles'

export interface EventPromptInput {
  event: DECAEvent
  profile: RoleplayProfile
  archetype: ScenarioArchetype
  instructionalArea: string
  performanceIndicators: string[]
}

export const DEFAULT_CAREER_COMPETENCIES = CAREER_COMPETENCIES.slice(0, 3)

export function getSolutionCriteria(eventCode: string): string[] {
  return eventCode === 'ACT'
    ? ['Accurate', 'Practical', 'Effective']
    : ['Unique', 'Practical', 'Effective']
}

export function buildParticipantInstructions(profile: RoleplayProfile): string[] {
  const rules = FORMAT_RULES[profile.format]
  const participants = rules.participantCount === 2 ? 'participants' : 'participant'
  const situation = rules.situationLabel.toLowerCase()
  return [
    `Review the Career Competencies, Performance Indicators and ${rules.situationLabel}. You have up to ${rules.prepMinutes} minutes to prepare and may make notes.`,
    `You have up to ${rules.presentationMinutes} minutes to present to the judge.`,
    `The ${participants} will be evaluated on the performance indicators, solution, Career Competencies and overall impression.`,
    rules.participantCount === 2
      ? `Both team members should participate meaningfully in analyzing the ${situation} and presenting one coordinated solution.`
      : 'Answer the judge’s questions using the facts and recommendations developed during your presentation.',
    'This is an original unofficial practice scenario and is not an official DECA competitive event case.',
  ]
}

function lines(label: string, values: string[]): string {
  return `${label}:\n${values.map(value => `- ${value}`).join('\n')}`
}

export function buildEventSystemPrompt(input: EventPromptInput): string {
  const { event, profile, archetype, instructionalArea, performanceIndicators } = input
  const rules = FORMAT_RULES[profile.format]
  const formatDirection = {
    'individual-series': 'Write a specialized individual business role-play. The participant must act as a working professional and make a defensible business recommendation.',
    principles: 'Write an entry-level individual role-play for a first-year DECA participant. Test foundational understanding through realistic workplace application, not specialist analysis.',
    'team-decision': 'Write a two-person team case study. Address the participants as a team, give them a joint decision with multiple stakeholders, and make the work substantial enough for both members to contribute.',
    'personal-financial-literacy': 'Write an educational personal-finance role-play about an individual or household decision. Use plain language and do not provide legal, tax, insurance or investment advice as fact.',
  }[profile.format]

  return `You create original, unofficial DECA-style practice material for one specific competitive event.

EVENT-SPECIFIC SYSTEM PROFILE
- Event: ${event.name} (${event.id})
- Format: ${profile.format}
- Official event scope, paraphrased: ${profile.officialScope}
- Required timing: ${rules.prepMinutes} minutes of preparation and ${rules.presentationMinutes} minutes of presentation
- Participants: ${rules.participantCount}
- Situation heading: ${rules.situationLabel}
- Scenario pattern for this generation: ${archetype.label}
- Primary instructional area: ${instructionalArea}

${formatDirection}

${lines('Possible participant roles (choose one)', archetype.participantRoles)}
${lines('Possible judge roles (choose one)', archetype.judgeRoles)}
${lines('Possible settings (choose one)', archetype.settings)}
${lines('Required kind of work (combine two or more)', archetype.tasks)}
${lines('Add one realistic complication', archetype.complications)}
${profile.promptDirectives.length ? lines('Event-specific constraints', profile.promptDirectives) : ''}

The following performance indicators are server-selected and REQUIRED. Design the facts and task so the participant can visibly demonstrate every one. Do not repeat them in the JSON because the server will attach them:
${performanceIndicators.map((indicator, index) => `${index + 1}. ${indicator}`).join('\n')}

IMMERSION AND ORIGINALITY RULES
- Invent a plausible fictional organization and names. Do not use a real person's sensitive information.
- Include concrete operational facts, realistic dollar amounts/percentages/counts where relevant, stakeholder motives, constraints and a clear decision deadline.
- Supply enough internally consistent information for the requested analysis; never require outside research.
- Do not copy, closely paraphrase or reconstruct any official DECA case, sample, company name or judge script.
- Do not claim DECA endorsement or that this is an official case.
- Make the participant role, judge role, requested deliverables and meeting context unmistakable.
- The judge must ask exactly two open-ended, event-relevant follow-up questions that probe tradeoffs or implementation.
- The judge script must mirror the participant facts without revealing a hidden answer, then instruct the judge to thank the participant(s) and make no further comments.
- Keep the challenge appropriate for high-school competitors and within ${event.id}, not merely the broad career cluster.

Return ONLY valid JSON with exactly this structure:
{
  "eventSituation": {
    "roleDescription": "Participant role, organization, judge role and immediate objective",
    "companyBackground": "Concise but vivid organization, customer/market and operating context",
    "businessChallenge": "Concrete facts, constraints, stakeholder tensions and why a decision is needed",
    "taskDescription": "Specific analysis, decision, recommendation and implementation deliverables",
    "presentationContext": "Where the meeting occurs, how the judge opens it and how it concludes"
  },
  "judgeInstructions": {
    "roleCharacterization": "Judge identity, priorities, concerns and the same material facts",
    "questionsToAsk": ["Question one", "Question two"],
    "evaluationCriteria": "How to conduct the meeting, ask both questions, then only thank the participant(s)"
  }
}`
}
