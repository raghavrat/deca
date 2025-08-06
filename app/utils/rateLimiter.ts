import { getClientIdentifier, maskIdentifier } from './clientIdentification'
import { NextRequest } from 'next/server'

export interface RateLimitResult {
  allowed: boolean
  timeRemaining?: number
  identifier: string
}

export class RateLimiter {
  private store: Map<string, number>
  private windowMs: number
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(windowMs: number = 5 * 60 * 1000) { // Default: 5 minutes
    this.store = new Map()
    this.windowMs = windowMs
    this.startCleanupTimer()
  }

  /**
   * Check if a request should be rate limited
   */
  checkRateLimit(request: NextRequest): RateLimitResult {
    try {
      const identifier = getClientIdentifier(request)
      const now = Date.now()
      const lastRequest = this.store.get(identifier)

      if (lastRequest && (now - lastRequest) < this.windowMs) {
        const timeRemaining = Math.ceil((this.windowMs - (now - lastRequest)) / 1000)
        
        console.log(`Rate limit exceeded for client ${maskIdentifier(identifier)}, ${timeRemaining}s remaining`)
        
        return {
          allowed: false,
          timeRemaining,
          identifier: maskIdentifier(identifier)
        }
      }

      return {
        allowed: true,
        identifier: maskIdentifier(identifier)
      }
    } catch (error) {
      console.error('Error checking rate limit:', error)
      // In case of error, allow the request but log the issue
      return {
        allowed: true,
        identifier: 'error'
      }
    }
  }

  /**
   * Record a successful request
   */
  recordRequest(request: NextRequest): void {
    try {
      const identifier = getClientIdentifier(request)
      const now = Date.now()
      
      this.store.set(identifier, now)
      console.log(`Request recorded for client ${maskIdentifier(identifier)}`)
    } catch (error) {
      console.error('Error recording request:', error)
    }
  }

  /**
   * Get current rate limit status without recording a request
   */
  getStatus(request: NextRequest): RateLimitResult {
    return this.checkRateLimit(request)
  }

  /**
   * Manually clean up expired entries
   */
  cleanup(): void {
    const now = Date.now()
    let cleanedCount = 0

    const entries = Array.from(this.store.entries())
    for (const [identifier, timestamp] of entries) {
      if (now - timestamp > this.windowMs) {
        this.store.delete(identifier)
        cleanedCount++
      }
    }

    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired rate limit entries`)
    }
  }

  /**
   * Get statistics about the rate limiter
   */
  getStats(): { totalEntries: number; windowMs: number } {
    return {
      totalEntries: this.store.size,
      windowMs: this.windowMs
    }
  }

  /**
   * Clear all rate limit entries (useful for testing)
   */
  clear(): void {
    this.store.clear()
    console.log('Rate limit store cleared')
  }

  /**
   * Start automatic cleanup timer
   */
  private startCleanupTimer(): void {
    // Clean up every 10 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 10 * 60 * 1000)
  }

  /**
   * Stop automatic cleanup timer
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }
}