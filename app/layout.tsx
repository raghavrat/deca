import './globals.css'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import { AuthContextProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        <ThemeProvider>
          <AuthContextProvider>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col transition-colors">
              <Header />
              <main className="flex-grow pt-16">
                {children}
              </main>
            </div>
          </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
