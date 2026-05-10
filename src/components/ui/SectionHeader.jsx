/**
 * Standard section heading pattern: mono eyebrow (`label`), display `title`, optional prose `subtitle`.
 *
 * Typography comes from global `.section-*` classes; motion is layered via CSS modules and
 * `useInView` so headings ease in when entering the viewport and ease out when leaving (reversible).
 */
import { useInView } from '../../hooks/useInView'
import styles from './SectionHeader.module.css'

/**
 * @param {{
 *   label: string,
 *   title: string,
 *   subtitle?: string,
 *   align?: 'left' | 'center'
 * }} props
 */
export default function SectionHeader({ label, title, subtitle, align = 'left' }) {
  const { ref, inView } = useInView({
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px',
  })

  return (
    <div
      ref={ref}
      className={`${styles.header} ${styles[align]} ${inView ? styles.inView : ''}`}
    >
      <span className={`section-label ${styles.label}`}>{label}</span>
      <h2 className={`section-title ${styles.title}`}>{title}</h2>
      {subtitle && <p className={`section-subtitle ${styles.subtitle}`}>{subtitle}</p>}
    </div>
  )
}
