import { useReducedMotion } from 'framer-motion';
import { useAppSelector } from '../store/hooks';

/**
 * True only when animations should actually run: the user hasn't disabled them
 * (Redux `animationsEnabled`) AND neither the OS setting (Redux `reducedMotion`)
 * nor Framer's own reduced-motion check is asking us to stop.
 */
export function useAnimationsActive(): boolean {
  const framerReduce = useReducedMotion();
  const reducedMotion = useAppSelector((s) => s.ui.reducedMotion);
  const animationsEnabled = useAppSelector((s) => s.ui.animationsEnabled);
  return animationsEnabled && !reducedMotion && !framerReduce;
}
