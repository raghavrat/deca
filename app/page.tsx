'use client'

import Link from 'next/link'
import { useAuth } from './context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ImageCarousel from './components/ImageCarousel'

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  // Show landing page for non-logged-in users
  if (!user) {
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
            Master DECA Events with AI-Powered Practice
          </h1>
          <p className="text-xl lg:text-2xl mb-12 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Deca Pal helps you prepare for DECA competitions with personalized practice tests, roleplay simulations, and performance tracking.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-6">
            <Link
              href="/signup"
              className="btn-primary"
            >
              Get Started - It's Free
            </Link>
            <Link
              href="/login"
              className="btn-ghost"
            >
              Sign In
            </Link>
          </div>
          <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
            No credit card required
          </p>
        </div>
      </div>

      {/* Interactive Preview Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-center mb-16 text-black dark:text-white">
            See Deca Pal in Action
          </h2>
          
          {/* Full Screenshot Carousel */}
          <div className="relative mx-auto max-w-4xl">
            <ImageCarousel
              images={[
                {
                  src: "/images/screenshot-1.png",
                  alt: "Deca Pal Performance Indicators",
                  title: "Performance Indicators"
                },
                {
                  src: "/images/screenshot-2.png",
                  alt: "Deca Pal Practice Tests",
                  title: "Practice Tests"
                },
                {
                  src: "/images/screenshot-3.png",
                  alt: "Deca Pal Detailed Explanations",
                  title: "Detailed Explanations"
                },
                {
                  src: "/images/screenshot-4.png",
                  alt: "Deca Pal Roleplay Practice",
                  title: "Roleplay Practice"
                },
                {
                  src: "/images/screenshot-5.png",
                  alt: "Deca Pal Feedback System",
                  title: "In-depth Feedback"
                }
              ]}
              autoPlayInterval={4000}
            />
          </div>
        </div>
        </div>

        {/* Features Section */}
        <div className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-center mb-16 text-black dark:text-white">
              Everything you need to excel
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-200 p-6">
                <div className="text-center mb-4">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-lg font-light mb-3 text-black dark:text-white text-center">Performance Tracking</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center text-sm leading-relaxed">
                  Monitor your progress with detailed analytics and performance indicators tailored to your DECA events.
                </p>
              </div>
              
              <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-200 p-6">
                <div className="text-center mb-4">
                  <span className="text-3xl">📝</span>
                </div>
                <h3 className="text-lg font-light mb-3 text-black dark:text-white text-center">Practice Tests</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center text-sm leading-relaxed">
                  Take practice tests to prepare for your DECA events with instant feedback and detailed explanations.
                </p>
              </div>
              
              <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-200 p-6">
                <div className="text-center mb-4">
                  <span className="text-3xl">🎭</span>
                </div>
                <h3 className="text-lg font-light mb-3 text-black dark:text-white text-center">Roleplay Practice</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center text-sm leading-relaxed">
                  Practice your roleplay scenarios with AI-powered feedback and suggestions to improve your performance.
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* CTA Section */}
        <div className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Complete CTA Box */}
            <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-8">
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
          </div>
        </div>
      </div>
    )
  }

  // Show dashboard for logged-in users
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10 dark:opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-4.5z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}
      />
      <h1 className="text-5xl font-light tracking-tight mb-12 text-center text-black dark:text-white relative z-10">Welcome Back</h1>
      <div className="w-full max-w-md space-y-6 relative z-10">
        <Link 
          href="/performance" 
          className="group block w-full text-center py-4 px-6 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-200"
        >
          <span className="text-sm font-medium tracking-wide text-black dark:text-white">Performance Indicators</span>
        </Link>
        <Link 
          href="/test" 
          className="group block w-full text-center py-4 px-6 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-200"
        >
          <span className="text-sm font-medium tracking-wide text-black dark:text-white">Take a Test</span>
        </Link>
        <Link 
          href="/roleplay" 
          className="group block w-full text-center py-4 px-6 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-200"
        >
          <span className="text-sm font-medium tracking-wide text-black dark:text-white">Practice Roleplays</span>
        </Link>
      </div>
    </div>
  )
}