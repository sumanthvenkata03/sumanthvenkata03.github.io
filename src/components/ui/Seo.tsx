import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SEO } from '../../data/content';

/**
 * Per-route document metadata (React 19 native — no helmet lib).
 * Updates the EXISTING base tags from index.html in place (rather than rendering
 * duplicates) so there is always exactly one <title>/<canonical>/description.
 * The static base meta stays in the served HTML for crawlers / no-JS.
 */
function upsert(selector: string, tag: 'meta' | 'link', identify: Record<string, string>, valueAttr: string, value: string) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = document.createElement(tag);
    for (const [k, v] of Object.entries(identify)) el.setAttribute(k, v);
    document.head.appendChild(el);
  }
  el.setAttribute(valueAttr, value);
}

export default function Seo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = SEO[pathname] ?? SEO['/'];
    document.title = meta.title;
    upsert('meta[name="description"]', 'meta', { name: 'description' }, 'content', meta.description);
    upsert('link[rel="canonical"]', 'link', { rel: 'canonical' }, 'href', meta.canonical);
    upsert('meta[property="og:title"]', 'meta', { property: 'og:title' }, 'content', meta.title);
    upsert('meta[property="og:description"]', 'meta', { property: 'og:description' }, 'content', meta.description);
    upsert('meta[property="og:url"]', 'meta', { property: 'og:url' }, 'content', meta.canonical);
    upsert('meta[name="twitter:title"]', 'meta', { name: 'twitter:title' }, 'content', meta.title);
    upsert('meta[name="twitter:description"]', 'meta', { name: 'twitter:description' }, 'content', meta.description);
  }, [pathname]);
  return null;
}
