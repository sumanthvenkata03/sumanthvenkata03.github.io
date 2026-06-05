import { useEffect, useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import SkipLink from './SkipLink';
import Seo from '../ui/Seo';
import ScrollProgress from '../graphics/ScrollProgress';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveSection, type SectionId } from '../../store/slices/uiSlice';
import { useSyncReducedMotion } from '../../hooks/useSyncReducedMotion';
import { useAnimationsActive } from '../../hooks/useAnimationsActive';

const SECTION_FOR_PATH = (pathname: string): SectionId => {
  const seg = pathname.split('/')[1];
  return (seg === '' ? 'home' : seg) as SectionId;
};

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();
  const dispatch = useAppDispatch();
  const animate = useAnimationsActive();
  const animationsEnabled = useAppSelector((s) => s.ui.animationsEnabled);
  const reducedMotion = useAppSelector((s) => s.ui.reducedMotion);
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  useSyncReducedMotion();

  // Reflect the animation preference on <html> so CSS-keyframe decorations
  // (hero shine, orbs, button shine) are disabled too — not just Framer ones.
  useEffect(() => {
    document.documentElement.dataset.animations =
      animationsEnabled && !reducedMotion ? 'on' : 'off';
  }, [animationsEnabled, reducedMotion]);

  // Sync active section to the route (drives nav highlight + per-route meta).
  useEffect(() => {
    dispatch(setActiveSection(SECTION_FOR_PATH(location.pathname)));
  }, [location.pathname, dispatch]);

  // On navigation (not initial load): reset scroll to top + move focus to <main>
  // for screen-reader / keyboard users. The legacy site did scroll-to-top on tab switch.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    mainRef.current?.focus();
  }, [location.pathname]);

  return (
    <>
      <Seo />
      <ScrollProgress />
      <SkipLink />
      <Navbar />
      <main id="main" ref={mainRef} tabIndex={-1}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={animate ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={animate ? { opacity: 0, y: -8 } : { opacity: 1 }}
            transition={{ duration: animate ? 0.28 : 0, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
