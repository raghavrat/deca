'use client'

import LifetimePlanCard from '../components/LifetimePlanCard'
import RecurringPlanSelector from '../components/RecurringPlanSelector'
import { useAuth } from '../context/AuthContext'

export default function Pricing() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <main className="min-h-[100dvh] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-10 w-36 bg-neutral-200 dark:bg-neutral-800" />
          <div className="mt-4 h-5 w-full max-w-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.75fr)]">
            <div className="h-[38rem] bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-[38rem] bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[100dvh] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <h1 className="text-4xl font-light tracking-tight text-neutral-950 dark:text-white md:text-5xl">
            Plans
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-neutral-600 dark:text-neutral-400">
            Pay monthly, save with yearly billing, or make one lifetime payment.
          </p>
        </header>

        <div className="mt-10 grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.75fr)]">
          <RecurringPlanSelector />
          <LifetimePlanCard />
        </div>

        <section className="mt-4 flex flex-col gap-3 border border-neutral-300 px-5 py-4 dark:border-neutral-700 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-medium text-neutral-950 dark:text-white">Starter is free</h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Two roleplays, complete practice tests, and no payment information required.
            </p>
          </div>
          <p className="shrink-0 text-sm font-medium text-neutral-950 dark:text-white">$0</p>
        </section>

        <p className="mt-5 text-xs leading-5 text-neutral-500">
          Subscriptions renew until canceled. Lifetime access lasts while the Deca Pal service operates.
          Taxes may apply.
        </p>
      </div>
    </main>
  )
}
