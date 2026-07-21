export function getElapsedRecordingSeconds(
  startedAt: Date,
  nowMs: number,
  maximumSeconds: number,
): number {
  const elapsed = Math.floor((nowMs - startedAt.getTime()) / 1000)
  return Math.min(maximumSeconds, Math.max(0, elapsed))
}
