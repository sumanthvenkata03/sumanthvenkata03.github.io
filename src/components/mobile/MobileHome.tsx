import { useEffect, useRef } from 'react';
import Reveal from '../../components/ui/Reveal';
import { HomeHero } from '../../pages/Home/Home';
import { AboutContent } from '../../pages/About/About';
import { WorkContent } from '../../pages/Work/Work';
import { ProjectsContent } from '../../pages/Projects/Projects';
import { ContactContent } from '../../pages/Contact/Contact';
import MobileActionBar from './MobileActionBar';
import { scrollToSection } from './scrollToSection';
import { trackPageview } from '../../analytics/analytics';
import { recordPageView } from '../../analytics/visit-notify';
import styles from './MobileHome.module.css';

export type MobileSectionId = 'home' | 'about' | 'work' | 'projects' | 'contact';

/** Section ids -> the route paths their content lives at on desktop. #home is
 *  intentionally absent: the initial "/" page_view already fires on load. */
const SECTION_PATH: Partial<Record<MobileSectionId, string>> = {
  about: '/about',
  work: '/work',
  projects: '/projects',
  contact: '/contact',
};

interface Props {
  /** When a mobile visitor deep-links to /about, /work, etc., scroll there on mount. */
  initialSection?: MobileSectionId;
}

/**
 * Mobile-only one-page experience: every section stacked in one scroll view so
 * nothing is hidden behind the (untapped) hamburger menu. Reuses the exact same
 * content the desktop pages render, each wrapped in the shared <Reveal> so it
 * animates in on scroll (respecting the Animations toggle + reduced motion).
 */
export default function MobileHome({ initialSection }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Deep-link: scroll to the requested section after mount (wait a frame for layout).
  useEffect(() => {
    if (!initialSection || initialSection === 'home') return;
    const raf = window.requestAnimationFrame(() => scrollToSection(initialSection));
    return () => window.cancelAnimationFrame(raf);
  }, [initialSection]);

  // Analytics: the one-page has no route changes, so fire a page_view the first
  // time each section scrolls into view (deduped once per section per visit).
  // trackPageview / recordPageView already no-op in dev and for bots.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          const path = SECTION_PATH[id as MobileSectionId];
          if (!path || seen.has(id)) continue;
          seen.add(id);
          trackPageview(path);
          recordPageView(path);
        }
      },
      { threshold: 0.4 }
    );

    root.querySelectorAll('section[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={styles.page}>
      <section id="home" className={styles.section}>
        <Reveal variant="up">
          <HomeHero />
        </Reveal>
      </section>
      <section id="about" className={styles.section}>
        <Reveal variant="up">
          <AboutContent />
        </Reveal>
      </section>
      <section id="work" className={styles.section}>
        <Reveal variant="up">
          <WorkContent />
        </Reveal>
      </section>
      <section id="projects" className={styles.section}>
        <Reveal variant="up">
          <ProjectsContent />
        </Reveal>
      </section>
      <section id="contact" className={styles.section}>
        <Reveal variant="up">
          <ContactContent />
        </Reveal>
      </section>

      <MobileActionBar />
    </div>
  );
}
