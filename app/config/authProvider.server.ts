import 'server-only'

import type { AuthProvider } from './authProvider'

export function getServerAuthProvider(): AuthProvider {
  const configuredProvider = process.env.AUTH_PROVIDER || 'firebase'
  const clientProvider = process.env.NEXT_PUBLIC_AUTH_PROVIDER || 'firebase'

  if (configuredProvider !== 'firebase' && configuredProvider !== 'clerk') {
    throw new Error('AUTH_PROVIDER must be either "firebase" or "clerk"')
  }
  if (clientProvider !== 'firebase' && clientProvider !== 'clerk') {
    throw new Error('NEXT_PUBLIC_AUTH_PROVIDER must be either "firebase" or "clerk"')
  }
  if (configuredProvider !== clientProvider) {
    throw new Error('AUTH_PROVIDER and NEXT_PUBLIC_AUTH_PROVIDER must use the same provider')
  }

  if (configuredProvider === 'clerk') {
    if (!process.env.CLERK_SECRET_KEY || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      throw new Error('Clerk auth is enabled, but the Clerk keys are missing')
    }

  }

  return configuredProvider
}
