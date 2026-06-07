import SectionShell from '../../components/ui/SectionShell';
import SectionHeading from '../../components/ui/SectionHeading';
import Card from '../../components/ui/Card';
import Reveal from '../../components/ui/Reveal';
import RevealGroup from '../../components/ui/RevealGroup';
import Tilt from '../../components/ui/Tilt';
import Icon from '../../components/ui/Icon';
import { buttonClass } from '../../components/ui/buttonClass';
import { SECTION } from '../../data/content';
import { PROJECTS } from '../../data/projects';
import { useIsMobile } from '../../hooks/useIsMobile';
import MobileHome from '../../components/mobile/MobileHome';
import styles from './Projects.module.css';

type Project = (typeof PROJECTS)[number];

/** A single project card — shared so desktop (Reveal + Tilt) and mobile
 *  (staggered RevealGroup roll) render identical card markup. */
function ProjectCard({ p }: { p: Project }) {
  return (
    <Card soft className={`${styles.card} ${p.federal ? styles.federal : ''}`}>
      {p.badge ? (
        <span className={styles.badge}>
          <Icon name="lock" size={11} /> {p.badge}
        </span>
      ) : null}
      <h3 className={styles.title}>{p.title}</h3>
      {p.attribution ? <p className={styles.attribution}>{p.attribution}</p> : null}
      {p.subtitle ? <p className={styles.subtitle}>{p.subtitle}</p> : null}
      <p className={styles.tech}>{p.tech}</p>
      <p className={styles.desc}>{p.description}</p>
      {p.link ? (
        <a
          className={`${buttonClass('accent')} ${styles.link}`}
          href={p.link.href}
          target="_blank"
          rel="noopener"
        >
          <Icon name="external" size={14} /> {p.link.label}
        </a>
      ) : (
        <span className={styles.internal}>{p.internalNote}</span>
      )}
    </Card>
  );
}

export function ProjectsContent({ mobile }: { mobile?: boolean }) {
  const s = SECTION.projects;
  return (
    <SectionShell bgImage={s.bgImage}>
      <SectionHeading title={s.title} role={s.role} />

      {mobile ? (
        <RevealGroup variant="roll" className={styles.grid}>
          {PROJECTS.map((p) => (
            <ProjectCard key={p.title} p={p} />
          ))}
        </RevealGroup>
      ) : (
        <div className={styles.grid}>
          {PROJECTS.map((p, i) => (
            <Reveal key={p.title} variant="up" delay={(i % 2) * 0.08} className={styles.cell}>
              <Tilt className={styles.tilt}>
                <ProjectCard p={p} />
              </Tilt>
            </Reveal>
          ))}
        </div>
      )}
    </SectionShell>
  );
}

export default function Projects() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileHome initialSection="projects" /> : <ProjectsContent />;
}
