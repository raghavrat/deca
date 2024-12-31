'use client'

import Link from 'next/link'
import { UserCircle, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
            <Link href="/performance" className="text-gray-600 hover:text-[#06C167] transition-colors duration-300 relative group">
              Performance
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#06C167] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link href="/test" className="text-gray-600 hover:text-[#06C167] transition-colors duration-300 relative group">
              Test
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#06C167] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
          </nav>

          {/* User Icon - Desktop */}
          <div className="hidden md:flex items-center">
            <button className="text-gray-600 hover:text-[#06C167] transition-colors duration-300 transform hover:scale-110">
              <UserCircle size={32} />
            </button>
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
              <button 
                className="flex items-center w-full px-3 py-2 text-gray-600 hover:text-[#06C167] transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserCircle size={24} className="mr-2" />
                <span>Profile</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

