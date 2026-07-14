import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './Navigation.css';

const primaryLinks = [
  { to: '/#top', section: 'top', label: 'Home', index: '01' },
  { to: '/#systems', section: 'systems', label: 'Systems', index: '02' },
  { to: '/#record', section: 'record', label: 'Record', index: '03' },
  { to: '/#contact', section: 'contact', label: 'Contact', index: '04' },
];

const secondaryLinks = [
  { to: '/quantfusion', label: 'QuantFusion', index: '05' },
  { to: '/spotify-brain', label: 'Spotify', index: '06' },
  { to: '/market-radar', label: 'Radar', index: '07' },
  { to: '/palimpsest', label: 'Palimpsest', index: '08' },
  { to: '/system', label: 'System', index: '09' },
];

function NavLinkItem({ to, label, index, isActive, onClick, secondary = false }) {
  return (
    <Link
      to={to}
      className={`nav-item ${secondary ? 'nav-item--secondary' : ''} ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <span className="nav-item__index" aria-hidden="true">{index}</span>
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
            <span className="nav-brand-name">NODE / KEREM BURAK YILMAZ</span>
            <span className="nav-brand-role">ISTANBUL / SYS.IST</span>
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
                  index={link.index}
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
                  index={link.index}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                    index={link.index}
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
                    index={link.index}
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
