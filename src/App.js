import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './styles/global.css';
import Navigation from './components/Navigation/Navigation';
import Home from './components/Home/Home';
import Projects from './components/Projects/Projects';
import Resume from './components/Resume/Resume';
import Contact from './components/Contact/Contact';
import SpotifyBrain from './components/SpotifyBrain/SpotifyBrain';

// Lazy load the game for code splitting
const GameRoute = lazy(() => import('./what-you-remember/ui/GameRoute'));
const SystemRunning = lazy(() => import('./system-is-running/SystemRunning'));

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

  return (
    <div className="app-container">
      {location.pathname !== '/system' && (
        <Navigation 
          activeSection={location.pathname}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          isScrolled={isScrolled}
        />
      )}
      
      <main className={location.pathname === '/what-you-remember' ? 'game-main' : location.pathname === '/system' ? 'system-main' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/spotify-brain" element={<SpotifyBrain />} />
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
        </Routes>
      </main>
    </div>
  );
}
