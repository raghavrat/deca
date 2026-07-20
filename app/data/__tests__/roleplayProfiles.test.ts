import { DECA_EVENTS } from '../decaEvents'
import {
  FORMAT_RULES,
  ROLEPLAY_PROFILES,
  chooseWeighted,
  getRoleplayProfile,
} from '../roleplayProfiles'
import { buildEventSystemPrompt } from '../../utils/roleplayPromptBuilder'

describe('roleplay event profiles', () => {
  test('covers every available roleplay event exactly once', () => {
    const eventCodes = DECA_EVENTS.map(event => event.id).sort()
    expect(Object.keys(ROLEPLAY_PROFILES).sort()).toEqual(eventCodes)
    for (const event of DECA_EVENTS) {
      expect(getRoleplayProfile(event.id)?.eventCode).toBe(event.id)
    }
  })

  test('uses current event-family timing, PI counts and 100-point totals', () => {
    for (const event of DECA_EVENTS) {
      const profile = getRoleplayProfile(event.id)!
      const rules = FORMAT_RULES[profile.format]
      expect(event.prepTime).toBe(rules.prepMinutes)
      expect(event.roleplayDuration).toBe(rules.presentationMinutes)
      expect(rules.performanceIndicatorCount).toBeGreaterThanOrEqual(3)
      expect(rules.performanceIndicatorCount).toBeLessThanOrEqual(5)

      const total = rules.performanceIndicatorCount * rules.performanceIndicatorMax +
        3 * rules.solutionMax +
        rules.careerCompetencyCount * rules.careerCompetencyMax +
        rules.overallImpressionMax
      expect(total).toBe(100)
    }
  })

  test('provides valid, varied archetypes and documented historical samples', () => {
    for (const profile of Object.values(ROLEPLAY_PROFILES)) {
      expect(profile.historicalSample.publicCases).toBeGreaterThan(0)
      expect(profile.historicalSample.instructionalAreas.length).toBeGreaterThan(0)
      expect(profile.archetypes.length).toBeGreaterThanOrEqual(4)
      expect(new Set(profile.archetypes.map(item => item.id)).size).toBe(profile.archetypes.length)
      const archetypeWeight = profile.archetypes.reduce((sum, item) => sum + item.weight, 0)
      expect({ eventCode: profile.eventCode, archetypeWeight }).toEqual({
        eventCode: profile.eventCode,
        archetypeWeight: 100,
      })
      for (const archetype of profile.archetypes) {
        expect(archetype.participantRoles.length).toBeGreaterThan(0)
        expect(archetype.judgeRoles.length).toBeGreaterThan(0)
        expect(archetype.tasks.length).toBeGreaterThan(0)
        expect(archetype.complications.length).toBeGreaterThan(0)
      }
    }
  })

  test('builds event-specific prompts with fixed PIs and anti-copy safeguards', () => {
    const prompts = DECA_EVENTS.map(event => {
      const profile = getRoleplayProfile(event.id)!
      const indicators = ['Required PI one', 'Required PI two', 'Required PI three']
      const prompt = buildEventSystemPrompt({
        event,
        profile,
        archetype: profile.archetypes[0],
        instructionalArea: profile.historicalSample.instructionalAreas[0].name,
        performanceIndicators: indicators,
      })
      expect(prompt).toContain(event.id)
      expect(prompt).toContain(profile.officialScope)
      expect(prompt).toContain(profile.archetypes[0].label)
      expect(prompt).toContain('Required PI one')
      expect(prompt).toContain('Do not copy')
      expect(prompt).toContain('exactly two')
      return prompt
    })
    expect(new Set(prompts).size).toBe(DECA_EVENTS.length)
  })

  test('weighted selection respects deterministic boundaries', () => {
    const items = [{ id: 'a', weight: 25 }, { id: 'b', weight: 75 }]
    expect(chooseWeighted(items, () => 0).id).toBe('a')
    expect(chooseWeighted(items, () => 0.249).id).toBe('a')
    expect(chooseWeighted(items, () => 0.25).id).toBe('b')
    expect(chooseWeighted(items, () => 0.999).id).toBe('b')
  })
})
