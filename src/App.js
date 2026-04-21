import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './styles/global.css';
import Navigation from './components/Navigation/Navigation';
import Home from './components/Home/Home';

const loadProjects = () => import('./components/Projects/Projects');
const loadResume = () => import('./components/Resume/Resume');
const loadContact = () => import('./components/Contact/Contact');
const loadSpotifyBrain = () => import('./components/SpotifyBrain/SpotifyBrain');
const loadMarketRadar = () => import('./components/MarketRadar/MarketRadar');
const loadGameRoute = () => import('./palimpsest/ui/GameRoute');
const loadSystemRunning = () => import('./system-is-running/SystemRunning');
const loadValentine = () => import('./valentine/Valentine');

const Projects = lazy(loadProjects);
const Resume = lazy(loadResume);
const Contact = lazy(loadContact);
const SpotifyBrain = lazy(loadSpotifyBrain);
const MarketRadar = lazy(loadMarketRadar);
const GameRoute = lazy(loadGameRoute);
const SystemRunning = lazy(loadSystemRunning);
const Valentine = lazy(loadValentine);

// Routes with special styling (full-screen, no navigation padding)
const SPECIAL_ROUTES = {
  '/': 'home-main',
  '/palimpsest': 'game-main',
  '/be-my-valentine': 'valentine-main',
};

// Routes where navigation should be hidden
const HIDDEN_NAV_ROUTES = ['/be-my-valentine'];

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

  useEffect(() => {
    if (location.pathname !== '/') {
      return undefined;
    }

    const preloadRoutes = () => {
      loadProjects();
      loadResume();
      loadContact();
      loadSpotifyBrain();
      loadMarketRadar();
      loadGameRoute();
      loadSystemRunning();
      loadValentine();
    };

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(preloadRoutes, { timeout: 1500 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(preloadRoutes, 1200);
    return () => window.clearTimeout(timeoutId);
  }, [location.pathname]);

  const showNavigation = !HIDDEN_NAV_ROUTES.includes(location.pathname);
  const mainClassName = SPECIAL_ROUTES[location.pathname] || '';

  const routeFallback = (
    <div style={{ minHeight: '40vh' }}></div>
  );

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
          <Route
            path="/projects"
            element={
              <Suspense fallback={routeFallback}>
                <PageTransition><Projects /></PageTransition>
              </Suspense>
            }
          />
          <Route
            path="/resume"
            element={
              <Suspense fallback={routeFallback}>
                <PageTransition><Resume /></PageTransition>
              </Suspense>
            }
          />
          <Route
            path="/contact"
            element={
              <Suspense fallback={routeFallback}>
                <PageTransition><Contact /></PageTransition>
              </Suspense>
            }
          />
          <Route
            path="/spotify-brain"
            element={
              <Suspense fallback={routeFallback}>
                <PageTransition><SpotifyBrain /></PageTransition>
              </Suspense>
            }
          />
          <Route
            path="/market-radar"
            element={
              <Suspense fallback={routeFallback}>
                <PageTransition><MarketRadar /></PageTransition>
              </Suspense>
            }
          />
          <Route
            path="/palimpsest"
            element={
              <Suspense fallback={routeFallback}>
                <PageTransition><GameRoute /></PageTransition>
              </Suspense>
            }
          />
          <Route
            path="/system"
            element={
              <Suspense fallback={routeFallback}>
                <PageTransition><SystemRunning /></PageTransition>
              </Suspense>
            }
          />
          <Route
            path="/be-my-valentine"
            element={
              <Suspense fallback={routeFallback}>
                <PageTransition><Valentine /></PageTransition>
              </Suspense>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
