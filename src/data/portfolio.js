/**
 * Central content for the portfolio (copy, skills matrix, project cards, experience).
 *
 * Convention:
 * - Section components import from here so copy and lists stay editable in one place.
 * - `skills[].items` drive progress bars; `level` is 0–100.
 * - `projects[].category` can be a string or array of strings, and must match filter keys in `Projects.jsx`
 *   (`scraping`, `automation`, etc.).
 */

/** Core identity and links used across Hero, Contact, Footer, etc. */
export const personalInfo = {
  name: 'Paul Tumabini',
  title: 'Full-Stack Developer',
  tagline: 'Web Scraping Specialist & JavaScript Automation Engineer',
  bio: 'I build robust web scraping pipelines, automation tools, and scalable full-stack web apps using Python and JavaScript — turning raw data into action, from Django backends to Google Apps Script workflows.',
  email: 'paultumabini@gmail.com',
  location: 'Australia 🇦🇺',
  linkedin: 'https://www.linkedin.com/in/paultumabini/',
  github: 'https://github.com/paultumabini',
  available: true,
};

/**
 * Skill groups for the Skills section. Each object becomes one `SkillCard`.
 * `color` maps to CSS module classes `color_${color}`; `featured` shows a corner badge.
 */
export const skills = [
  {
    category: 'Web Scraping',
    featured: true,
    icon: 'spider',
    color: 'green',
    items: [
      { name: 'Python', level: 93 },
      { name: 'Scrapy', level: 92 },
      { name: 'Playwright', level: 87 },
      { name: 'Selenium', level: 85 },
      { name: 'BeautifulSoup4', level: 85 },
      { name: 'Pandas', level: 82 },
    ],
  },
  {
    /**
     * Renamed to reflect broader workflow tooling, not just in-browser JavaScript.
     * This group now includes shell scripting because many automation tasks span CLI + JS.
     */
    category: 'Automation / Scripting',
    featured: true,
    icon: 'zap',
    color: 'orange',
    items: [
      { name: 'JavaScript', level: 94 },
      { name: 'Google Apps Script (GAS)', level: 95 },
      { name: 'Web Apps', level: 88 },
      /** Bash rounds out the scripting stack for cron jobs, local tooling, and deployment helpers. */
      { name: 'Bash Scripting', level: 82 },
      { name: 'jQuery', level: 82 },
      { name: 'Node.js', level: 75 },
    ],
  },
  {
    category: 'Backend & Framework',
    featured: false,
    icon: 'server',
    color: 'accent',
    items: [
      { name: 'Django', level: 90 },
      { name: 'Django REST Framework', level: 86 },
      { name: 'PostgreSQL', level: 85 },
    ],
  },
  {
    category: 'Frontend',
    featured: false,
    icon: 'layout',
    color: 'accent',
    items: [
      { name: 'React', level: 82 },
      { name: 'TypeScript', level: 75 },
      { name: 'TailwindCSS / Bootstrap', level: 85 },
      { name: 'HTML5 / CSS3', level: 93 },
      { name: 'Chart.js', level: 80 },
    ],
  },
];

/**
 * GitHub-backed work samples; `link` opens in a new tab from `ProjectCard`.
 * `liveLink` / `badge` / `credentials` are optional — see `Projects.jsx` for how each renders.
 * `videoLink` (optional) — YouTube URL for a recorded demo; renders a YouTube icon button + "Watch demo" CTA.
 *   Add to any project entry; omit (or set null) to hide both buttons entirely.
 */
export const projects = [
  /**
   * Flagship scraping platform: Django admin/API plus a large Scrapy codebase (~30+ spiders).
   * Multiple spider templates crawl hundreds of dealer sites; runs can overlap (parallel spiders /
   * scheduled jobs). See repo README for env vars (FTP, AVAIM), cron scheduling, and local run commands.
   * @see https://github.com/paultumabini/vdp-urls-scraper
   */
  {
    id: 1,
    title: 'Vehicle Data Web Scraper',
    description:
      'Full-stack Django + Scrapy app with 30+ spiders, Selenium/Playwright helpers, FTP pipeline, cron scheduling, and a Django admin UI. Features a JavaScript + Chart.js dashboard for real-time monitoring of scrape status and ingestion metrics. A library of spider templates and site-specific spiders crawls hundreds of domains, with concurrent runs & logging',
    tags: [
      'Python',
      'Django',
      'Scrapy',
      'Selenium',
      'Playwright',
      'JavaScript',
      'Chart.js',
      'FTP',
      'Cron',
      'PostgreSQL',
      'DRF',
    ],
    category: ['scraping', 'automation', 'python'],
    link: 'https://github.com/paultumabini/vehicle-detail-page-scraper',
    liveLink: null,
    featured: true,
    badge: 'Work Project',
  },
  {
    id: 2,
    title: 'VDP Import Parser',
    description:
      'Prepares raw vehicle dealer inventory feeds for CMS ingestion. Parses, transforms, and validates multi-format import data with error reporting and clean output generation before importing to ftp server for data ingestion.',
    tags: [
      'Python',
      'Data Parsing',
      'Data Pipeline',
      'CSV',
      'FTP',
      'Automation',
      'Django',
      'PostgreSQL',
    ],
    category: ['automation', 'python'],
    link: 'https://github.com/paultumabini/vdp-import-parser',
    liveLink: null,
    featured: true,
    badge: 'Work Project',
  },
  {
    id: 3,
    title: 'Vehicle Data Monitoring',
    description:
      'Full-featured vehicle data monitoring dashboard built on Google Apps Script with login/auth and complete CRUD functionality. Tracks real operational data with a role-protected login screen, live dashboard, and editable records. Real workplace tool.',
    tags: [
      'Google Apps Script',
      'JavaScript',
      'Auth / Login',
      'CRUD',
      'Dashboard',
    ],
    category: ['gaswebapp', 'webapp'],
    link: 'https://github.com/paultumabini/vehicle-data-monitoring',
    liveLink:
      'https://script.google.com/macros/s/AKfycbwsvDezT1ZB9RGJqlueIUG_I0K_aFXda0mfVy01lknpqLUzr0PhB0T8xk2oWWO8Gz_qow/exec',
    featured: true,
    badge: 'Live · Work Project',
    credentials: { user: 'testuser', pass: 'testing123' },
  },
  {
    id: 4,
    title: 'Vehicle Lease Calculator',
    description:
      'Clean HTML/JS lease payment calculator for vehicles. Computes monthly payments from principal, interest, residual value, and term — with live result updates.',
    tags: ['JavaScript', 'HTML5', 'CSS3', 'Finance Logic'],
    category: 'webapp',
    link: 'https://github.com/paultumabini/vehicle-lease-calculator',
    liveLink: 'https://vehicle-lease-calculator.vercel.app/',
    featured: true,
    badge: 'Live · Work Project',
  },

  {
    id: 5,
    title: 'Hacker News Scraper',
    description:
      'Scrapy-powered spider that harvests Hacker News articles, filters by vote threshold, and exports structured JSON data. Features deduplication, proxy rotation support, and async pipelines.',
    tags: ['Python', 'BeautifulSoup4', 'Scrapy', 'Pandas'],
    category: ['scraping', 'python'],
    link: 'https://github.com/paultumabini/simple-scrape-bs4',
    badge: 'Personal',
    featured: false,
  },

  /**
   * Full-stack AI-powered task manager — Django DRF API + React/Vite SPA.
   * JWT auth, Kanban board with drag-and-drop, analytics dashboard, timeline view,
   * and OpenAI gpt-4o-mini AI task prioritisation. Deployed on Render + Vercel + Neon.
   * @see https://github.com/paultumabini/taskaai-backend
   * @see https://github.com/paultumabini/taskaai-frontend
   */
  {
    id: 7,
    title: 'TaskaAI — AI Task Manager',
    description:
      'Full-stack task management app with a Django REST Framework API and React/Vite frontend. Features JWT authentication, a Kanban board with drag-and-drop, analytics dashboard with Chart.js, timeline view, and OpenAI-powered task prioritisation (priority, deadline, tags). Deployed on Render (Django), Vercel (React), and Neon (PostgreSQL).',
    tags: [
      'Django',
      'Django REST Framework',
      'React',
      'Vite',
      'PostgreSQL',
      'OpenAI',
      'JWT Auth',
      'Chart.js',
      'Neon',
      'Render',
      'Vercel',
    ],
    category: ['webapp', 'python'],
    link: 'https://github.com/paultumabini/taskaai-frontend',
    liveLink: 'https://taskaai.vercel.app',
    videoLink: 'https://youtu.be/YOUR_VIDEO_ID', // replace with your YouTube video ID once uploaded
    featured: true,
    badge: 'Live · Full-Stack',
    credentials: { user: 'testuser', pass: 'testuser123' },
  },

  {
    id: 6,
    title: 'Password Breach Checker',
    description:
      'Checks whether a password has been exposed in known data breaches using k-anonymity hashing with HaveIBeenPwned API — without ever sending the plain password.',
    tags: ['Python', 'API', 'Security', 'Hashing'],
    category: 'python',
    link: 'https://github.com/paultumabini/password-checker',
    liveLink: null,
    badge: 'Personal',
    featured: false,
  },
];

/**
 * Work history shown in `Experience.jsx`.
 * Keep newest first and include optional `liveProjects` / `workProjects` arrays for link chips.
 * `liveProjects[]` may include `credentials: { user, pass }` for login demos (see `Experience.jsx`).
 */
export const experiences = [
  {
    id: 1,
    role: 'Vehicle Data Administrator',
    specialisms: 'Web Scraping · Python · Django · Google Apps Script',
    company: 'AutoVerify',
    companyUrl: 'https://autoverify.com/',
    location: 'Canada',
    workArrangement: 'Remote',
    companyNote: 'formerly AIM Experts — acquired Sep 2021',
    period: 'AuG 2017 - Aug 2024',
    periodStart: 'May 2017',
    type: 'Full-time',
    current: false,
    summary:
      'Owned the full data and automation layer for vehicle data operations — building production web scrapers, full-stack Django pipelines, Google Apps Script web apps, and internal tooling that kept vehicle data clean, structured, and flowing across systems. Originally joined as AIM Experts; the company was acquired by AutoVerify in September 2021 and the role continued under the new name through August 2024.',
    highlights: [
      'Designed and maintained full-stack web scraping applications targeting static sites, dynamic content, and APIs — with a Django backend that cleaned and normalised raw data before pushing it to an FTP server for downstream ingestion.',
      'Built the VDP URLs Parser — a Python automation tool that parsed, transformed, and validated vehicle detail page feeds, then exported clean data directly to an FTP server for CMS ingestion.',
      'Developed internal automation scripts and Google Apps Script web apps — including Task UI and Vehicle Data Monitor — replacing manual workflows and reducing operational overhead across teams.',
      'Designed and built a simple lease calculator web app used by internal teams to generate accurate weekly, bi-weekly, and monthly lease payment estimates.',
      'Owned vehicle dataset quality across all inventory records — continuously auditing, cleaning, and reconciling data to ensure accuracy for sales, operations, and reporting.',
      'Managed OEM rebates, incentives, and lease programme data end-to-end — keeping records current and surfacing timely updates to internal stakeholders.',
    ],
    tags: [
      'Python',
      'Scrapy',
      'Selenium',
      'Playwright',
      'Django',
      'DRF',
      'PostgreSQL',
      'FTP',
      'Google Apps Script',
      'JavaScript',
      'Web Apps',
      'Data Pipeline',
    ],
    liveProjects: [
      {
        label: 'Vehicle Data Monitoring',
        url: 'https://script.google.com/macros/s/AKfycbwsvDezT1ZB9RGJqlueIUG_I0K_aFXda0mfVy01lknpqLUzr0PhB0T8xk2oWWO8Gz_qow/exec',
        credentials: { user: 'testuser', pass: 'testing123' },
      },
      {
        label: 'Vehicle Lease Calculator',
        url: 'https://vehicle-lease-calculator.vercel.app/',
      },
    ],
    workProjects: [
      {
        label: 'Vehicle Data Web Scraper',
        description:
          'Full-stack Django + Scrapy app with 30+ spiders, Selenium/Playwright helpers, FTP pipeline, cron scheduling, and a Django admin UI. Scrapes static, dynamic, and API-driven dealer sites daily.',
        url: 'https://github.com/paultumabini/vehicle-detail-page-scraper',
        tags: [
          'Django',
          'Scrapy',
          'Selenium',
          'Playwright',
          'FTP',
          'Cron',
          'PostgreSQL',
        ],
      },
      {
        label: 'VDP Import Parser',
        description:
          'Python automation tool that parses, transforms, and validates raw vehicle detail page feed files before pushing clean, structured data to an FTP server for CMS ingestion.',
        url: 'https://github.com/paultumabini/vdp-import-parser',
        tags: ['Python', 'Data Pipeline', 'FTP', 'CSV', 'Automation'],
      },
    ],
  },
];
