/**
 * Theme (light / dark) for the whole app.
 *
 * State lives in React; side effects mirror it to the DOM so CSS modules and `globals.css`
 * can read `html[data-theme="light" | "dark"]` and swap CSS variables without prop drilling.
 */
import { createContext, useContext, useState, useEffect } from 'react'

/** React context carrying the active theme string and a toggle callback (null when no provider). */
const ThemeContext = createContext(null)

/**
 * Provides theme state to the subtree.
 * - Initial state reads `localStorage` (or defaults to `'dark'`).
 * - Whenever `theme` changes, mirrors it to `<html data-theme="...">` for CSS variable swapping
 *   and persists to `localStorage` so the choice survives page reloads.
 *
 * @param {{ children: import('react').ReactNode }} props
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('portfolio-theme')
    return stored || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  /** Flips between `'dark'` and `'light'`; `useEffect` above persists each change. */
  const toggle = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Reads `{ theme, toggle }` from the nearest `ThemeProvider`.
 *
 * @returns {{ theme: 'light' | 'dark', toggle: () => void }}
 * @throws If called outside `ThemeProvider` (context is null).
 */
export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
