import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { useAnimationsActive } from '../../hooks/useAnimationsActive';

interface Props {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

/** Count-up number that animates from 0 when scrolled into view. Reduced-motion
 *  / animations-off → shows the final value immediately. */
export default function CountUp({
  target,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1200,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const active = useAnimationsActive();
  const [value, setValue] = useState(active ? 0 : target);

  useEffect(() => {
    if (!active) {
      setValue(target);
      return;
    }
    if (!inView) return;
    let raf = 0;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(step);
      else setValue(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, active, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
