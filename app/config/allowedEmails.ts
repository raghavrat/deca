const parseList = (value: string | undefined) =>
  (value || '')
    .split(',')
    .map(item => item.trim().toLowerCase())
    .filter(Boolean)

const allowedDomains = parseList(process.env.ALLOWED_EMAIL_DOMAINS || 'westfordk12.us')
const allowedEmails = parseList(process.env.ALLOWED_EMAILS)

export function isEmailAllowed(email: string): boolean {
  const normalizedEmail = email.trim().toLowerCase()
  const atIndex = normalizedEmail.lastIndexOf('@')
  if (atIndex <= 0 || atIndex === normalizedEmail.length - 1) return false

  if (allowedEmails.includes(normalizedEmail)) return true

  const domain = normalizedEmail.slice(atIndex + 1)
  return allowedDomains.includes(domain)
}
