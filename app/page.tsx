import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">Deca Pal</h1>
      <div className="w-full max-w-md space-y-6">
        <Link href="/performance" className="block w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-[15px] shadow-md text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] click-animation">
          Performance Indicators
        </Link>
        <Link href="/test" className="block w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-[15px] shadow-md text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] click-animation">
          Take a Test
        </Link>
        <Link href="/roleplay" className="block w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-[15px] shadow-md text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] click-animation">
          Practice Roleplays
        </Link>
      </div>
    </div>
  )
}

