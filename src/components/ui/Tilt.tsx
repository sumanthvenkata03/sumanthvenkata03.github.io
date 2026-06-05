import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useAnimationsActive } from '../../hooks/useAnimationsActive';

const SPRING = { stiffness: 220, damping: 18, mass: 0.4 };

interface Props {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  max?: number;
}

/** Spring-physics cursor 3D tilt. Desktop fine-pointer only; disabled on touch
 *  and when animations are off/reduced (renders a plain div). The inner card
 *  keeps its own CSS hover lift + glow — the tilt layers on top. */
export default function Tilt({ children, className, max = 6 }: Props) {
  const active = useAnimationsActive();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), SPRING);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), SPRING);

  const fine =
    typeof window !== 'undefined' &&
    !!window.matchMedia &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (!active || !fine) {
    return <div className={className}>{children}</div>;
  }

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
