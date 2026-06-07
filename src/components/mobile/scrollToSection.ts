/** Sticky brand-bar height (--nav-h in tokens.css) — the offset anchor jumps clear. */
const NAV_OFFSET = 64;

/**
 * Smooth-scroll the window to a section by id, landing its top just below the
 * fixed brand bar. Honours prefers-reduced-motion by jumping instantly ('auto').
 * Shared by the action bar and the deep-link scroll in MobileHome.
 */
export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
}
