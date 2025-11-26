import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first, then default to auto
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kajoo-theme') as Theme;
      if (stored && (stored === 'light' || stored === 'dark' || stored === 'auto')) {
        return stored;
      }
    }
    return 'auto';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Determine the resolved theme
    let resolved: 'light' | 'dark';
    if (theme === 'auto') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      resolved = theme;
    }
    
    setResolvedTheme(resolved);
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark');
    
    // Add resolved theme class
    root.classList.add(resolved);
    
    // Store in localStorage
    localStorage.setItem('kajoo-theme', theme);
  }, [theme]);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (theme !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const resolved = mediaQuery.matches ? 'dark' : 'light';
      setResolvedTheme(resolved);
      
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'auto';
      return 'light';
    });
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
