# Deploying the React portfolio

The site is a static React app (Vite). It builds to `dist/` and is hosted on
**GitHub Pages** at the apex custom domain **https://sumanthvenkata.com**.

> ⚠️ **The live site is currently served from the `restore-2020` branch**
> ("Deploy from a branch"). Nothing in this branch changes that until *you*
> switch the Pages source. The deploy workflow below is committed but **inactive**.

## What's already wired

- `vite.config.ts` → `base: '/'` (apex custom domain, **not** `/repo-name/`).
- `public/CNAME` (= `sumanthvenkata.com`) is copied into `dist/` on every build —
  required or the custom domain breaks.
- `public/robots.txt`, `public/sitemap.xml`, `favicon.ico`, `mypic.jpg`, the
  background images, `assets/logo/*`, and the résumé PDF are served verbatim.
- **SPA deep links:** `npm run postbuild` copies `dist/index.html` → `dist/404.html`
  so refreshing a deep link (e.g. `/about`) still loads the app.
- **No-JS / SEO prerender:** `npm run prerender` snapshots each route's rendered
  HTML into `dist/<route>/index.html`, so the site shows full content without
  JavaScript and crawlers get static markup. `npm run build:static` = build +
  prerender (this is what CI runs).

## Build commands

```bash
npm install              # first time
npm run dev              # local dev server
npm run build            # SPA build -> dist/ (+ 404.html)
npm run build:static     # build + prerender every route (what deploy uses)
npm run preview          # preview the SPA build on :4173
npm run verify           # Playwright checks (build must be in dist/)
```

## Going live on GitHub Actions (when you're ready)

1. **Settings → Pages → Build and deployment → Source → "GitHub Actions".**
   (This is the switch that moves serving away from the `restore-2020` branch.)
2. Push to **`react-master`** (the default branch). That triggers
   `.github/workflows/deploy.yml`, which runs `npm ci`, installs Chromium,
   runs `npm run build:static`, and deploys `dist/` to Pages.
   - You can also trigger it manually: **Actions → Deploy to GitHub Pages → Run workflow**.
3. Confirm the custom domain is still set under **Settings → Pages → Custom domain**
   = `sumanthvenkata.com` (the `CNAME` file in `dist/` preserves it).

Until step 1 is done, the workflow's deploy step has nowhere to publish and the
existing branch-based deployment of `restore-2020` continues unchanged.

## Rolling back

The `restore-2020` branch (the original AngularJS site) is untouched, so you can
revert by switching the Pages source back to "Deploy from a branch" →
`restore-2020`. The legacy source also remains in this branch's git history.
