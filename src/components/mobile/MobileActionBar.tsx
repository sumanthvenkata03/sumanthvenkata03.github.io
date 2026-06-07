import type { MouseEvent } from 'react';
import { scrollToSection } from './scrollToSection';
import styles from './MobileActionBar.module.css';

/**
 * Sticky bottom action bar — mobile only. Two thumb-sized actions that smooth-
 * scroll to the #projects and #contact sections of the one-page. Rendered by
 * MobileHome (so its anchor targets always exist); also CSS-gated to mobile
 * widths so it can never leak onto desktop.
 */
export default function MobileActionBar() {
  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToSection(id);
  };

  return (
    <nav className={styles.bar} aria-label="Quick actions">
      <a
        href="#projects"
        className={`${styles.action} ${styles.primary}`}
        aria-label="Jump to projects"
        onClick={(e) => go(e, 'projects')}
      >
        View Projects
      </a>
      <a
        href="#contact"
        className={`${styles.action} ${styles.secondary}`}
        aria-label="Jump to contact"
        onClick={(e) => go(e, 'contact')}
      >
        Contact
      </a>
    </nav>
  );
}
