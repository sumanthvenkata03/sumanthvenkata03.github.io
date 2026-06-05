// Build-time prerender: snapshot each route's rendered HTML into dist so the
// site shows full content WITHOUT JavaScript (progressive enhancement, like the
// legacy site) and crawlers get static markup. Captured under reduced-motion so
// scroll-reveal elements are already visible (not stuck at opacity:0).
//
// Run after `vite build`: npm run prerender   (or npm run build:static)
import http from 'node:http';
import { readFileSync, existsSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';

const DIST = join(process.cwd(), 'dist');
const PORT = 4178;
const ROUTES = ['/', '/about', '/work', '/projects', '/contact'];
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.webp': 'image/webp', '.txt': 'text/plain',
  '.xml': 'application/xml', '.woff2': 'font/woff2',
};

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('prerender: dist/index.html missing — run `vite build` first');
  process.exit(1);
}

// minimal static server with SPA fallback
const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const filePath = join(DIST, urlPath);
  if (urlPath !== '/' && existsSync(filePath) && statSync(filePath).isFile()) {
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
    res.end(readFileSync(filePath));
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(readFileSync(join(DIST, 'index.html'))); // SPA shell for route navigations
});

await new Promise((resolve) => server.listen(PORT, resolve));

const browser = await chromium.launch();
const ctx = await browser.newContext({ reducedMotion: 'reduce' });
const page = await ctx.newPage();

for (const route of ROUTES) {
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const html = '<!DOCTYPE html>\n' + (await page.evaluate('document.documentElement.outerHTML'));
  const outDir = route === '/' ? DIST : join(DIST, route);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html);
  console.log(`prerendered ${route} -> ${join(outDir, 'index.html').replace(DIST, 'dist')}`);
}

await browser.close();
server.close();
console.log('prerender complete');
