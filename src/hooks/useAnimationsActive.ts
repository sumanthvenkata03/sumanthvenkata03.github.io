/**
 * True always. Animations are on site-wide with no user control; the OS
 * reduce-motion setting no longer gates them. Kept as a hook so existing
 * call sites (Reveal, HeroParallax, Layout, etc.) need no changes.
 */
export function useAnimationsActive(): boolean {
  return true;
}
