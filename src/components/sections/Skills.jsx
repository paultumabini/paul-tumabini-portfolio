/** Skills section with animated cards and a tech stack cloud. */
import { Layers } from 'lucide-react'
import { useInView } from '../../hooks/useInView'
import { skills } from '../../data/portfolio'
import { techStackItems } from '../../data/techStack'
import SectionHeader from '../ui/SectionHeader'
import styles from './Skills.module.css'

/**
 * One labelled skill row: label + percentage + animated track fill.
 *
 * @param {{ name: string, level: number, inView: boolean, delay: number }} props
 *   - `inView` gates width so bars animate when the card scrolls into view.
 *   - `delay` staggers transitions for a cascading effect (`index * 80` ms from parent).
 */
function SkillBar({ name, level, inView, delay }) {
  return (
    <div className={styles.skillItem}>
      <div className={styles.skillMeta}>
        <span className={styles.skillName}>{name}</span>
        <span className={styles.skillLevel}>{level}%</span>
      </div>
      <div className={styles.skillTrack}>
        <div
          className={styles.skillFill}
          style={{
            width: inView ? `${level}%` : '0%',
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  )
}

/**
 * One category card from `portfolio.skills`, wrapped for scroll-driven motion.
 *
 * @param {object} props — Spread fields from `skills[]` plus:
 * @param {number} props.gridIndex — Column parity: even → slide from left, odd → from right.
 */
function SkillCard({ category, items, color, featured, gridIndex }) {
  const { ref, inView } = useInView()
  const fromLeft = gridIndex % 2 === 0

  return (
    <div
      ref={ref}
      className={`${styles.cardShell} ${fromLeft ? styles.shellFromLeft : styles.shellFromRight} ${inView ? styles.shellVisible : ''}`}
    >
      <div className={`${styles.card} ${featured ? styles.featured : ''} ${styles[`color_${color}`]}`}>
        {featured && <div className={styles.featuredBadge}>Featured Skill</div>}
        <h3 className={styles.cardTitle}>{category}</h3>
        <div className={styles.barList}>
          {items.map((s, i) => (
            <SkillBar key={s.name} name={s.name} level={s.level} inView={inView} delay={i * 80} />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Single entry in the “tech cloud”: optional Simple Icons CDN image, else a Lucide fallback.
 *
 * @param {{ name: string, slug: string | null }} props — `slug: null` means no CDN URL (use `Layers` icon).
 */
function TechChip({ name, slug }) {
  const icon = slug ? (
    <img
      src={`https://cdn.simpleicons.org/${slug}`}
      alt=""
      width={15}
      height={15}
      className={styles.techIcon}
      loading="lazy"
      decoding="async"
    />
  ) : (
    <Layers size={15} strokeWidth={2} className={styles.techIcon} aria-hidden />
  )

  return (
    <span className={styles.techChip}>
      {icon}
      {name}
    </span>
  )
}

/**
 * One animated row of tech chips.
 * Items are doubled so the track is exactly 2× one set wide.
 * The keyframe animates exactly -50% (half the track) so copy 1 and copy 2
 * are pixel-perfect identical at the loop point — no visible jump.
 * `direction` controls whether the row scrolls left or right.
 */
function MarqueeRow({ items, direction }) {
  const doubled = [...items, ...items]
  return (
    <div className={styles.marqueeWrapper}>
      <div className={`${styles.marqueeTrack} ${direction === 'right' ? styles.marqueeRight : styles.marqueeLeft}`}>
        {doubled.map(({ name, slug }, i) => (
          <TechChip key={`${name}-${i}`} name={name} slug={slug} />
        ))}
      </div>
    </div>
  )
}

/** Renders skill cards and the full tech stack list. */
export default function Skills() {
  // Split the flat tech stack array into three roughly equal rows so each
  // marquee row has a different set of chips (rows 1 & 3 scroll left, row 2 right).
  const rowSize = Math.ceil(techStackItems.length / 3)
  const row1 = techStackItems.slice(0, rowSize)
  const row2 = techStackItems.slice(rowSize, rowSize * 2)
  const row3 = techStackItems.slice(rowSize * 2)

  return (
    <section id="skills" className={`section ${styles.section}`}>
      {/* Subtle radial backdrop behind cards. */}
      <div className={styles.skillBackdrop} aria-hidden="true" />

      <div className="container">
        <SectionHeader
          label="02 / Skills"
          title="What I bring to the table."
          subtitle="Specialising in data extraction and automation, with a growing full-stack toolkit."
        />

        <div className={styles.cardGrid}>
          {skills.map((skill, gridIndex) => (
            <SkillCard key={skill.category} {...skill} gridIndex={gridIndex} />
          ))}
        </div>

        {/* Full tech stack: three alternating-direction marquee rows */}
        <div className={styles.techSection}>
          <p className="section-label" style={{ marginBottom: '1.25rem' }}>Full Tech Stack</p>
          <div className={styles.techMarquee}>
            <MarqueeRow items={row1} direction="left" />
            <MarqueeRow items={row2} direction="right" />
            <MarqueeRow items={row3} direction="left" />
          </div>
        </div>
      </div>
    </section>
  )
}
