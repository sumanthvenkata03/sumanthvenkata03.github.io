import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAnimationsActive } from '../../hooks/useAnimationsActive';

interface Props {
  className?: string;
  children: ReactNode;
}

/**
 * Subtle scroll-linked parallax for a single decorative layer (the hero glow —
 * NOT text). Maps the hero's scroll progress to a gentle upward drift + slight
 * scale. Reuses Reveal's gate (useAnimationsActive): when animations are off /
 * reduced-motion, the child renders with no transform. Mobile one-page only.
 */
export default function HeroParallax({ className, children }: Props) {
  const active = useAnimationsActive();
  const ref = useRef<HTMLDivElement>(null);
  // Measured on the (untransformed) wrapper; the child is what moves.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  if (!active) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y, scale }}>{children}</motion.div>
    </div>
  );
}
