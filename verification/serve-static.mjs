// Static server that emulates GitHub Pages resolution for verifying the
// prerendered build: a request for /about resolves to /about/index.html, and
// unknown paths fall back to 404.html. (vite preview doesn't do nested
// directory-index resolution, so it can't validate the prerender.)
import http from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = join(process.cwd(), 'dist');
const PORT = Number(process.env.STATIC_PORT || 4174);
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.webp': 'image/webp', '.txt': 'text/plain',
  '.xml': 'application/xml', '.woff2': 'font/woff2',
};

function resolve(urlPath) {
  const p = join(DIST, urlPath);
  if (existsSync(p) && statSync(p).isFile()) return { file: p, code: 200 };
  const idx = join(p, 'index.html');
  if (existsSync(idx)) return { file: idx, code: 200 };
  return { file: join(DIST, '404.html'), code: 404 };
}

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    const { file, code } = resolve(urlPath);
    res.writeHead(code, { 'Content-Type': MIME[extname(file)] || 'text/html' });
    res.end(readFileSync(file));
  })
  .listen(PORT, () => console.log(`static (GH-Pages emulation) on http://localhost:${PORT}`));
