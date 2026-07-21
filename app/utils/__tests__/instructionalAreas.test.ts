import { DECA_EVENTS } from '../../data/decaEvents'
import { getInstructionalAreaCatalog } from '../../data/instructionalAreaCatalog'
import { PERSONAL_FINANCE_AREAS } from '../../data/personalFinanceIndicators'
import { FORMAT_RULES, getRoleplayProfile } from '../../data/roleplayProfiles'
import { getEligibleInstructionalAreas, getInstructionalAreasByCategory } from '../instructionalAreas'

describe('roleplay instructional areas', () => {
  test('every event exposes at least one area with enough performance indicators', () => {
    for (const event of DECA_EVENTS) {
      const profile = getRoleplayProfile(event.id)!
      const requiredCount = FORMAT_RULES[profile.format].performanceIndicatorCount
      const availableAreas = profile.format === 'personal-financial-literacy'
        ? PERSONAL_FINANCE_AREAS
        : getInstructionalAreasByCategory(event.category)
      const eligibleAreas = getEligibleInstructionalAreas(availableAreas, requiredCount)

      expect({ event: event.id, eligibleAreas: eligibleAreas.length }).toEqual({
        event: event.id,
        eligibleAreas: expect.any(Number),
      })
      expect(eligibleAreas.length).toBeGreaterThan(0)
      expect(eligibleAreas.every(area => area.piCount >= requiredCount)).toBe(true)
    }
  })

  test('removes areas that cannot fill the requested PI set', () => {
    const areas = getInstructionalAreasByCategory('FINANCE')
    const eligibleAreas = getEligibleInstructionalAreas(areas, 5)

    expect(eligibleAreas.some(area => area.name === 'Entrepreneurship')).toBe(false)
    expect(eligibleAreas.every(area => area.piCount >= 5)).toBe(true)
  })

  test('keeps the lightweight client catalog synchronized with server data', () => {
    for (const category of ['MANAGEMENT', 'MARKETING', 'FINANCE', 'HOSPITALITY', 'ENTREPRENEUR'] as const) {
      expect(getInstructionalAreaCatalog(category)).toEqual(getInstructionalAreasByCategory(category))
    }
  })
})
