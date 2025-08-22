'use client'

import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  isHydrated: boolean;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default to dark mode, but we'll check user preferences in useEffect
  const [darkMode, setDarkMode] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Set hydration flag
    setIsHydrated(true);
    
    // Check user's theme preference
    const savedTheme = localStorage.getItem('theme');
    
    // Determine the correct theme state
    let shouldBeDark = true; // Default to dark mode
    if (savedTheme) {
      // User has explicitly set a theme preference
      shouldBeDark = savedTheme === 'dark';
    } else if (typeof window !== 'undefined') {
      // No saved preference, check system preference
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      // If system prefers light, we'll still default to dark as per your request
    }
    
    // Apply the theme to DOM and state
    setDarkMode(shouldBeDark);
    if (typeof window !== 'undefined') {
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    // Listen for system theme changes
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        // Only apply system preference if user hasn't explicitly set a theme
        const currentSavedTheme = localStorage.getItem('theme');
        if (!currentSavedTheme) {
          // Still default to dark even if system prefers light
          const systemDark = e.matches;
          // We'll keep dark mode as default, but update state for UI consistency
          setDarkMode(true);
          document.documentElement.classList.add('dark');
        }
      };

      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    if (typeof window !== 'undefined') {
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, isHydrated }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);