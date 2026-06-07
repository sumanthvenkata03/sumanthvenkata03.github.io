import SectionShell from '../../components/ui/SectionShell';
import SectionHeading from '../../components/ui/SectionHeading';
import Card from '../../components/ui/Card';
import Reveal from '../../components/ui/Reveal';
import RevealGroup from '../../components/ui/RevealGroup';
import RichText from '../../components/ui/RichText';
import { SECTION, EXPERIENCE } from '../../data/content';
import { useIsMobile } from '../../hooks/useIsMobile';
import MobileHome from '../../components/mobile/MobileHome';
import styles from './Work.module.css';

type Experience = (typeof EXPERIENCE)[number];

/** A single timeline card — shared so desktop (per-item Reveal) and mobile
 *  (staggered RevealGroup) render identical card markup. */
function WorkCard({ x }: { x: Experience }) {
  return (
    <Card className={styles.item}>
      <h3>{x.title}</h3>
      <p className={styles.meta}>
        <b>{x.company}</b>
        {x.companySuffix ?? ''}
        <span className={styles.period}>{x.period}</span>
      </p>
      <p className={styles.context}>{x.context}</p>
      <ul className={styles.bullets}>
        {x.bullets.map((b, i) => (
          <RichText key={i} as="li" html={b} />
        ))}
      </ul>
    </Card>
  );
}

export function WorkContent({ mobile }: { mobile?: boolean }) {
  const s = SECTION.work;
  return (
    <SectionShell bgImage={s.bgImage}>
      <SectionHeading title={s.title} role={s.role} />

      {mobile ? (
        <RevealGroup variant="rollRight" className={styles.timeline}>
          {EXPERIENCE.map((x) => (
            <WorkCard key={x.company} x={x} />
          ))}
        </RevealGroup>
      ) : (
        <div className={styles.timeline}>
          {EXPERIENCE.map((x) => (
            <Reveal
              key={x.company}
              variant={x.side === 'left' ? 'left' : 'right'}
              className={styles.itemCell}
            >
              <WorkCard x={x} />
            </Reveal>
          ))}
        </div>
      )}
    </SectionShell>
  );
}

export default function Work() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileHome initialSection="work" /> : <WorkContent />;
}
