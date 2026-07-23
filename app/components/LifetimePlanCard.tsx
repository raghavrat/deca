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
      className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900/60 sm:p-8"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <h2 id="lifetime-plan-heading" className="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
            Prefer to pay once?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            Get Elite access with one payment and no subscription renewal.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:justify-end">
          <div className="shrink-0">
            <div className="flex items-end gap-2 text-neutral-950 dark:text-neutral-50">
              <span className="text-4xl font-semibold tracking-[-0.04em]">${price}</span>
              <span className="pb-1 text-sm text-neutral-500 dark:text-neutral-400">once</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Elite Lifetime</p>
          </div>

          <div className="w-full sm:w-48">
            {!lifetimeEnabled ? (
              <button
                type="button"
                disabled
                className="btn-primary min-h-12 w-full cursor-not-allowed rounded-xl opacity-60"
              >
                Unavailable
              </button>
            ) : user ? (
              <button
                type="button"
                onClick={startCheckout}
                disabled={checkoutLoading || loading}
                className="btn-primary min-h-12 w-full rounded-xl active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkoutLoading ? 'Opening checkout...' : 'Buy lifetime'}
              </button>
            ) : (
              <Link
                href="/signup"
                className="btn-primary block min-h-12 w-full rounded-xl text-center active:translate-y-px"
              >
                Buy lifetime
              </Link>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </section>
  )
}
