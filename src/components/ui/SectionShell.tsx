import type { ReactNode } from 'react';
import styles from './SectionShell.module.css';

interface Props {
  bgImage: string;
  variant?: 'hero' | 'default';
  children: ReactNode;
  className?: string;
}

/** Full-height section with a fixed background image + overlay + centered
 *  container — the per-section hero structure from the legacy site. */
export default function SectionShell({ bgImage, variant = 'default', children, className }: Props) {
  const isHero = variant === 'hero';
  return (
    <section className={`${styles.section} ${isHero ? styles.hero : ''} ${className ?? ''}`}>
      <img
        src={bgImage}
        className={styles.bg}
        alt=""
        aria-hidden="true"
        {...(isHero
          ? { fetchPriority: 'high' as const }
          : { loading: 'lazy' as const, decoding: 'async' as const })}
      />
      <div className={isHero ? styles.heroOverlay : styles.overlay} aria-hidden="true" />
      <div className={styles.container}>{children}</div>
    </section>
  );
}
