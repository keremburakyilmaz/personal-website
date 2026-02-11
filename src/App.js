import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './styles/global.css';
import Navigation from './components/Navigation/Navigation';
import Home from './components/Home/Home';
import Projects from './components/Projects/Projects';
import Resume from './components/Resume/Resume';
import Contact from './components/Contact/Contact';
import SpotifyBrain from './components/SpotifyBrain/SpotifyBrain';
import MarketRadar from './components/MarketRadar/MarketRadar';

// Lazy load the game for code splitting
const GameRoute = lazy(() => import('./what-you-remember/ui/GameRoute'));
const SystemRunning = lazy(() => import('./system-is-running/SystemRunning'));
const Valentine = lazy(() => import('./valentine/Valentine'));

// Routes with special styling (full-screen, no navigation padding)
const SPECIAL_ROUTES = {
  '/what-you-remember': 'game-main',
  '/system': 'system-main',
  '/be-my-valentine': 'valentine-main',
};

// Routes where navigation should be hidden
const HIDDEN_NAV_ROUTES = ['/system', '/be-my-valentine'];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/spotify-brain" element={<SpotifyBrain />} />
          <Route path="/market-radar" element={<MarketRadar />} />
          <Route 
            path="/what-you-remember" 
            element={
              <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Loading...</div>}>
                <GameRoute />
              </Suspense>
            } 
          />
          <Route 
            path="/system" 
            element={
              <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0a0a0c' }}></div>}>
                <SystemRunning />
              </Suspense>
            } 
          />
          <Route 
            path="/be-my-valentine" 
            element={
              <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#fff8f0' }}></div>}>
                <Valentine />
              </Suspense>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}
