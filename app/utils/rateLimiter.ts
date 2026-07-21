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
      return this.checkIdentifier(identifier)
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
      this.recordIdentifier(identifier)
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

  /** Check an authenticated or otherwise server-trusted identifier. */
  checkIdentifier(identifier: string): RateLimitResult {
    const now = Date.now()
    const lastRequest = this.store.get(identifier)
    const publicIdentifier = maskIdentifier(identifier)

    if (lastRequest && (now - lastRequest) < this.windowMs) {
      return {
        allowed: false,
        timeRemaining: Math.ceil((this.windowMs - (now - lastRequest)) / 1000),
        identifier: publicIdentifier,
      }
    }

    return { allowed: true, identifier: publicIdentifier }
  }

  /** Record an authenticated or otherwise server-trusted identifier. */
  recordIdentifier(identifier: string): void {
    this.store.set(identifier, Date.now())
  }

  /** Release a reservation when the protected operation fails before completion. */
  removeIdentifier(identifier: string): void {
    this.store.delete(identifier)
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

    void cleanedCount
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
