/**
 * career-data.ts
 *
 * Single source of truth for all career data consumed by bento cards.
 *
 * Authoring rules:
 *  - All durations are in fractional years, rounded to the nearest 0.5.
 *  - `startYear` / `endYear` use calendar years (number). `endYear: null` means present.
 *  - Skill levels are on a 1–10 scale (1 = no exposure, 10 = principal-level mastery).
 *  - Focus-split percentages must sum to 100 per snapshot year.
 *  - Any change here automatically propagates to every card that imports from this file.
 *
 * Last reviewed: 2025
 */

// ─── Primitives ───────────────────────────────────────────────────────────────

export type Era = 'current' | 'recent' | 'past'

// ─── Roles ────────────────────────────────────────────────────────────────────

export interface Role {
  /** Short display title */
  title: string
  company: string
  /** Calendar year the role started */
  startYear: number
  /** Calendar year the role ended, or null if still active */
  endYear: number | null
  /** Duration in fractional years (rounded to nearest 0.5) */
  years: number
  location: string
  industry: string
  /** Primary technologies used in this role */
  technologies: string[]
  /** One-line summary shown in chart tooltips */
  summary: string
}

export const ROLES: Role[] = [
  {
    title: 'Junior Software Developer Intern',
    company: 'Insumedical',
    startYear: 2009,
    endYear: 2012,
    years: 3,
    location: 'Quito, Ecuador',
    industry: 'Med. Supply',
    technologies: ['Java', 'JEE', 'JavaScript'],
    summary: 'Junior Dev · B2C e-commerce platform for medical supply market',
  },
  {
    title: 'Software Developer Intern',
    company: 'Weatherford',
    startYear: 2012,
    endYear: 2013,
    years: 0.5,
    location: 'Ecuador',
    industry: 'Oil & Gas',
    technologies: ['C#', '.NET', 'ASP.NET', 'SharePoint'],
    summary: 'Intern · Internal e-learning platform on SharePoint / ASP.NET',
  },
  {
    title: 'Software Developer',
    company: 'EPN',
    startYear: 2014,
    endYear: 2015,
    years: 1,
    location: 'Quito, Ecuador',
    industry: 'Academia',
    technologies: ['AngularJS', 'Java', 'JEE'],
    summary: 'Software Dev · Collaborative NLP annotation tool',
  },
  {
    title: 'Full Stack Developer (Working Student)',
    company: 'TUM',
    startYear: 2016,
    endYear: 2018,
    years: 1.5,
    location: 'Munich, Germany',
    industry: 'Academia',
    technologies: ['Angular', 'Java', 'Node.js', 'MongoDB'],
    summary: 'Working Student · Contextual Email Client with task extraction',
  },
  {
    title: 'Graphics/UX Designer (Working Student)',
    company: 'Netlight',
    startYear: 2018,
    endYear: 2018,
    years: 0.5,
    location: 'Munich, Germany',
    industry: 'Consulting',
    technologies: ['JavaScript', 'TypeScript', 'Adobe Illustrator'],
    summary: 'Working Student · UX prototyping and visual assets',
  },
  {
    title: 'Full Stack Developer, Consultant',
    company: 'Netlight',
    startYear: 2018,
    endYear: 2019,
    years: 0.5,
    location: 'Munich, Germany',
    industry: 'Finance',
    technologies: ['Angular', 'React', 'Stencil.js', 'Node.js'],
    summary: 'Consultant · PoS financing platform & Digital Identity ecosystem',
  },
  {
    title: 'Software Engineer',
    company: 'Celonis',
    startYear: 2019,
    endYear: 2020,
    years: 1.5,
    location: 'Munich, Germany',
    industry: 'Process Mining',
    technologies: ['Angular', 'TypeScript', 'JavaScript'],
    summary: 'Software Engineer · Angular dashboards, platform performance',
  },
  {
    title: 'Senior Software Engineer',
    company: 'Celonis',
    startYear: 2020,
    endYear: 2023,
    years: 3.5,
    location: 'Munich, Germany',
    industry: 'Process Mining',
    technologies: ['Angular', 'TypeScript', 'd3.js', 'RxJS', 'Jest'],
    summary:
      'Senior Engineer · d3.js visualisations, Sankey diagrams, Treemaps',
  },
  {
    title: 'Senior Software Engineer',
    company: 'comstruct',
    startYear: 2023,
    endYear: null,
    years: 2,
    location: 'Munich, Germany',
    industry: 'Construction',
    technologies: [
      'TypeScript',
      'React',
      'NestJS',
      'Node.js',
      'Express',
      'Redis',
      'PostgreSQL',
    ],
    summary:
      'Senior Engineer · Invoice digitisation, supplier APIs, purchase orders',
  },
]

// ─── Derived helpers ──────────────────────────────────────────────────────────

/**
 * Total years of professional experience, measured as calendar span from first role to present.
 * Intentionally capped at 15 as a conservative, rounded display figure for the hero card.
 * Update the cap when the career span meaningfully crosses the next milestone (e.g. 20).
 */
export const TOTAL_YEARS = Math.min(
  new Date().getFullYear() - Math.min(...ROLES.map(r => r.startYear)),
  15
)

/** Display string used in the hero card, e.g. "15+" */
export const TOTAL_YEARS_DISPLAY = `${TOTAL_YEARS}+`

/** The role currently active (endYear === null). */
export const CURRENT_ROLE = ROLES.find(r => r.endYear === null)!

// ─── Personal ─────────────────────────────────────────────────────────────────

export const PERSONAL = {
  name: 'Paúl Gualotuña',
  initials: 'PG',
  location: 'Munich, Germany',
  locationShort: 'Germany · Remote-friendly',
  email: 'paul.gualotuna.dev@gmail.com',
  linkedin: 'https://www.linkedin.com/in/paul-gualotuna',
  github: 'https://github.com/poulzinho',
  website: 'https://gualotuna.com',
} as const

// ─── Industries ───────────────────────────────────────────────────────────────

export interface Industry {
  key: string
  /** Short display label used in chips and chart axes */
  label: string
  /** Approximate total years across all roles in this industry */
  years: number
}

export const INDUSTRIES: Industry[] = [
  { key: 'finance', label: 'Finance', years: 0.5 },
  { key: 'medical', label: 'Medical Supply', years: 3 },
  { key: 'ecommerce', label: 'E-Commerce', years: 3 },
  { key: 'construction', label: 'Construction', years: 2 },
  { key: 'oil_gas', label: 'Oil & Gas', years: 0.5 },
  { key: 'elearning', label: 'E-Learning', years: 0.5 },
  { key: 'academia', label: 'Academia', years: 2.5 },
  { key: 'process_mining', label: 'Process Mining', years: 5 },
  { key: 'consulting', label: 'Consulting', years: 0.5 },
]

// ─── Skills ───────────────────────────────────────────────────────────────────

export interface Skill {
  name: string
  category: 'language' | 'framework' | 'tool' | 'discipline'
  era: Era
  /** Years of active professional use (approximate) */
  years: number
  /** Primary brand hex color for chip accents */
  accentColor: string
}

export const SKILLS: Skill[] = [
  // Languages
  {
    name: 'TypeScript',
    category: 'language',
    era: 'current',
    years: 9,
    accentColor: '#3178c6',
  },
  {
    name: 'JavaScript',
    category: 'language',
    era: 'current',
    years: 15,
    accentColor: '#f0db4f',
  },
  {
    name: 'Java',
    category: 'language',
    era: 'past',
    years: 6,
    accentColor: '#f89820',
  },
  {
    name: 'C#',
    category: 'language',
    era: 'past',
    years: 1,
    accentColor: '#9b4993',
  },
  {
    name: 'SQL',
    category: 'language',
    era: 'current',
    years: 8,
    accentColor: '#336791',
  },
  {
    name: 'HTML5 / CSS3',
    category: 'language',
    era: 'current',
    years: 15,
    accentColor: '#e34f26',
  },
  // Frontend frameworks
  {
    name: 'React',
    category: 'framework',
    era: 'current',
    years: 4,
    accentColor: '#61dafb',
  },
  {
    name: 'Angular',
    category: 'framework',
    era: 'recent',
    years: 6,
    accentColor: '#dd0031',
  },
  {
    name: 'Stencil',
    category: 'framework',
    era: 'past',
    years: 0.5,
    accentColor: '#4e54c8',
  },
  // Backend frameworks
  {
    name: 'NestJS',
    category: 'framework',
    era: 'current',
    years: 2,
    accentColor: '#e0234e',
  },
  {
    name: 'Express',
    category: 'framework',
    era: 'current',
    years: 5,
    accentColor: '#ffffff',
  },
  {
    name: 'Node.js',
    category: 'framework',
    era: 'current',
    years: 7,
    accentColor: '#339933',
  },
  {
    name: 'JEE',
    category: 'framework',
    era: 'past',
    years: 4,
    accentColor: '#e76f00',
  },
  {
    name: '.NET',
    category: 'framework',
    era: 'past',
    years: 1,
    accentColor: '#512bd4',
  },
  // Libraries / tools
  {
    name: 'd3.js',
    category: 'tool',
    era: 'recent',
    years: 3.5,
    accentColor: '#f9a03c',
  },
  {
    name: 'RxJS',
    category: 'tool',
    era: 'recent',
    years: 4.5,
    accentColor: '#b7178c',
  },
  {
    name: 'Jest',
    category: 'tool',
    era: 'recent',
    years: 4,
    accentColor: '#c21325',
  },
  {
    name: 'Docker',
    category: 'tool',
    era: 'current',
    years: 5,
    accentColor: '#2496ed',
  },
  {
    name: 'GitHub Actions',
    category: 'tool',
    era: 'current',
    years: 4,
    accentColor: '#2088ff',
  },
  {
    name: 'GCP',
    category: 'tool',
    era: 'current',
    years: 4,
    accentColor: '#4285f4',
  },
  // Databases
  {
    name: 'PostgreSQL',
    category: 'tool',
    era: 'current',
    years: 2,
    accentColor: '#336791',
  },
  {
    name: 'MongoDB',
    category: 'tool',
    era: 'recent',
    years: 1.5,
    accentColor: '#47a248',
  },
  {
    name: 'Redis',
    category: 'tool',
    era: 'current',
    years: 2,
    accentColor: '#dc382d',
  },
  // Disciplines
  {
    name: 'Agile / Scrum',
    category: 'discipline',
    era: 'current',
    years: 10,
    accentColor: '#0052cc',
  },
  {
    name: 'UX / UI Design',
    category: 'discipline',
    era: 'current',
    years: 7,
    accentColor: '#ff7262',
  },
  {
    name: 'Mentorship',
    category: 'discipline',
    era: 'current',
    years: 5,
    accentColor: '#56d364',
  },
]

// ─── Chart datasets ───────────────────────────────────────────────────────────
//
// These arrays are the authoritative source for BarChartCard and TimeChartCard.
// Keys map 1-to-1 to chart encoding fields.

// --- Bar chart: Industry Journey ---

export interface IndustryDataPoint {
  [key: string]: unknown
  industry: string
  years: number
  company: string
  meta: string
}

export const INDUSTRY_CHART_DATA: IndustryDataPoint[] = [
  {
    industry: 'Med. Supply',
    years: 3,
    company: 'Insumedical',
    meta: 'Junior Dev · B2C e-commerce, medical supply',
  },
  {
    industry: 'Oil & Gas',
    years: 0.5,
    company: 'Weatherford',
    meta: 'Intern · E-learning platform, SharePoint / .NET',
  },
  {
    industry: 'Academia',
    years: 1,
    company: 'EPN',
    meta: 'Software Dev · NLP annotation tool',
  },
  {
    industry: 'Academia',
    years: 1.5,
    company: 'TUM',
    meta: 'Working Student · Contextual Email Client',
  },
  {
    industry: 'Finance',
    years: 0.5,
    company: 'Netlight',
    meta: 'Consultant · PoS financing platform',
  },
  {
    industry: 'Process Mining',
    years: 1.5,
    company: 'Celonis',
    meta: 'Software Engineer · Angular dashboards',
  },
  {
    industry: 'Process Mining',
    years: 3.5,
    company: 'Celonis',
    meta: 'Senior Engineer · d3.js, Sankey, Treemaps',
  },
  {
    industry: 'Construction',
    years: 2,
    company: 'comstruct',
    meta: 'Senior Engineer · Invoice & supplier APIs',
  },
]

// --- Bar chart: Framework Experience ---

export interface FrameworkDataPoint {
  [key: string]: unknown
  framework: string
  years: number
  company: string
  meta: string
}

export const FRAMEWORK_CHART_DATA: FrameworkDataPoint[] = [
  // React
  {
    framework: 'React',
    years: 2,
    company: 'comstruct',
    meta: 'Senior Engineer · React / NestJS platform',
  },
  {
    framework: 'React',
    years: 0.5,
    company: 'Netlight',
    meta: 'Consultant · Stencil + React integration',
  },
  // Angular
  {
    framework: 'Angular',
    years: 3.5,
    company: 'Celonis',
    meta: 'Senior Engineer · d3.js dashboards',
  },
  {
    framework: 'Angular',
    years: 1.5,
    company: 'Celonis',
    meta: 'Software Engineer · Angular dashboards',
  },
  {
    framework: 'Angular',
    years: 1,
    company: 'TUM',
    meta: 'Working Student · Contextual Email Client',
  },
  // d3.js
  {
    framework: 'd3.js',
    years: 3.5,
    company: 'Celonis',
    meta: 'Senior Engineer · Sankey, Treemaps, analytical dashboards',
  },
  // RxJS
  {
    framework: 'RxJS',
    years: 2,
    company: 'Celonis',
    meta: 'Software Engineer · Reactive state management',
  },
  {
    framework: 'RxJS',
    years: 2.5,
    company: 'Celonis',
    meta: 'Senior Engineer · Complex event streams',
  },
  // NestJS
  {
    framework: 'NestJS',
    years: 2,
    company: 'comstruct',
    meta: 'Senior Engineer · APIs, microservices',
  },
  // Express
  {
    framework: 'Express',
    years: 1,
    company: 'TUM',
    meta: 'Working Student · Node.js backend',
  },
  {
    framework: 'Express',
    years: 2,
    company: 'comstruct',
    meta: 'Senior Engineer · REST APIs',
  },
  // Stencil
  {
    framework: 'Stencil',
    years: 0.5,
    company: 'Netlight',
    meta: 'Consultant · Reusable web components',
  },
  // JEE
  {
    framework: 'JEE',
    years: 3,
    company: 'Insumedical',
    meta: 'Junior Dev · E-commerce backend',
  },
  {
    framework: 'JEE',
    years: 1,
    company: 'EPN',
    meta: 'Software Dev · NLP research tool',
  },
  // .NET
  {
    framework: '.NET',
    years: 0.5,
    company: 'Weatherford',
    meta: 'Intern · ASP.NET, SharePoint',
  },
]

// --- Time chart: Skill Growth ---

export type SkillDomain = 'Frontend' | 'Backend' | 'AI / ML' | 'DevOps'

export interface SkillGrowthPoint {
  [key: string]: unknown
  year: string
  level: number
  domain: SkillDomain
  meta: string
}

export const SKILL_GROWTH_DATA: SkillGrowthPoint[] = [
  // ── Frontend ──────────────────────────────────────────────────────────────
  {
    year: '2009',
    level: 1,
    domain: 'Frontend',
    meta: 'HTML/CSS, basic JS, JSF templates',
  },
  {
    year: '2013',
    level: 2,
    domain: 'Frontend',
    meta: 'jQuery, Bootstrap basics',
  },
  { year: '2015', level: 3, domain: 'Frontend', meta: 'AngularJS, Bootstrap' },
  {
    year: '2017',
    level: 6,
    domain: 'Frontend',
    meta: 'Angular 2+, RxJS, Stencil',
  },
  { year: '2019', level: 8, domain: 'Frontend', meta: 'React, TypeScript, d3' },
  {
    year: '2021',
    level: 9,
    domain: 'Frontend',
    meta: 'React at scale, design systems',
  },
  {
    year: '2023',
    level: 9,
    domain: 'Frontend',
    meta: 'React, TypeScript, RxJS, d3',
  },
  {
    year: '2025',
    level: 9,
    domain: 'Frontend',
    meta: 'React, TS, FSD architecture',
  },
  // ── Backend ───────────────────────────────────────────────────────────────
  {
    year: '2009',
    level: 3,
    domain: 'Backend',
    meta: 'Java EE, C#/.NET fundamentals',
  },
  { year: '2013', level: 5, domain: 'Backend', meta: 'Java EE, C#/.NET, SQL' },
  { year: '2015', level: 6, domain: 'Backend', meta: 'JEE, .NET, SQL' },
  {
    year: '2017',
    level: 7,
    domain: 'Backend',
    meta: 'Node.js, Express, REST APIs',
  },
  {
    year: '2019',
    level: 7,
    domain: 'Backend',
    meta: 'NestJS, GraphQL, microservices',
  },
  {
    year: '2021',
    level: 8,
    domain: 'Backend',
    meta: 'NestJS, event-driven architecture',
  },
  {
    year: '2023',
    level: 9,
    domain: 'Backend',
    meta: 'NestJS, Express, Node.js',
  },
  {
    year: '2025',
    level: 9,
    domain: 'Backend',
    meta: 'NestJS, APIs, event-driven',
  },
  // ── AI / ML ───────────────────────────────────────────────────────────────
  { year: '2009', level: 1, domain: 'AI / ML', meta: 'No exposure' },
  { year: '2013', level: 1, domain: 'AI / ML', meta: 'Academic exposure' },
  {
    year: '2015',
    level: 2,
    domain: 'AI / ML',
    meta: 'Python basics, scikit-learn',
  },
  { year: '2017', level: 2, domain: 'AI / ML', meta: 'Data analysis, Jupyter' },
  {
    year: '2019',
    level: 3,
    domain: 'AI / ML',
    meta: 'ML pipelines, TensorFlow',
  },
  {
    year: '2021',
    level: 5,
    domain: 'AI / ML',
    meta: 'NLP, LLM experimentation',
  },
  {
    year: '2023',
    level: 7,
    domain: 'AI / ML',
    meta: 'AI agents, Claude, prompt eng.',
  },
  {
    year: '2025',
    level: 9,
    domain: 'AI / ML',
    meta: 'Agentic systems, orchestration',
  },
  // ── DevOps ────────────────────────────────────────────────────────────────
  { year: '2009', level: 1, domain: 'DevOps', meta: 'No exposure' },
  { year: '2013', level: 1, domain: 'DevOps', meta: 'Manual deployments' },
  { year: '2015', level: 2, domain: 'DevOps', meta: 'Basic CI, shell scripts' },
  { year: '2017', level: 3, domain: 'DevOps', meta: 'Docker, Jenkins' },
  {
    year: '2019',
    level: 5,
    domain: 'DevOps',
    meta: 'GCP, Docker, CI/CD pipelines',
  },
  { year: '2021', level: 6, domain: 'DevOps', meta: 'GitHub Actions, IaC' },
  {
    year: '2023',
    level: 6,
    domain: 'DevOps',
    meta: 'GCP, Docker, GitHub Actions',
  },
  { year: '2025', level: 7, domain: 'DevOps', meta: 'GCP, Docker, CI/CD, IaC' },
]

// --- Time chart: Focus Split ---

export type FocusLayer = 'Frontend' | 'Backend' | 'Infra' | 'UX'

export interface FocusSplitPoint {
  [key: string]: unknown
  year: string
  /** Percentage of work effort. All layers for a given year must sum to 100. */
  pct: number
  layer: FocusLayer
  meta: string
}

export const FOCUS_SPLIT_DATA: FocusSplitPoint[] = [
  // 2009 — early career, heavily backend / Java
  { year: '2009', pct: 10, layer: 'Frontend', meta: 'HTML/CSS, JSF templates' },
  { year: '2009', pct: 85, layer: 'Backend', meta: 'Java EE, C# — core focus' },
  { year: '2009', pct: 5, layer: 'Infra', meta: 'Minimal — manual deploys' },
  { year: '2009', pct: 0, layer: 'UX', meta: 'None yet' },
  // 2013
  { year: '2013', pct: 15, layer: 'Frontend', meta: 'AngularJS, jQuery' },
  {
    year: '2013',
    pct: 75,
    layer: 'Backend',
    meta: 'Java EE, .NET — enterprise core',
  },
  { year: '2013', pct: 8, layer: 'Infra', meta: 'Basic scripts' },
  { year: '2013', pct: 2, layer: 'UX', meta: 'UI prototyping, early interest' },
  // 2016 — TUM + Netlight UX stint
  { year: '2016', pct: 30, layer: 'Frontend', meta: 'Angular, component libs' },
  { year: '2016', pct: 48, layer: 'Backend', meta: 'Node.js, Express, REST' },
  { year: '2016', pct: 10, layer: 'Infra', meta: 'Docker, basic CI' },
  {
    year: '2016',
    pct: 12,
    layer: 'UX',
    meta: 'UX design, Illustrator, Inkscape',
  },
  // 2019 — Celonis SE, frontend pivots stronger
  { year: '2019', pct: 45, layer: 'Frontend', meta: 'React, TypeScript, SPAs' },
  { year: '2019', pct: 35, layer: 'Backend', meta: 'NestJS, GraphQL, events' },
  { year: '2019', pct: 13, layer: 'Infra', meta: 'GCP, Docker, CI/CD' },
  { year: '2019', pct: 7, layer: 'UX', meta: 'User-oriented design, research' },
  // 2022 — Senior at Celonis, process mining at scale
  {
    year: '2022',
    pct: 42,
    layer: 'Frontend',
    meta: 'React, design systems, d3',
  },
  { year: '2022', pct: 38, layer: 'Backend', meta: 'NestJS, microservices' },
  { year: '2022', pct: 12, layer: 'Infra', meta: 'GitHub Actions, IaC' },
  { year: '2022', pct: 8, layer: 'UX', meta: 'Mentoring, release management' },
  // 2025 — comstruct, full-stack with growing AI / Infra share
  { year: '2025', pct: 40, layer: 'Frontend', meta: 'React, TypeScript, d3' },
  { year: '2025', pct: 35, layer: 'Backend', meta: 'NestJS, Express, Node.js' },
  {
    year: '2025',
    pct: 15,
    layer: 'Infra',
    meta: 'GCP, Docker, GitHub Actions',
  },
  { year: '2025', pct: 10, layer: 'UX', meta: 'Design systems, UX patterns' },
]

// ─── Education ────────────────────────────────────────────────────────────────

export interface EducationEntry {
  institution: string
  degree: string
  startYear: number
  endYear: number
}

export const EDUCATION: EducationEntry[] = [
  {
    institution: 'Escuela Politécnica Nacional',
    degree: "Engineer's Degree, Information Systems & Computer Science",
    startYear: 2006,
    endYear: 2013,
  },
  {
    institution: 'Technical University of Munich',
    degree: 'M.Sc. Informatics',
    startYear: 2015,
    endYear: 2018,
  },
]

// ─── Certifications & Awards ──────────────────────────────────────────────────

export interface Award {
  title: string
  issuer: string
  year: number
}

export const AWARDS: Award[] = [
  {
    title: 'Test-Driven Development (TDD) Certification',
    issuer: 'IBM Cloud Garage',
    year: 2019,
  },
  {
    title: 'Top World Universities Scholarship Award',
    issuer: 'Technical University of Munich',
    year: 2015,
  },
  {
    title: 'Valedictorian — High Performance Group Level 4',
    issuer: 'Escuela Politécnica Nacional',
    year: 2013,
  },
]

// ─── Human languages ─────────────────────────────────────────────────────────

export interface HumanLanguage {
  language: string
  level: 'Native' | 'Full Professional' | 'Basic'
}

export const HUMAN_LANGUAGES: HumanLanguage[] = [
  { language: 'Spanish', level: 'Native' },
  { language: 'English', level: 'Full Professional' },
  { language: 'German', level: 'Basic' },
]
