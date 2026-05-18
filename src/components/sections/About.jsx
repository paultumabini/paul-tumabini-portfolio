/**
 * About section: stats, narrative, interests grid.
 * useInView + .visible toggles CSS reveal when the block crosses the viewport (in or out).
 */
import { useInView } from '../../hooks/useInView';
import { personalInfo } from '../../data/portfolio';
import SectionHeader from '../ui/SectionHeader';
import styles from './About.module.css';

const stats = [
  { value: '5+', label: 'Years Coding' },
  { value: '20+', label: 'GitHub Repos' }, // ← bump this when you push a new repo
  { value: '10+', label: 'Tools & Frameworks' },
  { value: '∞', label: 'Lines Scraped' },
];

const interests = [
  {
    icon: '🕷️',
    title: 'Web Scraping',
    desc: 'Building resilient spiders and data pipelines with Scrapy, Selenium, and Playwright.',
  },
  {
    icon: '⚡',
    title: 'Automation / Scripting',
    desc: 'Automating spreadsheets and workflows with Google Apps Script and custom Web Apps. Including Bash scripting for cron jobs, local tooling, and deployment helpers. ',
  },
  {
    icon: '🐍',
    title: 'Python Backend',
    desc: 'Crafting APIs and data-driven apps with Django and Django REST Framework.',
  },
  {
    icon: '⚛️',
    title: 'Frontend Dev',
    desc: 'Building interactive UIs with React, TypeScript, and TailwindCSS.',
  },
];

export default function About() {
  /** Attached to the two-column grid; toggles `.visible` for CSS entrance transitions. */
  const { ref, inView } = useInView();

  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeader
          label="01 / About"
          title="Turning data into insight, and code into product."
          subtitle="I specialise in web scraping, automation, and building full-stack systems that turn raw data into something useful."
        />

        <div
          ref={ref}
          className={`${styles.grid} ${inView ? styles.visible : ''}`}
        >
          {/* Left: narrative */}
          <div className={styles.narrative}>
            <p>
              I'm Paul, a self-taught developer from the Philippines, now based
              in Australia, with a strong focus on{' '}
              <strong>
                {' '}
                web scraping, automation, and full-stack web development
              </strong>
              .
            </p>
            <p>
              My journey started with
              <span className={styles.tag}>JavaScript</span>, eventually dove
              into
              <span className={styles.tag}>Python</span> and quickly developed a
              passion for extracting and structuring data from the web using
              tools like <span className={styles.tag}>Scrapy</span>,{' '}
              <span className={styles.tag}>BeautifulSoup4</span>, and{' '}
              <span className={styles.tag}>Playwright</span>.
            </p>
            <p>
              On the automation side, I build{' '}
              <span className={styles.tag}>Python scripts</span> and
              <span className={styles.tag}>Google Apps Script</span> web apps
              that connect spreadsheets to real-world workflows and cut hours
              of manual work.
            </p>
            <p>
              I build full-stack products with{' '}
              <span className={styles.tag}>React</span> and{' '}
              <span className={styles.tag}>TypeScript</span> frontends backed by
              robust <span className={styles.tag}>Django</span> and{' '}
              <span className={styles.tag}>Django REST Framework</span> APIs.
            </p>

            <div className={styles.socialRow}>
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                View GitHub →
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                LinkedIn →
              </a>
            </div>
          </div>

          {/* Right: stats + interest cards */}
          <div className={styles.aside}>
            <div className={styles.statsGrid}>
              {stats.map((s, i) => (
                <div
                  key={i}
                  className={styles.statCard}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>

            <div className={styles.interestGrid}>
              {interests.map((item, i) => (
                <div key={i} className={styles.interestCard}>
                  <span className={styles.interestIcon}>{item.icon}</span>
                  <div>
                    <h4 className={styles.interestTitle}>{item.title}</h4>
                    <p className={styles.interestDesc}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
