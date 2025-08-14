import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800 dark:text-white">Deca Pal</h1>
      <div className="w-full max-w-md space-y-6">
        <Link href="/performance" className="block w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-semibold py-4 px-6 rounded-[15px] shadow-md text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] dark:focus:ring-[#4d94ff] click-animation">
          Performance Indicators
        </Link>
        <Link href="/test" className="block w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-semibold py-4 px-6 rounded-[15px] shadow-md text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] dark:focus:ring-[#4d94ff] click-animation">
          Take a Test
        </Link>
        <Link href="/roleplay" className="block w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-semibold py-4 px-6 rounded-[15px] shadow-md text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] dark:focus:ring-[#4d94ff] click-animation">
          Practice Roleplays
        </Link>
      </div>
    </div>
  )
}

