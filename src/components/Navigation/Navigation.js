import { useEffect, useMemo, useState } from 'react';
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
  { to: '/lab', label: 'Lab', index: '10' },
];

const navigationLinks = [...primaryLinks, ...secondaryLinks];

function useLiveStatus() {
  const [now, setNow] = useState(() => new Date());
  const [online, setOnline] = useState(() => (
    typeof navigator === 'undefined' ? true : navigator.onLine
  ));

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const istanbulTime = useMemo(() => new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Istanbul',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now), [now]);

  return { istanbulTime, online };
}

function NavLinkItem({ to, label, index, isActive, onClick }) {
  return (
    <Link
      to={to}
      className={`nav-item ${isActive ? 'active' : ''}`}
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
  const { istanbulTime, online } = useLiveStatus();

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

    return location.pathname === path
      || (path === '/lab' && location.pathname.startsWith('/lab/'));
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash, setMenuOpen]);

  const renderLink = (link) => (
    <NavLinkItem
      key={link.to}
      to={link.to}
      label={link.label}
      index={link.index}
      isActive={isActive(link.to, link.section)}
      onClick={link.section
        ? (event) => {
          event.preventDefault();
          scrollToSection(link.section);
        }
        : () => setMenuOpen(false)}
    />
  );

  return (
    <>
      <header className={`nav-container ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <Link
            to="/#top"
            className="nav-brand"
            aria-label="Kerem Burak Yilmaz, back to top"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection('top');
            }}
          >
            <span className="nav-brand__mark">KBY</span>
            <span className="nav-brand__slash" aria-hidden="true">/</span>
            <span className="nav-brand__system">SYS.IST</span>
          </Link>

          <div className="nav-telemetry" aria-label={`Istanbul time ${istanbulTime}. System ${online ? 'live' : 'offline'}.`}>
            <span>ISTANBUL / UTC+3</span>
            <time className="nav-telemetry__clock">{istanbulTime}</time>
            <span className={`nav-live-state ${online ? '' : 'nav-live-state--offline'}`}>
              <i aria-hidden="true" />{online ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {navigationLinks.map(renderLink)}
          </nav>

          <button
            className="menu-button"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <span className={`menu-icon ${menuOpen ? 'open' : ''}`} aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Primary navigation"
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
              {navigationLinks.map((link) => (
                <motion.div
                  key={link.to}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {renderLink(link)}
                </motion.div>
              ))}
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
