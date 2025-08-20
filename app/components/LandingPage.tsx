'use client'

import Link from 'next/link'
import { ArrowRight, Target, Users, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-6xl md:text-7xl font-light tracking-tight mb-6 text-black dark:text-white">
          Ace Your DECA Competition
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl">
          Master performance indicators, practice with real questions, and excel in your DECA competitions with our comprehensive study platform.
        </p>
        
        {/* Social Proof */}
        <div className="mb-12 text-gray-500 dark:text-gray-500">
          <p className="text-lg">Join 10,000+ DECA students already improving their scores</p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link 
            href="/signup" 
            className="group inline-flex items-center justify-center px-8 py-4 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 text-lg font-medium"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/login" 
            className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-colors duration-200 text-lg font-medium text-black dark:text-white"
          >
            Sign In
          </Link>
        </div>

        {/* Urgency Message */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 px-6 py-3 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-200 font-medium">
            🏆 Competition season is here! Start preparing today.
          </p>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-light text-center mb-16 text-black dark:text-white">
            Everything you need to succeed
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-black dark:bg-white rounded-full">
                <Target className="h-8 w-8 text-white dark:text-black" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-black dark:text-white">
                Performance Indicators
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Master all DECA performance indicators across Management, Marketing, Finance, Hospitality, and Entrepreneurship.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-black dark:bg-white rounded-full">
                <Users className="h-8 w-8 text-white dark:text-black" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-black dark:text-white">
                Practice Tests
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Take realistic practice tests with instant feedback and detailed explanations to improve your understanding.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-black dark:bg-white rounded-full">
                <TrendingUp className="h-8 w-8 text-white dark:text-black" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-black dark:text-white">
                Track Progress
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor your improvement with detailed analytics and personalized recommendations for study focus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-light mb-6 text-black dark:text-white">
            Ready to start winning?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of DECA students preparing for competition success.
          </p>
          <Link 
            href="/signup" 
            className="group inline-flex items-center justify-center px-8 py-4 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 text-lg font-medium"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}