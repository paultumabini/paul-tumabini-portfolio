import { useState, useEffect, useRef } from 'react'

/**
 * IntersectionObserver-driven visibility for scroll-triggered animations.
 *
 * @param {Object} [options]
 * @param {boolean} [options.once=false] — If true, `inView` becomes true on first intersection then the observer disconnects. If false (default), `inView` tracks `entry.isIntersecting` so content can fade out when leaving the viewport and fade in again when it returns.
 * @param {IntersectionObserverInit} [observerOptions] — threshold, rootMargin, etc.
 * @returns {{ ref: import('react').RefObject<HTMLElement | null>, inView: boolean }}
 *   — Attach `ref` to the DOM node to observe; `inView` updates as intersection changes (unless `once`).
 */
export function useInView(options = {}) {
  const { once = false, ...observerOptions } = options
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (once) {
          if (entry.isIntersecting) {
            setInView(true)
            observer.disconnect()
          }
        } else {
          setInView(entry.isIntersecting)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px', ...observerOptions }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  return { ref, inView }
}
