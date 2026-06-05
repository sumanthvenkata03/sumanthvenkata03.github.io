/**
 * Phase 0 — capture ground-truth screenshots of the LIVE original site
 * (https://sumanthvenkata.com) for each section at 390/768/1440, plus a
 * computed-style dump of key elements for design-token verification.
 *
 * Run: npm run capture:baseline
 */
import { chromium, type Page } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'baseline');
const SITE = process.env.BASELINE_URL || 'https://sumanthvenkata.com/';

const WIDTHS = [390, 768, 1440];
const SECTIONS = ['Home', 'About', 'Work', 'Projects', 'Contact'] as const;

mkdirSync(OUT, { recursive: true });

async function gotoSection(page: Page, label: string, width: number) {
  // Mobile: the nav links are hidden behind the hamburger until expanded.
  if (width < 768) {
    const toggle = page.locator('.navbar-toggle');
    const expanded = await page.locator('#main-nav.in').count();
    if (!expanded) {
      await toggle.click().catch(() => {});
      await page.waitForTimeout(350);
    }
  }
  await page.getByRole('link', { name: label, exact: true }).first().click();
  await page.waitForTimeout(700); // allow tab swap + reveal animations to settle
}

// NOTE: passed as a STRING (not a closure) so tsx/esbuild doesn't inject its
// `__name` helper into the serialized function — that helper is undefined in
// the page context and throws.
function dumpStyles(page: Page) {
  return page.evaluate(`(() => {
    const pick = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { color: cs.color, backgroundColor: cs.backgroundColor,
               fontFamily: cs.fontFamily, fontWeight: cs.fontWeight, fontSize: cs.fontSize };
    };
    return {
      body: pick(document.body),
      heroName: pick(document.querySelector('.section-hero .introText-name')),
      button: pick(document.querySelector('.btn-accent')),
      card: pick(document.querySelector('.card')),
      navbar: pick(document.querySelector('.custom-nav')),
    };
  })()`);
}

(async () => {
  const browser = await chromium.launch();
  const styleDumps: Record<string, unknown> = {};

  for (const width of WIDTHS) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    console.log(`\n=== width ${width} ===`);
    await page.goto(SITE, { waitUntil: 'networkidle', timeout: 60_000 });
    await page.waitForTimeout(800);

    for (const section of SECTIONS) {
      try {
        await gotoSection(page, section, width);
        const file = join(OUT, `${section.toLowerCase()}-${width}.png`);
        await page.screenshot({ path: file, fullPage: true });
        console.log(`  ✓ ${section} -> ${file}`);
      } catch (e) {
        console.error(`  ✗ ${section} @ ${width}:`, (e as Error).message);
      }
    }

    // computed styles only need one capture (use 1440, on Home)
    if (width === 1440) {
      await gotoSection(page, 'Home', width).catch(() => {});
      styleDumps['1440-home'] = await dumpStyles(page);
    }
    await context.close();
  }

  writeFileSync(join(OUT, 'computed-styles.json'), JSON.stringify(styleDumps, null, 2));
  console.log(`\nWrote computed-styles.json`);
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
