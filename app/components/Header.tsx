import Link from 'next/link'
import { UserCircle } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-white hover:text-blue-200 transition-colors duration-200">
            PI Home
          </Link>
          <button className="text-white hover:text-blue-200 transition-colors duration-200">
            <UserCircle size={32} />
          </button>
        </div>
      </div>
    </header>
  )
}

