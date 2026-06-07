import { useLayoutEffect, useState } from 'react';

/** Same breakpoint at which the navbar swaps to the hamburger (Navbar.module.css). */
const MOBILE_QUERY = '(max-width: 767px)';

/**
 * True at mobile widths (max-width: 767px — the navbar's hamburger breakpoint).
 *
 * SSR / prerender-safe and flash-free: state starts `false` so the first render
 * matches the desktop-rendered prerendered HTML (no hydration mismatch). The real
 * value is resolved in a useLayoutEffect — before the browser paints — and kept in
 * sync via matchMedia's 'change' event.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  return isMobile;
}
