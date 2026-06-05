import { useEffect, useState } from 'react';

/** Window scroll progress as a 0..1 ratio (rAF-throttled). */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const sc = window.pageYOffset || document.documentElement.scrollTop || 0;
      const sh = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      const ch = window.innerHeight || document.documentElement.clientHeight;
      const max = sh - ch;
      setProgress(max > 0 ? Math.min(sc / max, 1) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return progress;
}
