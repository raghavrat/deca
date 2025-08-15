import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-light tracking-tight mb-12 text-center text-black dark:text-white">Deca Pal</h1>
      <div className="w-full max-w-md space-y-6">
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