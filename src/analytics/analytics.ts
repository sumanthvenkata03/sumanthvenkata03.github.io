import { GA_MEASUREMENT_ID, CLARITY_PROJECT_ID } from './analytics-config';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    clarity: (...args: unknown[]) => void;
  }
}

// Module-level guard so init runs exactly once, even though React 19 StrictMode
// double-invokes effects in dev (dev is skipped anyway via the PROD check below).
let initialized = false;

// Real-visitor browsers only. Skips:
//  - SSR/prerender (no `window`)
//  - dev (`import.meta.env.PROD` is false under `vite`/`vite dev`)
//  - automation: Playwright sets `navigator.webdriver = true`, which keeps the
//    prerender snapshot clean (the build runs the prod bundle in headless Chromium,
//    where `window` and `PROD` are both truthy) and avoids polluting data during
//    verification runs. A human's `npm run preview` tab has `webdriver = false`,
//    so manual DevTools/Realtime checks still see analytics fire.
function isTrackingEnabled(): boolean {
  return (
    typeof window !== 'undefined' &&
    import.meta.env.PROD &&
    !navigator.webdriver
  );
}

export function initAnalytics(): void {
  if (initialized || !isTrackingEnabled()) return;
  initialized = true;

  if (GA_MEASUREMENT_ID) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    // SPA: suppress the automatic page_view; we send them manually on every route change.
    window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });

    const ga = document.createElement('script');
    ga.async = true;
    ga.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(ga);
  }

  if (CLARITY_PROJECT_ID) {
    // Standard Microsoft Clarity loader. Clarity auto-tracks SPA navigations via the
    // History API, so no manual pageview call is needed for it.
    (function (c: Window, l: Document, a: string, r: string, i: string) {
      type ClarityFn = Window['clarity'] & { q?: unknown[] };
      const w = c as Window & { [k: string]: unknown };
      w[a] =
        w[a] ||
        function (...args: unknown[]) {
          ((w[a] as ClarityFn).q = (w[a] as ClarityFn).q || []).push(args);
        };
      const t = l.createElement(r) as HTMLScriptElement;
      t.async = true;
      t.src = 'https://www.clarity.ms/tag/' + i;
      const y = l.getElementsByTagName(r)[0];
      y.parentNode?.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_PROJECT_ID);
  }
}

export function trackPageview(path: string, title?: string): void {
  if (!isTrackingEnabled() || !GA_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: title ?? document.title,
  });
  // Clarity needs nothing here — it auto-tracks SPA navigations.
}
