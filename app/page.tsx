import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">Deca Pal</h1>
      <div className="w-full max-w-md space-y-6">
        <Link href="/performance" className="block w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-[15px] shadow-md text-center transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc]">
          Performance Indicators
        </Link>
        <Link href="/test" className="block w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-[15px] shadow-md text-center transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc]">
          Take a Test
        </Link>
      </div>
    </div>
  )
}

