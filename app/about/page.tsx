'use client'

import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function About() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect logged-in users to the dashboard
  useEffect(() => {
    if (user && !loading) {
      router.push('/performance')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 dark:border-white"></div>
      </div>
    )
  }

  // Only show about page for non-logged-in users
  if (user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="deca-hero relative overflow-hidden bg-black px-4 py-16 text-white lg:py-24">
        <div className="deca-hero-grid" aria-hidden="true" />
        <div className="deca-hero-light" aria-hidden="true" />
        
        <div className="deca-hero-copy relative z-10 mx-auto max-w-4xl">
          <h1 className="max-w-3xl text-4xl font-light leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl">
            Built because good practice was hard to find.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-400">
            Deca Pal is the focused study space I wanted when I was preparing to compete.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <main className="px-4 py-16 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <section className="grid gap-8 border-b border-neutral-300 pb-14 dark:border-neutral-700 md:grid-cols-[0.7fr_1.3fr] md:gap-12">
            <h2 className="text-2xl font-light tracking-tight text-black dark:text-white md:text-3xl">
              Why I built it
            </h2>
            <div className="space-y-5 text-base leading-7 text-neutral-600 dark:text-neutral-400">
              <p>
                I&apos;m Raghav. While preparing for DECA, I could learn the concepts, but finding enough realistic practice was much harder.
              </p>
              <p>
                I built Deca Pal to bring original practice tests, event-specific roleplays, and useful feedback into one place. The goal is simple: help students practice more often and learn something from every attempt.
              </p>
            </div>
          </section>

          <section className="py-14">
            <h2 className="text-2xl font-light tracking-tight text-black dark:text-white md:text-3xl">
              What students can expect
            </h2>
            <div className="mt-8 grid border border-neutral-300 dark:border-neutral-700 md:grid-cols-3">
              <div className="p-6 md:border-r md:border-neutral-300 md:dark:border-neutral-700">
                <h3 className="text-base font-medium text-black dark:text-white">Original material</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                  Practice questions and scenarios written for learning, not copied from official tests.
                </p>
              </div>
              <div className="border-t border-neutral-300 p-6 dark:border-neutral-700 md:border-r md:border-t-0 md:dark:border-neutral-700">
                <h3 className="text-base font-medium text-black dark:text-white">Event-specific practice</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                  Tests, roleplays, and performance indicators organized around the event being studied.
                </p>
              </div>
              <div className="border-t border-neutral-300 p-6 dark:border-neutral-700 md:border-t-0">
                <h3 className="text-base font-medium text-black dark:text-white">Feedback that teaches</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                  Explanations and roleplay feedback that make the next attempt more useful.
                </p>
              </div>
            </div>
          </section>

          <section className="border border-neutral-300 p-8 dark:border-neutral-700 md:flex md:items-end md:justify-between md:gap-12">
            <div className="max-w-xl">
              <h2 className="text-2xl font-light tracking-tight text-black dark:text-white md:text-3xl">
                Independent by design
              </h2>
              <p className="mt-4 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                Deca Pal is an independent study tool and is not affiliated with or endorsed by DECA Inc. Practice scores are not official competition results.
              </p>
            </div>
            <div className="mt-8 shrink-0 md:mt-0">
              <Link href="/signup" className="btn-primary">
                Start practicing
              </Link>
              <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                Free to start.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
