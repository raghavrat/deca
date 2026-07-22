'use client'

import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AuthPageShell from '../components/AuthPageShell'

export default function MigrationConsentPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const hasCompletedConsent = user?.unsafeMetadata.age13Confirmed === true && user.legalAcceptedAt !== null
    if (isLoaded && isSignedIn && hasCompletedConsent) {
      router.replace('/performance')
    }
  }, [isLoaded, isSignedIn, router, user])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!ageConfirmed || !termsAccepted || !user) return

    setIsSaving(true)
    setError('')
    try {
      const response = await fetch('/api/auth/complete-migration-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ageConfirmed, termsAccepted }),
      })
      if (!response.ok) throw new Error('Unable to save confirmations')
      await user.reload()
      window.location.assign('/performance')
    } catch {
      setError('We could not save your confirmations. Please try again.')
      setIsSaving(false)
    }
  }

  return (
    <AuthPageShell>
      <form className="w-full space-y-8" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">One last step</p>
          <h1 className="text-3xl font-medium tracking-tight text-white">Confirm before training</h1>
          <p className="text-sm leading-6 text-neutral-400">Confirm the current requirements to continue.</p>
        </div>

        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <input id="migration-age-confirmation" type="checkbox" checked={ageConfirmed} onChange={event => setAgeConfirmed(event.target.checked)} className="mt-1 h-5 w-5" />
            <label htmlFor="migration-age-confirmation" className="text-sm leading-6 text-neutral-200">I am at least 13 years old. If I am under the age of legal majority, my parent or guardian has permitted me to use Deca Pal.</label>
          </div>
          <div className="flex items-start gap-3">
            <input id="migration-policy-confirmation" type="checkbox" checked={termsAccepted} onChange={event => setTermsAccepted(event.target.checked)} className="mt-1 h-5 w-5" />
            <label htmlFor="migration-policy-confirmation" className="text-sm leading-6 text-neutral-200">I agree to the <Link href="/terms" className="underline underline-offset-2">Terms of Use</Link> and acknowledge the <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.</label>
          </div>
        </div>

        <button type="submit" disabled={isSaving || !ageConfirmed || !termsAccepted} className="w-full border border-white bg-white px-5 py-3 text-sm font-semibold text-black transition-colors duration-200 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:border-neutral-800 disabled:bg-neutral-900 disabled:text-neutral-500">
          {isSaving ? 'Saving…' : 'Continue'}
        </button>
      </form>
    </AuthPageShell>
  )
}
