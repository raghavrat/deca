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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
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
            About Deca Pal 👋
          </h1>
          <p className="text-xl lg:text-2xl mb-12 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Learn about the story behind Deca Pal and why it was created to help DECA students succeed.
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Personal Message Box */}
          <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-8 mb-8">
            <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-6 text-black dark:text-white text-left">
              A Personal Message from Raghav 👋
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-left mb-8">
              Hi, my name is Raghav and I built this app to help people study for their DECA roleplays because I knew it was hard for me when I was studying and it was very difficult without proper resources. 📚 My hope is that you can win Glass due to my website! 🏆✨
            </p>
            
            {/* CTA Button Section */}
            <div className="text-center">
              <Link
                href="/signup"
                className="btn-primary"
              >
                Start Your Journey to Glass 🥇
              </Link>
              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                No credit card required • Built with ❤️ for DECA students
              </p>
            </div>
          </div>

          {/* Additional Story Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-200 p-6">
              <div className="text-center mb-4">
                <span className="text-3xl">🤔</span>
              </div>
              <h3 className="text-lg font-light mb-4 text-black dark:text-white text-center">
                The Problem
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed text-center">
                When I was preparing for DECA competitions, I struggled to find quality practice resources for roleplays. Most materials were outdated or didn't provide the realistic feedback needed to improve.
              </p>
            </div>
            
            <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-200 p-6">
              <div className="text-center mb-4">
                <span className="text-3xl">💡</span>
              </div>
              <h3 className="text-lg font-light mb-4 text-black dark:text-white text-center">
                The Solution
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed text-center">
                Deca Pal uses AI to create realistic roleplay scenarios and provide detailed feedback, giving students the practice they need to excel in DECA competitions.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}