import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initAnalytics, trackPageview } from './analytics';

/**
 * Headless analytics wiring. Renders nothing; must live INSIDE the router so
 * `useLocation` has context. Initializes GA4 + Clarity once, then sends a GA4
 * page_view on the initial load and on every route change (Clarity auto-tracks).
 */
export default function Analytics(): null {
  const location = useLocation();

  // Init once.
  useEffect(() => {
    initAnalytics();
  }, []);

  // One page_view per route change (and the initial load). Defer a frame so
  // React 19's per-route <title> is in place before we read document.title.
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      trackPageview(location.pathname + location.search, document.title),
    );
    return () => cancelAnimationFrame(id);
  }, [location.pathname, location.search]);

  return null;
}
