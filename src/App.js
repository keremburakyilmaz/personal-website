import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './styles/global.css';
import Navigation from './components/Navigation/Navigation';
import Home from './components/Home/Home';
import Projects from './components/Projects/Projects';
import Resume from './components/Resume/Resume';
import Contact from './components/Contact/Contact';
import SpotifyBrain from './components/SpotifyBrain/SpotifyBrain';
import { SpotifyPlayerProvider } from './contexts/SpotifyPlayerContext';

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
      <Navigation 
        activeSection={location.pathname}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        isScrolled={isScrolled}
      />
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/spotify-brain" element={<SpotifyPlayerProvider><SpotifyBrain /></SpotifyPlayerProvider>} />
        </Routes>
      </main>
    </div>
  );
}
