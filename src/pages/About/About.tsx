import SectionShell from '../../components/ui/SectionShell';
import SectionHeading from '../../components/ui/SectionHeading';
import Card from '../../components/ui/Card';
import Reveal from '../../components/ui/Reveal';
import Tilt from '../../components/ui/Tilt';
import { SECTION, EDUCATION } from '../../data/content';
import { TECH_STRIP, SKILL_CATEGORIES } from '../../data/skills';
import { useIsMobile } from '../../hooks/useIsMobile';
import MobileHome from '../../components/mobile/MobileHome';
import styles from './About.module.css';

export function AboutContent({ mobile }: { mobile?: boolean }) {
  const s = SECTION.about;
  return (
    <SectionShell bgImage={s.bgImage}>
      <SectionHeading title={s.title} role={s.role} />

      <div className={styles.content}>
        <SectionHeading title={s.skillsHeading} level={2} />

        <div className={styles.techStrip} aria-label="Headline technologies">
          {TECH_STRIP.map((t, i) => (
            <Reveal key={t.label} variant={mobile ? 'rise' : 'scale'} delay={i * 0.04} className={styles.techItem}>
              <i className={t.icon} role="img" title={t.label} aria-label={t.label} />
            </Reveal>
          ))}
        </div>

        <div className={styles.cats}>
          {SKILL_CATEGORIES.map((c, i) => (
            <Reveal key={c.title} variant={mobile ? 'rise' : 'up'} delay={(i % 3) * 0.06} className={styles.catCell}>
              <Tilt className={styles.tilt} max={5}>
                <Card soft className={styles.cat}>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </Card>
              </Tilt>
            </Reveal>
          ))}
        </div>

        <SectionHeading title={s.educationHeading} level={2} />

        {EDUCATION.map((e) => (
          <Reveal key={e.degree} variant={mobile ? 'rise' : 'up'} className={styles.eduCell}>
            <Card soft className={styles.edu}>
              <b>{e.degree}</b> —{' '}
              <a href={e.schoolUrl} target="_blank" rel="noopener noreferrer">
                {e.school}
              </a>
              , {e.location}
              <span className={styles.fromTo}>{e.period}</span>
            </Card>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

export default function About() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileHome initialSection="about" /> : <AboutContent />;
}
