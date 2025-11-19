import './Navigation.css';

export default function Navigation({ activeSection, setActiveSection, menuOpen, setMenuOpen, isScrolled }) {
  return (
    <>
      <nav className={`nav-container ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <div className="nav-brand">
            <span className="nav-brand-name">Kerem Burak Yılmaz</span>
            <span className="nav-brand-title">AI/ML Engineer</span>
          </div>
          
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`menu-icon ${menuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
          
          <div className="desktop-nav">
            <button 
              className={`nav-item ${activeSection === 'home' ? 'active' : ''}`} 
              onClick={() => setActiveSection('home')}
            >
              <span>Home</span>
            </button>
            <button 
              className={`nav-item ${activeSection === 'projects' ? 'active' : ''}`} 
              onClick={() => setActiveSection('projects')}
            >
              <span>Projects</span>
            </button>
            <button 
              className={`nav-item ${activeSection === 'resume' ? 'active' : ''}`} 
              onClick={() => setActiveSection('resume')}
            >
              <span>Resume</span>
            </button>
            <button 
              className={`nav-item ${activeSection === 'contact' ? 'active' : ''}`} 
              onClick={() => setActiveSection('contact')}
            >
              <span>Contact</span>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="mobile-nav">
          <button 
            className={`nav-item ${activeSection === 'home' ? 'active' : ''}`} 
            onClick={() => {setActiveSection('home'); setMenuOpen(false)}}
          >
            <span>Home</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'projects' ? 'active' : ''}`} 
            onClick={() => {setActiveSection('projects'); setMenuOpen(false)}}
          >
            <span>Projects</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'resume' ? 'active' : ''}`} 
            onClick={() => {setActiveSection('resume'); setMenuOpen(false)}}
          >
            <span>Resume</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'contact' ? 'active' : ''}`} 
            onClick={() => {setActiveSection('contact'); setMenuOpen(false)}}
          >
            <span>Contact</span>
          </button>
        </div>
      )}
    </>
  );
}

