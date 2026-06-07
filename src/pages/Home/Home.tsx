import { Link } from 'react-router-dom';
import SectionShell from '../../components/ui/SectionShell';
import Card from '../../components/ui/Card';
import CountUp from '../../components/ui/CountUp';
import RichText from '../../components/ui/RichText';
import { buttonClass } from '../../components/ui/buttonClass';
import { HERO } from '../../data/content';
import { useIsMobile } from '../../hooks/useIsMobile';
import HeroParallax from '../../components/ui/HeroParallax';
import MobileHome from '../../components/mobile/MobileHome';
import styles from './Home.module.css';

/** The hero — original Home content, reused as the #home section on mobile.
 *  On mobile it adds a subtle parallax glow layer behind the (unchanged) text. */
export function HomeHero({ mobile }: { mobile?: boolean }) {
  return (
    <SectionShell bgImage={HERO.bgImage} variant="hero">
      {mobile ? (
        <HeroParallax className={styles.heroGlow}>
          <div className={styles.heroGlowInner} aria-hidden="true" />
        </HeroParallax>
      ) : null}
      <div className={styles.inner}>
        <img
          src={HERO.photo}
          className={styles.photo}
          alt="Sumanth Venkata"
          width={180}
          height={180}
          fetchPriority="high"
        />

        <h1 className={styles.name}>
          {HERO.greetingPre}
          <span className={styles.accent}>{HERO.accent}</span>
          <br />
          {HERO.rest}
        </h1>

        <p className={styles.role}>{HERO.role}</p>

        <div className={styles.ctas}>
          <Link className={buttonClass('accent', { large: true })} to="/work">
            View Work
          </Link>
          <Link className={buttonClass('ghost', { large: true })} to="/contact">
            Contact Me
          </Link>
        </div>

        <div className={styles.stats}>
          {HERO.stats.map((s) => (
            <div className={styles.stat} key={s.label}>
              <CountUp
                className={styles.count}
                target={s.target}
                decimals={s.decimals}
                suffix={s.suffix}
              />
              <small>{s.label}</small>
            </div>
          ))}
        </div>

        <div className={styles.blurbWrap}>
          <Card soft className={styles.blurb}>
            <h2 className={styles.blurbHeading}>
              <b>{HERO.aboutHeading}</b>
            </h2>
            {HERO.aboutParagraphs.map((p, i) => (
              <RichText key={i} as="p" className={styles.blurbText} html={p} />
            ))}
          </Card>
        </div>
      </div>
    </SectionShell>
  );
}

export default function Home() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileHome /> : <HomeHero />;
}
