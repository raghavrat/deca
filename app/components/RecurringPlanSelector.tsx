'use client'

import { Show } from '@clerk/nextjs'
import { CheckoutButton, usePlans } from '@clerk/nextjs/experimental'
import Link from 'next/link'
import { useState } from 'react'
import { isClerkClientEnabled } from '../config/authProvider'
import { useAuth } from '../context/AuthContext'

type BillingPeriod = 'month' | 'annual'
type PlanSlug = 'champion' | 'elite'

interface RecurringPlan {
  slug: PlanSlug
  name: string
  monthlyPrice: string
  yearlyPrice: string
  yearlyMonthlyPrice: string
  description: string
  features: string[]
  featured?: boolean
}

const RECURRING_PLANS: RecurringPlan[] = [
  {
    slug: 'champion',
    name: 'Champion',
    monthlyPrice: '4.99',
    yearlyPrice: '39.96',
    yearlyMonthlyPrice: '3.33',
    description: 'Structured practice for consistent competitors.',
    features: [
      '100 roleplay generations each month',
      'Full practice test access',
      'Scoring and detailed feedback',
    ],
  },
  {
    slug: 'elite',
    name: 'Elite',
    monthlyPrice: '6.99',
    yearlyPrice: '55.92',
    yearlyMonthlyPrice: '4.66',
    description: 'More practice with no monthly roleplay cap.',
    features: [
      'Unlimited roleplays under fair-use limits',
      'Everything in Champion',
      'Extended history and analytics',
    ],
    featured: true,
  },
]

interface PlanActionProps {
  billingPeriod: BillingPeriod
  clerkPlanId?: string
  isLoading: boolean
  plan: RecurringPlan
}

function PlanAction({
  billingPeriod,
  clerkPlanId,
  isLoading,
  plan,
}: PlanActionProps) {
  const { user } = useAuth()
  const buttonClass = plan.featured ? 'btn-primary w-full' : 'btn-ghost w-full'

  if (!user) {
    return (
      <Link href="/signup" className={`${buttonClass} block text-center`}>
        Choose {plan.name}
      </Link>
    )
  }

  if (isLoading) {
    return (
      <button type="button" disabled aria-busy="true" className={`${buttonClass} cursor-wait opacity-60`}>
        Loading plan
      </button>
    )
  }

  if (!clerkPlanId) {
    return (
      <button type="button" disabled className={`${buttonClass} cursor-not-allowed opacity-60`}>
        Temporarily unavailable
      </button>
    )
  }

  return (
    <Show when="signed-in">
      <CheckoutButton
        planId={clerkPlanId}
        planPeriod={billingPeriod}
        for="user"
        newSubscriptionRedirectUrl="/account"
      >
        <button type="button" className={buttonClass}>
          Choose {plan.name}
        </button>
      </CheckoutButton>
    </Show>
  )
}

function ClerkRecurringPlans({ billingPeriod }: { billingPeriod: BillingPeriod }) {
  const { data, isLoading } = usePlans({ for: 'user', pageSize: 10 })
  const clerkPlans = data || []

  return (
    <div className="grid gap-px bg-neutral-300 dark:bg-neutral-700 md:grid-cols-2">
      {RECURRING_PLANS.map(plan => {
        const clerkPlan = clerkPlans.find(candidate => candidate.slug === plan.slug)
        const price = billingPeriod === 'month' ? plan.monthlyPrice : plan.yearlyPrice

        return (
          <article
            key={plan.slug}
            className={`flex min-h-[28rem] flex-col bg-white p-6 dark:bg-neutral-950 ${
              plan.featured ? 'outline outline-2 outline-neutral-950 dark:outline-white' : ''
            }`}
          >
            <div>
              <h3 className="text-2xl font-light tracking-tight text-neutral-950 dark:text-white">
                {plan.name}
              </h3>
              <p className="mt-2 min-h-10 text-sm leading-5 text-neutral-600 dark:text-neutral-400">
                {plan.description}
              </p>
            </div>

            <div className="mt-8">
              <div className="flex items-baseline gap-2 text-neutral-950 dark:text-white">
                <span className="text-4xl font-light tracking-tight">${price}</span>
                <span className="text-sm text-neutral-500">
                  /{billingPeriod === 'month' ? 'month' : 'year'}
                </span>
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                {billingPeriod === 'month'
                  ? 'Billed monthly. Cancel before your next renewal.'
                  : `$${plan.yearlyMonthlyPrice} per month when billed yearly.`}
              </p>
            </div>

            <ul className="mt-8 space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
              {plan.features.map(feature => (
                <li key={feature} className="flex gap-3">
                  <span aria-hidden="true" className="text-neutral-400">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8">
              <PlanAction
                billingPeriod={billingPeriod}
                clerkPlanId={clerkPlan?.id}
                isLoading={Boolean(isLoading)}
                plan={plan}
              />
            </div>
          </article>
        )
      })}
    </div>
  )
}

function RecurringPlansFallback({ billingPeriod }: { billingPeriod: BillingPeriod }) {
  return (
    <div className="grid gap-px bg-neutral-300 dark:bg-neutral-700 md:grid-cols-2">
      {RECURRING_PLANS.map(plan => {
        const price = billingPeriod === 'month' ? plan.monthlyPrice : plan.yearlyPrice

        return (
          <article key={plan.slug} className="flex min-h-[28rem] flex-col bg-white p-6 dark:bg-neutral-950">
            <div>
              <h3 className="text-2xl font-light tracking-tight text-neutral-950 dark:text-white">{plan.name}</h3>
              <p className="mt-2 min-h-10 text-sm leading-5 text-neutral-600 dark:text-neutral-400">
                {plan.description}
              </p>
            </div>
            <div className="mt-8">
              <div className="flex items-baseline gap-2 text-neutral-950 dark:text-white">
                <span className="text-4xl font-light tracking-tight">${price}</span>
                <span className="text-sm text-neutral-500">
                  /{billingPeriod === 'month' ? 'month' : 'year'}
                </span>
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                {billingPeriod === 'month'
                  ? 'Billed monthly. Cancel before your next renewal.'
                  : `$${plan.yearlyMonthlyPrice} per month when billed yearly.`}
              </p>
            </div>
            <ul className="mt-8 space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
              {plan.features.map(feature => (
                <li key={feature} className="flex gap-3">
                  <span aria-hidden="true" className="text-neutral-400">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8">
              <Link href="/signup" className="btn-ghost block w-full text-center">
                Choose {plan.name}
              </Link>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default function RecurringPlanSelector() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('month')
  const clerkEnabled = isClerkClientEnabled()

  return (
    <section aria-labelledby="subscription-heading" className="border border-neutral-300 dark:border-neutral-700">
      <div className="flex flex-col gap-5 border-b border-neutral-300 p-5 dark:border-neutral-700 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="subscription-heading" className="text-xl font-light text-neutral-950 dark:text-white">
            Monthly or yearly
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Switch billing periods without changing plan features.
          </p>
        </div>

        <div
          className="grid w-full grid-cols-2 border border-neutral-300 bg-neutral-100 p-1 dark:border-neutral-700 dark:bg-neutral-900 sm:w-auto"
          aria-label="Billing period"
        >
          <button
            type="button"
            aria-pressed={billingPeriod === 'month'}
            onClick={() => setBillingPeriod('month')}
            className={`min-w-28 px-4 py-2 text-sm transition-colors duration-200 active:translate-y-px ${
              billingPeriod === 'month'
                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            aria-pressed={billingPeriod === 'annual'}
            onClick={() => setBillingPeriod('annual')}
            className={`min-w-28 px-4 py-2 text-sm transition-colors duration-200 active:translate-y-px ${
              billingPeriod === 'annual'
                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {clerkEnabled
        ? <ClerkRecurringPlans billingPeriod={billingPeriod} />
        : <RecurringPlansFallback billingPeriod={billingPeriod} />}
    </section>
  )
}
