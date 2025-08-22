'use client'

import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Pricing() {
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  // Only show pricing page for non-logged-in users
  if (user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="py-16 lg:py-24 px-4 text-center relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-10 dark:opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3Ccircle cx='50' cy='10' r='2'/%3E%3Ccircle cx='10' cy='50' r='2'/%3E%3Ccircle cx='50' cy='50' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6 text-black dark:text-white">
            Choose Your Plan 💎
          </h1>
          <p className="text-xl lg:text-2xl mb-12 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Start free and upgrade as you grow. Every plan includes everything you need to excel in DECA competitions.
          </p>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-200 p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-light mb-2 text-black dark:text-white">Starter</h3>
                <div className="text-2xl font-light mb-2 text-black dark:text-white">Free</div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Perfect for getting started</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <span className="mr-3 text-black dark:text-white">✓</span>
                  2 free roleplay generations
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <span className="mr-3 text-black dark:text-white">✓</span>
                  Full access to practice tests
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <span className="mr-3 text-black dark:text-white">✓</span>
                  Complete performance indicators
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
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
                <p className="text-gray-600 dark:text-gray-400 text-sm">For serious competitors</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <span className="mr-3 text-black dark:text-white">✓</span>
                  100 roleplay generations/month
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <span className="mr-3 text-black dark:text-white">✓</span>
                  Everything in Starter
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <span className="mr-3 text-black dark:text-white">✓</span>
                  Advanced AI feedback
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
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
            <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-200 p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-light mb-2 text-black dark:text-white">Elite</h3>
                <div className="text-2xl font-light mb-2 text-black dark:text-white">TBD</div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">For championship teams</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <span className="mr-3 text-black dark:text-white">✓</span>
                  Unlimited roleplay generations
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <span className="mr-3 text-black dark:text-white">✓</span>
                  Everything in Champion
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <span className="mr-3 text-black dark:text-white">✓</span>
                  Extended roleplay history
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
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
        </div>
      </div>

    </div>
  )
}