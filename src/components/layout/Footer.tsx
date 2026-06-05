import { version as reactVersion } from 'react';
import AnimationsToggle from '../ui/AnimationsToggle';
import Reveal from '../ui/Reveal';
import styles from './Footer.module.css';

const reactMajor = reactVersion.split('.')[0];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <h2 className={styles.heading}>Let’s Connect</h2>
      <div className={styles.icons}>
        <a
          href="https://github.com/sumanthvenkata03"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <img className={styles.logo} src="/assets/logo/git.svg" alt="GitHub" />
        </a>
        <a
          href="https://www.linkedin.com/in/sumanth-venkata-156690159/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <img className={styles.logo} src="/assets/logo/linkedin.png" alt="LinkedIn" />
        </a>
        <a href="mailto:sumanth.techie9@gmail.com" className={styles.email} aria-label="Email">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-10 6L2 7" />
          </svg>
        </a>
      </div>
      <AnimationsToggle />

      <Reveal variant="up" className={styles.credit}>
        <span className={styles.creditText}>
          Built with React {reactMajor} · TypeScript · Vite · Framer Motion
        </span>
        <span className={styles.creditSep} aria-hidden="true">
          ·
        </span>
        <a
          className={styles.creditLink}
          href="https://github.com/sumanthvenkata03/sumanthvenkata03.github.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          View source ↗
        </a>
      </Reveal>
    </footer>
  );
}
