import './globals.css'
import { Manrope } from 'next/font/google'
import Header from './components/Header'
import { AuthContextProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

const manrope = Manrope({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope'
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var shouldBeDark = theme === 'dark' || (!theme && systemPrefersDark);
                  
                  document.documentElement.classList.toggle('dark', shouldBeDark);
                } catch (e) {
                  // Fallback to light mode if localStorage is not available
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${manrope.variable} font-sans`}>
        <ThemeProvider>
          <AuthContextProvider>
            <div className="min-h-screen flex flex-col transition-colors">
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
