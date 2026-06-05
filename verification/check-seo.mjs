// Assert SEO invariants directly on the prerendered dist HTML:
//   - each route's canonical + og:url use the expected (trailing-slash) form
//   - those URLs match sitemap.xml exactly
//   - a valid Person JSON-LD block is present
// Run after `npm run build:static`: node verification/check-seo.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(process.cwd(), 'dist');
const ROUTES = [
  { name: 'home', file: 'index.html', url: 'https://sumanthvenkata.com/' },
  { name: 'about', file: 'about/index.html', url: 'https://sumanthvenkata.com/about/' },
  { name: 'work', file: 'work/index.html', url: 'https://sumanthvenkata.com/work/' },
  { name: 'projects', file: 'projects/index.html', url: 'https://sumanthvenkata.com/projects/' },
  { name: 'contact', file: 'contact/index.html', url: 'https://sumanthvenkata.com/contact/' },
];

const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

let pass = 0;
let fail = 0;
const row = (name, ok, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
  ok ? pass++ : fail++;
};

for (const r of ROUTES) {
  const html = readFileSync(join(DIST, r.file), 'utf8');
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  const ogurl = (html.match(/<meta property="og:url" content="([^"]+)"/) || [])[1];
  row(`[${r.name}] canonical = ${r.url}`, canonical === r.url, canonical);
  row(`[${r.name}] og:url matches canonical`, ogurl === r.url, ogurl);
  row(`[${r.name}] sitemap contains ${r.url}`, locs.includes(r.url), '');

  const ld = (html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/) || [])[1];
  let ok = false;
  let detail = 'missing';
  try {
    const obj = JSON.parse(ld);
    ok = obj['@type'] === 'Person' && obj.name === 'Sumanth Venkata';
    detail = `${obj['@type']} / ${obj.name}`;
  } catch (e) {
    detail = `parse error: ${(e && e.message) || e}`;
  }
  row(`[${r.name}] Person JSON-LD valid`, ok, detail);
}

// sitemap should contain exactly the 5 trailing-slash URLs, nothing legacy
const expected = ROUTES.map((r) => r.url);
const extra = locs.filter((l) => !expected.includes(l));
row('sitemap has only the 5 expected URLs', extra.length === 0, extra.join(' | '));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
