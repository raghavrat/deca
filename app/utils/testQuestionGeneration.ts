import { createHash } from 'crypto'
import {
  LEGACY_EXAM_BLOOM_BASE64,
  LEGACY_EXAM_BLOOM_BITS,
  LEGACY_EXAM_BLOOM_HASHES,
} from '../data/legacyExamBloom'

const prohibitedSourceSignals = [
  /\bDECA(?:\+|\s+Inc\.?|\s+exam)?\b/i,
  /\bMBA\s*Research\b/i,
  /\bICDC\b/i,
  /\b(?:district|association|provincial|chartered association)\s+exam\b/i,
  /\btest\s*#?\s*\d{3,}\b/i,
  /copyrighted|official question|published exam|question bank/i,
]

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()

function wordNgrams(value: string, size = 5): Set<string> {
  const words = normalize(value).split(' ').filter(Boolean)
  const result = new Set<string>()
  for (let index = 0; index <= words.length - size; index += 1) {
    result.add(words.slice(index, index + size).join(' '))
  }
  return result
}

export function questionSimilarity(left: string, right: string): number {
  const leftSet = wordNgrams(left)
  const rightSet = wordNgrams(right)
  if (!leftSet.size || !rightSet.size) return normalize(left) === normalize(right) ? 1 : 0
  let intersection = 0
  leftSet.forEach(value => {
    if (rightSet.has(value)) intersection += 1
  })
  return intersection / (leftSet.size + rightSet.size - intersection)
}

export function hasProhibitedSourceSignal(...values: string[]): boolean {
  return prohibitedSourceSignals.some(pattern => values.some(value => pattern.test(value)))
}

export function hasBlockedBankStyleOpening(value: string): boolean {
  return /^(?:which of the following|what is the (?:best|most))\b/i.test(value.trim())
}

const legacyExamBloom = Buffer.from(LEGACY_EXAM_BLOOM_BASE64, 'base64')

export function legacyExamOverlapCount(question: string): number {
  const words = normalize(question).split(' ').filter(Boolean)
  let matches = 0
  for (let index = 0; index <= words.length - 8; index += 1) {
    const digest = createHash('sha256').update(words.slice(index, index + 8).join(' ')).digest()
    let present = true
    for (let hashIndex = 0; hashIndex < LEGACY_EXAM_BLOOM_HASHES; hashIndex += 1) {
      const bit = digest.readUInt32BE(hashIndex * 4) % LEGACY_EXAM_BLOOM_BITS
      if ((legacyExamBloom[Math.floor(bit / 8)] & (1 << (bit % 8))) === 0) {
        present = false
        break
      }
    }
    if (present) matches += 1
  }
  return matches
}
