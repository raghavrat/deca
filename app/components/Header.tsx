'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, logout, loading } = useAuth()
  const { darkMode, toggleDarkMode, isHydrated } = useTheme()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setIsProfileOpen(false)
      setIsMenuOpen(false)
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  const isActive = (path: string) => pathname.startsWith(path)

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-6xl z-50 bg-white dark:bg-black backdrop-blur-md border border-gray-300 dark:border-gray-700 shadow-lg">
      <div className="w-full">
        <div className="px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="text-lg font-semibold tracking-tight text-black dark:text-white hover:opacity-70 transition-opacity">
                Deca Pal
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {loading ? (
                /* Loading placeholder - maintain layout */
                <div className="flex items-center space-x-8">
                  <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ) : user ? (
                <>
                  <Link 
                    href="/performance" 
                    className={`nav-link ${isActive('/performance') ? 'nav-link-active' : ''}`}
                  >
                    Performance Indicators
                  </Link>
                  <Link 
                    href="/test" 
                    className={`nav-link ${isActive('/test') ? 'nav-link-active' : ''}`}
                  >
                    Tests
                  </Link>
                  <Link 
                    href="/roleplay" 
                    className={`nav-link ${isActive('/roleplay') ? 'nav-link-active' : ''}`}
                  >
                    Roleplays
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/pricing" 
                    className={`nav-link ${isActive('/pricing') ? 'nav-link-active' : ''}`}
                  >
                    Pricing
                  </Link>
                  <Link 
                    href="/about" 
                    className={`nav-link ${isActive('/about') ? 'nav-link-active' : ''}`}
                  >
                    About
                  </Link>
                </>
              )}
            </nav>

            {/* Right side - Theme toggle and User */}
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={toggleDarkMode}
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Toggle dark mode"
              >
                {/* Use isHydrated to prevent hydration mismatch */}
                {isHydrated ? (
                  darkMode ? <Sun size={20} /> : <Moon size={20} />
                ) : (
                  // Show Sun icon as default during hydration since we're defaulting to dark mode
                  <Sun size={20} />
                )}
              </button>
              
              <div ref={dropdownRef} className="relative">
                {loading ? (
                  /* Loading placeholder for user area */
                  <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : user ? (
                  <>
                    <button 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                      {user.email?.split('@')[0]}
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                      <div className="absolute right-0 top-8 w-48 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 fade-in">
                        <Link
                          href="/account"
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                        >
                          Account
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="btn-text"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-black dark:text-white"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 fade-in">
              <div className="flex flex-col space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                {loading ? (
                  /* Loading placeholder for mobile nav */
                  <div className="flex flex-col space-y-4">
                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-28 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ) : user ? (
                  <>
                    <Link 
                      href="/performance" 
                      className={`nav-link ${isActive('/performance') ? 'nav-link-active' : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Performance Indicators
                    </Link>
                    <Link 
                      href="/test" 
                      className={`nav-link ${isActive('/test') ? 'nav-link-active' : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Tests
                    </Link>
                    <Link 
                      href="/roleplay" 
                      className={`nav-link ${isActive('/roleplay') ? 'nav-link-active' : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Roleplays
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/pricing" 
                      className={`nav-link ${isActive('/pricing') ? 'nav-link-active' : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Pricing
                    </Link>
                    <Link 
                      href="/about" 
                      className={`nav-link ${isActive('/about') ? 'nav-link-active' : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      About
                    </Link>
                  </>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    onClick={toggleDarkMode}
                    className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400"
                  >
                    {/* Prevent hydration mismatch by checking DOM state during hydration */}
                    {isHydrated ? (
                      <>
                        {darkMode ? <Sun size={16} className="mr-2" /> : <Moon size={16} className="mr-2" />}
                        {darkMode ? 'Light' : 'Dark'}
                      </>
                    ) : (
                      // During hydration, check DOM state to show correct icon and text
                      typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? (
                        <>
                          <Sun size={16} className="mr-2" />
                          Light
                        </>
                      ) : (
                        <>
                          <Moon size={16} className="mr-2" />
                          Dark
                        </>
                      )
                    )}
                  </button>
                  
                  {loading ? (
                    /* Loading placeholder for mobile user area */
                    <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  ) : user ? (
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {user.email?.split('@')[0]}
                      </span>
                      <button 
                        className="text-sm font-medium text-gray-600 dark:text-gray-400"
                        onClick={handleLogout}
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link 
                      href="/login"
                      className="text-sm font-medium text-black dark:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}