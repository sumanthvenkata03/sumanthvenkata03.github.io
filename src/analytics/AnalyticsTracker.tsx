import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initAnalytics, trackPageview } from './analytics';
import { notifyVisit, recordPageView } from './visit-notify';

/**
 * Headless analytics wiring. Renders nothing; must live INSIDE the router so
 * `useLocation` has context. Initializes GA4 + Clarity once, then sends a GA4
 * page_view on the initial load and on every route change (Clarity auto-tracks).
 */
export default function Analytics(): null {
  const location = useLocation();

  // Init once. notifyVisit() fires the one-per-visit Slack ping; it must NOT go in
  // the per-route effect below, or it would re-ping on every navigation.
  useEffect(() => {
    initAnalytics();
    notifyVisit();
  }, []);

  // One page_view per route change (and the initial load). Defer a frame so
  // React 19's per-route <title> is in place before we read document.title.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      trackPageview(location.pathname + location.search, document.title);
      recordPageView(location.pathname + location.search);
    });
    return () => cancelAnimationFrame(id);
  }, [location.pathname, location.search]);

  return null;
}
