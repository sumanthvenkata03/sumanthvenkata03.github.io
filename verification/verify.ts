/**
 * Verification harness (Playwright/Chromium) — run against a running preview
 * server (`npm run preview`). Grows per phase; current checks:
 *   - boot + zero console errors + zero failed requests per route
 *   - nav present & 5 links
 *   - screenshots at 390/768/1440 -> verification/current/
 *   - no horizontal overflow
 *   - axe a11y (zero critical/serious) — skip with NO_AXE=1
 *   - external links resolve (HEAD/GET 200/3xx) — enable with CHECK_LINKS=1
 *
 * Run: npm run verify   (set PREVIEW_URL to override http://localhost:4173)
 */
import { chromium, type Page, request as pwRequest } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CURRENT = join(__dirname, 'current');
const BASE = process.env.PREVIEW_URL || 'http://localhost:4173';
const WIDTHS = [390, 768, 1440];
const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/about', name: 'about' },
  { path: '/work', name: 'work' },
  { path: '/projects', name: 'projects' },
  { path: '/contact', name: 'contact' },
];

mkdirSync(CURRENT, { recursive: true });

// Content-parity: representative copy that MUST appear per route (from
// MIGRATION-INVENTORY.md). Apostrophes are the curly ’ used in the source.
const PARITY: Record<string, string[]> = {
  home: [
    'Hello, I’m', 'Sumanth', 'Venkata',
    'Senior UI / Front-End Engineer · React · Angular · TypeScript · Micro-Frontends',
    'Years experience', 'Annual sessions', 'Faster builds', 'Few lines about me',
    'QualityNet Platform', 'Module Federation', 'Section 508 / WCAG',
  ],
  about: [
    'About Me', 'Professional developer with ~8 years', 'Technical Skills',
    'Languages', 'Frameworks & Libraries', 'UI & Data Viz', 'Design & UX', 'Architecture',
    'Build & Testing', 'CI/CD & DevOps', 'Analytics', 'GenAI / AI', 'APIs & Web',
    'Accessibility & Compliance', 'Practices & Tools',
    'Education', 'University of Central Missouri', 'Anna University',
    'Aug 2016 – Dec 2017', '2012 – 2016',
  ],
  work: [
    'Experience', 'Overview of my recent work', 'Senior UI / Front-End Engineer',
    'Cadmus Group — CMS', 'Mar 2019 – Present • Reston, VA (Remote)',
    'Senior React Developer', 'UnitedHealth Group / Optum', 'Jul 2018 – Feb 2019 • Hartford, CT',
    'Module Federation', 'AG Grid', 'BEACH',
  ],
  projects: [
    'Projects', 'A few things I’ve built end-to-end', 'QualityNet Platform', 'Federal Platform',
    'The Big Screen Index', 'Astro Match', 'AI-Powered Semantic Search (CMS)',
    'Internal project — no public link', 'qualitynet.cms.gov',
  ],
  contact: [
    'Contact Me', 'sumanth.techie9@gmail.com', '+1 815-496-0803', 'Leesburg, VA', 'Contact Form',
  ],
};

type Row = { check: string; ok: boolean; detail: string };
const rows: Row[] = [];
const add = (check: string, ok: boolean, detail = '') => rows.push({ check, ok, detail });

async function overflowWidth(page: Page): Promise<number> {
  // string body avoids tsx/esbuild __name injection in the page context
  return (await page.evaluate(
    `Math.max(0, (document.scrollingElement?.scrollWidth || 0) - (document.scrollingElement?.clientWidth || 0))`,
  )) as number;
}

(async () => {
  const browser = await chromium.launch();

  for (const route of ROUTES) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const consoleErrors: string[] = [];
    const failedReqs: string[] = [];
    page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
    page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));
    page.on('requestfailed', (r) => {
      // ignore benign favicon/font aborts on navigation
      const url = r.url();
      if (!/favicon|fonts\.gstatic|fonts\.googleapis/.test(url)) {
        failedReqs.push(`${url} — ${r.failure()?.errorText ?? 'failed'}`);
      }
    });

    const resp = await page.goto(BASE + route.path, { waitUntil: 'networkidle', timeout: 30_000 });
    await page.waitForTimeout(400);

    add(`[${route.name}] HTTP ${resp?.status()}`, !!resp && resp.status() < 400, String(resp?.status()));
    add(`[${route.name}] zero console errors`, consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '));
    add(`[${route.name}] zero failed requests`, failedReqs.length === 0, failedReqs.slice(0, 3).join(' | '));

    const navLinks = await page.locator('header nav a').count();
    add(`[${route.name}] nav present (≥6 anchors)`, navLinks >= 6, `${navLinks} anchors`);

    // content parity — textContent (raw source text, not affected by
    // text-transform like the uppercased "Federal Platform" badge)
    const bodyText = ((await page.evaluate('document.body.textContent')) as string) || '';
    const missing = (PARITY[route.name] ?? []).filter((s) => !bodyText.includes(s));
    add(`[${route.name}] content parity (${PARITY[route.name]?.length ?? 0} snippets)`, missing.length === 0, missing.length ? `MISSING: ${missing.join(' | ')}` : '');

    // responsive screenshots + overflow
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.waitForTimeout(250);
      const overflow = await overflowWidth(page);
      add(`[${route.name}] no h-overflow @${w}`, overflow <= 1, `${overflow}px`);
      await page.screenshot({ path: join(CURRENT, `${route.name}-${w}.png`), fullPage: true });
    }
    await page.setViewportSize({ width: 1440, height: 900 });

    // a11y
    if (!process.env.NO_AXE) {
      try {
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        const serious = results.violations.filter(
          (v) => v.impact === 'critical' || v.impact === 'serious',
        );
        add(
          `[${route.name}] axe: 0 critical/serious`,
          serious.length === 0,
          serious.map((v) => `${v.id}(${v.nodes.length})`).join(', '),
        );
      } catch (e) {
        add(`[${route.name}] axe ran`, false, (e as Error).message);
      }
    }

    await context.close();
  }

  // nav interaction — desktop click + mobile hamburger toggle/auto-collapse
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: 'About', exact: true }).click();
    await page.waitForTimeout(500);
    add('nav: click About -> /about', new URL(page.url()).pathname === '/about', page.url());
    const focusedMain = await page.evaluate(`document.activeElement?.id === 'main'`);
    add('nav: focus moved to <main> (a11y)', focusedMain === true);
    // keyboard: focus the Work link and activate with Enter
    await page.getByRole('link', { name: 'Work', exact: true }).focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    add('nav: keyboard Enter -> /work', new URL(page.url()).pathname === '/work', page.url());
    await ctx.close();
  }
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    const toggle = page.getByRole('button', { name: /toggle navigation/i });
    const aboutLink = page.getByRole('link', { name: 'About', exact: true });
    add('mobile: About hidden before toggle', !(await aboutLink.isVisible()));
    await toggle.click();
    await page.waitForTimeout(300);
    add('mobile: About visible after toggle', await aboutLink.isVisible());
    await aboutLink.click();
    await page.waitForTimeout(500);
    const closedAndNavigated =
      new URL(page.url()).pathname === '/about' && !(await aboutLink.isVisible());
    add('mobile: nav -> /about + menu auto-closes', closedAndNavigated, page.url());
    await ctx.close();
  }

  // contact form validation (Redux contactSlice)
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + '/contact', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /^submit$/i }).click();
    await page.waitForTimeout(300);
    const invalid = await page.locator('[aria-invalid="true"]').count();
    add('contact: empty submit shows errors', invalid >= 2, `${invalid} invalid fields`);
    await page.fill('#firstName', 'Jane');
    await page.fill('#email', 'jane@example.com');
    await page.fill('#message', 'Hello, this is a test message.');
    await page.waitForTimeout(150);
    const invalidAfter = await page.locator('[aria-invalid="true"]').count();
    add('contact: valid input clears errors', invalidAfter === 0, `${invalidAfter} invalid`);
    await ctx.close();
  }
  // animations toggle + localStorage persistence (uiSlice + persist middleware)
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    const toggle = page.getByRole('switch', { name: /animations/i });
    const before = await page.evaluate(`document.documentElement.dataset.animations`);
    await toggle.click();
    await page.waitForTimeout(200);
    const after = await page.evaluate(`document.documentElement.dataset.animations`);
    add('animations: toggle flips data-animations', before !== after, `${before} -> ${after}`);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const afterReload = await page.evaluate(`document.documentElement.dataset.animations`);
    add('animations: persists across reload', afterReload === after, `${afterReload}`);
    await ctx.close();
  }

  // reduced-motion: animations off, content static & fully visible
  {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
    });
    const page = await ctx.newPage();
    await page.goto(BASE + '/about', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const bar = await page.locator('[data-testid="scroll-progress"]').count();
    add('reduced-motion: scroll-progress hidden', bar === 0, `${bar} bars`);
    const op = await page.evaluate(
      `(() => { const el = document.querySelector('main h2'); return el ? getComputedStyle(el).opacity : '0'; })()`,
    );
    add('reduced-motion: content visible (opacity 1)', op === '1', `opacity ${op}`);
    await ctx.close();
  }
  // normal: scroll-progress present
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + '/about', { waitUntil: 'networkidle' });
    const bar = await page.locator('[data-testid="scroll-progress"]').count();
    add('normal: scroll-progress present', bar === 1, `${bar} bars`);
    await ctx.close();
  }

  // no-JS: prerendered static HTML must show full content (set CHECK_NOJS=1
  // after `npm run build:static`)
  if (process.env.CHECK_NOJS) {
    const nojsBase = process.env.NOJS_URL || 'http://localhost:4174';
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    for (const route of ROUTES) {
      await page.goto(nojsBase + route.path, { waitUntil: 'domcontentloaded' });
      const text = (await page.locator('body').textContent()) || '';
      const needles = (PARITY[route.name] ?? []).slice(0, 4);
      const ok = needles.every((n) => text.includes(n)) && text.length > 200;
      add(`no-JS [${route.name}] content present`, ok, `${text.length} chars`);
    }
    await ctx.close();
  }

  // external link reachability (opt-in; networky/slow)
  if (process.env.CHECK_LINKS) {
    const ctx = await pwRequest.newContext();
    const urls = [
      'https://qualitynet.cms.gov',
      'https://github.com/sumanthvenkata03/ott-weekend-bot',
      'https://astro-match-nu.vercel.app/',
      'https://github.com/sumanthvenkata03',
      'https://www.linkedin.com/in/sumanth-venkata-156690159/',
      `${BASE}/assets/resume/sumanth_venkata_resume.pdf`,
    ];
    for (const u of urls) {
      try {
        const r = await ctx.get(u, { timeout: 20_000, maxRedirects: 5 });
        // LinkedIn returns 999 to non-browser clients (anti-bot) — link is valid.
        const ok = r.status() < 400 || (u.includes('linkedin.com') && r.status() === 999);
        add(`link ${u}`, ok, String(r.status()));
      } catch (e) {
        add(`link ${u}`, false, (e as Error).message);
      }
    }
    await ctx.dispose();
  }

  await browser.close();

  // report
  const pass = rows.filter((r) => r.ok).length;
  const fail = rows.length - pass;
  console.log('\n=== VERIFICATION ===');
  for (const r of rows) {
    console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.check}${r.detail ? `  — ${r.detail}` : ''}`);
  }
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
