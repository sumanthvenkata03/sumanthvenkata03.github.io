// All site copy — single source of truth, ported verbatim from legacy index.html.
// Strings containing inline <b> markup are rendered via a small RichText helper
// (trusted static content) so the original emphasis is preserved exactly.

export interface StatItem {
  target: number;
  decimals: number;
  suffix: string;
  label: string;
}

export const HERO = {
  bgImage: '/laptopBackground.jpg',
  photo: '/mypic.jpg',
  greetingPre: 'Hello, I’m ',
  accent: 'Sumanth',
  rest: 'Venkata',
  role: 'Senior UI / Front-End Engineer · React · Angular · TypeScript · Micro-Frontends',
  stats: [
    { target: 8, decimals: 0, suffix: '+', label: 'Years experience' },
    { target: 1.3, decimals: 1, suffix: 'M+', label: 'Annual sessions' },
    { target: 10, decimals: 0, suffix: '×', label: 'Faster builds' },
  ] as StatItem[],
  aboutHeading: 'Few lines about me',
  aboutParagraphs: [
    'I’m a <b>senior front-end engineer</b> with 8 years building fast, accessible, large-scale web applications for enterprise and federally regulated platforms. For the past several years I’ve been the lead front-end engineer on <b>CMS’s QualityNet Platform</b> (with Cadmus Group, formerly Ventera) — a federal healthcare system spanning six mandated programs whose data drives Medicare value-based purchasing and reimbursement decisions worth billions.',
    'I work primarily in <b>React, Angular, and TypeScript</b> on top of Node.js APIs. Right now I’m architecting a <b>Module Federation micro-frontend platform</b> (Vite) that hosts multiple independently deployable React and Angular apps behind a shared authentication shell and a private design-system / component library. I care deeply about design systems, performance, and accessibility — <b>Section 508 / WCAG</b> is part of how I build, not an afterthought.',
    'I’m also building <b>AI into real products</b> — integrating LLMs (Anthropic Claude, Google Gemini) with prompt engineering and schema-validated structured outputs. Open to senior, lead, and principal front-end and full-stack roles, remote or in the DC metro area.',
  ],
};

export const SECTION = {
  about: {
    bgImage: '/aboutMeBackgroundImage.jpg',
    title: 'About Me',
    role: 'Professional developer with ~8 years of experience crafting web & front-end applications.',
    skillsHeading: 'Technical Skills',
    educationHeading: 'Education',
  },
  work: {
    bgImage: '/workTieImage.jpg',
    title: 'Experience',
    role: 'Overview of my recent work',
  },
  projects: {
    bgImage: '/laptopBackground.jpg',
    title: 'Projects',
    role: 'A few things I’ve built end-to-end',
  },
  contact: {
    bgImage: '/connectMe.jpg',
    title: 'Contact Me',
    role: 'I’m open to senior / lead / principal front-end and full-stack roles — remote or DC-metro. Let’s talk.',
  },
};

export interface ExperienceItem {
  title: string;
  company: string;
  companySuffix?: string;
  period: string;
  context: string;
  bullets: string[];
  side: 'left' | 'right';
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    title: 'Senior UI / Front-End Engineer',
    company: 'Cadmus Group — CMS',
    period: 'Mar 2019 – Present • Reston, VA (Remote)',
    context:
      'QualityNet Platform (QNP) — CMS’s secure federal healthcare-quality-reporting platform across six mandated programs; ~1.3M+ sessions and 3.8M+ pageviews/year; built to HIPAA, Section 508, and FedRAMP / FISMA standards.',
    bullets: [
      'Architected a <b>Module Federation</b> micro-frontend platform (Vite) hosting multiple independently deployable React and Angular apps behind a shared authentication shell and a private design-system / component library (Storybook).',
      'Lead <b>React</b> development (React 18, Hooks, Context API, Redux, TypeScript) — translating Figma designs into reusable components and data dashboards that consume RESTful APIs.',
      'Built the React/TypeScript front end for an internal <b>AI-powered semantic document-search</b> tool over CMS policy PDFs — ranked results with source metadata, consuming a vector-search API.',
      'Deliver and oversee <b>Angular</b> (through v20) reporting/admin apps using RxJS and NgRx.',
      'Cut production build times <b>~5–10×</b> by migrating to esbuild-based tooling; tuned bundling and load performance.',
      'Set front-end standards, run code reviews, and mentor developers; partner closely with UX in Figma.',
      'Front-end CI/CD: reusable Jenkins shared-library functions (Groovy), Docker / AWS ECS, SonarQube, and Section 508 quality gates.',
      'Deliver full <b>Section 508 / WCAG</b> accessibility (JAWS, NVDA, Axe).',
    ],
    side: 'left',
  },
  {
    title: 'Senior React Developer',
    company: 'UnitedHealth Group / Optum',
    companySuffix: ' (contract via Pioneer Consulting Services)',
    period: 'Jul 2018 – Feb 2019 • Hartford, CT',
    context:
      'Built the front end of BEACH (Benefit Eligibility and Coverage Hub), a benefits-browser app for plan coverage, copays, deductibles, and coinsurance.',
    bullets: [
      'Built fast, responsive UIs in <b>React and TypeScript</b> — reduced page-load times 30% and improved Lighthouse scores 20+ points.',
      'Rich data visualizations with <b>AG Grid</b> (large datasets) and <b>AmCharts</b> (analytics).',
      'Implemented <b>Material UI</b> components and a reusable component library.',
      'Managed state with <b>Redux</b>; cut initial bundle size 40% with lazy loading and route-based code splitting.',
      '80%+ unit-test coverage (Jest, React Testing Library, Enzyme) plus Cypress e2e; built supporting Node.js / Express REST APIs.',
    ],
    side: 'right',
  },
];

export interface EducationItem {
  degree: string;
  school: string;
  schoolUrl: string;
  location: string;
  period: string;
}

export const EDUCATION: EducationItem[] = [
  {
    degree: 'Master of Science, Computer Science',
    school: 'University of Central Missouri',
    schoolUrl: 'https://www.ucmo.edu',
    location: 'USA.',
    period: 'Aug 2016 – Dec 2017',
  },
  {
    degree: 'Bachelor of Science, Computer Science',
    school: 'Anna University',
    schoolUrl: 'https://www.annauniv.edu',
    location: 'India.',
    period: '2012 – 2016',
  },
];

export const CONTACT_DETAILS = {
  email: 'sumanth.techie9@gmail.com',
  phoneDisplay: '+1 815-496-0803',
  phoneHref: 'tel:+18154960803',
  location: 'Leesburg, VA',
};

export const RESUME_HREF = '/assets/resume/sumanth_venkata_resume.pdf';

export const SOCIAL = {
  github: 'https://github.com/sumanthvenkata03',
  linkedin: 'https://www.linkedin.com/in/sumanth-venkata-156690159/',
  email: 'sumanth.techie9@gmail.com',
};

const BASE_DESC =
  'Senior front-end engineer: React, Angular, TypeScript, micro-frontends, AWS, accessibility, and AI-powered web apps.';

export interface RouteMeta {
  title: string;
  description: string;
  canonical: string;
}

export const SEO: Record<string, RouteMeta> = {
  '/': {
    title: 'Sumanth Venkata • Senior Front-End Engineer',
    description: `Sumanth Venkata — ${BASE_DESC}`,
    canonical: 'https://sumanthvenkata.com/',
  },
  '/about': {
    title: 'About • Sumanth Venkata',
    description: `About Sumanth Venkata — ${BASE_DESC}`,
    canonical: 'https://sumanthvenkata.com/about/',
  },
  '/work': {
    title: 'Work • Sumanth Venkata',
    description: `Work experience of Sumanth Venkata — ${BASE_DESC}`,
    canonical: 'https://sumanthvenkata.com/work/',
  },
  '/projects': {
    title: 'Projects • Sumanth Venkata',
    description: `Projects by Sumanth Venkata — ${BASE_DESC}`,
    canonical: 'https://sumanthvenkata.com/projects/',
  },
  '/contact': {
    title: 'Contact • Sumanth Venkata',
    description: `Contact Sumanth Venkata — ${BASE_DESC}`,
    canonical: 'https://sumanthvenkata.com/contact/',
  },
};
