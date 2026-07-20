/**
 * Summarize the public role-play/case-study index attached to each official
 * DECA competitive-event page. The index is a changing convenience sample,
 * not an official probability forecast for future competition cases.
 *
 * Usage: node scripts/research-deca-roleplays.mjs
 */

const events = {
  ACT: 'accounting-applications-series',
  BFS: 'business-finance-series',
  PFL: 'personal-financial-literacy',
  PFN: 'principles-of-finance',
  AAM: 'apparel-and-accessories-marketing-series',
  ASM: 'automotive-services-marketing-series',
  BSM: 'business-services-marketing-series',
  FMS: 'food-marketing-series',
  MCS: 'marketing-communications-series',
  PMK: 'principles-of-marketing',
  RMS: 'retail-merchandising-series',
  SEM: 'sports-and-entertainment-marketing-series',
  HLM: 'hotel-and-lodging-management-series',
  PHT: 'principles-of-hospitality',
  QSRM: 'quick-serve-restaurant-management-series',
  RFSM: 'restaurant-and-food-service-management-series',
  HRM: 'human-resources-management-series',
  PBM: 'principles-of-business-management-and-administration',
  ENT: 'entrepreneurship-series',
  PEN: 'principles-of-entrepreneurship',
  BLTDM: 'business-law-and-ethics-team-decision-making',
  BTDM: 'buying-and-merchandising-team-decision-making',
  ETDM: 'entrepreneurship-team-decision-making',
  FTDM: 'financial-services-team-decision-making',
  HTDM: 'hospitality-services-team-decision-making',
  MTDM: 'marketing-management-team-decision-making',
  STDM: 'sports-and-entertainment-marketing-team-decision-making',
  TTDM: 'travel-and-tourism-team-decision-making',
}

const decodeHtml = (value) => value
  .replace(/<[^>]+>/g, ' ')
  .replace(/&quot;/g, '"')
  .replace(/&#x27;|&#39;/g, "'")
  .replace(/&amp;/g, '&')
  .replace(/&nbsp;/g, ' ')
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/\s+/g, ' ')
  .trim()

function field(block, name) {
  const pattern = new RegExp(`fs-cmsfilter-field="${name}"[^>]*>([\\s\\S]*?)<\\/div>`)
  return decodeHtml(block.match(pattern)?.[1] || '')
}

function parseItems(html) {
  const items = []
  const pattern = /<a href="([^"]+)"[^>]*class="ad-listing-item[^>]*>([\s\S]*?)<\/a>/g
  for (const match of html.matchAll(pattern)) {
    const block = match[2]
    const type = field(block, 'Type')
    if (type !== 'Role-Play' && type !== 'Case Study') continue

    const descriptionMatch = block.match(/<p[^>]*class="text-size-small text-color-grey"[^>]*>([\s\S]*?)<\/p>/)
    items.push({
      year: Number(field(block, 'Year')) || null,
      name: field(block, 'Name'),
      type,
      instructionalArea: field(block, 'InstructionalArea') || 'Unspecified',
      competitiveEvent: field(block, 'CompetitiveEvent'),
      description: decodeHtml(descriptionMatch?.[1] || ''),
      source: decodeHtml(match[1]),
    })
  }
  return items
}

function pageCount(html) {
  const explicit = html.match(/aria-label="Page \d+ of (\d+)"/)
  if (explicit) return Number(explicit[1])
  const compact = html.match(/class="w-page-count[^>]*>\s*\d+\s*\/\s*(\d+)/)
  return compact ? Number(compact[1]) : 1
}

function countBy(items, key) {
  const counts = new Map()
  for (const item of items) {
    const value = item[key]
    counts.set(value, (counts.get(value) || 0) + 1)
  }
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || String(left[0]).localeCompare(String(right[0])))
    .map(([value, count]) => ({
      value,
      count,
      percent: Math.round((count / items.length) * 100),
    }))
}

function commonPhrases(items, pattern) {
  const phrases = []
  for (const item of items) {
    const match = item.description.match(pattern)
    if (match?.[1]) phrases.push({ phrase: match[1].trim().toLowerCase(), year: item.year })
  }
  const counts = new Map()
  for (const { phrase } of phrases) counts.set(phrase, (counts.get(phrase) || 0) + 1)
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 8)
    .map(([phrase, count]) => ({ phrase, count }))
}

async function fetchPage(slug, page = 1) {
  const url = new URL(`https://www.deca.org/compete/${slug}`)
  url.searchParams.set('b29253f7_page', String(page))
  const response = await fetch(url, {
    headers: { 'User-Agent': 'DECA-Pal-research/1.0 (public event-page analysis)' },
  })
  if (!response.ok) throw new Error(`${response.status} ${url}`)
  return response.text()
}

async function summarizeEvent(code, slug) {
  const firstPage = await fetchPage(slug)
  const pages = pageCount(firstPage)
  const remaining = await Promise.all(
    Array.from({ length: Math.max(0, pages - 1) }, (_, index) => fetchPage(slug, index + 2)),
  )
  const items = [firstPage, ...remaining].flatMap(parseItems)
  const unique = [...new Map(items.map(item => [item.source || JSON.stringify(item), item])).values()]
  const years = unique.map(item => item.year).filter(Number.isFinite)

  return {
    code,
    officialPage: `https://www.deca.org/compete/${slug}`,
    publicCases: unique.length,
    yearRange: years.length ? [Math.min(...years), Math.max(...years)] : [],
    instructionalAreas: countBy(unique, 'instructionalArea'),
    participantRoles: commonPhrases(unique, /assume the role of (.*?)(?: at | for | working |\. |, )/i),
    judgeRoles: commonPhrases(unique, /(?:the|a|an) ([^.]*) \(judge\)/i),
  }
}

const requestedCodes = new Set(process.argv.slice(2).map(value => value.toUpperCase()))
const selectedEvents = Object.entries(events).filter(([code]) => requestedCodes.size === 0 || requestedCodes.has(code))

const summaries = []
for (const [code, slug] of selectedEvents) {
  try {
    summaries.push(await summarizeEvent(code, slug))
  } catch (error) {
    summaries.push({ code, officialPage: `https://www.deca.org/compete/${slug}`, error: String(error) })
  }
}

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  methodology: 'Counts are from DECA.org public related-resource cards and are descriptive only, not official future-event probabilities.',
  events: summaries,
}, null, 2))
