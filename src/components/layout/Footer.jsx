/**
 * Site footer: brand mark, dynamic copyright year, and outbound social links.
 *
 * Uses `personalInfo` for GitHub/LinkedIn URLs so they stay consistent with the rest of the site.
 */
import { personalInfo } from '../../data/portfolio'
import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.accent}>{'</PT>'}</span>
          <span className={styles.dot} />
        </div>
        <p className={styles.copy}>
          © {year} Paul Tumabini · Built with React & Vite
        </p>
        <div className={styles.links}>
          <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}
