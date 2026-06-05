import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAnimationsActive } from '../../hooks/useAnimationsActive';

export type RevealVariant = 'up' | 'left' | 'right' | 'scale';

const HIDDEN: Record<RevealVariant, Record<string, number>> = {
  up: { opacity: 0, y: 26 },
  left: { opacity: 0, x: -30 },
  right: { opacity: 0, x: 30 },
  scale: { opacity: 0, scale: 0.93 },
};

interface Props {
  children: ReactNode;
  variant?: RevealVariant;
  /** Stagger delay (seconds). */
  delay?: number;
  className?: string;
  /** Fraction (or 'some'/'all') of the element that must be in view to trigger. */
  amount?: number | 'some' | 'all';
  /** IntersectionObserver-style root margin. Default insets the bottom by 8% so
   *  reveals fire just before the edge — override to '0px' for elements that sit
   *  at the very bottom of the page (e.g. the footer), which would otherwise
   *  never leave that dead zone. */
  margin?: string;
}

/**
 * Scroll-reveal wrapper (replaces the legacy hand-rolled IntersectionObserver).
 * When animations are disabled / reduced-motion, renders a plain, fully-visible
 * element with no transform — content is never hidden.
 */
export default function Reveal({
  children,
  variant = 'up',
  delay = 0,
  className,
  amount = 0.2,
  margin = '0px 0px -8% 0px',
}: Props) {
  const active = useAnimationsActive();
  if (!active) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={HIDDEN[variant]}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount, margin }}
      transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
