import styles from './Orbs.module.css';

/** Drifting gradient orbs + animated mesh for the hero — cheap depth (transform
 *  only). Animation is killed by the global net under reduced-motion / off. */
export default function Orbs() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <span className={styles.mesh} />
      <span className={`${styles.orb} ${styles.orbA}`} />
      <span className={`${styles.orb} ${styles.orbB}`} />
    </div>
  );
}
