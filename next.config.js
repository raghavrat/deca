/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  compress: true,
  async headers() {
    const clerkAuthEnabled = process.env.AUTH_PROVIDER === 'clerk' &&
      process.env.NEXT_PUBLIC_AUTH_PROVIDER === 'clerk'
    // Next's development runtime evaluates source maps in the browser. Keep
    // unsafe-eval out of production, but allow it for a working local preview.
    const scriptSrc = process.env.NODE_ENV === 'development'
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
      : "script-src 'self' 'unsafe-inline'"
    const securityHeaders = [
      { key: 'Cross-Origin-Opener-Policy', value: clerkAuthEnabled ? 'same-origin-allow-popups' : 'same-origin' },
      { key: 'Referrer-Policy', value: 'no-referrer' },
      { key: 'Permissions-Policy', value: 'camera=(), geolocation=(), microphone=(self)' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
    ]

    // Clerk middleware generates a nonce-aware policy with the current Clerk
    // frontend host and Stripe Billing sources. Firebase keeps the static CSP.
    if (!clerkAuthEnabled) {
      securityHeaders.unshift({
        key: 'Content-Security-Policy',
        value: `default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; frame-src 'self' https://*.firebaseapp.com; object-src 'none'; ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self'; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com wss://*.firebaseio.com`,
      })
    }

    if (process.env.NODE_ENV === 'production') {
      securityHeaders.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      })
    }

    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

module.exports = nextConfig
