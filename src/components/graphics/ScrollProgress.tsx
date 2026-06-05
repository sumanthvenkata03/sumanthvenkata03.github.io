import { useScrollProgress } from '../../hooks/useScrollProgress';
import { useAnimationsActive } from '../../hooks/useAnimationsActive';
import styles from './ScrollProgress.module.css';

/** Fixed top scroll-progress bar. Hidden when animations are off / reduced. */
export default function ScrollProgress() {
  const active = useAnimationsActive();
  const progress = useScrollProgress();
  if (!active) return null;
  return (
    <div
      className={styles.bar}
      style={{ transform: `scaleX(${progress})` }}
      data-testid="scroll-progress"
      aria-hidden="true"
    />
  );
}
