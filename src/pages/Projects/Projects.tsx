import SectionShell from '../../components/ui/SectionShell';
import SectionHeading from '../../components/ui/SectionHeading';
import Card from '../../components/ui/Card';
import Reveal from '../../components/ui/Reveal';
import Icon from '../../components/ui/Icon';
import { buttonClass } from '../../components/ui/Button';
import { SECTION } from '../../data/content';
import { PROJECTS } from '../../data/projects';
import styles from './Projects.module.css';

export default function Projects() {
  const s = SECTION.projects;
  return (
    <SectionShell bgImage={s.bgImage}>
      <SectionHeading title={s.title} role={s.role} />

      <div className={styles.grid}>
        {PROJECTS.map((p, i) => (
          <Reveal key={p.title} variant="up" delay={(i % 2) * 0.08} className={styles.cell}>
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
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
