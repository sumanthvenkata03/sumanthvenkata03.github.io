// Copy dist/index.html -> dist/404.html so GitHub Pages serves the SPA shell
// for deep links (e.g. /about refreshed directly). Runs as npm "postbuild".
import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');
const index = join(dist, 'index.html');
const notFound = join(dist, '404.html');

if (!existsSync(index)) {
  console.error('postbuild: dist/index.html not found — did the build run?');
  process.exit(1);
}
copyFileSync(index, notFound);
console.log('postbuild: dist/index.html -> dist/404.html');
