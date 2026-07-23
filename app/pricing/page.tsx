import LifetimePlanCard from '../components/LifetimePlanCard'
import RecurringPlanSelector from '../components/RecurringPlanSelector'

export default function Pricing() {
  return (
    <main className="min-h-[100dvh] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-neutral-950 dark:text-neutral-50 md:text-5xl">
            Choose your plan
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-neutral-600 dark:text-neutral-400">
            Start free, subscribe for more practice, or pay once for lifetime access.
          </p>
        </header>

        <div className="mt-10">
          <RecurringPlanSelector />
        </div>

        <div className="mt-8">
          <LifetimePlanCard />
        </div>

        <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-5 text-neutral-500 dark:text-neutral-400">
          Subscriptions renew until canceled. Lifetime access lasts while Deca Pal operates.
          Taxes may apply.
        </p>
      </div>
    </main>
  )
}
