# Migration Inventory — AngularJS 1.6 → React (acceptance checklist)

Single source of truth = legacy `index.html` (copy), `mainCSS.css` (design), `module.js` (behavior).
Every item below must be present, unaltered, in the React app. Used by `verification/verify.ts` for content parity.

---

## 1. SEO / `<head>` meta

| Tag | Value |
| --- | --- |
| `title` | `Sumanth Venkata • Senior Front-End Engineer` |
| `meta description` | `Sumanth Venkata — Senior front-end engineer: React, Angular, TypeScript, micro-frontends, AWS, accessibility, and AI-powered web apps.` |
| `meta author` | `Sumanth Venkata` |
| `meta viewport` | `width=device-width, initial-scale=1, viewport-fit=cover` |
| `link canonical` | `https://sumanthvenkata.com/` |
| `og:title` | `Sumanth Venkata — Senior Front-End Engineer` |
| `og:description` | `Senior front-end engineer: React, Angular, TypeScript, micro-frontends, AWS, accessibility, and AI-powered web apps.` |
| `og:type` | `website` |
| `og:url` | `https://sumanthvenkata.com/` |
| `og:image` | `https://sumanthvenkata.com/mypic.jpg` |
| `twitter:card` | `summary_large_image` |
| `twitter:title` | `Sumanth Venkata — Senior Front-End Engineer` |
| `twitter:description` | (same as og:description) |
| `twitter:image` | `https://sumanthvenkata.com/mypic.jpg` |
| favicon | `favicon.ico` |
| Fonts | Inter (300;400;600;800) + Lora (ital 0,400;0,600;1,400) via Google Fonts |
| Icons | Devicon via jsDelivr CDN |

**Per-route canonical/title (react-helmet-async), routes:** `/`, `/about`, `/work`, `/projects`, `/contact`.

---

## 2. Navigation (order preserved)

Brand: **Sumanth Venkata** → Home.
Links in order: **Home · About · Work · Projects · Contact** + **Resume** button.
(Legacy tab ids: Home=1, About=2, Work=3, Projects=5, Contact=4 — order is Home·About·Work·Projects·Contact.)

- Resume → `assets/resume/sumanth_venkata_resume.pdf` (new tab, download icon)
- Mobile hamburger collapses after tapping a link.
- Active link derived from current route.

---

## 3. Home (`/`)

- **BG image:** `laptopBackground.jpg`
- **Profile pic:** `mypic.jpg`
- **H1:** `Hello, I’m Sumanth` + `Venkata` (accent on "Sumanth"; hero gradient shine, NO underline)
- **Role:** `Senior UI / Front-End Engineer · React · Angular · TypeScript · Micro-Frontends`
- **CTAs:** `View Work` → /work · `Contact Me` → /contact
- **Stat strip (count-up):**
  - `8+` — `Years experience` (target 8, suffix `+`)
  - `1.3M+` — `Annual sessions` (target 1.3, decimals 1, suffix `M+`)
  - `10×` — `Faster builds` (target 10, suffix `×`)
- **"Few lines about me" card** — 3 paragraphs (verbatim):
  1. "I’m a **senior front-end engineer** with 8 years building fast, accessible, large-scale web applications for enterprise and federally regulated platforms. For the past several years I’ve been the lead front-end engineer on **CMS’s QualityNet Platform** (with Cadmus Group, formerly Ventera) — a federal healthcare system spanning six mandated programs whose data drives Medicare value-based purchasing and reimbursement decisions worth billions."
  2. "I work primarily in **React, Angular, and TypeScript** on top of Node.js APIs. Right now I’m architecting a **Module Federation micro-frontend platform** (Vite) that hosts multiple independently deployable React and Angular apps behind a shared authentication shell and a private design-system / component library. I care deeply about design systems, performance, and accessibility — **Section 508 / WCAG** is part of how I build, not an afterthought."
  3. "I’m also building **AI into real products** — integrating LLMs (Anthropic Claude, Google Gemini) with prompt engineering and schema-validated structured outputs. Open to senior, lead, and principal front-end and full-stack roles, remote or in the DC metro area."

---

## 4. About (`/about`)

- **BG:** `aboutMeBackgroundImage.jpg`
- **H1:** `About Me` (underline)
- **Role:** `Professional developer with ~8 years of experience crafting web & front-end applications.`
- **Heading:** `Technical Skills` (underline)
- **Tech strip (20 logos, order):** React, TypeScript, JavaScript, Angular, Redux, Node.js, HTML5, CSS3, Sass, Bootstrap, Tailwind CSS, Material UI, Vite, Jest, Docker, AWS, Jenkins, Git, Figma, Storybook
- **Skill categories (12 cards):**
  1. **Languages** — JavaScript (ES6+), TypeScript, HTML5, CSS3, SASS/LESS
  2. **Frameworks & Libraries** — React.js (React 18, JSX, Hooks, Context API), Redux, Angular (2–20), Node.js, Express.js, RxJS, NgRx
  3. **UI & Data Viz** — Material UI (MUI), AG Grid, AmCharts, Angular Material, Bootstrap, Tailwind CSS
  4. **Design & UX** — Figma (mockups, components, design-spec / CSS inspection), wireframing, design hand-off, responsive & accessible UI
  5. **Architecture** — Micro-Frontends, Module Federation, design system / shared component library, Storybook, SPA & PWA
  6. **Build & Testing** — Vite, esbuild, Webpack, Rollup, Babel, npm · Jest, React Testing Library, Cypress (e2e), Enzyme, Jasmine, Karma, TDD
  7. **CI/CD & DevOps** — Jenkins (Groovy shared libraries), GitHub Actions, Docker, AWS ECS, JFrog Artifactory, SonarQube, Husky / Prettier, Git / GitHub
  8. **Analytics** — Matomo, Datadog RUM, New Relic Browser, real-user monitoring, custom event & page-view tracking
  9. **GenAI / AI** — LLM integration (Anthropic Claude, Google Gemini), prompt engineering, structured outputs & schema validation, semantic / vector search (consuming embeddings APIs), AI-assisted development (Claude Code)
  10. **APIs & Web** — RESTful APIs, JSON, AJAX, JWT auth, DOM & JavaScript object model
  11. **Accessibility & Compliance** — Section 508, WCAG 2.x, ARIA, JAWS, NVDA, Axe, WAVE · HIPAA, FedRAMP / FISMA
  12. **Practices & Tools** — Agile / Scrum, code reviews, mentoring, Jira
- **Heading:** `Education` (underline)
- **Education (2):**
  - **Master of Science, Computer Science** — University of Central Missouri (link ucmo.edu), USA. `Aug 2016 – Dec 2017`
  - **Bachelor of Science, Computer Science** — Anna University (link annauniv.edu), India. `2012 – 2016`

---

## 5. Work (`/work`)

- **BG:** `workTieImage.jpg`
- **H1:** `Experience` (underline)
- **Role:** `Overview of my recent work`
- **Timeline item 1 — Cadmus Group — CMS**
  - Title: `Senior UI / Front-End Engineer`
  - Period: `Mar 2019 – Present • Reston, VA (Remote)`
  - Context: "QualityNet Platform (QNP) — CMS’s secure federal healthcare-quality-reporting platform across six mandated programs; ~1.3M+ sessions and 3.8M+ pageviews/year; built to HIPAA, Section 508, and FedRAMP / FISMA standards."
  - 8 bullets (Module Federation; React lead; AI semantic search; Angular v20; build times ~5–10×; standards/reviews/mentor; Jenkins/Docker/ECS/SonarQube/508 gates; Section 508 WCAG JAWS/NVDA/Axe)
- **Timeline item 2 — UnitedHealth Group / Optum** (contract via Pioneer Consulting Services)
  - Title: `Senior React Developer`
  - Period: `Jul 2018 – Feb 2019 • Hartford, CT`
  - Context: "Built the front end of BEACH (Benefit Eligibility and Coverage Hub), a benefits-browser app for plan coverage, copays, deductibles, and coinsurance."
  - 5 bullets (React/TS perf; AG Grid + AmCharts; Material UI lib; Redux + code splitting; 80%+ tests + Node/Express)

(Full bullet text in legacy `index.html` lines 266–294 — must match verbatim.)

---

## 6. Projects (`/projects`)

- **BG:** `laptopBackground.jpg`
- **H1:** `Projects` (underline) · **Role:** `A few things I’ve built end-to-end`
- **Cards (4, order):**
  1. **QualityNet Platform** — badge `Federal Platform` (lock icon). Attribution: `CMS · Cadmus Group (contract) · Lead Front-End Engineer`. Tech: `React 18 · Angular · TypeScript · Module Federation (Vite) · Node.js · Section 508`. Link → `https://qualitynet.cms.gov` (label qualitynet.cms.gov).
  2. **The Big Screen Index** — subtitle `GenAI Editorial Automation Platform`. Tech: `TypeScript · Anthropic Claude API · Puppeteer · GitHub Actions · Cloudflare R2`. Link → `https://github.com/sumanthvenkata03/ott-weekend-bot` (View on GitHub).
  3. **Astro Match** — subtitle `Vedic Compatibility PWA`. Tech: `Angular 19 · TypeScript · Free-Astrology-API · Google Gemini · Vercel`. Link → `https://astro-match-nu.vercel.app/` (View Live).
  4. **AI-Powered Semantic Search (CMS)** — subtitle `Internal document-search front end`. Tech: `React · TypeScript · Vite`. No link — `Internal project — no public link`.

(Full project descriptions in legacy `index.html` lines 320–361 — must match verbatim.)

---

## 7. Contact (`/contact`)

- **BG:** `connectMe.jpg`
- **H1:** `Contact Me` (underline)
- **Role:** `I’m open to senior / lead / principal front-end and full-stack roles — remote or DC-metro. Let’s talk.`
- **Details:** email `sumanth.techie9@gmail.com` · phone `+1 815-496-0803` · location `Leesburg, VA`
- **Form** (legacy: Formspree `https://formspree.io/f/xqalngpk`): fields First name (req), Last name, Email (req, email), Phone (tel), Message (req). Hidden `formName=Portfolio Contact`, honeypot `_gotcha`. Submit button. Inline success/error toast.
  - React target: controlled by `contactSlice`; submit → `mailto:` prefill by default, or Formspree POST if `VITE_FORMSPREE_ID` set.

---

## 8. Footer (every section)

- Heading: `Let’s Connect`
- GitHub → `https://github.com/sumanthvenkata03` (icon `assets/logo/git.svg`)
- LinkedIn → `https://www.linkedin.com/in/sumanth-venkata-156690159/` (icon `assets/logo/linkedin.png`)
- Email → `mailto:sumanth.techie9@gmail.com` (envelope glyph)

---

## 9. Design tokens (`:root`) — port verbatim

```
--bg:#0e1013; --card:#14181f; --muted:#9aa0a6;
--navy:#1F3864; --teal:#0F766E; --teal-light:#5EEAD4;
--accent:var(--teal); --accent-2:var(--navy); --accent-text:var(--teal-light); --white:#fff;
```
Body bg `#0e1013`, text `#e8eaed`. Card base `rgba(255,255,255,0.05)` border `rgba(255,255,255,0.10)`; `.card-soft` navy→teal gradient.

## 10. Keyframes (10) — port verbatim

`textMove`, `heroIn`, `floaty`, `nameShine`, `orbDriftA`, `orbDriftB`, `btnShine`, `toastEnter`, `toastGlow`, `toastProgress`.

## 11. Breakpoints

`480 / 575 / 600 / 767 / 768 / 991 / 992` px.

## 12. Behaviors (from module.js) to reproduce

- Scroll-to-top + focus to `<h1>` on route change.
- Mobile nav collapse on link tap.
- Scroll-reveal (→ Framer `whileInView`), staggered.
- Count-up stats on view.
- Scroll-progress bar.
- Cursor 3D tilt on `.project-card` / `.skill-cat` (desktop pointer, reduced-motion off).
- Hero name shine, drifting orbs, button shine, animated heading underline.

## 13. Static assets to serve verbatim (→ `public/`)

`CNAME` (=`sumanthvenkata.com`), `robots.txt`, `sitemap.xml`, `favicon.ico`, `mypic.jpg`,
`aboutMeBackgroundImage.jpg`, `connectMe.jpg`, `laptopBackground.jpg`, `workTieImage.jpg`,
`assets/logo/git.svg`, `assets/logo/linkedin.png`, `assets/resume/sumanth_venkata_resume.pdf`.

`base: '/'` (apex custom domain). `CNAME` MUST be in `dist/`.

---

## 14. Cross-check vs Appendix A

| Appendix A claim | Actual | Status |
| --- | --- | --- |
| Tokens (10 vars) | match `mainCSS.css :root` | ✅ |
| Fonts Inter+Lora | match | ✅ |
| 10 keyframes | match | ✅ |
| Routes /,/about,/work,/projects,/contact | maps to tabs 1,2,3,5,4 | ✅ |
| Stats 8 / 1.3 / 10 | labels Years experience / Annual sessions / Faster builds; suffixes +, M+, × | ✅ |
| Skills strip 20 logos | match list in §4 | ✅ |
| Breakpoints | match | ✅ |
| SEO meta | matches (domain = sumanthvenkata.com) | ✅ |
| Replace Angular 1.6.4 / jQuery 1.12.4 / Bootstrap 3.3.7 | will be removed | ✅ planned |

**Discrepancies flagged:** none material. Notes:
- Orphan file `linkedin.jpg` at repo root is **not** referenced by the site (footer uses `assets/logo/linkedin.png`); excluded from `public/`.
- Legacy `og:image`/`twitter:image` already updated to `https://sumanthvenkata.com/mypic.jpg` (done in prior commit).
