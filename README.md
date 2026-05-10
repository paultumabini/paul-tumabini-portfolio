# Paul Tumabini — Developer Portfolio

Personal portfolio site built with **React** and **Vite**: dark/light theme, responsive navigation, scroll-spy, filterable projects, and content driven from a single data file.

**Live site:** [paul-tumabini-portfolio.vercel.app](https://paul-tumabini-portfolio.vercel.app/)

---

## Features

- Dark / light theme (persisted in `localStorage`)
- Responsive nav with hamburger menu and scroll-spy active sections
- Scroll-triggered section reveals (`IntersectionObserver`)
- Animated skill bars and filterable project grid
- CSS Modules, no runtime CSS-in-JS

---

## Quick start

**Requirements:** Node.js 18+ and npm (or yarn/pnpm).

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
npm install
npm run dev
```

Open **http://localhost:5173**.

| Command | Description |
|--------|-------------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |

---

## Project structure

```
src/
├── components/
│   ├── layout/       # Navbar, Footer
│   ├── sections/     # Hero, About, Skills, Projects, Contact
│   └── ui/           # ThemeToggle, Badge, SectionHeader
├── context/          # ThemeContext
├── data/
│   └── portfolio.js  # All copy, links, projects — edit here
├── hooks/            # useScrollSpy, useInView
├── styles/
│   └── globals.css   # CSS variables, themes
├── App.jsx
└── main.jsx
```

---

## Customising content

Edit **`src/data/portfolio.js`** for name, bio, social links, skills, projects, and experience.

To add a section:

1. Add `src/components/sections/YourSection.jsx` and `YourSection.module.css`
2. Import and render it in `src/App.jsx`
3. Add a nav item in `src/components/layout/Navbar.jsx`

**Theme colours:** `src/styles/globals.css` — adjust `--accent` (and related variables) under `:root` and `[data-theme="light"]`.

---

## Deploying

This is a static SPA after `npm run build` (output in `dist/`). Common options:

| Platform | Notes |
|----------|--------|
| [Cloudflare Pages](https://pages.cloudflare.com/) | Free tier, fast CDN; connect the GitHub repo or upload `dist` |
| [Netlify](https://www.netlify.com/) | Free tier; drag-and-drop `dist` or Git integration |
| [Vercel](https://vercel.com/) | Free tier; good for Vite projects |
| [GitHub Pages](https://pages.github.com/) | Free for public repos; if the site is served from a **project** URL (`username.github.io/repo-name/`), set `base` in `vite.config.js` to `'/repo-name/'` and use a Pages action or deploy the `dist` contents |

If your production URL changes, update the **Live site** link at the top of this README.

---

## Tech stack

- React 18, Vite 5
- CSS Modules
- Lucide React (icons)
- Google Fonts: Syne, DM Mono, DM Sans

---

## License

This repository is personal portfolio source code. If you fork it for your own site, replace all content in `portfolio.js` and adjust branding as needed.
