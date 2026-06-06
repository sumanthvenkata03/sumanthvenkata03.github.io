import { VISIT_ENDPOINT } from './analytics-config';

// `window.clarity` is already declared globally in ./analytics, so no Window
// augmentation is needed here.

interface PageHit { path: string; t: number; }
interface ActionHit { label: string; href?: string; t: number; }

let started = false;
let summarySent = false;
let startTime = 0;
let visitorId: string | null = null;
let returning = false;
let clarityToken = '';
const pages: PageHit[] = [];
const actions: ActionHit[] = [];

function safeLocalGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

function classifyLink(a: HTMLAnchorElement): ActionHit | null {
  const href = a.getAttribute('href') || '';
  if (!href) return null;
  const text = (a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);

  if (/resume|cv/i.test(href) || /\.pdf($|\?)/i.test(href) || a.hasAttribute('download')) {
    return { label: '📄 Downloaded résumé', href, t: Date.now() };
  }
  if (href.startsWith('mailto:')) return { label: `✉️ Email: ${href.replace('mailto:', '')}`, t: Date.now() };
  if (href.startsWith('tel:')) return { label: `📞 Phone: ${href.replace('tel:', '')}`, t: Date.now() };

  let host = '';
  try { host = new URL(href, window.location.href).hostname.toLowerCase(); } catch { return null; }
  if (!host || host === window.location.hostname) return null;

  let name = host.replace(/^www\./, '');
  if (host.includes('linkedin')) name = 'LinkedIn';
  else if (host.includes('github')) name = 'GitHub';
  else if (host === 't.co' || host.includes('twitter') || host.includes('x.com')) name = 'X/Twitter';
  else if (host.includes('instagram')) name = 'Instagram';
  return { label: `🔗 ${name}${text ? ` — "${text}"` : ''}`, href, t: Date.now() };
}

function onClick(e: MouseEvent): void {
  const target = e.target as HTMLElement | null;
  const el = target && target.closest ? (target.closest('a') as HTMLAnchorElement | null) : null;
  if (!el) return;
  const hit = classifyLink(el);
  if (!hit) return;
  const lastA = actions[actions.length - 1];
  if (!lastA || lastA.label !== hit.label) actions.push(hit);
}

function buildSummary(): string {
  return JSON.stringify({
    event: 'summary',
    visitorId, returning, clarityToken,
    durationMs: Date.now() - startTime,
    pages,
    actions,
    referrer: document.referrer || '',
    utmSource: new URLSearchParams(window.location.search).get('utm_source') || '',
    language: navigator.language || '',
    screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
  });
}

function sendSummary(): void {
  if (summarySent || !started) return;
  summarySent = true;
  const data = buildSummary();
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(VISIT_ENDPOINT, data); // string -> text/plain (CORS-safelisted; no preflight)
      return;
    }
  } catch { /* fall through to fetch */ }
  fetch(VISIT_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: data, keepalive: true }).catch(() => {});
}

export function notifyVisit(): void {
  if (typeof window === 'undefined' || !import.meta.env.PROD || navigator.webdriver) return;
  if (!VISIT_ENDPOINT || started) return;
  started = true;
  startTime = Date.now();

  visitorId = safeLocalGet('pf_visitor_id');
  returning = !!visitorId;
  if (!visitorId) {
    visitorId = crypto?.randomUUID?.() ?? String(Date.now()) + Math.random().toString(16).slice(2);
    try { localStorage.setItem('pf_visitor_id', visitorId); } catch { /* ignore */ }
  }

  clarityToken = 'visit_' + Math.random().toString(36).slice(2, 8);
  window.clarity?.('set', 'visit_token', clarityToken);
  if (visitorId) window.clarity?.('identify', visitorId);

  recordPageView(window.location.pathname);

  let firstThisSession = true;
  try {
    firstThisSession = !sessionStorage.getItem('pf_visit_pinged');
    sessionStorage.setItem('pf_visit_pinged', '1');
  } catch { /* ignore */ }

  if (firstThisSession) {
    fetch(VISIT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'arrival',
        path: window.location.pathname,
        title: document.title,
        referrer: document.referrer || '',
        utmSource: new URLSearchParams(window.location.search).get('utm_source') || '',
        language: navigator.language || '',
        screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
        visitorId, returning, clarityToken,
      }),
      keepalive: true,
    }).catch(() => {});
  }

  document.addEventListener('click', onClick, true);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') sendSummary(); });
  window.addEventListener('pagehide', sendSummary);
}

export function recordPageView(path: string): void {
  if (!started) return;
  const last = pages[pages.length - 1];
  if (last && last.path === path) return; // de-dupe consecutive
  pages.push({ path, t: Date.now() });
}
