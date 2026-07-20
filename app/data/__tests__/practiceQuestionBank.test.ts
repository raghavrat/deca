import {
  PRACTICE_QUESTION_BANK,
  getAuthoredPracticeQuestions,
  getPracticeQuestionBlueprint,
} from '../practiceQuestionBank'
import { TEST_BLUEPRINTS, type TestCategory } from '../testBlueprints'
import {
  hasBlockedBankStyleOpening,
  hasProhibitedSourceSignal,
  legacyExamOverlapCount,
} from '../../utils/testQuestionGeneration'

const categories: TestCategory[] = ['MANAGEMENT', 'MARKETING', 'FINANCE', 'HOSPITALITY', 'ENTREPRENEURSHIP']

describe('first-party practice question bank', () => {
  test('contains exactly one thousand questions for every category', () => {
    categories.forEach(category => {
      expect(getAuthoredPracticeQuestions(category)).toHaveLength(1_000)
    })
  })

  test('distributes questions across every concept blueprint', () => {
    TEST_BLUEPRINTS.forEach(blueprint => {
      const count = PRACTICE_QUESTION_BANK.filter(question => question.blueprintId === blueprint.id).length
      expect(count).toBeGreaterThanOrEqual(166)
      expect(count).toBeLessThanOrEqual(167)
    })
  })

  test('uses unique IDs, valid answer keys, and copyright-safety checks', () => {
    expect(new Set(PRACTICE_QUESTION_BANK.map(question => question.id)).size).toBe(PRACTICE_QUESTION_BANK.length)
    expect(new Set(PRACTICE_QUESTION_BANK.map(question => question.text)).size).toBe(PRACTICE_QUESTION_BANK.length)

    PRACTICE_QUESTION_BANK.forEach(question => {
      expect(getPracticeQuestionBlueprint(question.blueprintId)).toBeDefined()
      expect(question.text.length).toBeGreaterThanOrEqual(80)
      expect(question.text.length).toBeLessThanOrEqual(700)
      expect(question.explanation.length).toBeGreaterThanOrEqual(60)
      expect(question.explanation.length).toBeLessThanOrEqual(1_500)
      expect(question.answers).toHaveLength(4)
      const uniqueAnswers = new Set(question.answers.map(answer => answer.trim().toLowerCase())).size
      if (uniqueAnswers !== 4) throw new Error(`Duplicate answers in ${question.id}`)
      expect(question.answers.every(answer => answer.length > 0 && answer.length <= 240)).toBe(true)
      expect(Number.isInteger(question.correctAnswer)).toBe(true)
      expect(question.correctAnswer).toBeGreaterThanOrEqual(0)
      expect(question.correctAnswer).toBeLessThan(4)
      expect(hasProhibitedSourceSignal(question.text, question.explanation, ...question.answers)).toBe(false)
      expect(hasBlockedBankStyleOpening(question.text)).toBe(false)
      expect(legacyExamOverlapCount(question.text)).toBeLessThan(2)
    })
  })
})
