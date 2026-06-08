import { useAppSelector } from '../store/hooks';

/**
 * True when animations should run. The in-app toggle (Redux `animationsEnabled`)
 * is the single source of truth: it can OVERRIDE the OS reduce-motion setting
 * when the user explicitly turns animations on. The OS setting only seeds the
 * toggle's default on first visit (see uiSlice); it no longer hard-blocks here.
 */
export function useAnimationsActive(): boolean {
  const animationsEnabled = useAppSelector((s) => s.ui.animationsEnabled);
  return animationsEnabled;
}
