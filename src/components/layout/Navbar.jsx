/**
 * Site navigation: fixed header, desktop inline links, mobile slide-in drawer.
 *
 * State:
 * - `open` — Mobile drawer visibility; closing also happens on backdrop click and wide resize.
 * - `scrolled` — Adds glass/blur styles after a small scroll threshold for contrast over the hero.
 * - `activeId` — From `useScrollSpy`; highlights the nav button whose section is uppermost in view.
 *
 * Contract: every `NAV_LINKS[].id` must exist on a `<section id="...">` in the page (see `App.jsx`).
 */
import { useState, useEffect } from 'react'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { personalInfo } from '../../data/portfolio'
import ThemeToggle from '../ui/ThemeToggle'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { id: 'about',      label: 'About' },
  { id: 'skills',     label: 'Skills' },
  { id: 'projects',   label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact',    label: 'Contact' },
]

// Stable reference — module-level so useScrollSpy's effect dep never triggers a spurious re-run
const SECTION_IDS = NAV_LINKS.map(l => l.id)

export default function Navbar() {
  // Drawer open/closed (mobile only in UI; DOM node is always mounted for CSS transitions)
  const [open, setOpen] = useState(false)
  // Toggles .scrolled styles after user moves down the page (visual separation from hero)
  const [scrolled, setScrolled] = useState(false)
  // Which section’s top is currently “behind” the nav offset — drives .active on links
  const activeId = useScrollSpy(SECTION_IDS)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    // passive: true tells the browser we won’t call preventDefault — smoother scrolling
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // If the user widens past the mobile breakpoint, hide drawer + backdrop (hamburger is CSS-hidden)
    const onResize = () => { if (window.innerWidth > 768) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleNavClick = (id) => {
    setOpen(false)
    // Optional chaining: no error if id typo — section just won’t scroll
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      {/* z-index on .nav (CSS) keeps this row above the drawer so the menu button stays tappable */}
      <nav className={styles.nav}>
        <a href="#hero" className={styles.logo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className={styles.logoAccent}>{'<PT>'}</span>
          <span className={styles.logoDot} />
        </a>

        <ul className={styles.desktopLinks}>
          {NAV_LINKS.map(link => (
            <li key={link.id}>
              <button
                type="button"
                className={`${styles.navLink} ${activeId === link.id ? styles.active : ''}`}
                onClick={() => handleNavClick(link.id)}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <ThemeToggle />
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            GitHub
          </a>

          {/* Three spans animate via CSS when open === true (hamburger ↔ close icon) */}
          <button
            type="button"
            className={`${styles.hamburger} ${open ? styles.hamburgerOpen : ''}`}
            onClick={() => setOpen(p => !p)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Off-canvas panel: translateX in CSS; open class slides it in from the right */}
      <div className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ''}`}>
        <ul className={styles.mobileLinks}>
          {NAV_LINKS.map((link, i) => (
            <li key={link.id} style={{ animationDelay: `${i * 0.07}s` }}>
              <button
                type="button"
                className={`${styles.mobileLink} ${activeId === link.id ? styles.active : ''}`}
                onClick={() => handleNavClick(link.id)}
              >
                <span className={styles.mobileLinkNum}>0{i + 1}.</span>
                {link.label}
              </button>
            </li>
          ))}
          <li style={{ animationDelay: '0.28s' }}>
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileCta}
              onClick={() => setOpen(false)}
            >
              View GitHub
            </a>
          </li>
        </ul>
      </div>

      {/* Only mounted when open — avoids invisible full-screen hit target */}
      {open && <div className={styles.backdrop} onClick={() => setOpen(false)} />}
    </header>
  )
}
