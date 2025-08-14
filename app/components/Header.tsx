'use client'

import Link from 'next/link'
import { UserCircle, Menu, X, LogOut, Moon, Sun } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, logout } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  return (
    <header className="fixed top-4 left-4 right-4 z-10">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-[20px] transition-colors max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-1 flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-800 dark:text-white hover:text-[#0066cc] dark:hover:text-[#4d94ff] transition-colors duration-300">
              Deca Pal
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 items-center justify-center space-x-6">
            <Link href="/performance" className="text-gray-600 dark:text-gray-300 hover:text-[#0066cc] dark:hover:text-[#4d94ff] transition-colors duration-300 whitespace-nowrap">
              Performance Indicators
            </Link>
            <Link href="/test" className="text-gray-600 dark:text-gray-300 hover:text-[#0066cc] dark:hover:text-[#4d94ff] transition-colors duration-300">
              Tests
            </Link>
            <Link href="/roleplay" className="text-gray-600 dark:text-gray-300 hover:text-[#0066cc] dark:hover:text-[#4d94ff] transition-colors duration-300">
              Roleplays
            </Link>
            <Link href="/leaderboard" className="text-gray-600 dark:text-gray-300 hover:text-[#0066cc] dark:hover:text-[#4d94ff] transition-colors duration-300">
              Leaderboard
            </Link>
          </nav>

          {/* User Icon and Dark Mode Toggle - Desktop */}
          <div className="hidden md:flex flex-1 items-center justify-end space-x-4 relative">
            <button 
              onClick={toggleDarkMode}
              className="text-gray-600 dark:text-gray-300 hover:text-[#0066cc] dark:hover:text-[#4d94ff] transition-colors duration-200 click-animation"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <div ref={dropdownRef} className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="text-gray-600 dark:text-gray-300 hover:text-[#0066cc] dark:hover:text-[#4d94ff] transition-colors duration-200 click-animation"
              >
                <UserCircle size={32} />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 top-12 w-72 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 break-words">
                        {user.email}
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 click-animation"
                      >
                        <UserCircle size={16} className="mr-2 flex-shrink-0" />
                        Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 click-animation"
                      >
                        <LogOut size={16} className="mr-2 flex-shrink-0" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 click-animation"
                    >
                      Login
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-[#0066cc] transition-colors duration-200 click-animation"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <Link 
                href="/performance" 
                className="block px-3 py-2 text-gray-600 hover:text-[#0066cc] transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                PIs
              </Link>
              <Link 
                href="/test" 
                className="block px-3 py-2 text-gray-600 hover:text-[#0066cc] transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Tests
              </Link>
              <Link 
                href="/roleplay" 
                className="block px-3 py-2 text-gray-600 hover:text-[#0066cc] transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Roleplays
              </Link>
              <Link 
                href="/leaderboard" 
                className="block px-3 py-2 text-gray-600 hover:text-[#0066cc] transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Leaderboard
              </Link>
              
              {/* Dark Mode Toggle - Mobile */}
              <button
                onClick={toggleDarkMode}
                className="flex items-center w-full px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-[#0066cc] dark:hover:text-[#4d94ff] transition-colors duration-200"
              >
                {darkMode ? <Sun size={20} className="mr-2" /> : <Moon size={20} className="mr-2" />}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-700 border-t border-gray-100 break-words">
                    {user.email}
                  </div>
                  <Link 
                    href="/account"
                    className="flex items-center w-full px-3 py-2 text-gray-600 hover:text-[#0066cc] transition-colors duration-200 click-animation"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserCircle size={20} className="mr-2 flex-shrink-0" />
                    Account
                  </Link>
                  <button 
                    className="flex items-center w-full px-3 py-2 text-gray-600 hover:text-[#0066cc] transition-colors duration-200 click-animation"
                    onClick={handleLogout}
                  >
                    <LogOut size={20} className="mr-2 flex-shrink-0" />
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  href="/login"
                  className="block px-3 py-2 text-gray-600 hover:text-[#0066cc] transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </header>
  )
}

