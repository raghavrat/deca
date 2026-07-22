'use client'

import { PricingTable } from '@clerk/nextjs'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { isClerkClientEnabled } from '../config/authProvider'

export default function Pricing() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const clerkEnabled = isClerkClientEnabled()

  // Redirect logged-in users to the dashboard
  useEffect(() => {
    if (user && !loading && !clerkEnabled) {
      router.push('/performance')
    }
  }, [user, loading, router, clerkEnabled])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 dark:border-white"></div>
      </div>
    )
  }

  // Only show pricing page for non-logged-in users
  if (user && !clerkEnabled) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="deca-hero relative overflow-hidden bg-black px-4 py-16 text-white lg:py-24">
        <div className="deca-hero-grid" aria-hidden="true" />
        <div className="deca-hero-light" aria-hidden="true" />
        
        <div className="deca-hero-copy relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-light tracking-tight text-white md:text-5xl lg:text-6xl">
            Choose your plan.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-neutral-400 lg:text-2xl">
            Start free and upgrade as you grow. Every plan includes everything you need to excel in DECA competitions.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {clerkEnabled ? (
            <PricingTable />
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <div className="bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-all duration-200 p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-light mb-2 text-black dark:text-white">Starter</h3>
                <div className="text-2xl font-light mb-2 text-black dark:text-white">Free</div>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">Perfect for getting started</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-neutral-600 dark:text-neutral-400 text-sm">
                  <span className="mr-3 text-black dark:text-white">✓</span>
                  2 free roleplay generations
                </li>
                <li className="flex items-center text-neutral-600 dark:text-neutral-400 text-sm">
                  <span className="mr-3 text-black dark:text-white">✓</span>
                  Full access to practice tests
                </li>
                <li className="flex items-center text-neutral-600 dark:text-neutral-400 text-sm">
                  <span className="mr-3 text-black dark:text-white">✓</span>
                  Complete performance indicators
                </li>
                <li className="flex items-center text-neutral-600 dark:text-neutral-400 text-sm">
                  <span className="mr-3 text-black dark:text-white">✓</span>
                  Community support
                </li>
              </ul>
              
              <Link
                href="/signup"
                className="btn-ghost w-full text-center"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white dark:bg-black border border-black dark:border-white transition-all duration-200 p-6 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-black dark:bg-white text-white dark:text-black px-3 py-1 text-xs font-medium">Most Popular</span>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-lg font-light mb-2 text-black dark:text-white">Champion</h3>
                <div className="text-2xl font-light mb-2 text-black dark:text-white">TBD</div>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">For serious competitors</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-neutral-600 dark:text-neutral-400 text-sm">
                  <span className="mr-3 text-black dark:text-white">✓</span>
                  100 roleplay generations/month
                </li>
                <li className="flex items-center text-neutral-600 dark:text-neutral-400 text-sm">
                  <span className="mr-3 text-black dark:text-white">✓</span>
                  Everything in Starter
                </li>
                <li className="flex items-center text-neutral-600 dark:text-neutral-400 text-sm">
                  <span className="mr-3 text-black dark:text-white">✓</span>
                  Advanced AI feedback
                </li>
                <li className="flex items-center text-neutral-600 dark:text-neutral-400 text-sm">
                  <span className="mr-3 text-black dark:text-white">✓</span>
                  Priority support
                </li>
              </ul>
              
              <Link
                href="/signup"
                className="btn-primary w-full text-center"
              >
                Coming Soon
              </Link>
            </div>

            {/* Elite Plan */}
            <div className="bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-all duration-200 p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-light mb-2 text-black dark:text-white">Elite</h3>
                <div className="text-2xl font-light mb-2 text-black dark:text-white">TBD</div>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">For championship teams</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-neutral-600 dark:text-neutral-400 text-sm">
                  <span className="mr-3 text-black dark:text-white">✓</span>
                  Unlimited roleplay generations
                </li>
                <li className="flex items-center text-neutral-600 dark:text-neutral-400 text-sm">
                  <span className="mr-3 text-black dark:text-white">✓</span>
                  Everything in Champion
                </li>
                <li className="flex items-center text-neutral-600 dark:text-neutral-400 text-sm">
                  <span className="mr-3 text-black dark:text-white">✓</span>
                  Extended roleplay history
                </li>
                <li className="flex items-center text-neutral-600 dark:text-neutral-400 text-sm">
                  <span className="mr-3 text-black dark:text-white">✓</span>
                  Access to in depth analytics
                </li>
              </ul>
              
              <Link
                href="/signup"
                className="btn-ghost w-full text-center"
              >
                Coming Soon
              </Link>
            </div>
          </div>
          )}
        </div>
      </div>

    </div>
  )
}
