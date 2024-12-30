import Link from 'next/link'
import { UserCircle } from 'lucide-react'

export default function Header() {
  return (
<<<<<<< HEAD
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="w-64">
            <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-[#06C167] transition-colors duration-300">
              Deca Pal
            </Link>
          </div>
          <nav className="flex-1 flex justify-center -ml-16 space-x-8">
            <Link href="/performance" className="text-gray-600 hover:text-[#06C167] transition-colors duration-300 relative group">
              Performance
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#06C167] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link href="/test" className="text-gray-600 hover:text-[#06C167] transition-colors duration-300 relative group">
              Test
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#06C167] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
          </nav>
          <div className="w-64 flex justify-end">
            <button className="text-gray-600 hover:text-[#06C167] transition-colors duration-300 transform hover:scale-110">
              <UserCircle size={32} />
            </button>
          </div>
=======
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-white hover:text-blue-200 transition-colors duration-200">
            PI Home
          </Link>
          <button className="text-white hover:text-blue-200 transition-colors duration-200">
            <UserCircle size={32} />
          </button>
>>>>>>> 22ee48ed548d41ef82d536d121bc20d018918773
        </div>
      </div>
    </header>
  )
}

