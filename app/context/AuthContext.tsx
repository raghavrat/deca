'use client'

import { ClerkProvider, useClerk, useUser } from '@clerk/nextjs'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import { getClientAuthProvider, isClerkClientEnabled, type AuthProvider } from '../config/authProvider'
import { auth } from '../firebase/config'
import { resolveClerkDataUid } from '../utils/userIdentity'

export interface AppUser {
  uid: string
  authUid: string
  email: string | null
  displayName: string | null
  emailVerified: boolean
  provider: AuthProvider
}

interface AuthContextType {
  user: AppUser | null
  loading: boolean
  signUp: (email: string, password: string, name: string, ageConfirmed: boolean, termsAccepted: boolean) => Promise<boolean>
  signIn: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

function toFirebaseAppUser(user: FirebaseUser): AppUser {
  return {
    uid: user.uid,
    authUid: user.uid,
    email: user.email,
    displayName: user.displayName,
    emailVerified: user.emailVerified,
    provider: 'firebase',
  }
}

function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const firebaseAuth = auth
    if (!firebaseAuth) {
      setUser(null)
      setLoading(false)
      return
    }

    let unsubscribe: (() => void) | undefined
    let isActive = true
    const loadingFallback = window.setTimeout(() => {
      if (isActive) setLoading(false)
    }, 2500)

    const initializeAuth = async () => {
      let hasValidSession = false
      try {
        const sessionResponse = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include',
        })
        hasValidSession = sessionResponse.ok
      } catch {
        // A missing session is expected for signed-out visitors.
      }

      unsubscribe = onAuthStateChanged(firebaseAuth, async firebaseUser => {
        if (firebaseUser) {
          setUser(toFirebaseAppUser(firebaseUser))
        } else if (hasValidSession) {
          window.setTimeout(async () => {
            await firebaseAuth.authStateReady()
            setUser(firebaseAuth.currentUser ? toFirebaseAppUser(firebaseAuth.currentUser) : null)
            setLoading(false)
          }, 1000)
          return
        } else {
          setUser(null)
        }
        window.clearTimeout(loadingFallback)
        setLoading(false)
      }, () => {
        window.clearTimeout(loadingFallback)
        if (isActive) {
          setUser(null)
          setLoading(false)
        }
      })
    }

    void initializeAuth().catch(() => {
      window.clearTimeout(loadingFallback)
      if (isActive) {
        setUser(null)
        setLoading(false)
      }
    })

    return () => {
      isActive = false
      window.clearTimeout(loadingFallback)
      unsubscribe?.()
    }
  }, [])

  const signUp = async (email: string, password: string, name: string, ageConfirmed: boolean, termsAccepted: boolean) => {
    if (!auth) throw new Error('Firebase Authentication is not configured')
    if (!ageConfirmed || !termsAccepted) {
      throw new Error('Age and policy confirmations are required')
    }

    const eligibilityResponse = await fetch('/api/auth/eligibility', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (!eligibilityResponse.ok) throw new Error('Enter a valid email address')

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(userCredential.user, { displayName: name })

    const idToken = await userCredential.user.getIdToken()
    const profileResponse = await fetch('/api/auth/register-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken, name, ageConfirmed, termsAccepted }),
    })
    if (!profileResponse.ok) {
      throw new Error('Unable to finish account setup')
    }

    await sendEmailVerification(userCredential.user)
    return true
  }

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase Authentication is not configured')
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const idToken = await userCredential.user.getIdToken()
    const sessionResponse = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    })
    const sessionData = await sessionResponse.json()
    if (!sessionResponse.ok) throw new Error(sessionData.error || 'Failed to create session')
    window.location.href = '/'
  }

  const logout = async () => {
    if (!auth) throw new Error('Firebase Authentication is not configured')
    await signOut(auth)
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/login')
  }

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error('Firebase Authentication is not configured')
    await sendPasswordResetEmail(auth, email)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

function ClerkAuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser()
  const { signOut: clerkSignOut } = useClerk()
  const pathname = usePathname()

  useEffect(() => {
    const hasCompletedConsent = clerkUser?.unsafeMetadata.age13Confirmed === true && clerkUser.legalAcceptedAt !== null
    if (
      isLoaded && isSignedIn && clerkUser && !hasCompletedConsent &&
      !['/consent', '/privacy', '/terms', '/signup'].includes(pathname)
    ) {
      window.location.replace('/consent')
    }
  }, [clerkUser, isLoaded, isSignedIn, pathname])

  const primaryEmail = clerkUser?.primaryEmailAddress
  const user: AppUser | null = isLoaded && isSignedIn && clerkUser
    ? {
        uid: resolveClerkDataUid(clerkUser.id, clerkUser.externalId),
        authUid: clerkUser.id,
        email: primaryEmail?.emailAddress || null,
        displayName: clerkUser.username,
        emailVerified: primaryEmail?.verification.status === 'verified',
        provider: 'clerk',
      }
    : null

  const navigateToClerkPage = async (path: string): Promise<never> => {
    window.location.assign(path)
    return new Promise(() => undefined)
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading: !isLoaded,
      signUp: () => navigateToClerkPage('/signup'),
      signIn: () => navigateToClerkPage('/login'),
      logout: async () => clerkSignOut({ redirectUrl: '/login' }),
      resetPassword: () => navigateToClerkPage('/login'),
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  if (getClientAuthProvider() === 'clerk' && isClerkClientEnabled()) {
    return (
      <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        signInUrl="/login"
        signUpUrl="/signup"
        signInFallbackRedirectUrl="/performance"
        signUpFallbackRedirectUrl="/performance"
        localization={{
          signIn: {
            start: {
              title: 'Welcome back',
              titleCombined: 'Welcome back',
              subtitle: 'Sign in to continue training.',
              subtitleCombined: 'Sign in to continue training.',
            },
          },
          signUp: {
            start: {
              title: 'Create your account',
              titleCombined: 'Create your account',
              subtitle: 'Start with tests, roleplays, and feedback.',
              subtitleCombined: 'Start with tests, roleplays, and feedback.',
            },
          },
        }}
        appearance={{
          variables: {
            colorPrimary: '#fafafa',
            colorPrimaryForeground: '#0a0a0a',
            colorBackground: '#080808',
            colorForeground: '#fafafa',
            colorMuted: '#171717',
            colorMutedForeground: '#a3a3a3',
            colorInput: '#111111',
            colorInputForeground: '#fafafa',
            colorNeutral: '#d4d4d4',
            colorBorder: '#404040',
            colorRing: '#fafafa',
            colorDanger: '#f87171',
            fontFamily: 'var(--font-manrope)',
            borderRadius: '0px',
          },
          elements: {
            rootBox: 'clerk-auth-root',
            cardBox: 'clerk-auth-card-box',
            card: 'clerk-auth-card',
            header: 'clerk-auth-header',
            headerTitle: 'clerk-auth-title',
            headerSubtitle: 'clerk-auth-subtitle',
            footer: 'clerk-auth-footer',
            socialButtonsBlockButton: 'clerk-auth-social-button',
            socialButtonsBlockButtonText: 'clerk-auth-social-button-text',
            dividerLine: 'clerk-auth-divider-line',
            dividerText: 'clerk-auth-divider-text',
            formFieldLabel: 'clerk-auth-label',
            formFieldInput: 'clerk-auth-input',
            formButtonPrimary: 'clerk-auth-primary-button',
            footerActionText: 'clerk-auth-footer-text',
            footerActionLink: 'clerk-auth-footer-link',
            footerPages: 'clerk-auth-provider-footer',
            formFieldErrorText: 'clerk-auth-error',
          },
        }}
      >
        <ClerkAuthProvider>{children}</ClerkAuthProvider>
      </ClerkProvider>
    )
  }

  return <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
}

export const useAuth = () => useContext(AuthContext)
