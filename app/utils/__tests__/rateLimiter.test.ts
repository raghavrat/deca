import type { NextRequest } from 'next/server'
import { RateLimiter } from '../rateLimiter'

function createMockRequest(ip: string): NextRequest {
  return { headers: new Headers({ 'cf-connecting-ip': ip }) } as NextRequest
}

describe('RateLimiter', () => {
  test('blocks a recorded client during the active window', () => {
    const limiter = new RateLimiter(60_000)
    const request = createMockRequest('203.0.113.10')

    expect(limiter.checkRateLimit(request).allowed).toBe(true)
    limiter.recordRequest(request)
    const result = limiter.checkRateLimit(request)

    expect(result.allowed).toBe(false)
    expect(result.timeRemaining).toBeGreaterThan(0)
    limiter.destroy()
  })

  test('keeps different client identifiers separate', () => {
    const limiter = new RateLimiter(60_000)
    limiter.recordRequest(createMockRequest('203.0.113.10'))

    expect(limiter.checkRateLimit(createMockRequest('203.0.113.11')).allowed).toBe(true)
    limiter.destroy()
  })

  test('clear removes recorded requests', () => {
    const limiter = new RateLimiter(60_000)
    const request = createMockRequest('203.0.113.10')
    limiter.recordRequest(request)
    limiter.clear()

    expect(limiter.checkRateLimit(request).allowed).toBe(true)
    limiter.destroy()
  })

  test('supports a server-trusted account identifier', () => {
    const limiter = new RateLimiter(60_000)
    limiter.recordIdentifier('user:test-user')

    expect(limiter.checkIdentifier('user:test-user').allowed).toBe(false)
    expect(limiter.checkIdentifier('user:another-user').allowed).toBe(true)
    limiter.destroy()
  })
})
