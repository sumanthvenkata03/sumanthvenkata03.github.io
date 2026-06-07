import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAnimationsActive } from '../../hooks/useAnimationsActive';

export type RevealVariant =
  | 'up'
  | 'left'
  | 'right'
  | 'scale'
  | 'rise'
  | 'roll'
  | 'rollRight'
  | 'rollSoft';

type Bezier = [number, number, number, number];

// Legacy easing + shared visible target for the original desktop variants
// (up/left/right/scale) — kept byte-for-byte so desktop motion is unchanged.
const LEGACY_EASE: Bezier = [0.22, 0.61, 0.36, 1];
const LEGACY_SHOW = { opacity: 1, x: 0, y: 0, scale: 1 };
// Signature easing for the mobile motion system (rise / roll family).
const SIG_EASE: Bezier = [0.16, 1, 0.3, 1];

interface VariantConfig {
  hidden: Record<string, number>;
  show: Record<string, number>;
  duration: number;
  ease: Bezier;
  amount: number;
}

const CONFIG: Record<RevealVariant, VariantConfig> = {
  // --- original desktop variants (unchanged: dur 0.6, legacy ease, amount 0.2) ---
  up: { hidden: { opacity: 0, y: 26 }, show: LEGACY_SHOW, duration: 0.6, ease: LEGACY_EASE, amount: 0.2 },
  left: { hidden: { opacity: 0, x: -30 }, show: LEGACY_SHOW, duration: 0.6, ease: LEGACY_EASE, amount: 0.2 },
  right: { hidden: { opacity: 0, x: 30 }, show: LEGACY_SHOW, duration: 0.6, ease: LEGACY_EASE, amount: 0.2 },
  scale: { hidden: { opacity: 0, scale: 0.93 }, show: LEGACY_SHOW, duration: 0.6, ease: LEGACY_EASE, amount: 0.2 },
  // --- mobile motion system (signature ease, once @ amount 0.25) ---
  rise: { hidden: { opacity: 0, y: 44, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1 }, duration: 0.8, ease: SIG_EASE, amount: 0.25 },
  roll: { hidden: { opacity: 0, x: -90, rotate: -12 }, show: { opacity: 1, x: 0, rotate: 0 }, duration: 0.9, ease: SIG_EASE, amount: 0.25 },
  rollRight: { hidden: { opacity: 0, x: 90, rotate: 12 }, show: { opacity: 1, x: 0, rotate: 0 }, duration: 0.9, ease: SIG_EASE, amount: 0.25 },
  rollSoft: { hidden: { opacity: 0, x: -40, rotate: -5 }, show: { opacity: 1, x: 0, rotate: 0 }, duration: 0.8, ease: SIG_EASE, amount: 0.25 },
};

interface Props {
  children: ReactNode;
  variant?: RevealVariant;
  /** Stagger delay (seconds). */
  delay?: number;
  className?: string;
  /** Fraction (or 'some'/'all') in view to trigger. Defaults to the variant's own amount. */
  amount?: number | 'some' | 'all';
  /** IntersectionObserver-style root margin. Default insets the bottom by 8% so
   *  reveals fire just before the edge — override to '0px' for elements that sit
   *  at the very bottom of the page (e.g. the footer). */
  margin?: string;
}

/**
 * Scroll-reveal wrapper. When animations are disabled / reduced-motion, renders a
 * plain, fully-visible element with no transform — content is never hidden. The
 * original "up/left/right/scale" variants are unchanged (desktop); "rise/roll/
 * rollRight/rollSoft" power the mobile one-page motion system.
 */
export default function Reveal({
  children,
  variant = 'up',
  delay = 0,
  className,
  amount,
  margin = '0px 0px -8% 0px',
}: Props) {
  const active = useAnimationsActive();
  if (!active) {
    return <div className={className}>{children}</div>;
  }
  const config = CONFIG[variant];
  return (
    <motion.div
      className={className}
      initial={config.hidden}
      whileInView={config.show}
      viewport={{ once: true, amount: amount ?? config.amount, margin }}
      transition={{ duration: config.duration, ease: config.ease, delay }}
    >
      {children}
    </motion.div>
  );
}
