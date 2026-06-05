import { motion } from 'framer-motion';
import Reveal from './Reveal';
import { useAnimationsActive } from '../../hooks/useAnimationsActive';
import styles from './SectionHeading.module.css';

interface Props {
  title: string;
  role?: string;
  /** 1 = page H1 (default), 2 = section H2 subheading (e.g. "Technical Skills"). */
  level?: 1 | 2;
}

/** Page H1 / section H2 + optional Lora role subtitle + animated gradient
 *  underline that draws on reveal. (Hero name is styled separately — it keeps
 *  its gradient shine and has no underline.) */
export default function SectionHeading({ title, role, level = 1 }: Props) {
  const active = useAnimationsActive();
  const Tag = (level === 1 ? 'h1' : 'h2') as 'h1' | 'h2';
  return (
    <Reveal variant="up" className={styles.wrap}>
      <Tag className={`${styles.title} ${level === 2 ? styles.sub : ''}`}>
        {title}
        {active ? (
          <motion.span
            className={styles.underline}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1], delay: 0.15 }}
            aria-hidden="true"
          />
        ) : (
          <span className={styles.underline} aria-hidden="true" />
        )}
      </Tag>
      {role ? <p className={styles.role}>{role}</p> : null}
    </Reveal>
  );
}
