'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LifetimePlanCard() {
  const { user, loading } = useAuth()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState('')
  const price = process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_USD || '49.99'
  const lifetimeEnabled = process.env.NEXT_PUBLIC_STRIPE_LIFETIME_ENABLED === 'true'

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
    <section
      aria-labelledby="lifetime-plan-heading"
      className="flex h-full flex-col border border-neutral-300 bg-neutral-100 p-6 dark:border-neutral-700 dark:bg-neutral-900"
    >
      <div>
        <h2 id="lifetime-plan-heading" className="text-2xl font-light tracking-tight text-neutral-950 dark:text-white">
          Elite Lifetime
        </h2>
        <p className="mt-2 text-sm leading-5 text-neutral-600 dark:text-neutral-400">
          Pay once for Elite access for as long as Deca Pal operates.
        </p>
      </div>

      <div className="mt-8 text-neutral-950 dark:text-white">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-light tracking-tight">${price}</span>
          <span className="text-sm text-neutral-500">one time</span>
        </div>
        <p className="mt-2 text-xs text-neutral-500">Single payment in USD.</p>
      </div>

      <ul className="mt-8 space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
        <li className="flex gap-3">
          <span aria-hidden="true" className="text-neutral-400">✓</span>
          <span>Unlimited roleplays under fair-use limits</span>
        </li>
        <li className="flex gap-3">
          <span aria-hidden="true" className="text-neutral-400">✓</span>
          <span>Scoring and detailed feedback</span>
        </li>
        <li className="flex gap-3">
          <span aria-hidden="true" className="text-neutral-400">✓</span>
          <span>No subscription renewal</span>
        </li>
      </ul>

      <div className="mt-auto pt-8">
        {!lifetimeEnabled ? (
          <button type="button" disabled className="btn-primary w-full cursor-not-allowed opacity-60">
            Temporarily unavailable
          </button>
        ) : user ? (
          <button
            type="button"
            onClick={startCheckout}
            disabled={checkoutLoading || loading}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {checkoutLoading ? 'Opening checkout...' : 'Choose lifetime'}
          </button>
        ) : (
          <Link href="/signup" className="btn-primary block w-full text-center">
            Choose lifetime
          </Link>
        )}
        {error && <p role="alert" className="mt-3 text-sm text-red-700 dark:text-red-400">{error}</p>}
      </div>
    </section>
  )
}
