# Portfolio Architecture Guide

A complete reference for how this app is wired — from entry point to every component, hook, and data file. Use this whenever you need to know where a function lives, what a file exports, or how data flows through the UI.

---

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [Entry Point Chain](#entry-point-chain)
3. [Data Layer](#data-layer)
4. [Context](#context)
5. [Hooks](#hooks)
6. [Layout Components](#layout-components)
7. [Section Components](#section-components)
8. [UI Components](#ui-components)
9. [CSS Architecture](#css-architecture)
10. [Full Data Flow Diagram](#full-data-flow-diagram)
11. [Quick Reference: Where Is X?](#quick-reference-where-is-x)
12. [How to Add or Change Content](#how-to-add-or-change-content)

---

## Directory Structure

```
src/
├── main.jsx                        # Entry point — mounts React into the DOM
├── App.jsx                         # Root layout — wraps everything in ThemeProvider
│
├── styles/
│   └── globals.css                 # Design tokens (:root), resets, shared keyframes
│
├── context/
│   └── ThemeContext.jsx            # Theme state (dark/light) + useTheme() hook
│
├── hooks/
│   ├── useInView.js                # IntersectionObserver — scroll-triggered visibility
│   └── useScrollSpy.js            # Tracks which section is in the viewport (nav highlight)
│
├── data/
│   ├── portfolio.js                # ALL content: personalInfo, skills, projects, experiences
│   └── techStack.js               # Tech chip list for the Skills marquee
│
└── components/
    ├── layout/
    │   ├── Navbar.jsx              # Fixed top nav — desktop links + mobile drawer
    │   ├── Navbar.module.css
    │   ├── Footer.jsx              # Brand mark, copyright, social links
    │   └── Footer.module.css
    │
    ├── sections/                   # One file per page section (render order = App.jsx order)
    │   ├── Hero.jsx                # Above-the-fold: canvas, typewriter code card, CTAs
    │   ├── Hero.module.css
    │   ├── About.jsx               # Stats grid + narrative + interest cards
    │   ├── About.module.css
    │   ├── Skills.jsx              # Skill cards + tech stack marquee
    │   ├── Skills.module.css
    │   ├── Projects.jsx            # Filterable project grid
    │   ├── Projects.module.css
    │   ├── Experience.jsx          # Timeline of work history
    │   ├── Experience.module.css
    │   ├── Contact.jsx             # Contact cards + CTA panel
    │   └── Contact.module.css
    │
    └── ui/                         # Reusable micro-components
        ├── SectionHeader.jsx       # Eyebrow label + title + subtitle with scroll animation
        ├── SectionHeader.module.css
        ├── Badge.jsx               # Coloured pill tag (used on project and experience cards)
        ├── Badge.module.css
        ├── ThemeToggle.jsx         # Pill switch for dark/light mode
        └── ThemeToggle.module.css
```

---

## Entry Point Chain

```
public/index.html  →  <div id="root">
        │
        ▼
src/main.jsx
  - Imports globals.css (loads design tokens before first paint)
  - Calls createRoot().render()
  - Wraps <App /> in React <StrictMode>
        │
        ▼
src/App.jsx
  - Wraps everything in <ThemeProvider>  ← ThemeContext.jsx
  - Renders: <Navbar /> + <main> + <Footer />
  - Section order inside <main>:
      <Hero />  →  <About />  →  <Skills />  →  <Projects />  →  <Experience />  →  <Contact />
```

Every section `<section>` element has a matching `id` attribute (`"hero"`, `"about"`, `"skills"`, `"projects"`, `"experience"`, `"contact"`) — these must stay in sync with `NAV_LINKS` in `Navbar.jsx` or smooth-scroll and scroll-spy will break.

---

## Data Layer

### `src/data/portfolio.js`

The single source of truth for all portfolio content. Every section component imports from here.

| Export | Type | Used by |
|---|---|---|
| `personalInfo` | Object | `Hero`, `About`, `Contact`, `Footer`, `Navbar` |
| `skills` | Array of objects | `Skills` |
| `projects` | Array of objects | `Projects` |
| `experiences` | Array of objects | `Experience` |

#### `personalInfo` shape
```js
{
  name: string,
  title: string,
  tagline: string,
  bio: string,
  email: string,         // used in Contact mailto: links
  location: string,
  linkedin: string,      // URL
  github: string,        // URL — also used in Navbar + Footer
  available: boolean,    // drives the "Available" badge in Hero + Contact
}
```

#### `skills[]` item shape
```js
{
  category: string,      // Card heading
  featured: boolean,     // Shows "Featured Skill" badge
  icon: string,          // Icon name (visual only)
  color: 'green' | 'orange' | 'accent',  // CSS color variant
  items: [{ name: string, level: number }]  // 0–100; drives progress bar width
}
```

#### `projects[]` item shape
```js
{
  id: number,
  title: string,
  description: string,
  tags: string[],
  category: string | string[],  // must match FILTERS keys in Projects.jsx
  link: string | null,          // GitHub URL
  liveLink: string | null,      // Deployed app URL
  videoLink: string | null,     // YouTube demo URL (optional)
  featured: boolean,
  badge: string,                // e.g. 'Work Project', 'Live · Full-Stack'
  credentials: { user: string, pass: string } | undefined,
  companyNote: string | undefined,
}
```

Valid `category` keys (must match `FILTERS` in `Projects.jsx`):
`'python'` | `'scraping'` | `'automation'` | `'gaswebapp'` | `'webapp'`

#### `experiences[]` item shape
```js
{
  id: number,
  role: string,
  specialisms: string,          // e.g. 'Web Scraping · Django'
  company: string,
  companyNote: string | undefined,  // e.g. 'formerly AIM Experts — acquired Sep 2021'
  period: string,               // e.g. 'May 2017 - Aug 2024'
  periodStart: string,          // e.g. 'May 2017'
  type: string,                 // e.g. 'Full-time'
  current: boolean,             // shows green "Current role" pill
  summary: string,
  highlights: string[],         // bullet points
  tags: string[],
  liveProjects: [{ label, url, credentials? }] | undefined,
  workProjects:  [{ label, url, description, tags }] | undefined,
}
```

---

### `src/data/techStack.js`

```js
export const techStackItems = [{ name: string, slug: string | null }]
```

- `slug` is the [Simple Icons](https://simpleicons.org/) CDN identifier — used to load `<img src="https://cdn.simpleicons.org/{slug}">` in `Skills.jsx`.
- `slug: null` triggers the Lucide `<Layers>` fallback icon (use for tools not on Simple Icons).
- Imported only by `Skills.jsx`.

---

## Context

### `src/context/ThemeContext.jsx`

**Exports:**
| Export | What it is |
|---|---|
| `ThemeProvider` | Wrap the app in this to enable theming |
| `useTheme()` | Hook — returns `{ theme: 'dark' \| 'light', toggle: () => void }` |

**How it works:**
1. Reads initial theme from `localStorage` (key: `'portfolio-theme'`), defaults to `'dark'`
2. On every change, writes `data-theme="dark|light"` to `<html>` — this is how CSS variables in `globals.css` swap between palettes
3. Also persists back to `localStorage` so the user's choice survives page reloads

**Used by:** `App.jsx` (wraps), `ThemeToggle.jsx` (reads + calls toggle), `Hero.jsx` (canvas reads CSS variables which depend on `data-theme`)

---

## Hooks

### `src/hooks/useInView.js`

```js
export function useInView(options = {}) → { ref, inView }
```

Wraps `IntersectionObserver`. Attach `ref` to a DOM node; `inView` becomes `true` when the node enters the viewport.

**Options:**
| Key | Default | Effect |
|---|---|---|
| `once` | `false` | If `true`, fires once then disconnects (element stays visible forever) |
| `threshold` | `0.1` | Fraction of element visible to trigger |
| `rootMargin` | `'0px 0px -60px 0px'` | Shrinks the viewport bottom by 60 px (triggers slightly before full visibility) |

**Used by:** `SectionHeader`, `About`, `Skills` (SkillCard), `Projects` (ProjectCard), `Experience` (ExperienceCard), `Contact`

**Pattern:**
```jsx
const { ref, inView } = useInView()
<div ref={ref} className={inView ? styles.visible : ''}>
```

---

### `src/hooks/useScrollSpy.js`

```js
export function useScrollSpy(sectionIds: string[], offset = 100) → string
```

Listens to `window.scroll` and returns the `id` of the section currently occupying the upper viewport. Used by `Navbar` to highlight the active nav link.

**How it works:** Walks `sectionIds` from bottom to top and picks the first whose `offsetTop − offset ≤ scrollY`. The `offset` (100 px) accounts for the fixed navbar height.

**Used by:** `Navbar.jsx` only.

> ⚠️ `SECTION_IDS` in `Navbar.jsx` is a module-level constant (not computed inline) to prevent the `useEffect` inside `useScrollSpy` from re-running on every Navbar render.

---

## Layout Components

### `src/components/layout/Navbar.jsx`

**State:**
| Variable | Type | Purpose |
|---|---|---|
| `open` | boolean | Mobile drawer open/closed |
| `scrolled` | boolean | Adds glass blur after 20 px scroll |
| `activeId` | string | From `useScrollSpy` — highlights the active nav link |

**Key constants:**
```js
const NAV_LINKS = [{ id, label }]     // section ids + display labels
const SECTION_IDS = NAV_LINKS.map(l => l.id)  // stable array for useScrollSpy
```

**Imports from:** `useScrollSpy`, `personalInfo` (GitHub URL), `ThemeToggle`

**Behaviour:**
- Desktop: inline link row + GitHub CTA button + `ThemeToggle`
- Mobile (≤768 px): hamburger button → off-canvas drawer with staggered `slideIn` animation
- Clicking a nav link calls `document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })`
- Backdrop click closes the drawer
- Window resize past 768 px auto-closes the drawer

---

### `src/components/layout/Footer.jsx`

Simple static component. Imports `personalInfo` for GitHub and LinkedIn URLs. `new Date().getFullYear()` keeps the copyright year current automatically.

---

## Section Components

### `src/components/sections/Hero.jsx`

The most complex component. Contains three independent systems:

**1. Circuit canvas animation**
- A `<canvas>` element covers the full hero background
- `useEffect` drives a `requestAnimationFrame` loop drawing a gradient grid and animated "pulse" dots that travel along grid lines
- Colours (`--hero-grid-line`, `--hero-grid-line-mid`) are read from CSS custom properties so they update when the theme switches — a `MutationObserver` watches `data-theme` on `<html>`
- `prefers-reduced-motion`: renders a static grid only, no RAF loop

**2. Typewriter code card**
- `HERO_CODE_SNIPPET` is a Python Scrapy spider string
- `buildHighlightedRun(source)` tokenizes it into `{ ch, kind }[]` on mount (`useMemo`)
- A `setInterval` increments `typedLen` by 1 every 22 ms; when complete, pauses 2.8 s then resets
- Each character is rendered as a `<span className={styles['tok_' + kind]}>` — Dracula syntax colours in CSS
- `prefers-reduced-motion`: shows the full snippet immediately

**3. CTAs and layout**
- "View Projects" button calls `document.getElementById('projects')?.scrollIntoView()`
- GitHub and LinkedIn links come from `personalInfo`
- `personalInfo.available` drives the green "Available" status badge

**Imports from:** `personalInfo` from `portfolio.js`

---

### `src/components/sections/About.jsx`

Two-column layout: narrative text (left) + stats + interest cards (right).

- `stats` and `interests` are local arrays defined at the top of the file (not in `portfolio.js` — they are UI-specific)
- `useInView` on the grid container triggers `.visible` which fires CSS transitions: narrative slides from left, aside slides from right
- Imports `personalInfo` for GitHub and LinkedIn `href` values

**To update the stats**, edit the `stats` array directly in `About.jsx`:
```js
const stats = [
  { value: '6+', label: 'Years Coding' },
  ...
]
```

---

### `src/components/sections/Skills.jsx`

Three sub-components + one parent:

| Component | Props | Purpose |
|---|---|---|
| `SkillBar` | `name, level, inView, delay` | One progress bar row |
| `SkillCard` | spread from `skills[]` + `gridIndex` | One category card with bars |
| `TechChip` | `name, slug` | One chip in the marquee |
| `MarqueeRow` | `items, direction` | One scrolling row of chips |

**Data flow:**
```
portfolio.js → skills[]  →  SkillCard  →  SkillBar
techStack.js → techStackItems  →  split into row1/row2/row3  →  MarqueeRow  →  TechChip
```

`gridIndex % 2` determines whether a card slides in from the left or right.

The three marquee rows alternate direction (`left`, `right`, `left`) and speed (55 s, 60 s, 55 s) so they feel independent. Items are doubled in `MarqueeRow` and the keyframe animates exactly `-50%` for a seamless loop.

---

### `src/components/sections/Projects.jsx`

**Filter system:**
```js
const FILTERS = [{ key, label }]  // keys must match project.category values
```
State `active` holds the selected filter key. `filtered` is a derived array — no separate state.

```js
const filtered = active === 'all'
  ? projects
  : projects.filter(p => getProjectCategories(p).includes(active))
```

`getProjectCategories` normalises `project.category` to always be an array so filters work whether `category` is a string or `string[]`.

**`ProjectCard` renders conditionally:**
| Field present | What renders |
|---|---|
| `project.videoLink` | YouTube icon button (top-right) + "Watch demo" CTA button |
| `project.liveLink` | External-link icon button (top-right) + "Open live app" CTA button |
| `project.link` | GitHub icon button (top-right) |
| `project.credentials` | Credentials pill with user/pass |
| `project.featured` | "Featured" ribbon |
| `project.badge.startsWith('Live')` | Pulsing green dot in the live mark |

**Imports from:** `projects` from `portfolio.js`

---

### `src/components/sections/Experience.jsx`

**Helper functions:**

```js
parseMonthYear(str) → { year, month } | null
```
Parses `"May 2017"` into `{ year: 2017, month: 4 }` (0-indexed month). Returns `null` on unrecognised input.

```js
calcTenure(periodStr) → string | null
```
Computes a LinkedIn-style duration label (`"7 yrs 3 mos"`) from a period string like `"May 2017 - Aug 2024"`. Handles `"Present"` as the current month. Inclusive month counting (same month = "1 mo").

**`ExperienceCard` renders conditionally:**
| Field present | What renders |
|---|---|
| `exp.current` | Green "Current role" pulsing pill |
| `exp.companyNote` | Small mono line below company/period (e.g. acquisition note) |
| `exp.workProjects` | GitHub chip links |
| `exp.liveProjects` | Orange live tool buttons + optional credential row |

**Imports from:** `experiences` from `portfolio.js`

---

### `src/components/sections/Contact.jsx`

**`contactLinks` array** is defined locally in the file (not in `portfolio.js`):
```js
const contactLinks = [
  { label, value, href, icon, color }  // href: null renders plain text (e.g. location)
]
```

- Email row is active and pulls `personalInfo.email`
- Location row has `href: null` — renders as `<span>` not `<a>`
- The CTA panel's "Send me an email" button uses `href={\`mailto:${personalInfo.email}\`}`

**Imports from:** `personalInfo` from `portfolio.js`

---

## UI Components

### `SectionHeader`

```jsx
<SectionHeader
  label="01 / About"        // mono eyebrow text
  title="Turning data..."   // display heading
  subtitle="..."            // optional prose (omit to hide)
  align="left"              // 'left' (default) | 'center'
/>
```

Has its own `useInView` instance. When in view, CSS transitions fire sequentially: label rises first (0.04 s delay), title clip-reveals (0.1 s), subtitle fades (0.2 s). All motion is suppressed by `prefers-reduced-motion`.

---

### `Badge`

```jsx
<Badge color="default">Python</Badge>  // color: 'default' | 'green' | 'orange'
```

Used on `ProjectCard` (always `default`) and `ExperienceCard` (`color="default"`).

---

### `ThemeToggle`

Reads `{ theme, toggle }` from `useTheme()`. Renders a pill track with a sliding thumb. The thumb icon shows the *current* mode's icon; `aria-label` describes what clicking will *switch to*.

---

## CSS Architecture

### Design tokens — `globals.css`

All colours, spacing, fonts, and transitions are CSS custom properties on `:root` (dark theme) with overrides on `[data-theme="light"]`. **Never hard-code hex values in component CSS** — always use `var(--*)`.

| Token group | Examples |
|---|---|
| Backgrounds | `--bg-primary`, `--bg-secondary`, `--bg-card` |
| Text | `--text-primary`, `--text-secondary`, `--text-muted` |
| Accent | `--accent`, `--accent-bright`, `--accent-dim`, `--accent-glow` |
| Status colours | `--green`, `--green-dim`, `--orange`, `--orange-dim` |
| Borders | `--border`, `--border-hover` |
| Typography | `--font-display` (Syne), `--font-mono` (DM Mono), `--font-body` (DM Sans) |
| Motion | `--transition` (0.25 s ease), `--transition-slow` (0.5 s ease) |
| Radii | `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl` |

### Shared keyframes — `globals.css`

| Keyframe | Used by |
|---|---|
| `fadeUp` | Hero content stagger, `.animate-fade-up` utility |
| `fadeIn` | Hero canvas, Hero code card, Navbar backdrop |
| `pulse-glow` | Status dots across Hero, Projects, Experience, Contact |
| `float` | Hero code card continuous float |
| `spin-slow` | Available for decorative use |
| `blink` | Available for cursor use |

### Shared layout classes — `globals.css`

```css
.container    /* max-width: 1100px, centred, horizontal padding */
.section      /* padding: 7rem 0 */
.section-label    /* mono uppercase eyebrow (used by SectionHeader) */
.section-title    /* Syne display heading with clamp() */
.section-subtitle /* body prose with max-width */
```

### CSS Modules pattern

Every component has a co-located `ComponentName.module.css`. Classes are imported as `styles` and applied via template literals:

```jsx
import styles from './Component.module.css'
<div className={`${styles.card} ${isActive ? styles.active : ''}`}>
```

---

## Full Data Flow Diagram

```
src/data/portfolio.js
│
├─ personalInfo ──────────────────────────────────────────────────┐
│   name, bio, email, github, linkedin, available                  │
│   └── Hero (bio, github, linkedin, available)                    │
│   └── About (github, linkedin)                                   │
│   └── Navbar (github)                                            │
│   └── Footer (github, linkedin)                                  │
│   └── Contact (email, linkedin, location, available)             │
│                                                                   │
├─ skills[] ──────────────────────────────────────────────────────┤
│   category, items[{name, level}], color, featured               │
│   └── Skills → SkillCard → SkillBar                             │
│                                                                   │
├─ projects[] ────────────────────────────────────────────────────┤
│   id, title, description, tags, category,                       │
│   link, liveLink, videoLink, featured, badge, credentials       │
│   └── Projects → filtered[] → ProjectCard                       │
│                                                                   │
└─ experiences[] ─────────────────────────────────────────────────┘
    id, role, company, period, highlights,
    liveProjects, workProjects, tags
    └── Experience → ExperienceCard
            └── calcTenure(period) → tenure string


src/data/techStack.js
│
└─ techStackItems[] ──────────────────────────────────────────────
    {name, slug}
    └── Skills → row1/row2/row3 → MarqueeRow → TechChip


src/context/ThemeContext.jsx
│
└─ ThemeProvider (App.jsx wraps entire tree)
    ├── writes data-theme to <html>  ←  globals.css reads this
    └─ useTheme() ──────────────────────────────────────────────
        └── ThemeToggle (reads theme, calls toggle)
        └── Hero canvas (reads CSS vars that depend on data-theme)


src/hooks/useInView.js
└── IntersectionObserver
    └── SectionHeader, About, Skills/SkillCard,
        Projects/ProjectCard, Experience/ExperienceCard, Contact

src/hooks/useScrollSpy.js
└── window.scroll listener
    └── Navbar (activeId → highlights nav links)
```

---

## Quick Reference: Where Is X?

| What you want to find | Where to look |
|---|---|
| Your name, bio, location | `portfolio.js` → `personalInfo` |
| Email address | `portfolio.js` → `personalInfo.email` |
| GitHub / LinkedIn URLs | `portfolio.js` → `personalInfo.github / .linkedin` |
| "Available for work" toggle | `portfolio.js` → `personalInfo.available` (boolean) |
| Add / edit a project | `portfolio.js` → `projects[]` |
| Add a YouTube demo video | `portfolio.js` → `projects[n].videoLink` |
| Add / edit work experience | `portfolio.js` → `experiences[]` |
| Edit skill levels | `portfolio.js` → `skills[n].items[n].level` |
| Add a tech chip to the marquee | `techStack.js` → `techStackItems` |
| Change nav links | `Navbar.jsx` → `NAV_LINKS` |
| Change section order | `App.jsx` → order of section components in `<main>` |
| About page stats (years, repos) | `About.jsx` → `stats[]` |
| About page interests | `About.jsx` → `interests[]` |
| Contact card list | `Contact.jsx` → `contactLinks[]` |
| Project filter tabs | `Projects.jsx` → `FILTERS[]` |
| Hero code snippet | `Hero.jsx` → `HERO_CODE_SNIPPET` |
| Design tokens (colours, fonts) | `styles/globals.css` → `:root` and `[data-theme="light"]` |
| Scroll animation timing | `useInView.js` → `threshold`, `rootMargin` options |
| Nav scroll-spy offset | `useScrollSpy.js` → `offset` parameter (default 100 px) |
| Theme persistence key | `ThemeContext.jsx` → `localStorage.getItem('portfolio-theme')` |

---

## How to Add or Change Content

### Add a new project

In `portfolio.js`, add an object to `projects[]`:

```js
{
  id: 8,                             // must be unique
  title: 'My New Project',
  description: '...',
  tags: ['Python', 'Django'],
  category: ['webapp', 'python'],    // must match FILTERS keys in Projects.jsx
  link: 'https://github.com/...',    // or null
  liveLink: 'https://...',           // or null
  videoLink: 'https://youtu.be/...', // or omit entirely
  featured: true,
  badge: 'Live · Full-Stack',
  credentials: { user: 'demo', pass: 'demo123' },  // or omit
}
```

### Add a new project filter tab

In `Projects.jsx`, add to `FILTERS[]`:
```js
{ key: 'newkey', label: '🔑 New Category' }
```
Then add `'newkey'` to the `category` array of any relevant projects in `portfolio.js`.

### Add a YouTube demo video to a project

In `portfolio.js`, add `videoLink` to an existing project:
```js
videoLink: 'https://youtu.be/YOUR_VIDEO_ID',
```

### Update work experience

Edit the object in `portfolio.js → experiences[]`. The tenure duration is computed automatically from `period` by `calcTenure()` in `Experience.jsx` — you don't need to update it manually.

### Change the theme default

In `ThemeContext.jsx`:
```js
const stored = localStorage.getItem('portfolio-theme')
return stored || 'light'  // change 'dark' to 'light'
```

### Add a new skill category card

In `portfolio.js → skills[]`, add:
```js
{
  category: 'DevOps',
  featured: false,
  icon: 'server',
  color: 'accent',         // 'green' | 'orange' | 'accent'
  items: [
    { name: 'Docker', level: 72 },
  ],
}
```

### Add a new contact card

In `Contact.jsx → contactLinks[]`, add:
```js
{
  label: 'Twitter',
  value: '@yourhandle',
  href: 'https://twitter.com/yourhandle',
  icon: <TwitterIcon />,
  color: 'accent',          // 'default' | 'accent' | 'green' | 'orange'
},
```
Also add a matching `.color_twitter` hover rule in `Contact.module.css` if you want a custom tint.
