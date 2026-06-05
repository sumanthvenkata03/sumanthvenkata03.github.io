// Skills data — ported verbatim from legacy index.html (About section).

export interface TechIcon {
  /** Devicon class (kept on the CDN icon set used by the legacy site). */
  icon: string;
  label: string;
}

/** Headline tech strip — 20 icons, original order. */
export const TECH_STRIP: TechIcon[] = [
  { icon: 'devicon-react-original colored', label: 'React' },
  { icon: 'devicon-typescript-plain colored', label: 'TypeScript' },
  { icon: 'devicon-javascript-plain colored', label: 'JavaScript' },
  { icon: 'devicon-angular-plain colored', label: 'Angular' },
  { icon: 'devicon-redux-original colored', label: 'Redux' },
  { icon: 'devicon-nodejs-plain colored', label: 'Node.js' },
  { icon: 'devicon-html5-plain colored', label: 'HTML5' },
  { icon: 'devicon-css3-plain colored', label: 'CSS3' },
  { icon: 'devicon-sass-original colored', label: 'Sass' },
  { icon: 'devicon-bootstrap-plain colored', label: 'Bootstrap' },
  { icon: 'devicon-tailwindcss-original colored', label: 'Tailwind CSS' },
  { icon: 'devicon-materialui-plain colored', label: 'Material UI' },
  { icon: 'devicon-vitejs-plain colored', label: 'Vite' },
  { icon: 'devicon-jest-plain colored', label: 'Jest' },
  { icon: 'devicon-docker-plain colored', label: 'Docker' },
  { icon: 'devicon-amazonwebservices-plain-wordmark colored', label: 'AWS' },
  { icon: 'devicon-jenkins-plain colored', label: 'Jenkins' },
  { icon: 'devicon-git-plain colored', label: 'Git' },
  { icon: 'devicon-figma-plain colored', label: 'Figma' },
  { icon: 'devicon-storybook-plain colored', label: 'Storybook' },
];

export interface SkillCategory {
  title: string;
  body: string;
}

/** Categorized skills — 12 cards, original order + text. */
export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Languages',
    body: 'JavaScript (ES6+), TypeScript, HTML5, CSS3, SASS/LESS',
  },
  {
    title: 'Frameworks & Libraries',
    body: 'React.js (React 18, JSX, Hooks, Context API), Redux, Angular (2–20), Node.js, Express.js, RxJS, NgRx',
  },
  {
    title: 'UI & Data Viz',
    body: 'Material UI (MUI), AG Grid, AmCharts, Angular Material, Bootstrap, Tailwind CSS',
  },
  {
    title: 'Design & UX',
    body: 'Figma (mockups, components, design-spec / CSS inspection), wireframing, design hand-off, responsive & accessible UI',
  },
  {
    title: 'Architecture',
    body: 'Micro-Frontends, Module Federation, design system / shared component library, Storybook, SPA & PWA',
  },
  {
    title: 'Build & Testing',
    body: 'Vite, esbuild, Webpack, Rollup, Babel, npm · Jest, React Testing Library, Cypress (e2e), Enzyme, Jasmine, Karma, TDD',
  },
  {
    title: 'CI/CD & DevOps',
    body: 'Jenkins (Groovy shared libraries), GitHub Actions, Docker, AWS ECS, JFrog Artifactory, SonarQube, Husky / Prettier, Git / GitHub',
  },
  {
    title: 'Analytics',
    body: 'Matomo, Datadog RUM, New Relic Browser, real-user monitoring, custom event & page-view tracking',
  },
  {
    title: 'GenAI / AI',
    body: 'LLM integration (Anthropic Claude, Google Gemini), prompt engineering, structured outputs & schema validation, semantic / vector search (consuming embeddings APIs), AI-assisted development (Claude Code)',
  },
  {
    title: 'APIs & Web',
    body: 'RESTful APIs, JSON, AJAX, JWT auth, DOM & JavaScript object model',
  },
  {
    title: 'Accessibility & Compliance',
    body: 'Section 508, WCAG 2.x, ARIA, JAWS, NVDA, Axe, WAVE · HIPAA, FedRAMP / FISMA',
  },
  {
    title: 'Practices & Tools',
    body: 'Agile / Scrum, code reviews, mentoring, Jira',
  },
];
