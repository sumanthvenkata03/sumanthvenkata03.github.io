import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleAnimations } from '../../store/slices/uiSlice';
import styles from './AnimationsToggle.module.css';

/** Footer control to enable/disable animations. Persisted to localStorage via
 *  the persist middleware. When the OS prefers reduced motion, animations are
 *  off regardless — reflected in the label. */
export default function AnimationsToggle() {
  const dispatch = useAppDispatch();
  const enabled = useAppSelector((s) => s.ui.animationsEnabled);
  const reduced = useAppSelector((s) => s.ui.reducedMotion);
  const effective = enabled && !reduced;

  return (
    <button
      type="button"
      className={styles.toggle}
      role="switch"
      aria-checked={effective}
      onClick={() => dispatch(toggleAnimations())}
      title={reduced ? 'Your system prefers reduced motion' : 'Toggle animations'}
    >
      <span className={`${styles.track} ${effective ? styles.on : ''}`} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      <span className={styles.label}>
        Animations: {enabled ? 'On' : 'Off'}
        {reduced ? ' (system reduced)' : ''}
      </span>
    </button>
  );
}
