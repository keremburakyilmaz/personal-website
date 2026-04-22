import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './Navigation.css';

const primaryLinks = [
  { to: '/#home', section: 'home', label: 'Home' },
  { to: '/#resume', section: 'resume', label: 'Resume' },
  { to: '/#projects', section: 'projects', label: 'Projects' },
  { to: '/#contact', section: 'contact', label: 'Contact' },
];

const secondaryLinks = [
  { to: '/spotify-brain', label: 'Spotify' },
  { to: '/market-radar', label: 'Market Radar' },
  { to: '/palimpsest', label: 'Palimpsest' },
  { to: '/system', label: 'System' },
];

function NavLinkItem({ to, label, isActive, onClick, secondary = false }) {
  return (
    <Link
      to={to}
      className={`nav-item ${secondary ? 'nav-item--secondary' : ''} ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {isActive && (
        <motion.span
          layoutId="nav-active-pill"
          className="nav-item__pill"
          transition={{ type: 'spring', stiffness: 380, damping: 34 }}
        />
      )}
      <span className="nav-item__label">{label}</span>
    </Link>
  );
}

export default function Navigation({ activeSection, menuOpen, setMenuOpen, isScrolled }) {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (section) => {
    const targetHash = `#${section}`;

    if (location.pathname !== '/') {
      navigate(`/${targetHash}`);
      setMenuOpen(false);
      return;
    }

    const target = document.getElementById(section);
    if (target) {
      window.history.replaceState(null, '', targetHash);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMenuOpen(false);
  };

  const isActive = (path, section) => {
    if (section) {
      return location.pathname === '/' && activeSection === section;
    }
    return activeSection === path;
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <nav className={`nav-container ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <Link to="/" className="nav-brand">
            <span className="nav-brand-name">Kerem Burak Yılmaz</span>
            <span className="nav-brand-role">AI systems and product engineering</span>
          </Link>

          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <div className={`menu-icon ${menuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          <div className="desktop-nav-shell">
            <div className="desktop-nav">
              {primaryLinks.map((link) => (
                <NavLinkItem
                  key={link.to}
                  to={link.to}
                  label={link.label}
                  isActive={isActive(link.to, link.section)}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection(link.section);
                  }}
                />
              ))}
              <span className="nav-sep" aria-hidden="true"></span>
              {secondaryLinks.map((link) => (
                <NavLinkItem
                  key={link.to}
                  to={link.to}
                  label={link.label}
                  isActive={isActive(link.to)}
                  secondary
                />
              ))}
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-nav"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(18px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="mobile-nav__inner"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delayChildren: 0.08,
                    staggerChildren: 0.05,
                  },
                },
              }}
            >
              {primaryLinks.map((link) => (
                <motion.div
                  key={link.to}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <NavLinkItem
                    to={link.to}
                    label={link.label}
                    isActive={isActive(link.to, link.section)}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToSection(link.section);
                    }}
                  />
                </motion.div>
              ))}
              <div className="mobile-nav-divider"></div>
              {secondaryLinks.map((link) => (
                <motion.div
                  key={link.to}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <NavLinkItem
                    to={link.to}
                    label={link.label}
                    isActive={isActive(link.to)}
                    onClick={() => setMenuOpen(false)}
                    secondary
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
