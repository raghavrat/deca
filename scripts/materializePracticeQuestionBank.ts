import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { materializePracticeQuestionBank } from '../app/data/practiceQuestionBank'

const outputPath = resolve(process.cwd(), 'app/data/practiceQuestionBank.generated.json')
const questions = materializePracticeQuestionBank()

writeFileSync(outputPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8')
console.log(`Wrote ${questions.length} fixed practice questions to ${outputPath}`)
