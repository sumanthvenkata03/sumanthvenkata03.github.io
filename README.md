# Sumanth Venkata — Personal Portfolio

Personal portfolio for **Sumanth Venkata**, a Senior Front-End Engineer — a modern
**React + TypeScript** single-page app hosted on **GitHub Pages** at the apex custom domain:

🔗 **https://sumanthvenkata.com/**

It presents a hero/about intro, technical skills, work experience, featured projects, and
contact details, plus a downloadable résumé — across five routes with a fixed top nav and
a mobile hamburger menu.

> Migrated from the original AngularJS 1.6 / Bootstrap 3 static site to React. The original
> site remains on the `restore-2020` branch and in this branch's git history.

## Tech stack

- **React 19** + **TypeScript** (`strict`)
- **Vite** (build / dev), `base: '/'` for the apex custom domain
- **Redux Toolkit** + **React-Redux** (typed hooks) — UI state + contact form state
- **React Router 7** — a real URL per section (`/`, `/about`, `/work`, `/projects`, `/contact`)
- **Framer Motion** — route transitions, scroll-reveal, 3D card tilt
- **CSS Modules** + a global design-token layer (ported 1:1 from the original CSS)
- **React 19 native document metadata** for per-route `<title>` / canonical / Open Graph
- **Devicon** (CDN) for technology logos · **Google Fonts** (Inter, Lora)

No runtime framework CDNs — AngularJS, jQuery, and Bootstrap have been removed.

## What's in the repo

| Path | Purpose |
| --- | --- |
| `index.html` | Vite entry; holds the base SEO meta present in the served HTML. |
| `src/main.tsx`, `src/App.tsx` | App bootstrap — Redux `<Provider>` + `<RouterProvider>`. |
| `src/routes/` | `createBrowserRouter` route map. |
| `src/pages/` | `Home` / `About` / `Work` / `Projects` / `Contact` (component + CSS module each). |
| `src/components/layout/` | `Navbar`, `Footer`, `Layout`, `SkipLink`. |
| `src/components/ui/` | `SectionShell`, `SectionHeading`, `Card`, `Button`, `CountUp`, `Reveal`, `Tilt`, `Icon`, `Seo`, … |
| `src/components/graphics/` | `ScrollProgress`, `Orbs` (hero depth). |
| `src/store/` | `configureStore`, typed hooks, `slices/` (`uiSlice`, `contactSlice`), `middleware/persist.ts`. |
| `src/hooks/` | `useScrollProgress`, `useSyncReducedMotion`, `useAnimationsActive`. |
| `src/data/` | **All copy** — `content.ts`, `skills.ts`, `projects.ts` (single source of truth). |
| `src/styles/` | `tokens.css`, `global.css`, `keyframes.css`. |
| `public/` | Served verbatim — `CNAME`, `robots.txt`, `sitemap.xml`, `favicon.ico`, images, `assets/logo/*`, résumé PDF. |
| `verification/` | Playwright harness (`verify.ts`), baseline screenshots, and the prerender script. |
| `.github/workflows/deploy.yml` | GitHub Pages deploy workflow (inactive — see [DEPLOY.md](DEPLOY.md)). |

## How it works

- **Routing.** Each section is a route. The active nav link, scroll-to-top, and focus-to-`<main>`
  on navigation are all handled in `Layout`.
- **State (Redux).** `uiSlice` tracks the mobile menu, reduced-motion, the animations toggle,
  and active section; `contactSlice` holds the controlled contact form (fields, validation,
  status). The animations preference is persisted to `localStorage`.
- **Contact form.** Validated client-side; submits by opening a prefilled `mailto:` draft by
  default, or POSTs to Formspree if `VITE_FORMSPREE_ID` is set.
- **Accessibility.** Keyboard-operable throughout, visible focus rings, a skip link, and full
  `prefers-reduced-motion` support (plus a user toggle). Verified with `@axe-core/playwright`.
- **Progressive enhancement (no-JS).** `npm run build:static` prerenders every route to static
  HTML, so the site shows full content without JavaScript and crawlers get real markup.

## Running locally

Requires **Node 20+**.

```bash
npm install            # first time

npm run dev            # dev server with hot reload  -> http://localhost:5173/
npm run build          # type-check + production SPA build -> dist/
npm run build:static   # build + prerender every route (closest to production)
npm run preview        # serve the build -> http://localhost:4173/

npm run lint           # eslint
npm run typecheck      # tsc --noEmit (strict)
npm run verify         # Playwright checks (needs a build served on :4173)
```

## Deployment

Hosted on **GitHub Pages** at the apex custom domain (`sumanthvenkata.com`, preserved by
`public/CNAME`). A deploy workflow is committed but **inactive**; activation and rollback are
documented in **[DEPLOY.md](DEPLOY.md)**.
