import './globals.css'
import { Manrope } from 'next/font/google'
import Header from './components/Header'
import { AuthContextProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Footer from './components/Footer'
import type { Metadata } from 'next'

const manrope = Manrope({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope'
})

export const metadata: Metadata = {
  title: {
    default: 'Deca Pal',
    template: '%s | Deca Pal',
  },
  description: 'Independent practice tools for DECA students, including tests, roleplay simulations, and AI-assisted feedback.',
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
      </head>
      <body className={`${manrope.variable} font-sans`}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <ThemeProvider>
          <AuthContextProvider>
            <div className="min-h-screen flex flex-col transition-colors">
              <Header />
              <main id="main-content" tabIndex={-1} className="flex-grow pt-24 outline-none">
                {children}
              </main>
              <Footer />
            </div>
          </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
