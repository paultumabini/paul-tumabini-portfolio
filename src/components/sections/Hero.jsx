/**
 * Above-the-fold intro: ambient background, headline, CTAs, and a decorative “typing” code card.
 *
 * Behaviour:
 * - `id="hero"` is the in-page anchor for the Navbar logo (scroll to top uses smooth scroll there too).
 * - A `useEffect` drives a typewriter loop over `HERO_CODE_SNIPPET`; respects `prefers-reduced-motion`
 *   by showing the full snippet immediately and skipping timers.
 * - `buildHighlightedRun` tokenizes the snippet so each character can get a Dracula-style class (`tok_*`).
 */
import { useState, useEffect, useMemo, useRef } from 'react'
import { personalInfo } from '../../data/portfolio'
import styles from './Hero.module.css'

const HERO_CODE_SNIPPET = `import scrapy

class PaulSpider(scrapy.Spider):
    name = "paul"
    
    def parse(self, response):
        yield {
            "role": "Full-Stack Dev",
            "skills": ["Python","Django",
                       "Scrapy","React"],
            "status": "available 🟢",
        }`

/**
 * Walks the Python-ish hero string once and emits `{ ch, kind }[]` for syntax-coloured spans.
 *
 * Lexing rules (order matters):
 * - Whitespace → `plain`
 * - Double-quoted strings → `str` (handles escaped `\"` naïvely)
 * - Identifiers → classified against small keyword / name sets (`kw`, `fun`, `cls`, …)
 * - Everything else → `punct`
 *
 * @param {string} source — Full snippet shown in the ghost `<pre>` (layout sizing).
 * @returns {{ ch: string, kind: string }[]}
 */
function buildHighlightedRun(source) {
  const run = []
  const KW = new Set(['import', 'class', 'def', 'yield'])
  let i = 0

  while (i < source.length) {
    const c = source[i]

    if (c === ' ' || c === '\n' || c === '\t') {
      run.push({ ch: c, kind: 'plain' })
      i += 1
      continue
    }

    if (c === '"') {
      let j = i + 1
      while (j < source.length) {
        if (source[j] === '"' && source[j - 1] !== '\\') break
        j += 1
      }
      const end = j < source.length ? j + 1 : j
      for (const ch of Array.from(source.slice(i, end))) run.push({ ch, kind: 'str' })
      i = end
      continue
    }

    if (/[a-zA-Z_]/.test(c)) {
      let j = i + 1
      while (j < source.length && /[a-zA-Z0-9_]/.test(source[j])) j += 1
      const word = source.slice(i, j)
      let kind = 'ident'
      if (KW.has(word)) kind = 'kw'
      else if (word === 'self') kind = 'self_kw'
      else if (word === 'parse') kind = 'fun'
      else if (word === 'PaulSpider' || word === 'Spider') kind = 'cls'
      else if (word === 'scrapy') kind = 'mod'
      for (const ch of Array.from(word)) run.push({ ch, kind })
      i = j
      continue
    }

    run.push({ ch: c, kind: 'punct' })
    i += 1
  }
  return run
}

/** Inline SVG (currentColor) for the GitHub ghost button. */
const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
)

/** Inline SVG for the LinkedIn ghost button. */
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

/** Small arrow paired with “View Projects” for visual affordance. */
const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

export default function Hero() {
  /** Precomputed token stream so we only lex the snippet once per mount. */
  const codeRun = useMemo(() => buildHighlightedRun(HERO_CODE_SNIPPET), [])
  const isAvailable = personalInfo.available
  const codeLen = codeRun.length
  /** How many characters of `codeRun` are visible in the animated `<pre>`. */
  const [typedLen, setTypedLen] = useState(0)
  const intervalRef = useRef(null)
  const pauseRef = useRef(null)
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  /**
   * Typewriter loop: after an initial delay, types one character every `typeMs` until the end,
   * pauses, then resets and repeats. Cleans up all timers on unmount or dependency change.
   */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setTypedLen(codeLen)
      return
    }

    const typeMs = 22
    const pauseAfterFullMs = 2800

    const clearTimers = () => {
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (pauseRef.current != null) {
        clearTimeout(pauseRef.current)
        pauseRef.current = null
      }
    }

    const runCycle = () => {
      setTypedLen(0)
      let n = 0
      intervalRef.current = window.setInterval(() => {
        n += 1
        setTypedLen(n)
        if (n >= codeLen) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
          pauseRef.current = window.setTimeout(() => {
            pauseRef.current = null
            runCycle()
          }, pauseAfterFullMs)
        }
      }, typeMs)
    }

    pauseRef.current = window.setTimeout(runCycle, 700)
    return () => {
      clearTimers()
    }
  }, [codeLen])

  /** Primary CTA: scrolls the viewport to `#projects` (must match `Projects` section id). */
  const handleScrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  /**
   * Circuit-board grid on canvas (decorative layer — stays under `.content` via z-index).
   *
   * - Grid line colours come from `globals.css` (`--hero-grid-line`, `--hero-grid-line-mid`) so
   *   light mode stays visible with a purple→green accent in the middle of each line.
   * - Opacity of the whole layer: `--hero-circuit-opacity` (same file).
   * - Pulses draw a radial bloom + short strokes on neighbouring grid paths so the glow “runs”
   *   along the wires, not only on the moving segment.
   * - Pulse travel uses elapsed time (px/s), not px/frame, so high-Hz phones keep the same pace as 60Hz.
   */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    /** Respect user accessibility settings: disable animation and render a static grid. */
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /** Base grid spacing in pixels; larger value = fewer lines and less draw work. */
    const CELL = 60
    /** Horizontal pulse color (purple) and vertical pulse color (green). */
    const PULSE_COLOR_H = 'rgba(108, 99, 255,'
    const PULSE_COLOR_V = 'rgba(0, 217, 163,'
    const RGB_H = '108, 99, 255'
    const RGB_V = '0, 217, 163'
    /** Caps branching pulses to avoid unbounded growth / performance drops. */
    const MAX_PULSES = 18
    /**
     * Pixels per second along wires (time-based for consistent pacing on any display refresh rate).
     * 60Hz reference: px/frame ≈ SPEED_PX_PER_SEC / 60 — e.g. 50 ≈ ~0.83 px/frame at 60Hz.
     */
    const SPEED_PX_PER_SEC = 50
    /** Fork attempts per second near intersections; scaled by dt so rate stays ~same at any FPS. */
    const FORK_RATE_PER_SEC = 0.24
    /**
     * Max simulated time per frame. Too low (e.g. 50ms) makes motion *lose* progress whenever the
     * main thread skips frames (load, GC, throttling) so it feels fine at first then “slows down”.
     */
    const MAX_DT_SEC = 0.25

    /** Cached geometry computed on resize and reused every frame. */
    let cols = 0
    let rows = 0
    let w = 0
    let h = 0
    /** Edge + centre stops for gradient grid (updated when theme changes). */
    let gridEdge = 'rgba(255,255,255,0.055)'
    let gridMid = 'rgba(108, 99, 255, 0.14)'

    /** Pull current theme colors from CSS variables so dark/light mode updates live. */
    const syncGridFromCss = () => {
      const cs = getComputedStyle(document.documentElement)
      const edge = cs.getPropertyValue('--hero-grid-line').trim()
      const mid = cs.getPropertyValue('--hero-grid-line-mid').trim()
      if (edge) gridEdge = edge
      if (mid) gridMid = mid
    }
    syncGridFromCss()

    /** React to theme switches (`data-theme` mutations) without remounting the component. */
    const themeObserver = new MutationObserver(() => {
      syncGridFromCss()
      /** In reduced-motion mode there is no RAF loop, so redraw once immediately. */
      if (reduced) drawStaticGrid()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    /** Keep canvas backing store synced with rendered size for crisp lines. */
    const resize = () => {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w
      canvas.height = h
      /** +1 ensures the far edge always has a final line after ceil rounding. */
      cols = Math.ceil(w / CELL) + 1
      rows = Math.ceil(h / CELL) + 1
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    /** @type {number | null} */
    let lastFrameTimeMs = null

    /** Spawn one pulse entering from left edge (horizontal) or top edge (vertical). */
    const makePulse = () => {
      const horiz = Math.random() > 0.5
      const col = Math.floor(Math.random() * cols)
      const row = Math.floor(Math.random() * rows)
      return {
        /** Start at edge and travel inward along one axis only. */
        x: horiz ? 0 : col * CELL,
        y: horiz ? row * CELL : 0,
        horiz,
        /** Trail length in pixels (2-5 cells) so pulses vary organically. */
        len: CELL * (2 + Math.random() * 3),
      }
    }

    /** Initial traffic density; each pulse may fork later at intersections. */
    const pulses = Array.from({ length: 6 }, makePulse)

    /** Soft bloom + strokes on adjacent grid lines so light travels along the mesh. */
    function drawSurroundingWireGlow(ctx, px, py, horiz) {
      const rgb = horiz ? RGB_H : RGB_V
      const snapX = Math.round(px / CELL) * CELL
      const snapY = Math.round(py / CELL) * CELL
      const spread = CELL * 2.5

      ctx.save()
      ctx.globalCompositeOperation = 'lighter'

      const rg = ctx.createRadialGradient(px, py, 0, px, py, spread)
      rg.addColorStop(0, `rgba(${rgb}, 0.24)`)
      rg.addColorStop(0.4, `rgba(${rgb}, 0.07)`)
      rg.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = rg
      ctx.fillRect(px - spread, py - spread, spread * 2, spread * 2)

      ctx.lineCap = 'round'
      for (let dist = 1; dist <= 2; dist++) {
        const alpha = 0.12 / dist
        ctx.strokeStyle = `rgba(${rgb}, ${alpha})`
        ctx.lineWidth = 1.5 + dist * 0.4
        ctx.shadowBlur = 8 + dist * 5
        ctx.shadowColor = `rgba(${rgb}, 0.5)`
        if (horiz) {
          for (const ox of [-CELL * dist, 0, CELL * dist]) {
            ctx.beginPath()
            ctx.moveTo(snapX + ox, snapY - CELL * 1.25)
            ctx.lineTo(snapX + ox, snapY + CELL * 1.25)
            ctx.stroke()
          }
          for (const oy of [-CELL * dist, CELL * dist]) {
            ctx.beginPath()
            ctx.moveTo(snapX - CELL * 1.25, snapY + oy)
            ctx.lineTo(snapX + CELL * 1.25, snapY + oy)
            ctx.stroke()
          }
        } else {
          for (const oy of [-CELL * dist, 0, CELL * dist]) {
            ctx.beginPath()
            ctx.moveTo(snapX - CELL * 1.25, snapY + oy)
            ctx.lineTo(snapX + CELL * 1.25, snapY + oy)
            ctx.stroke()
          }
          for (const ox of [-CELL * dist, CELL * dist]) {
            ctx.beginPath()
            ctx.moveTo(snapX + ox, snapY - CELL * 1.25)
            ctx.lineTo(snapX + ox, snapY + CELL * 1.25)
            ctx.stroke()
          }
        }
      }
      ctx.shadowBlur = 0
      ctx.restore()
    }

    /** Draw base wire mesh with center-weighted gradient on each line. */
    function drawGradientGrid(ctx) {
      ctx.lineWidth = 1
      for (let c = 0; c <= cols; c++) {
        const x = c * CELL
        const g = ctx.createLinearGradient(x, 0, x, h)
        g.addColorStop(0, gridEdge)
        g.addColorStop(0.5, gridMid)
        g.addColorStop(1, gridEdge)
        ctx.strokeStyle = g
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let r = 0; r <= rows; r++) {
        const y = r * CELL
        const g = ctx.createLinearGradient(0, y, w, y)
        g.addColorStop(0, gridEdge)
        g.addColorStop(0.5, gridMid)
        g.addColorStop(1, gridEdge)
        ctx.strokeStyle = g
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }
    }

    /**
     * @param {number} nowMs — DOMHighResTimeStamp from requestAnimationFrame; used for FPS-independent motion.
     */
    const draw = (nowMs) => {
      const ctx = canvas.getContext('2d')
      if (!ctx || w === 0) {
        /** Retry next frame until canvas has measurable size and 2D context is ready. */
        rafRef.current = requestAnimationFrame(draw)
        return
      }
      let dtSec = 0
      if (lastFrameTimeMs != null) {
        /** Avoid under-counting motion when frames are irregular; tab focus reset limits huge jumps. */
        dtSec = Math.min((nowMs - lastFrameTimeMs) / 1000, MAX_DT_SEC)
      }
      lastFrameTimeMs = nowMs
      const stepPx = SPEED_PX_PER_SEC * dtSec
      const nearIntersectPx = Math.max(stepPx * 2, 2)

      /** Full-frame redraw for deterministic layering: grid -> glow -> pulse head/trail. */
      ctx.clearRect(0, 0, w, h)
      drawGradientGrid(ctx)

      for (const p of pulses) {
        /** Move pulse by elapsed time; speed is `SPEED_PX_PER_SEC`. */
        if (p.horiz) p.x += stepPx
        else p.y += stepPx

        if (
          pulses.length < MAX_PULSES &&
          /** Chance scales with dt so high refresh rates don’t spawn extra forks. */
          Math.random() < FORK_RATE_PER_SEC * dtSec &&
          p.x % CELL < nearIntersectPx &&
          p.y % CELL < nearIntersectPx
        ) {
          /** Fork at current location and switch axis to create network-like flow. */
          const fork = { ...makePulse(), x: p.x, y: p.y }
          fork.horiz = !p.horiz
          pulses.push(fork)
        }

        drawSurroundingWireGlow(ctx, p.x, p.y, p.horiz)

        /** Build a fading trail: transparent tail -> bright leading edge. */
        const colorBase = p.horiz ? PULSE_COLOR_H : PULSE_COLOR_V
        const grad = p.horiz
          ? ctx.createLinearGradient(p.x - p.len, p.y, p.x, p.y)
          : ctx.createLinearGradient(p.x, p.y - p.len, p.x, p.y)

        grad.addColorStop(0, `${colorBase}0)`)
        grad.addColorStop(0.55, `${colorBase}0.5)`)
        grad.addColorStop(1, `${colorBase}0.95)`)

        /** Main trail stroke with soft shadow to simulate emitted light. */
        ctx.strokeStyle = grad
        ctx.lineWidth = 2
        ctx.shadowColor = p.horiz ? 'rgba(108,99,255,0.75)' : 'rgba(0,217,163,0.75)'
        ctx.shadowBlur = 14
        ctx.beginPath()
        if (p.horiz) {
          ctx.moveTo(p.x - p.len, p.y)
          ctx.lineTo(p.x, p.y)
        } else {
          ctx.moveTo(p.x, p.y - p.len)
          ctx.lineTo(p.x, p.y)
        }
        ctx.stroke()
        ctx.shadowBlur = 0

        // Leading dot: fixed-size soft halo (radial fill) + small solid core; no time-based pulse.
        const rgbHead = p.horiz ? '139,131,255' : '0,245,190'
        const rgbGlow = p.horiz ? '108,99,255' : '0,217,163'
        const haloR = 17 // outer radius of the head glow in CSS pixels

        ctx.save()
        ctx.globalCompositeOperation = 'lighter' // stack light on the grid without muddying darks
        const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloR)
        halo.addColorStop(0, `rgba(${rgbHead},0.52)`) // bright center of the halo
        halo.addColorStop(0.4, `rgba(${rgbGlow},0.24)`)
        halo.addColorStop(1, 'rgba(0,0,0,0)') // transparent edge
        ctx.fillStyle = halo
        ctx.beginPath()
        ctx.arc(p.x, p.y, haloR, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        ctx.fillStyle = `rgba(${rgbHead},0.98)` // crisp cap on the moving line
        ctx.shadowColor = `rgba(${rgbGlow},0.92)`
        ctx.shadowBlur = 24 // soft drop shadow reads as steady bloom, not animation
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]
        if (p.x > w + p.len || p.y > h + p.len) {
          /** Recycle off-screen pulses to keep count stable and avoid allocations growing forever. */
          pulses.splice(i, 1, makePulse())
        }
      }

      /** Continuous animation loop in motion-enabled mode. */
      rafRef.current = requestAnimationFrame(draw)
    }

    /** One-shot renderer used only when reduced motion is enabled. */
    function drawStaticGrid() {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      syncGridFromCss()
      const cw = canvas.width || canvas.offsetWidth
      const ch = canvas.height || canvas.offsetHeight
      if (cw === 0 || ch === 0) return
      const cCount = Math.ceil(cw / CELL) + 1
      const rCount = Math.ceil(ch / CELL) + 1
      ctx.clearRect(0, 0, cw, ch)
      cols = cCount
      rows = rCount
      w = cw
      h = ch
      drawGradientGrid(ctx)
    }

    if (!reduced) {
      /** After a tab is hidden, rAF can resume with a huge gap — skip that delta so we don’t spike or stall. */
      const onVisibilityChange = () => {
        if (document.visibilityState === 'visible') lastFrameTimeMs = null
      }
      document.addEventListener('visibilitychange', onVisibilityChange)

      /** Start animated mode. */
      rafRef.current = requestAnimationFrame(draw)

      return () => {
        document.removeEventListener('visibilitychange', onVisibilityChange)
        cancelAnimationFrame(rafRef.current)
        ro.disconnect()
        themeObserver.disconnect()
      }
    }

    drawStaticGrid()
    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      themeObserver.disconnect()
    }
  }, [])

  return (
    <section id="hero" className={styles.hero}>
      {/* Ambient background blobs */}
      <div className={styles.blobPurple} aria-hidden="true" />
      <div className={styles.blobGreen} aria-hidden="true" />
      {/* Circuit grid canvas */}
      <canvas ref={canvasRef} className={styles.circuitCanvas} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        <div className={styles.badge}>
          <span className={styles.statusDot} />
          <span className={styles.statusText}>
            {isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <h1 className={styles.headline}>
          <span className={styles.headlineTop}>Hi, I'm</span>
          <span className={styles.headlineName}>Paul Tumabini</span>
          <span className={styles.headlineRole}>
            <span className={styles.roleHighlight}>Web Scraping</span> &amp; Full-Stack Dev
          </span>
        </h1>

        <p className={styles.bio}>{personalInfo.bio}</p>

        {/* Specialty pills */}
        <div className={styles.pills}>
          {['Python · Scrapy · Django', 'Google Apps Script', 'React · TypeScript', 'Selenium · Playwright'].map(p => (
            <span key={p} className={styles.pill}>{p}</span>
          ))}
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.btnPrimary} onClick={handleScrollToProjects}>
            View Projects <ArrowIcon />
          </button>
          <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className={styles.btnGhost}>
            <GitHubIcon /> GitHub
          </a>
          <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className={styles.btnGhost}>
            <LinkedInIcon /> LinkedIn
          </a>
        </div>
      </div>

      {/* Floating code block decoration */}
      <div className={styles.codeCard} aria-hidden="true">
        <div className={styles.codeCardDots}>
          <span /><span /><span />
        </div>
        <div className={styles.codeBlockWrap}>
          {/* Invisible full source reserves height/width so the card never grows while typing */}
          <pre className={styles.codeBlockGhost}>{HERO_CODE_SNIPPET}</pre>
          <pre className={styles.codeBlock}>
            {codeRun.slice(0, typedLen).map((cell, idx) => (
              <span key={idx} className={styles[`tok_${cell.kind}`]}>{cell.ch}</span>
            ))}
            <span className={styles.codeCursor} />
          </pre>
        </div>
      </div>

      {/* Scroll indicator — three staggered animated chevrons */}
      <div className={styles.scrollIndicator} aria-hidden="true">
        <span className={styles.scrollLabel}>scroll</span>
        <div className={styles.scrollArrows}>
          {[0, 1, 2].map(i => (
            <svg
              key={i}
              className={styles.scrollArrow}
              width="18"
              height="10"
              viewBox="0 0 18 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ animationDelay: `${i * 0.22}s` }}
            >
              <polyline
                points="1,1 9,9 17,1"
                stroke="#8b83ff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ))}
        </div>
      </div>
    </section>
  )
}
