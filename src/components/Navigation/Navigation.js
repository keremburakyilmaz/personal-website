import { Link } from 'react-router-dom';
import './Navigation.css';

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
            <span className="nav-sep" aria-hidden="true"></span>
            <Link
              to="/spotify-brain"
              className={`nav-item nav-item--secondary ${isActive('/spotify-brain') ? 'active' : ''}`}
            >
              <span>Spotify</span>
            </Link>
            <Link
              to="/market-radar"
              className={`nav-item nav-item--secondary ${isActive('/market-radar') ? 'active' : ''}`}
            >
              <span>Market Radar</span>
            </Link>
            <Link
              to="/the-same-night"
              className={`nav-item nav-item--secondary ${isActive('/the-same-night') ? 'active' : ''}`}
            >
              <span>The Same Night</span>
            </Link>
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
          <div className="mobile-nav-divider"></div>
          <Link
            to="/spotify-brain"
            className={`nav-item nav-item--secondary ${isActive('/spotify-brain') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span>Spotify</span>
          </Link>
          <Link
            to="/market-radar"
            className={`nav-item nav-item--secondary ${isActive('/market-radar') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span>Market Radar</span>
          </Link>
          <Link
            to="/the-same-night"
            className={`nav-item nav-item--secondary ${isActive('/the-same-night') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span>The Same Night</span>
          </Link>
        </div>
      )}
    </>
  );
}
