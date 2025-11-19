import { useState, useEffect } from 'react';
import './styles/global.css';
import Navigation from './components/Navigation/Navigation';
import Home from './components/Home/Home';
import Projects from './components/Projects/Projects';
import Resume from './components/Resume/Resume';
import Contact from './components/Contact/Contact';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
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
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        isScrolled={isScrolled}
      />
      
      <main>
        {activeSection === 'home' && <Home />}
        {activeSection === 'projects' && <Projects />}
        {activeSection === 'resume' && <Resume />}
        {activeSection === 'contact' && <Contact />}
      </main>
    </div>
  );
}
