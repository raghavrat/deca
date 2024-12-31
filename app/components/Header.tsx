'use client'

import Link from 'next/link'
import { UserCircle, Menu, X, LogOut } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, logout } = useAuth()
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
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-[#06C167] transition-colors duration-300">
              Deca Pal
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/performance" className="text-gray-600 hover:text-[#06C167] transition-colors duration-300">
              Performance
            </Link>
            <Link href="/test" className="text-gray-600 hover:text-[#06C167] transition-colors duration-300">
              Test
            </Link>
          </nav>

          {/* User Icon - Desktop */}
          <div className="hidden md:flex items-center relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="text-gray-600 hover:text-[#06C167] transition-colors duration-300 transform hover:scale-110"
            >
              <UserCircle size={32} />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 top-12 w-72 py-2 bg-white rounded-lg shadow-xl border border-gray-100">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100 break-words">
                      {user.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2 flex-shrink-0" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-[#06C167] transition-colors duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              <Link 
                href="/performance" 
                className="block px-3 py-2 text-gray-600 hover:text-[#06C167] transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Performance
              </Link>
              <Link 
                href="/test" 
                className="block px-3 py-2 text-gray-600 hover:text-[#06C167] transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Test
              </Link>
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-700 border-t border-gray-100 break-words">
                    {user.email}
                  </div>
                  <button 
                    className="flex items-center w-full px-3 py-2 text-gray-600 hover:text-[#06C167] transition-colors duration-300"
                    onClick={handleLogout}
                  >
                    <LogOut size={20} className="mr-2 flex-shrink-0" />
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  href="/login"
                  className="block px-3 py-2 text-gray-600 hover:text-[#06C167] transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

