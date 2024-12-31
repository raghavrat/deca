import './globals.css'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import { AuthContextProvider } from './context/AuthContext'

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
        <AuthContextProvider>
          <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header />
            <main className="flex-grow pt-16">
              {children}
            </main>
          </div>
        </AuthContextProvider>
      </body>
    </html>
  )
}

