// Projects data — ported verbatim from legacy index.html (Projects section).

export interface Project {
  title: string;
  /** Federal badge label, if any. */
  badge?: string;
  /** Attribution line (federal card). */
  attribution?: string;
  /** Subtitle line (other cards). */
  subtitle?: string;
  tech: string;
  description: string;
  link?: { href: string; label: string };
  /** Shown instead of a link for internal projects. */
  internalNote?: string;
  federal?: boolean;
}

export const PROJECTS: Project[] = [
  {
    title: 'QualityNet Platform',
    badge: 'Federal Platform',
    attribution: 'CMS · Cadmus Group (contract) · Lead Front-End Engineer',
    tech: 'React 18 · Angular · TypeScript · Module Federation (Vite) · Node.js · Section 508',
    description:
      'Lead front-end engineer on CMS’s QualityNet Platform — the U.S. government’s secure system for healthcare quality reporting across six federally mandated programs, serving ~1.3M+ sessions a year. I architect a Module Federation micro-frontend platform (Vite) that hosts React and Angular applications behind a shared authentication shell and a private design-system / component library, and I deliver Section 508 / WCAG-compliant, high-performance UIs. Note: most of the platform is behind secure federal sign-in — the link opens the public site.',
    link: { href: 'https://qualitynet.cms.gov', label: 'qualitynet.cms.gov' },
    federal: true,
  },
  {
    title: 'The Big Screen Index',
    subtitle: 'GenAI Editorial Automation Platform',
    tech: 'TypeScript · Anthropic Claude API · Puppeteer · GitHub Actions · Cloudflare R2',
    description:
      'A production GenAI platform that auto-generates publication-grade Instagram carousels and reels from structured data. Integrates the Claude API with prompt engineering and schema-validated, type-safe structured outputs, and automates rendering + delivery end-to-end via Puppeteer and GitHub Actions (built through an agentic Claude Code workflow).',
    link: { href: 'https://github.com/sumanthvenkata03/ott-weekend-bot', label: 'View on GitHub' },
  },
  {
    title: 'Astro Match',
    subtitle: 'Vedic Compatibility PWA',
    tech: 'Angular 19 · TypeScript · Free-Astrology-API · Google Gemini · Vercel',
    description:
      'An Angular 19 PWA for 36-point Vedic Ashtakoot compatibility matching. Integrates an LLM (Gemini) for bilingual narrative output. Built and deployed end-to-end.',
    link: { href: 'https://astro-match-nu.vercel.app/', label: 'View Live' },
  },
  {
    title: 'AI-Powered Semantic Search (CMS)',
    subtitle: 'Internal document-search front end',
    tech: 'React · TypeScript · Vite',
    description:
      'Built the React/TypeScript front end for an internal semantic document-search tool over CMS policy PDFs, rendering ranked results (document, page, relevance) from a vector-search API.',
    internalNote: 'Internal project — no public link',
  },
];
