export function getIndicatorAnchorId(indicator: string): string {
  const codeMatch = indicator.match(/\(([A-Z]+):(\d+)\)/)
  if (codeMatch) {
    const [, code, num] = codeMatch
    return `pi-${code.toLowerCase()}-${num}`
  }

  return indicator
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s]+/g, '-')
}


