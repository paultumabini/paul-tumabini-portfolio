/**
 * Contact section: link cards + CTA panel; useInView + .visible mirror viewport visibility.
 */
import { useState } from 'react';
import { useInView } from '../../hooks/useInView';
import { personalInfo } from '../../data/portfolio';
import SectionHeader from '../ui/SectionHeader';
import styles from './Contact.module.css';

/** Reused SVG markers for the contact link row (20×20 viewBox). */
const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

/** LinkedIn profile icon for the contact link card (inline SVG, `currentColor`). */
const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

/** Mail envelope for the email contact card. */
const MailIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

/** Map pin for the non-clickable location row. */
const MapIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

/** Render email in a bot-unfriendly format for the visible UI text. */
const obfuscateEmail = email => {
  const [user, domain = ''] = email.split('@');
  const domainText = domain.split('.').join(' [dot] ');
  return `${user} [at] ${domainText}`;
};

/**
 * Static rows for the left column. `href: null` renders a non-link value (e.g. location).
 * `color` maps to `Contact.module.css` `color_*` hover accents on cards.
 */
const contactLinks = [
  {
    label: 'GitHub',
    value: '@paultumabini',
    href: 'https://github.com/paultumabini',
    icon: <GitHubIcon />,
    color: 'default',
  },
  {
    label: 'LinkedIn',
    value: 'paultumabini',
    href: 'https://www.linkedin.com/in/paultumabini/',
    icon: <LinkedInIcon />,
    color: 'accent',
  },
  {
    label: 'Email',
    value: obfuscateEmail(personalInfo.email),
    href: null,
    icon: <MailIcon />,
    color: 'green',
  },
  {
    label: 'Location',
    /** Reuse centralized profile data so the location stays consistent across sections. */
    value: personalInfo.location,
    href: null,
    icon: <MapIcon />,
    color: 'orange',
  },
];

export default function Contact() {
  /** When the grid intersects the viewport, toggles `styles.visible` for fade/slide-in. */
  const { ref, inView } = useInView();
  const isAvailable = personalInfo.available;
  const [isCopied, setIsCopied] = useState(false);
  /** Build the real address at interaction time so it is not embedded in CTA markup. */
  const getEmail = () => personalInfo.email;

  /** Copy address on demand from a user click. */
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(getEmail());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1800);
    } catch {
      setIsCopied(false);
    }
  };

  /** Trigger mail client only after explicit user action from the CTA button. */
  const handleSendEmail = () => {
    window.location.href = `mailto:${getEmail()}`;
  };

  return (
    <section id="contact" className={`section ${styles.section}`}>
      <div className="container">
        <SectionHeader
          label="05 / Contact"
          title="Let's work together."
          subtitle="I'm open to freelance projects, collaborations, and full-time opportunities. Drop me a message."
          align="center"
        />

        <div
          ref={ref}
          className={`${styles.grid} ${inView ? styles.visible : ''}`}
        >
          {/* Contact info cards */}
          <div className={styles.contactCards}>
            {contactLinks.map((link, i) => (
              <div
                key={link.label}
                className={`${styles.contactCard} ${styles[`color_${link.color}`]}`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className={styles.contactIcon}>{link.icon}</div>
                <div className={styles.contactInfo}>
                  <span className={styles.contactLabel}>{link.label}</span>
                  {link.label === 'Email' ? (
                    <>
                      {/* Keep a privacy-friendly visible string while exposing only a copy action. */}
                      <div className={styles.emailActions}>
                        <span className={styles.contactValue}>
                          {link.value}
                        </span>
                        <button
                          type="button"
                          className={styles.copyEmailBtn}
                          onClick={handleCopyEmail}
                        >
                          {isCopied ? 'Copied!' : 'Copy email'}
                        </button>
                      </div>
                    </>
                  ) : link.href ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.contactValue}
                    >
                      {link.value}
                    </a>
                  ) : (
                    <span className={styles.contactValue}>{link.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Call to action panel */}
          <div className={styles.ctaPanel}>
            <div className={styles.ctaGlow} aria-hidden="true" />
            <div className={styles.ctaContent}>
              <div className={styles.availablePill}>
                <span className={styles.availableDot} />
                {isAvailable
                  ? 'Available for work'
                  : 'Currently unavailable for work'}
              </div>
              <h3 className={styles.ctaTitle}>Ready to start a project?</h3>
              <p className={styles.ctaBody}>
                Whether you need a custom scraping pipeline, a Django backend, a
                Google Apps Script automation, or a full web application, I'd
                love to hear about your project.
              </p>
              <div className={styles.ctaButtons}>
                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={handleSendEmail}
                >
                  Send me an email
                </button>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnSecondary}
                >
                  Connect on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
