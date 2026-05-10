/**
 * Experience section: timeline of work history driven by `experiences` in `portfolio.js`.
 *
 * Each `ExperienceCard` renders a role, company, computed tenure, contribution bullets,
 * and optional GitHub / live-project links. `useInView` triggers a slide-in animation
 * when the card enters the viewport.
 *
 * `calcTenure` computes a LinkedIn-style label ("7 yrs 4 mos") from the `period` string.
 */
import { useInView } from '../../hooks/useInView'
import { experiences } from '../../data/portfolio'
import SectionHeader from '../ui/SectionHeader'
import Badge from '../ui/Badge'
import styles from './Experience.module.css'

/** Small GitHub mark used in repository link chips. */
const GitHubIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
)

/** External-link glyph shared by live and GitHub project links. */
const ExternalIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)

/** Check mark for each contribution bullet. */
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

/** Tiny label icons used in the live-project login hint. */
const UserIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21a8 8 0 0 0-16 0" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const KeyIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
)

/** Map pin for company location. */
const MapPinIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

/** Timeline marker icon at the left spine. */
const BriefcaseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
)


/**
 * Array of month names for quick lookup.
 * Uses Date.toLocaleString with month: 'short' to get "Jan", "Feb", etc.
 * @type {string[]}
 */
const MONTHS = Array.from({ length: 12 }, (v, i) => 
  new Date(0, i).toLocaleString('en-US', { month: 'short' })
); 

/**
 * Parse a "Mon YYYY" string into a `{ year, month }` object (month is 0-indexed).
 * Returns `null` for any unrecognised format so callers can bail out gracefully.
 *
 * @param {string | null | undefined} str — e.g. `"May 2017"`, `"Aug 2024"`
 * @returns {{ year: number, month: number } | null}
 */
function parseMonthYear(str) {
  if (!str) return null
  const cleaned = str.trim()  
  const [mon, year] = cleaned.split(/\s+/) 
  const month = MONTHS.indexOf(mon.charAt(0).toUpperCase() + mon.slice(1).toLowerCase()) 
  const y = Number.parseInt(year, 10)
  if (month === -1 || Number.isNaN(y)) return null
  return { year: y, month }
}

/**
 * Compute a LinkedIn-style tenure label from a period string.
 *
 * Supported inputs:
 * - "May 2017 - Present"
 * - "May 2017 - Aug 2024"
 * - "Sep 2025 - Dec 2025"
 * - "Jan 2026 - Jan 2026"
 *
 * Rules:
 * - Month ranges are inclusive (Jan–Jan => 1 mo).
 * - "Present" resolves to the current month.
 */
function calcTenure(periodStr) {
  if (!periodStr) return null

  // Normalize separators (hyphen / en dash / em dash) and split once.
  const parts = periodStr.split(/\s*[-–—]\s*/)
  if (parts.length < 2) return null

  const start = parseMonthYear(parts[0])
  if (!start) return null

  const endRaw = parts[1].trim()
  const end =
    endRaw.toLowerCase() === 'present'
      ? { year: new Date().getFullYear(), month: new Date().getMonth() }
      : parseMonthYear(endRaw)

  if (!end) return null

  const startIndex = start.year * 12 + start.month
  const endIndex = end.year * 12 + end.month

  // Inclusive month count so same month returns 1.
  let totalMonths = endIndex - startIndex + 1
  if (totalMonths < 1) totalMonths = 1

  const yrs = Math.floor(totalMonths / 12)
  const mos = totalMonths % 12

  const yrLabel = yrs > 0 ? `${yrs} yr${yrs !== 1 ? 's' : ''}` : null
  const moLabel = mos > 0 ? `${mos} mo${mos !== 1 ? 's' : ''}` : null

  if (yrLabel && moLabel) return `${yrLabel} ${moLabel}`
  if (yrLabel) return yrLabel
  return moLabel ?? '1 mo'
}

function ExperienceCard({ exp }) {
  const { ref, inView } = useInView()
  const tenure = calcTenure(exp.period)

  return (
    <div ref={ref} className={`${styles.card} ${inView ? styles.visible : ''}`}>
      {/* Timeline spine (icon + vertical line) */}
      <div className={styles.spine}>
        <div className={styles.spineIcon}>
          <BriefcaseIcon />
        </div>
        <div className={styles.spineLine} />
      </div>

      {/* Main experience content */}
      <div className={styles.content}>
        {/* Role metadata — LinkedIn-style: title → specialisms → company+pills → period → location */}
        <div className={styles.header}>
          <h3 className={styles.role}>{exp.role}</h3>
          <p className={styles.specialisms}>{exp.specialisms}</p>

          {/* Company name + employment pills on one line */}
          <div className={styles.companyRow}>
            {exp.companyUrl ? (
              <a
                href={exp.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.company} ${styles.companyLink}`}
              >
                {exp.company}
              </a>
            ) : (
              <span className={styles.company}>{exp.company}</span>
            )}
            {exp.current && (
              <>
                <span className={styles.divider}>·</span>
                <span className={styles.currentPill}>
                  <span className={styles.currentDot} />
                  Current role
                </span>
              </>
            )}
            <span className={styles.divider}>·</span>
            <span className={styles.typePill}>{exp.type}</span>
          </div>

          {/* Period · tenure on their own line */}
          <div className={styles.periodRow}>
            <span className={styles.period}>{exp.period}</span>
            {tenure && (
              <>
                <span className={styles.divider}>·</span>
                <span className={styles.tenure}>{tenure}</span>
              </>
            )}
          </div>

          {/* Location · work arrangement on their own line */}
          {(exp.location || exp.workArrangement) && (
            <div className={styles.locationRow}>
              {exp.location && (
                <span className={styles.location}>
                  <MapPinIcon />
                  {exp.location}
                </span>
              )}
              {exp.location && exp.workArrangement && (
                <span className={styles.divider}>·</span>
              )}
              {exp.workArrangement && (
                <span className={styles.workArrangement}>{exp.workArrangement}</span>
              )}
            </div>
          )}

          {/* Shown when a company was renamed/acquired mid-tenure */}
          {exp.companyNote && (
            <p className={styles.companyNote}>{exp.companyNote}</p>
          )}
        </div>

        {/* Short role overview */}
        <p className={styles.summary}>{exp.summary}</p>

        {/* Impact bullets */}
        <div className={styles.highlights}>
          <p className={styles.highlightsLabel}>Key contributions</p>
          <ul className={styles.highlightsList}>
            {exp.highlights.map((h, i) => (
              <li key={i} className={styles.highlightItem}>
                <span className={styles.checkIcon}><CheckIcon /></span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Related GitHub repos (compact links; full details are in Projects section) */}
        {exp.workProjects?.length > 0 && (
          <div className={styles.projectLinks}>
            <p className={styles.highlightsLabel}>Work projects on GitHub</p>
            <div className={styles.linkRow}>
              {exp.workProjects.map(p => (
                <a key={p.label} href={p.url} target="_blank" rel="noopener noreferrer" className={styles.ghLink}>
                  <GitHubIcon />
                  {p.label}
                  <ExternalIcon />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Public live tools from this role */}
        {exp.liveProjects?.length > 0 && (
          <div className={styles.projectLinks}>
            <p className={styles.highlightsLabel}>Live tools built in this role</p>
            <div className={styles.linkRow}>
              {exp.liveProjects.map(p => (
                <div key={p.label} className={styles.liveToolBlock}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className={styles.liveLink}>
                    <span className={styles.liveDot} />
                    {p.label}
                    <ExternalIcon />
                  </a>
                  {p.credentials && (
                    /* Compact login hint shown only for projects with demo credentials. */
                    <p className={styles.liveCreds}>
                      <span className={styles.liveCredsLabel}>LOGIN:</span>{' '}
                      <span className={styles.credsIcon} aria-hidden="true"><UserIcon /></span>{' '}
                      <code>{p.credentials.user}</code> /{' '}
                      <span className={styles.credsIcon} aria-hidden="true"><KeyIcon /></span>{' '}
                      <code>{p.credentials.pass}</code>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skill tags for quick scanning */}
        <div className={styles.tags}>
          {exp.tags.map(tag => (
            <Badge key={tag} color="default">{tag}</Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Experience() {
  return (
    <section id="experience" className={`section ${styles.section}`}>
      <div className="container">
        <SectionHeader
          label="04 / Experience"
          title="Where I've applied my craft."
          subtitle="Real-world roles where code ships to production and data pipelines run daily."
        />

        <div className={styles.timeline}>
          {experiences.map(exp => (
            <ExperienceCard key={exp.id} exp={exp} />
          ))}
        </div>
      </div>
    </section>
  )
}
