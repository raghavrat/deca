export function isAccountEmailValid(email: string): boolean {
  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail || normalizedEmail.length > 254) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
}
