import './globals.css'
import { Manrope } from 'next/font/google'
import Header from './components/Header'
import { AuthContextProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

const manrope = Manrope({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  fallback: ['system-ui', 'Arial', 'sans-serif']
})

export const metadata = {
  title: 'Deca Pal',
  description: 'Deca Pal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} font-sans`}>
        <ThemeProvider>
          <AuthContextProvider>
            <div className="min-h-screen bg-white dark:bg-black flex flex-col transition-colors">
              <Header />
              <main className="flex-grow pt-24">
                {children}
              </main>
            </div>
          </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
