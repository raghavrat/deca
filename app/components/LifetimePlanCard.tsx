'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LifetimePlanCard() {
  const { user, loading } = useAuth()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState('')
  const price = process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_USD || '49.99'

  if (process.env.NEXT_PUBLIC_STRIPE_LIFETIME_ENABLED !== 'true') return null

  const startCheckout = async () => {
    setError('')
    setCheckoutLoading(true)
    try {
      const response = await fetch('/api/billing/lifetime-checkout', { method: 'POST' })
      const payload = await response.json() as { url?: string; error?: string }
      if (!response.ok || !payload.url) throw new Error(payload.error || 'Unable to start checkout')
      window.location.assign(payload.url)
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Unable to start checkout')
      setCheckoutLoading(false)
    }
  }

  return (
    <section className="mt-8 border border-neutral-300 bg-white p-6 dark:border-neutral-700 dark:bg-black">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">One payment</p>
          <h2 className="mt-2 text-2xl font-light text-black dark:text-white">Elite Lifetime</h2>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
            Unlimited roleplay generations with scoring and feedback for the life of the Deca Pal service.
            Fair-use and abuse limits still apply.
          </p>
        </div>
        <div className="min-w-44 text-left md:text-right">
          <p className="text-3xl font-light text-black dark:text-white">${price}</p>
          <p className="text-xs text-neutral-500">one time · USD</p>
          {user ? (
            <button
              type="button"
              onClick={startCheckout}
              disabled={checkoutLoading || loading}
              className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checkoutLoading ? 'Opening checkout…' : 'Buy lifetime access'}
            </button>
          ) : (
            <Link href="/signup" className="btn-primary mt-4 block w-full text-center">
              Sign up to purchase
            </Link>
          )}
          {error && <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
      </div>
    </section>
  )
}
