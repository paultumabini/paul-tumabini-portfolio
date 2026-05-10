import { useState, useEffect } from 'react'

/**
 * Tracks which page section is currently “active” while the user scrolls.
 *
 * How it works:
 * - Each section should have `document.getElementById(id)` (e.g. `<section id="about">`).
 * - On scroll, we compare `window.scrollY` to each section’s `offsetTop` (minus `offset` for a fixed nav).
 * - We walk `sectionIds` from bottom to top and pick the last section whose top has passed that threshold.
 *   That way the active id is the section occupying the upper viewport, not a tiny sliver above.
 *
 * @param {string[]} sectionIds — Ordered top-to-bottom; same strings as DOM `id` attributes.
 * @param {number} [offset=100] — Pixels subtracted from each section top (room for fixed navbar).
 * @returns {string} — The active section id, or `''` if none matched (e.g. above first section).
 */
export function useScrollSpy(sectionIds, offset = 100) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i])
        if (el && el.offsetTop - offset <= scrollY) {
          setActiveId(sectionIds[i])
          return
        }
      }
      setActiveId('')
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initialise on mount (e.g. mid-page refresh or hash navigation)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sectionIds, offset])

  return activeId
}
