'use client'

import { Show } from '@clerk/nextjs'
import { CheckoutButton, usePlans } from '@clerk/nextjs/experimental'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { isClerkClientEnabled } from '../config/authProvider'
import { useAuth } from '../context/AuthContext'
import { ROLEPLAY_PLAN_LIMITS } from '../utils/roleplayUsagePolicy'

type BillingPeriod = 'month' | 'annual'
type PaidPlanSlug = 'champion' | 'elite'

interface PaidPlan {
  slug: PaidPlanSlug
  name: string
  monthlyPrice: string
  yearlyPrice: string
  yearlySavingsPercent: string
  description: string
  features: string[]
  featured?: boolean
}

const PAID_PLANS: PaidPlan[] = [
  {
    slug: 'champion',
    name: 'Champion',
    monthlyPrice: '4.99',
    yearlyPrice: '39.99',
    yearlySavingsPercent: '33%',
    description: 'For competitors who practice every week.',
    features: [
      `${ROLEPLAY_PLAN_LIMITS.champion.limit} roleplay generations each month`,
      'Complete practice test access',
      'Roleplay scoring and feedback',
    ],
    featured: true,
  },
  {
    slug: 'elite',
    name: 'Elite',
    monthlyPrice: '6.99',
    yearlyPrice: '59.99',
    yearlySavingsPercent: '28%',
    description: 'For competitors who want more reps.',
    features: [
      'Unlimited roleplays under fair-use limits',
      'Complete practice test access',
      'Roleplay scoring and feedback',
    ],
  },
]

interface PlanCardProps {
  action: ReactNode
  description: string
  featured?: boolean
  features: string[]
  name: string
  price: string
  priceDetail: string
  priceSuffix?: string
}

function PlanCard({
  action,
  description,
  featured = false,
  features,
  name,
  price,
  priceDetail,
  priceSuffix,
}: PlanCardProps) {
  return (
    <article
      className={`relative flex min-h-[30rem] flex-col rounded-xl border bg-white p-6 transition-[border-color,transform,box-shadow] duration-200 dark:bg-neutral-950 sm:p-7 ${
        featured
          ? 'border-2 border-neutral-950 shadow-[0_18px_50px_rgba(23,23,23,0.08)] dark:border-neutral-100 dark:shadow-[0_18px_50px_rgba(0,0,0,0.3)] lg:-translate-y-2'
          : 'border-neutral-200 hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600'
      }`}
    >
      {featured && (
        <span className="absolute right-5 top-5 rounded-xl bg-neutral-950 px-3 py-1 text-xs font-medium text-white dark:bg-neutral-100 dark:text-neutral-950">
          Most popular
        </span>
      )}

      <div className={featured ? 'pr-24' : undefined}>
        <h3 className="text-xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
          {name}
        </h3>
        <p className="mt-2 min-h-10 text-sm leading-5 text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      </div>

      <div className="mt-8">
        <div className="flex items-end gap-2 text-neutral-950 dark:text-neutral-50">
          <span className="text-4xl font-semibold tracking-[-0.04em]">${price}</span>
          {priceSuffix && (
            <span className="pb-1 text-sm text-neutral-500 dark:text-neutral-400">
              {priceSuffix}
            </span>
          )}
        </div>
        <p className="mt-2 min-h-5 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
          {priceDetail}
        </p>
      </div>

      <ul className="mt-8 space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
        {features.map(feature => (
          <li key={feature} className="flex gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-xs font-semibold text-neutral-950 dark:bg-neutral-800 dark:text-neutral-100"
            >
              ✓
            </span>
            <span className="leading-5">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">{action}</div>
    </article>
  )
}

function StarterAction() {
  const { user } = useAuth()

  return (
    <Link
      href={user ? '/test' : '/signup'}
      className="btn-ghost block min-h-12 w-full rounded-xl text-center active:translate-y-px"
    >
      {user ? 'Start practicing' : 'Start free'}
    </Link>
  )
}

interface PaidPlanActionProps {
  billingPeriod: BillingPeriod
  clerkPlanId?: string
  isLoading: boolean
  plan: PaidPlan
}

function PaidPlanAction({
  billingPeriod,
  clerkPlanId,
  isLoading,
  plan,
}: PaidPlanActionProps) {
  const { user } = useAuth()
  const buttonClass = plan.featured
    ? 'btn-primary min-h-12 w-full rounded-xl active:translate-y-px'
    : 'btn-ghost min-h-12 w-full rounded-xl active:translate-y-px'

  if (!user) {
    return (
      <Link href="/signup" className={`${buttonClass} block text-center`}>
        Choose {plan.name}
      </Link>
    )
  }

  if (isLoading) {
    return (
      <button
        type="button"
        disabled
        aria-busy="true"
        className={`${buttonClass} cursor-wait opacity-60`}
      >
        Loading plan
      </button>
    )
  }

  if (!clerkPlanId) {
    return (
      <button type="button" disabled className={`${buttonClass} cursor-not-allowed opacity-60`}>
        Unavailable
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

function getPlanPrice(plan: PaidPlan, billingPeriod: BillingPeriod) {
  if (billingPeriod === 'month') {
    return {
      price: plan.monthlyPrice,
      suffix: '/month',
      detail: 'Billed monthly. Cancel anytime.',
    }
  }

  return {
    price: plan.yearlyPrice,
    suffix: '/year',
    detail: `Save ${plan.yearlySavingsPercent} compared with monthly.`,
  }
}

function StarterCard() {
  return (
    <PlanCard
      name="Starter"
      description="Try the full practice experience for free."
      price="0"
      priceDetail="No payment information required."
      features={[
        `${ROLEPLAY_PLAN_LIMITS.starter.limit} roleplay generations`,
        'Complete practice test access',
        'Roleplay scoring and feedback',
      ]}
      action={<StarterAction />}
    />
  )
}

function ClerkPaidPlans({ billingPeriod }: { billingPeriod: BillingPeriod }) {
  const { data, isLoading } = usePlans({ for: 'user', pageSize: 10 })
  const clerkPlans = data || []

  return (
    <>
      {PAID_PLANS.map(plan => {
        const clerkPlan = clerkPlans.find(candidate => candidate.slug === plan.slug)
        const displayPrice = getPlanPrice(plan, billingPeriod)

        return (
          <PlanCard
            key={plan.slug}
            name={plan.name}
            description={plan.description}
            price={displayPrice.price}
            priceSuffix={displayPrice.suffix}
            priceDetail={displayPrice.detail}
            features={plan.features}
            featured={plan.featured}
            action={(
              <PaidPlanAction
                billingPeriod={billingPeriod}
                clerkPlanId={clerkPlan?.id}
                isLoading={Boolean(isLoading)}
                plan={plan}
              />
            )}
          />
        )
      })}
    </>
  )
}

function PaidPlansFallback({ billingPeriod }: { billingPeriod: BillingPeriod }) {
  return (
    <>
      {PAID_PLANS.map(plan => {
        const displayPrice = getPlanPrice(plan, billingPeriod)

        return (
          <PlanCard
            key={plan.slug}
            name={plan.name}
            description={plan.description}
            price={displayPrice.price}
            priceSuffix={displayPrice.suffix}
            priceDetail={displayPrice.detail}
            features={plan.features}
            featured={plan.featured}
            action={(
              <Link
                href="/signup"
                className={`${plan.featured ? 'btn-primary' : 'btn-ghost'} block min-h-12 w-full rounded-xl text-center active:translate-y-px`}
              >
                Choose {plan.name}
              </Link>
            )}
          />
        )
      })}
    </>
  )
}

export default function RecurringPlanSelector() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('annual')
  const clerkEnabled = isClerkClientEnabled()

  return (
    <section aria-labelledby="subscription-heading">
      <div className="flex flex-col items-center">
        <h2 id="subscription-heading" className="sr-only">Subscription plans</h2>
        <div
          className="grid grid-cols-2 rounded-xl border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900"
          aria-label="Billing period"
        >
          <button
            type="button"
            aria-pressed={billingPeriod === 'month'}
            onClick={() => setBillingPeriod('month')}
            className={`min-w-28 rounded-xl px-4 py-2.5 text-sm font-medium transition-[background-color,color,transform] duration-200 active:translate-y-px ${
              billingPeriod === 'month'
                ? 'bg-white text-neutral-950 shadow-sm dark:bg-neutral-700 dark:text-white'
                : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            aria-pressed={billingPeriod === 'annual'}
            onClick={() => setBillingPeriod('annual')}
            className={`min-w-28 rounded-xl px-4 py-2.5 text-sm font-medium transition-[background-color,color,transform] duration-200 active:translate-y-px ${
              billingPeriod === 'annual'
                ? 'bg-white text-neutral-950 shadow-sm dark:bg-neutral-700 dark:text-white'
                : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            Yearly
          </button>
        </div>
        <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
          Save up to 33% with yearly billing.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        <StarterCard />
        {clerkEnabled
          ? <ClerkPaidPlans billingPeriod={billingPeriod} />
          : <PaidPlansFallback billingPeriod={billingPeriod} />}
      </div>
    </section>
  )
}
