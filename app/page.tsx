'use client'

import Link from 'next/link'
import { BarChart3, ClipboardCheck, MessagesSquare } from 'lucide-react'
import { useAuth } from './context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import HorizontalShowcase, { type HorizontalShowcaseSlide } from './components/HorizontalShowcase'

const productSlides: HorizontalShowcaseSlide[] = [
  {
    src: '/images/screenshot-1.png',
    alt: 'Deca Pal performance indicator practice page',
    title: 'Performance indicators',
    description: 'Study the exact skills behind your event.',
  },
  {
    src: '/images/screenshot-2.png',
    alt: 'Deca Pal practice test page',
    title: 'Practice tests',
    description: 'Work through original questions from a fixed practice bank.',
  },
  {
    src: '/images/screenshot-3.png',
    alt: 'Deca Pal answer explanation page',
    title: 'Detailed explanations',
    description: 'Understand why an answer works before moving on.',
  },
  {
    src: '/images/screenshot-4.png',
    alt: 'Deca Pal roleplay practice page',
    title: 'Roleplay practice',
    description: 'Rehearse event-specific scenarios under realistic constraints.',
  },
  {
    src: '/images/screenshot-5.png',
    alt: 'Deca Pal roleplay feedback page',
    title: 'In-depth feedback',
    description: 'Review each attempt and decide what to improve next.',
  },
]

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect logged-in users to the dashboard
  useEffect(() => {
    if (user && !loading) {
      // User is already on the dashboard page now, no redirect needed
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 dark:border-white"></div>
      </div>
    )
  }

  // Show landing page for non-logged-in users
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="deca-hero deca-scroll-hero relative flex min-h-[calc(100dvh-6rem)] items-center overflow-hidden bg-black px-4 py-16 text-white lg:py-24">
          <div className="deca-hero-grid" aria-hidden="true" />
          <div className="deca-hero-light" aria-hidden="true" />
          <div className="deca-hero-geometry" aria-hidden="true">
            <div className="deca-hero-frame deca-hero-frame-outer" />
            <div className="deca-hero-frame deca-hero-frame-inner" />
            <div className="deca-hero-frame-core" />
          </div>
          
          <div className="relative z-10 mx-auto w-full max-w-6xl">
            <div className="deca-hero-copy mx-auto max-w-4xl text-center lg:mx-0 lg:text-left">
              <h1 className="text-4xl font-light leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl">
                <span className="deca-hero-line deca-hero-line-left block">Practice for the</span>
                <span className="deca-hero-line deca-hero-line-right block">moment it counts.</span>
              </h1>
              <div className="deca-hero-support">
                <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-neutral-400 lg:mx-0">
                  Tests, event-specific roleplays, and performance indicators in one focused workspace.
                </p>
                <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                  <Link
                    href="/signup"
                    className="inline-flex min-h-12 items-center justify-center border border-white bg-white px-6 py-3 text-sm font-medium text-black transition-[background-color,color,transform] duration-200 hover:bg-black hover:text-white active:translate-y-px"
                  >
                    Start practicing
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex min-h-12 items-center justify-center border border-white/25 bg-transparent px-6 py-3 text-sm font-medium text-white transition-[border-color,transform] duration-200 hover:border-white active:translate-y-px"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <HorizontalShowcase slides={productSlides} />

        {/* Features Section */}
        <div className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-center mb-16 text-black dark:text-white">
              Everything you need to excel
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-all duration-200 p-6">
                <div className="text-center mb-4">
                  <BarChart3 className="mx-auto h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-light mb-3 text-black dark:text-white text-center">Performance Tracking</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-center text-sm leading-relaxed">
                  Review the skills and concepts connected to your event.
                </p>
              </div>
              
              <div className="bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-all duration-200 p-6">
                <div className="text-center mb-4">
                  <ClipboardCheck className="mx-auto h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-light mb-3 text-black dark:text-white text-center">Practice Tests</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-center text-sm leading-relaxed">
                  Use original questions with instant explanations.
                </p>
              </div>
              
              <div className="bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-all duration-200 p-6">
                <div className="text-center mb-4">
                  <MessagesSquare className="mx-auto h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-light mb-3 text-black dark:text-white text-center">Roleplay Practice</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-center text-sm leading-relaxed">
                  Rehearse event-specific scenarios and receive feedback.
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* CTA Section */}
        <div className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Complete CTA Box */}
            <div className="bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 p-8">
              <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-6 text-black dark:text-white text-left">
                Built by a competitor
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed text-left mb-8">
                I built Deca Pal because realistic roleplay practice was difficult to find. It is the focused preparation space I wanted when I was competing.
              </p>
              
              {/* CTA Button Section */}
              <div className="text-center">
                <Link
                  href="/signup"
                  className="btn-primary"
                >
                  Start practicing
                </Link>
                <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
                  Free to start. Built for DECA students.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show dashboard for logged-in users
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-white dark:bg-black">
      <h1 className="text-5xl font-light tracking-tight mb-12 text-center text-black dark:text-white relative z-10">Welcome Back</h1>
      <div className="w-full max-w-md space-y-6 relative z-10">
        <Link 
          href="/performance" 
          className="group block w-full text-center py-4 px-6 border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-all duration-200"
        >
          <span className="text-sm font-medium tracking-wide text-black dark:text-white">Performance Indicators</span>
        </Link>
        <Link 
          href="/test" 
          className="group block w-full text-center py-4 px-6 border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-all duration-200"
        >
          <span className="text-sm font-medium tracking-wide text-black dark:text-white">Take a Test</span>
        </Link>
        <Link 
          href="/roleplay" 
          className="group block w-full text-center py-4 px-6 border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-all duration-200"
        >
          <span className="text-sm font-medium tracking-wide text-black dark:text-white">Practice Roleplays</span>
        </Link>
      </div>
    </div>
  )
}
