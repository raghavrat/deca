import { getClientIdentifier, maskIdentifier } from '../clientIdentification'
import { NextRequest } from 'next/server'

// Mock NextRequest for testing
function createMockRequest(headers: Record<string, string> = {}): NextRequest {
  const url = 'http://localhost:3000/api/test'
  const request = new NextRequest(url)
  
  // Add headers to the request
  Object.entries(headers).forEach(([key, value]) => {
    request.headers.set(key, value)
  })
  
  return request
}

describe('getClientIdentifier', () => {
  test('should extract IP from cf-connecting-ip header', () => {
    const request = createMockRequest({
      'cf-connecting-ip': '192.168.1.100'
    })
    
    const identifier = getClientIdentifier(request)
    expect(identifier).toBe('ip:192.168.1.100')
  })

  test('should extract IP from x-real-ip header', () => {
    const request = createMockRequest({
      'x-real-ip': '10.0.0.1'
    })
    
    const identifier = getClientIdentifier(request)
    expect(identifier).toBe('ip:10.0.0.1')
  })

  test('should extract first IP from x-forwarded-for header', () => {
    const request = createMockRequest({
      'x-forwarded-for': '203.0.113.1, 192.168.1.1, 10.0.0.1'
    })
    
    const identifier = getClientIdentifier(request)
    expect(identifier).toBe('ip:203.0.113.1')
  })

  test('should prefer cf-connecting-ip over other headers', () => {
    const request = createMockRequest({
      'cf-connecting-ip': '1.2.3.4',
      'x-real-ip': '5.6.7.8',
      'x-forwarded-for': '9.10.11.12'
    })
    
    const identifier = getClientIdentifier(request)
    expect(identifier).toBe('ip:1.2.3.4')
  })

  test('should create fingerprint when no valid IP is found', () => {
    const request = createMockRequest({
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'accept-language': 'en-US,en;q=0.9',
      'accept-encoding': 'gzip, deflate, br'
    })
    
    const identifier = getClientIdentifier(request)
    expect(identifier).toMatch(/^fingerprint:[a-f0-9]{16}$/)
  })

  test('should handle missing headers gracefully', () => {
    const request = createMockRequest({})
    
    const identifier = getClientIdentifier(request)
    expect(identifier).toMatch(/^fingerprint:[a-f0-9]{16}$/)
  })

  test('should reject invalid IP addresses', () => {
    const request = createMockRequest({
      'x-forwarded-for': 'invalid-ip, not-an-ip',
      'user-agent': 'test-agent'
    })
    
    const identifier = getClientIdentifier(request)
    expect(identifier).toMatch(/^fingerprint:[a-f0-9]{16}$/)
  })

  test('should handle IPv6 addresses', () => {
    const request = createMockRequest({
      'x-real-ip': '2001:0db8:85a3:0000:0000:8a2e:0370:7334'
    })
    
    const identifier = getClientIdentifier(request)
    expect(identifier).toBe('ip:2001:0db8:85a3:0000:0000:8a2e:0370:7334')
  })
})

describe('maskIdentifier', () => {
  test('should mask IPv4 addresses', () => {
    const masked = maskIdentifier('ip:192.168.1.100')
    expect(masked).toBe('ip:192.168.xxx.xxx')
  })

  test('should mask IPv6 addresses', () => {
    const masked = maskIdentifier('ip:2001:0db8:85a3:0000:0000:8a2e:0370:7334')
    expect(masked).toBe('ip:2001:0db...')
  })

  test('should mask fingerprints', () => {
    const masked = maskIdentifier('fingerprint:abc123def456')
    expect(masked).toBe('fingerprint:abc1...')
  })

  test('should mask unknown identifier types', () => {
    const masked = maskIdentifier('unknown:someverylongidentifier')
    expect(masked).toBe('unknown:...')
  })
})