/**
 * Projects grid with client-side category filter (state `active` keys into `project.category`).
 * Each `ProjectCard` uses `useInView` so the card fades with viewport entry/exit.
 *
 * Data: rows come from `projects` in `portfolio.js` (order is display order; `id` is the React key).
 * Rows may be GitHub-only (`link`), live GAS apps (`liveLink`, optional `badge` / `credentials`), or both.
 * Optional `videoLink` renders a YouTube icon button + "Watch demo" CTA — add to any project in portfolio.js.
 */
import { useState } from 'react';
import { useInView } from '../../hooks/useInView';
import { projects } from '../../data/portfolio';
import SectionHeader from '../ui/SectionHeader';
import Badge from '../ui/Badge';
import styles from './Projects.module.css';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'python', label: '🐍 Python' },
  { key: 'scraping', label: '🕷️ Scraping' },
  { key: 'automation', label: '🔧 Automation' },
  { key: 'gaswebapp', label: '⚡ GAS Web Apps' },
  { key: 'webapp', label: '🌐 Web App' },
];

/**
 * Normalizes `project.category` to an array so filters support either:
 * - `category: 'scraping'`
 * - `category: ['scraping', 'automation']`
 */
const getProjectCategories = project =>
  Array.isArray(project.category) ? project.category : [project.category];

/** “Open in new window” affordance beside each project title. */
const ExternalIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

/** Shown in the featured ribbon for `project.featured` cards. */
const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const KeyIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

/**
 * One project tile: title, description, tags; optional featured ribbon, live badge, demo credentials.
 *
 * @param {object} props
 * @param {{
 *   id: number,
 *   title: string,
 *   description: string,
 *   tags: string[],
 *   category: string | string[],
 *   link: string | null,
 *   liveLink: string | null,
 *   videoLink?: string,
 *   featured?: boolean,
 *   badge?: string,
 *   credentials?: { user: string, pass: string },
 * }} props.project — Shape from `portfolio.js`; `link` / `liveLink` / `videoLink` can be omitted when not applicable.
 * @param {number} props.index — Staggers `transitionDelay` for entrance animation (`index % 3`).
 */
function ProjectCard({ project, index }) {
  const { ref, inView } = useInView();
  /** Adds `.gasCard` styles for Google Apps Script deployments (distinct from GitHub-only scrapers). */
  const isGas = getProjectCategories(project).includes('gaswebapp');
  const badgeText = project.badge || 'Personal';

  return (
    <article
      ref={ref}
      className={`${styles.card} ${inView ? styles.visible : ''} ${project.featured ? styles.featured : ''} ${isGas ? styles.gasCard : ''}`}
      style={{ transitionDelay: `${(index % 3) * 0.08}s` }}
    >
      {/* Top row: badges + link icons */}
      <div className={styles.cardTop}>
        <div className={styles.badgeRow}>
          {project.featured && (
            <div className={styles.featuredMark}>
              <StarIcon /> Featured
            </div>
          )}
          {badgeText && (
            <div className={styles.liveMark}>
              {badgeText.startsWith('Live') && (
                <span className={styles.liveDot} aria-hidden="true" />
              )}
              {badgeText}
            </div>
          )}
        </div>
        {/* Icon row: video → live → GitHub (left-to-right visual priority) */}
        <div className={styles.linkIcons}>
          {project.videoLink && (
            <a
              href={project.videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.iconBtn} ${styles.videoBtn}`}
              aria-label={`Watch ${project.title} demo video`}
              title="Watch demo video"
            >
              <YouTubeIcon />
            </a>
          )}
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.iconBtn} ${styles.liveBtn}`}
              aria-label={`Open ${project.title} live app`}
              title="Open live app"
            >
              <ExternalIcon />
            </a>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconBtn}
              aria-label={`View ${project.title} on GitHub`}
              title="View on GitHub"
            >
              <GitHubIcon />
            </a>
          )}
        </div>
      </div>

      <h3 className={styles.cardTitle}>{project.title}</h3>
      <p className={styles.cardDesc}>{project.description}</p>

      {/* Credentials hint for login-protected apps */}
      {project.credentials && (
        <div className={styles.credsPill}>
          <KeyIcon />
          <span>
            Demo — user: <code>{project.credentials.user}</code> / pass:{' '}
            <code>{project.credentials.pass}</code>
          </span>
        </div>
      )}

      <div className={styles.cardTags}>
        {project.tags.map(tag => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>

      {/* CTA buttons — only renders when at least one action link exists */}
      {(project.liveLink || project.videoLink) && (
        <div className={styles.ctaRow}>
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.demoBtn}
            >
              Open live app <ExternalIcon />
            </a>
          )}
          {project.videoLink && (
            <a
              href={project.videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.watchBtn}
            >
              <YouTubeIcon /> Watch demo
            </a>
          )}
        </div>
      )}
    </article>
  );
}

/**
 * Projects grid with category filter tabs. State `active` holds a `FILTERS.key` or `'all'`.
 *
 * Filtering is derived (`filtered`) so the source of truth remains `projects` from `portfolio.js`.
 */
export default function Projects() {
  const [active, setActive] = useState('all');

  const filtered =
    active === 'all'
      ? projects
      : projects.filter(p => getProjectCategories(p).includes(active));

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeader
          label="03 / Projects"
          title="Things I've built."
          subtitle="A selection of projects across web scraping, data pipelines, and web applications."
        />

        {/* Filter tabs */}
        <div className={styles.filters} role="tablist">
          {FILTERS.map(f => (
            <button
              key={f.key}
              role="tab"
              aria-selected={active === f.key}
              className={`${styles.filterBtn} ${active === f.key ? styles.filterActive : ''}`}
              onClick={() => setActive(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        <div className={styles.githubCta}>
          <a
            href="https://github.com/paultumabini?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubBtn}
          >
            View all repositories on GitHub → {/* ← bump this when you push a new repo */}
          </a>
        </div>
      </div>
    </section>
  );
}
