import { Link } from 'react-router-dom';
import './Navigation.css';
import powerIcon from '../../assets/power-button-icon.png';

export default function Navigation({ activeSection, menuOpen, setMenuOpen, isScrolled }) {
  const isActive = (path) => {
    if (path === '/') {
      return activeSection === '/' || activeSection === '';
    }
    return activeSection === path;
  };

  return (
    <>
      <nav className={`nav-container ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <Link to="/" className="nav-brand">
            <span className="nav-brand-name">Kerem Burak Yılmaz</span>
            <span className="nav-brand-title">AI/ML Engineer</span>
          </Link>
          
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`menu-icon ${menuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
          
          <div className="desktop-nav">
            <Link 
              to="/"
              className={`nav-item ${isActive('/') ? 'active' : ''}`}
            >
              <span>Home</span>
            </Link>
            <Link 
              to="/projects"
              className={`nav-item ${isActive('/projects') ? 'active' : ''}`}
            >
              <span>Projects</span>
            </Link>
            <Link 
              to="/resume"
              className={`nav-item ${isActive('/resume') ? 'active' : ''}`}
            >
              <span>Resume</span>
            </Link>
            <Link 
              to="/contact"
              className={`nav-item ${isActive('/contact') ? 'active' : ''}`}
            >
              <span>Contact</span>
            </Link>
            <Link 
              to="/spotify-brain"
              className={`nav-item ${isActive('/spotify-brain') ? 'active' : ''}`}
            >
              <span>My Spotify Brain</span>
            </Link>
            {/* <Link 
              to="/what-you-remember"
              className={`nav-item ${isActive('/what-you-remember') ? 'active' : ''}`}
            >
              <span>What You Remember</span>
            </Link> */}
            {/* <Link 
              to="/system"
              className="nav-system-link"
              aria-label="System"
            >
              <img src={powerIcon} alt="" className="nav-system-icon" />
            </Link> */}
          </div>
        </div>
      </nav>
      
      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="mobile-nav">
          <Link 
            to="/"
            className={`nav-item ${isActive('/') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span>Home</span>
          </Link>
          <Link 
            to="/projects"
            className={`nav-item ${isActive('/projects') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span>Projects</span>
          </Link>
          <Link 
            to="/resume"
            className={`nav-item ${isActive('/resume') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span>Resume</span>
          </Link>
          <Link 
            to="/contact"
            className={`nav-item ${isActive('/contact') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span>Contact</span>
          </Link>
          <Link 
            to="/spotify-brain"
            className={`nav-item ${isActive('/spotify-brain') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span>My Spotify Brain</span>
          </Link>
          {/* <Link 
            to="/what-you-remember"
            className={`nav-item ${isActive('/what-you-remember') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span>What You Remember</span>
          </Link> */}
          {/* <Link 
            to="/system"
            className="nav-system-link"
            onClick={() => setMenuOpen(false)}
            aria-label="System"
          >
            <img src={powerIcon} alt="" className="nav-system-icon" />
          </Link> */}
        </div>
      )}
    </>
  );
}

