import {
  PRACTICE_QUESTION_BANK,
  getAuthoredPracticeQuestions,
  getPracticeQuestionBlueprint,
  selectAuthoredPracticeQuestions,
} from '../practiceQuestionBank'
import FIXED_PRACTICE_QUESTION_BANK from '../practiceQuestionBank.generated.json'
import {
  EXAM_BLUEPRINTS,
  TEST_BLUEPRINTS,
  TEST_CATEGORIES,
  type TestCategory,
} from '../testBlueprints'
import {
  hasBlockedBankStyleOpening,
  hasProhibitedSourceSignal,
  legacyExamOverlapCount,
} from '../../utils/testQuestionGeneration'

const categories: readonly TestCategory[] = TEST_CATEGORIES

describe('first-party practice question bank', () => {
  test('loads all questions from the committed fixed bank', () => {
    expect(FIXED_PRACTICE_QUESTION_BANK).toHaveLength(7_000)
    expect(PRACTICE_QUESTION_BANK.map(question => question.id)).toEqual(
      FIXED_PRACTICE_QUESTION_BANK.map(question => question.id),
    )
  })

  test('contains exactly one thousand questions for every category', () => {
    categories.forEach(category => {
      expect(getAuthoredPracticeQuestions(category)).toHaveLength(1_000)
    })
  })

  test('distributes questions across every first-party objective', () => {
    TEST_BLUEPRINTS.forEach(blueprint => {
      const count = PRACTICE_QUESTION_BANK.filter(question => question.blueprintId === blueprint.id).length
      expect(count).toBeGreaterThan(0)
    })
  })

  test('matches every official district instructional-area quota at ten times scale', () => {
    categories.forEach(category => {
      EXAM_BLUEPRINTS[category].forEach(quota => {
        const count = PRACTICE_QUESTION_BANK.filter(
          question => question.category === category && question.instructionalArea === quota.instructionalArea,
        ).length
        expect(count).toBe(quota.district * 10)
      })
    })
  })

  test('uses unique IDs, valid answer keys, and copyright-safety checks', () => {
    expect(new Set(PRACTICE_QUESTION_BANK.map(question => question.id)).size).toBe(PRACTICE_QUESTION_BANK.length)
    expect(new Set(PRACTICE_QUESTION_BANK.map(question => question.text)).size).toBe(PRACTICE_QUESTION_BANK.length)

    PRACTICE_QUESTION_BANK.forEach(question => {
      expect(getPracticeQuestionBlueprint(question.blueprintId)).toBeDefined()
      expect(question.text.length).toBeGreaterThanOrEqual(35)
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
      expect(question.objectiveId).toBe(question.blueprintId)
      expect(question.reviewStatus).toBe('automated-validated')
      expect(question.examFamily.length).toBeGreaterThan(3)
      expect(question.instructionalArea.length).toBeGreaterThan(2)
      expect(hasProhibitedSourceSignal(question.text, question.explanation, ...question.answers)).toBe(false)
      expect(hasBlockedBankStyleOpening(question.text)).toBe(false)
      expect(legacyExamOverlapCount(question.text)).toBeLessThan(2)
    })
  })

  test('maintains structural variety in every exam family', () => {
    categories.forEach(category => {
      const questions = getAuthoredPracticeQuestions(category)
      expect(new Set(questions.map(question => question.stemForm)).size).toBeGreaterThanOrEqual(6)
      expect(new Set(questions.map(question => question.cognitiveOperation)).size).toBeGreaterThanOrEqual(5)
      const calculationCount = questions.filter(question => question.stemForm === 'calculation').length
      expect(calculationCount).toBeGreaterThanOrEqual(40)
      expect(calculationCount).toBeLessThanOrEqual(200)

      const positionCounts = [0, 1, 2, 3].map(position =>
        questions.filter(question => question.correctAnswer === position).length,
      )
      positionCounts.forEach(count => {
        expect(count).toBeGreaterThanOrEqual(200)
        expect(count).toBeLessThanOrEqual(300)
      })
    })
  })

  test('assembles full simulations using the district instructional-area blueprint', () => {
    categories.forEach(category => {
      const questions = selectAuthoredPracticeQuestions(category, 100, () => 0.5)
      expect(questions).toHaveLength(100)
      expect(new Set(questions.map(question => question.id)).size).toBe(100)
      EXAM_BLUEPRINTS[category].forEach(quota => {
        expect(questions.filter(question => question.instructionalArea === quota.instructionalArea)).toHaveLength(quota.district)
      })
    })
  })

  test('assembles smaller weighted sets without duplicate records', () => {
    categories.forEach(category => {
      const questions = selectAuthoredPracticeQuestions(category, 10, () => 0.25)
      expect(questions).toHaveLength(10)
      expect(new Set(questions.map(question => question.id)).size).toBe(10)
    })
  })
})
