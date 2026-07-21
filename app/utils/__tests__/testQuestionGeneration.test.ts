import {
  TEST_BLUEPRINTS,
  TEST_CATEGORIES,
  getTestBlueprints,
  type TestCategory,
} from '../../data/testBlueprints'
import {
  hasBlockedBankStyleOpening,
  hasProhibitedSourceSignal,
  questionSimilarity,
} from '../testQuestionGeneration'

const categories: readonly TestCategory[] = TEST_CATEGORIES

describe('practice-question safeguards', () => {
  test('uses first-party blueprints across every practice category', () => {
    expect(new Set(TEST_BLUEPRINTS.map(item => item.id)).size).toBe(TEST_BLUEPRINTS.length)
    for (const category of categories) {
      const blueprints = getTestBlueprints(category)
      expect(blueprints.length).toBeGreaterThanOrEqual(24)
      expect(blueprints.every(item => item.category === category)).toBe(true)
    }
  })

  test('detects protected-source labels and blocked bank-style openings', () => {
    expect(hasProhibitedSourceSignal('Taken from the DECA district exam')).toBe(true)
    expect(hasProhibitedSourceSignal('An original fictional retailer scenario')).toBe(false)
    expect(hasBlockedBankStyleOpening('Which of the following choices should the company make?')).toBe(true)
    expect(hasBlockedBankStyleOpening('A company compares four choices before making a decision.')).toBe(false)
  })

  test('detects substantial five-word phrase overlap', () => {
    const left = 'A fictional retailer reviews a delayed order and compares customer impact before selecting a response.'
    const close = 'A fictional retailer reviews a delayed order and compares customer impact before selecting a different response.'
    const unrelated = 'A hotel calculates room contribution after variable housekeeping cost changes during a festival weekend.'
    expect(questionSimilarity(left, close)).toBeGreaterThan(0.35)
    expect(questionSimilarity(left, unrelated)).toBeLessThan(0.1)
  })
})
