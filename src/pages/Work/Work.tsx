import SectionShell from '../../components/ui/SectionShell';
import SectionHeading from '../../components/ui/SectionHeading';
import Card from '../../components/ui/Card';
import Reveal from '../../components/ui/Reveal';
import RichText from '../../components/ui/RichText';
import { SECTION, EXPERIENCE } from '../../data/content';
import styles from './Work.module.css';

export default function Work() {
  const s = SECTION.work;
  return (
    <SectionShell bgImage={s.bgImage}>
      <SectionHeading title={s.title} role={s.role} />

      <div className={styles.timeline}>
        {EXPERIENCE.map((x) => (
          <Reveal
            key={x.company}
            variant={x.side === 'left' ? 'left' : 'right'}
            className={styles.itemCell}
          >
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
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
