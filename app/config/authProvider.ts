export type AuthProvider = 'firebase' | 'clerk'

export function getClientAuthProvider(): AuthProvider {
  return process.env.NEXT_PUBLIC_AUTH_PROVIDER === 'clerk' ? 'clerk' : 'firebase'
}
export function isClerkClientEnabled(): boolean {
  return getClientAuthProvider() === 'clerk' && Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
}
