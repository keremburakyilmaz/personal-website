import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './styles/global.css';
import Navigation from './components/Navigation/Navigation';
import Home from './components/Home/Home';
import Projects from './components/Projects/Projects';
import Resume from './components/Resume/Resume';
import Contact from './components/Contact/Contact';
import SpotifyBrain from './components/SpotifyBrain/SpotifyBrain';
import MarketRadar from './components/MarketRadar/MarketRadar';
import StyleMorph from './components/StyleMorph/StyleMorph';

// Lazy load the game for code splitting
const GameRoute = lazy(() => import('./palimpsest/ui/GameRoute'));
const SystemRunning = lazy(() => import('./system-is-running/SystemRunning'));
const Valentine = lazy(() => import('./valentine/Valentine'));

// Routes with special styling (full-screen, no navigation padding)
const SPECIAL_ROUTES = {
  '/': 'home-main',
  '/palimpsest': 'game-main',
  '/system': 'system-main',
  '/be-my-valentine': 'valentine-main',
};

// Routes where navigation should be hidden
const HIDDEN_NAV_ROUTES = ['/system', '/be-my-valentine'];

function PageTransition({ children }) {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showNavigation = !HIDDEN_NAV_ROUTES.includes(location.pathname);
  const mainClassName = SPECIAL_ROUTES[location.pathname] || '';

  return (
    <div className="app-container">
      {showNavigation && (
        <Navigation
          activeSection={location.pathname}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          isScrolled={isScrolled}
        />
      )}

      <main className={mainClassName}>
        <Routes location={location}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
          <Route path="/resume" element={<PageTransition><Resume /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/spotify-brain" element={<PageTransition><SpotifyBrain /></PageTransition>} />
          <Route path="/market-radar" element={<PageTransition><MarketRadar /></PageTransition>} />
          <Route path="/style-morph" element={<PageTransition><StyleMorph /></PageTransition>} />
          <Route
            path="/palimpsest"
            element={
              <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Loading...</div>}>
                <PageTransition><GameRoute /></PageTransition>
              </Suspense>
            }
          />
          <Route
            path="/system"
            element={
              <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0a0a0c' }}></div>}>
                <PageTransition><SystemRunning /></PageTransition>
              </Suspense>
            }
          />
          <Route
            path="/be-my-valentine"
            element={
              <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#fff8f0' }}></div>}>
                <PageTransition><Valentine /></PageTransition>
              </Suspense>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
