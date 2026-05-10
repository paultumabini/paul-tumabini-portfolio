import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Experience from './components/sections/Experience'
import Contact from './components/sections/Contact'

/**
 * Root layout for the single-page portfolio.
 *
 * Responsibilities:
 * - `ThemeProvider` supplies `useTheme()` to descendants and syncs `data-theme` on `<html>`.
 * - `Navbar` is fixed; each section below exposes an `id` that matches `NAV_LINKS` in Navbar
 *   so smooth scrolling and scroll-spy highlighting stay in sync.
 * - Order inside `<main>` is the intended reading flow:
 *   Hero → About → Skills → Projects → Experience → Contact.
 */
export default function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Contact />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
