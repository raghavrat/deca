import { NextRequest } from 'next/server'
import crypto from 'crypto'

/**
 * Extracts client identifier from request headers with multiple fallback methods
 */
export function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from various headers (in order of preference)
  const ipHeaders = [
    'cf-connecting-ip', // Cloudflare
    'x-real-ip',        // Nginx
    'x-forwarded-for',  // Standard proxy header
    'x-client-ip',      // Some proxies
    'x-forwarded',      // Less common
    'forwarded-for',    // Less common
    'forwarded'         // RFC 7239
  ]

  for (const header of ipHeaders) {
    const value = request.headers.get(header)
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first one
      const ip = value.split(',')[0].trim()
      if (isValidIP(ip)) {
        return `ip:${ip}`
      }
    }
  }

  // Fallback: Create identifier from user-agent and other headers
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const acceptLanguage = request.headers.get('accept-language') || 'unknown'
  const acceptEncoding = request.headers.get('accept-encoding') || 'unknown'
  
  // Create a hash of the combined headers for privacy
  const fingerprint = crypto
    .createHash('sha256')
    .update(`${userAgent}:${acceptLanguage}:${acceptEncoding}`)
    .digest('hex')
    .substring(0, 16) // Use first 16 chars for brevity

  return `fingerprint:${fingerprint}`
}

/**
 * Validates if a string is a valid IP address (IPv4 or IPv6)
 */
function isValidIP(ip: string): boolean {
  // IPv4 regex
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  
  // IPv6 regex (simplified)
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip)
}

/**
 * Masks an identifier for logging purposes (privacy protection)
 */
export function maskIdentifier(identifier: string): string {
  if (identifier.startsWith('ip:')) {
    const ip = identifier.substring(3)
    const parts = ip.split('.')
    if (parts.length === 4) {
      // IPv4: show first two octets, mask last two
      return `ip:${parts[0]}.${parts[1]}.xxx.xxx`
    } else {
      // IPv6 or other: show first 8 chars, mask the rest
      return `ip:${ip.substring(0, 8)}...`
    }
  } else if (identifier.startsWith('fingerprint:')) {
    const hash = identifier.substring(12)
    return `fingerprint:${hash.substring(0, 4)}...`
  }
  
  return identifier.substring(0, 8) + '...'
}