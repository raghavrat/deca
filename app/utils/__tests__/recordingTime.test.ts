import { getElapsedRecordingSeconds } from '../recordingTime'

describe('roleplay recording time', () => {
  const startedAt = new Date('2026-07-20T12:00:00.000Z')

  test('uses elapsed wall time instead of accumulating duplicate intervals', () => {
    expect(getElapsedRecordingSeconds(startedAt, startedAt.getTime() + 12_900, 600)).toBe(12)
  })

  test('clamps the submitted duration to the configured roleplay limit', () => {
    expect(getElapsedRecordingSeconds(startedAt, startedAt.getTime() + 900_000, 600)).toBe(600)
  })

  test('never returns a negative duration', () => {
    expect(getElapsedRecordingSeconds(startedAt, startedAt.getTime() - 1_000, 600)).toBe(0)
  })
})
