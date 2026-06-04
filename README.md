# Sumanth Venkata — Personal Portfolio

A single-page personal portfolio website for **Sumanth Venkata**, a Senior Front-End Engineer.
It's a static site hosted on **GitHub Pages** and served live at:

🔗 **https://sumanthvenkata03.github.io/**

The site presents an "About me", work experience, featured projects, a skills/tech
overview, and contact details, plus a downloadable résumé — all on one page with
tabbed navigation.

## What's in the repo

| File / folder | Purpose |
| --- | --- |
| `index.html` | The entire single-page site markup (nav, hero, About, Work, Projects, Contact sections). |
| `mainCSS.css` | All custom styling — layout, theme, responsive/mobile-first rules, and animations. |
| `module.js` | The AngularJS app + vanilla-JS enhancements (tab switching, scroll-reveal, count-up stats, scroll progress bar, cursor-tilt cards). |
| `assets/logo/` | Social/link icons (GitHub, LinkedIn). |
| `assets/resume/` | Downloadable PDF résumé. |
| `*.jpg`, `favicon.ico` | Hero/section background photos and the site favicon. |

## How it works

- **Single page, tabbed UI.** Each "page" (Home, About, Work, Projects, Contact) is a
  section that's shown/hidden by AngularJS based on the active tab (`vm.tab`). The nav
  links — both the desktop bar and the mobile hamburger menu — set the active tab.
- **Switching tabs scrolls back to the top** so every section opens at the top of the page.
- **Progressive enhancement.** Content is fully visible without JavaScript; JS layers on
  scroll-reveal animations, animated stat counters, and a scroll-progress bar. Animations
  respect the user's `prefers-reduced-motion` setting.
- **Mobile-first & responsive**, optimized for phones up through desktop.

## Tech stack

- **HTML5 / CSS3** (custom styling, no build step)
- **AngularJS 1.6** (loaded from CDN) for the tab/controller logic
- **Bootstrap 3** (CDN) for the responsive grid and navbar
- **Devicon** (CDN) for technology logos
- **Google Fonts** (Inter, Lora)
- **Vanilla JavaScript** for the animation system

There is **no build tooling, package manager, or framework bundler** — it's plain static
files loaded directly by the browser.

## Running it locally

Because it's a static site, just open `index.html` in a browser. For a more
production-like setup (so relative paths and CDN scripts behave), serve the folder over a
local web server, for example:

```bash
# Python 3
python -m http.server 8000
# then visit http://localhost:8000
```

```bash
# Node (if you have it)
npx serve .
```

## Deployment

The site is deployed automatically via **GitHub Pages** from this repository
(`sumanthvenkata03.github.io`). Pushing to the published branch updates the live site at
the URL above — no build or CI step required.
