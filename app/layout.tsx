import './globals.css'
import { Inter } from 'next/font/google'
import Header from './components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
<<<<<<< HEAD
  title: 'Uber Learning Platform',
  description: 'Performance Indicators and Tests for Uber',
=======
  title: 'Performance Indicators',
  description: 'Display Performance Indicators for different Instructional Areas',
>>>>>>> 22ee48ed548d41ef82d536d121bc20d018918773
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
<<<<<<< HEAD
        <div className="min-h-screen bg-gray-100 flex flex-col">
=======
        <div className="min-h-screen bg-gray-50 flex flex-col">
>>>>>>> 22ee48ed548d41ef82d536d121bc20d018918773
          <Header />
          <main className="flex-grow pt-16">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

