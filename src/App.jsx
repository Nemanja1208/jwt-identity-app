import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SlideNav } from './components/SlideNav.jsx';

import SlideIntro           from './slides/S01_Intro.jsx';
import SlideJwtStructure    from './slides/S02_JwtStructure.jsx';
import SlideAuthFlow        from './slides/S03_AuthFlow.jsx';
import SlideInstall         from './slides/S04_Install.jsx';
import SlideConfig          from './slides/S05_Config.jsx';
import SlideProgramCs       from './slides/S06_ProgramCs.jsx';
import SlideAuthController  from './slides/S07_AuthController.jsx';
import SlideTokenService    from './slides/S08_TokenService.jsx';
import SlideProtected       from './slides/S09_Protected.jsx';
import SlideMigrations      from './slides/S10_Migrations.jsx';
import SlideFullFlow        from './slides/S11_FullFlow.jsx';
import SlideCheatSheet      from './slides/S12_CheatSheet.jsx';

const SLIDES = [
  { component: SlideIntro,          title: 'Introduction' },
  { component: SlideJwtStructure,   title: 'JWT Structure' },
  { component: SlideAuthFlow,       title: 'Authentication Flow' },
  { component: SlideInstall,        title: 'Package Installation' },
  { component: SlideConfig,         title: 'Configuration' },
  { component: SlideProgramCs,      title: 'Program.cs Setup' },
  { component: SlideAuthController, title: 'Auth Controller' },
  { component: SlideTokenService,   title: 'Token Service' },
  { component: SlideProtected,      title: 'Protected Endpoints' },
  { component: SlideMigrations,     title: 'EF Migrations' },
  { component: SlideFullFlow,       title: 'Complete Flow' },
  { component: SlideCheatSheet,     title: 'Cheat Sheet' },
];

const variants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0, scale: 0.96 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-60%' : '60%', opacity: 0, scale: 0.94 }),
};

export default function App() {
  const [[current, direction], setSlide] = useState([0, 0]);

  const goTo = useCallback((next) => {
    if (next < 0 || next >= SLIDES.length) return;
    setSlide(([cur]) => [next, next > cur ? 1 : -1]);
  }, []);

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault(); goNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault(); goPrev();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  const SlideComponent = SLIDES[current].component;

  return (
    <div className="slide-container">
      <SlideNav
        current={current}
        total={SLIDES.length}
        onPrev={goPrev}
        onNext={goNext}
        slideTitle={SLIDES[current].title}
      />
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.25 },
            scale: { duration: 0.3 },
          }}
          style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
          <SlideComponent />
        </motion.div>
      </AnimatePresence>
      <div style={{ position: 'fixed', top: 48, left: 0, width: 1, height: '60%', background: 'linear-gradient(180deg, transparent, rgba(0,255,136,0.1), transparent)', pointerEvents: 'none', zIndex: 50 }} />
      <div style={{ position: 'fixed', top: 48, right: 0, width: 1, height: '60%', background: 'linear-gradient(180deg, transparent, rgba(0,212,255,0.1), transparent)', pointerEvents: 'none', zIndex: 50 }} />
    </div>
  );
}
