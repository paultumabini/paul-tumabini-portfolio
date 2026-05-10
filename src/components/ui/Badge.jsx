/**
 * Compact pill for technology tags (e.g. on project cards).
 *
 * Styling: `color` must match a class exported from `Badge.module.css` (`default`, `green`, `orange`).
 */
import styles from './Badge.module.css'

/**
 * @param {{ children: import('react').ReactNode, color?: 'default' | 'green' | 'orange' }} props
 */
export default function Badge({ children, color = 'default' }) {
  return (
    <span className={`${styles.badge} ${styles[color]}`}>
      {children}
    </span>
  )
}
