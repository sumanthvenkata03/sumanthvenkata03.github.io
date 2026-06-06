import { VISIT_ENDPOINT } from './analytics-config';

// `window.clarity` is already declared globally in ./analytics, so no Window
// augmentation is needed here. The loader queues set/identify calls until the
// Clarity script loads, so calling these early is safe.

export function notifyVisit(): void {
  // same guards as the rest of analytics: browser-only, prod-only, skip bots
  if (typeof window === 'undefined' || !import.meta.env.PROD || navigator.webdriver) return;
  if (!VISIT_ENDPOINT) return;
  // ONCE PER VISIT: a session flag means a refresh in the same tab won't re-ping;
  // a brand-new tab/session pings again.
  try {
    if (sessionStorage.getItem('pf_visit_pinged')) return;
    sessionStorage.setItem('pf_visit_pinged', '1');
  } catch { /* storage blocked → just proceed once */ }

  // durable anonymous visitor id + new/returning flag
  let visitorId: string | null = null;
  let returning = false;
  try {
    visitorId = localStorage.getItem('pf_visitor_id');
    returning = !!visitorId;
    if (!visitorId) {
      visitorId = (crypto?.randomUUID?.() ?? String(Date.now()) + Math.random().toString(16).slice(2));
      localStorage.setItem('pf_visitor_id', visitorId);
    }
  } catch { /* ignore */ }

  // short token to correlate this session with its Clarity recording
  const clarityToken = 'visit_' + Math.random().toString(36).slice(2, 8);
  // tag + identify in Clarity (the loader queues these until the script loads)
  window.clarity?.('set', 'visit_token', clarityToken);
  if (visitorId) window.clarity?.('identify', visitorId);

  const utmSource = new URLSearchParams(window.location.search).get('utm_source') || '';
  const payload = {
    path: window.location.pathname,
    title: document.title,
    referrer: document.referrer || '',
    utmSource,
    language: navigator.language || '',
    screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    visitorId, returning, clarityToken,
  };
  // fire-and-forget; keepalive lets it finish even if the user navigates immediately
  fetch(VISIT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}
