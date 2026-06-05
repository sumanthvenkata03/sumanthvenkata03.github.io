import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setReducedMotion } from '../store/slices/uiSlice';

/**
 * Mirror the OS `prefers-reduced-motion` media query into the Redux store on
 * mount and whenever it changes. The store flag (ui.reducedMotion) is the single
 * source of truth for gating animations app-wide.
 */
export function useSyncReducedMotion(): void {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    dispatch(setReducedMotion(mq.matches));
    const onChange = (e: MediaQueryListEvent) => dispatch(setReducedMotion(e.matches));
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [dispatch]);
}
