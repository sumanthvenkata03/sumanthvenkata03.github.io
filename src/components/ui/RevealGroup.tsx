import { Children, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAnimationsActive } from '../../hooks/useAnimationsActive';

export type RevealGroupVariant = 'roll' | 'rollRight' | 'rise';

type Bezier = [number, number, number, number];
const EASE: Bezier = [0.16, 1, 0.3, 1];

const ITEM: Record<RevealGroupVariant, { hidden: Record<string, number>; show: Record<string, number>; duration: number }> = {
  roll: { hidden: { opacity: 0, x: -90, rotate: -12 }, show: { opacity: 1, x: 0, rotate: 0 }, duration: 0.9 },
  rollRight: { hidden: { opacity: 0, x: 90, rotate: 12 }, show: { opacity: 1, x: 0, rotate: 0 }, duration: 0.9 },
  rise: { hidden: { opacity: 0, y: 44, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1 }, duration: 0.8 },
};

const CONTAINER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

interface Props {
  variant?: RevealGroupVariant;
  className?: string;
  children: ReactNode;
}

/**
 * Staggered reveal container — each direct child rolls/rises in sequence when the
 * group scrolls into view. Reuses Reveal's exact gate (useAnimationsActive): when
 * animations are off / reduced-motion, children render statically with no stagger
 * and no transform. Mobile one-page only.
 */
export default function RevealGroup({ variant = 'roll', className, children }: Props) {
  const active = useAnimationsActive();
  if (!active) {
    return <div className={className}>{children}</div>;
  }
  const cfg = ITEM[variant];
  const item = {
    hidden: cfg.hidden,
    show: { ...cfg.show, transition: { duration: cfg.duration, ease: EASE } },
  };
  return (
    <motion.div
      className={className}
      variants={CONTAINER}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {Children.map(children, (child, i) => (
        <motion.div key={i} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
