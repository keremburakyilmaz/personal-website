import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import './Home.css';
import wave from '../../assets/great_wave.jpg';

const heroContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const statusCards = [
  {
    label: 'Currently',
    value: 'Full Stack Engineer at Turkish Technology',
  },
  {
    label: 'Education',
    value: 'Koç University - CS & Business, with KTH exchange',
  },
];

const focusRoadmapStats = [
  { label: 'Duration', value: '24 weeks' },
  { label: 'Target', value: 'ML Quant / Quant Researcher' },
  { label: 'Pace', value: '10-15 hrs/week' },
];

const focusRoadmapPhases = [
  {
    number: '01',
    name: 'Foundation',
    range: 'Weeks 1-6',
    signal: 'Probability, linear algebra, stochastic processes',
    accent: '#c9d772',
  },
  {
    number: '02',
    name: 'Markets + Stats',
    range: 'Weeks 7-12',
    signal: 'Microstructure, time series, risk, portfolios',
    accent: '#78c0c8',
  },
  {
    number: '03',
    name: 'Quant Systems',
    range: 'Weeks 13-18',
    signal: 'Backtesting, options pricing, ML alpha',
    accent: '#d2a05f',
  },
  {
    number: '04',
    name: 'Portfolio Building',
    range: 'Weeks 19-24',
    signal: 'Flagship projects, interviews, alpha submissions',
    accent: '#bda0cf',
  },
];

export default function Home() {
  return (
    <section id="home" className="home-section scroll-section">
      <div className="hero">
        <div className="hero-atmosphere" aria-hidden="true">
          <span className="hero-orb hero-orb--gold"></span>
          <span className="hero-orb hero-orb--sand"></span>
          <span className="hero-grid-glow"></span>
        </div>

        <div className="hero-wave-bg" aria-hidden="true">
          <img src={wave} alt="" className="hero-wave-img" />
        </div>

        <div className="hero-shell">
          <motion.div
            className="hero-content"
            variants={heroContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.span className="hero-label" variants={heroItem}>
              AI / ML Engineer - Istanbul
            </motion.span>

            <motion.h1 className="hero-name" variants={heroItem}>
              Kerem Burak
              <br />
              Yılmaz
            </motion.h1>

            <motion.p className="hero-desc" variants={heroItem}>
              I build AI systems that run in production, from a Spotify ML pipeline
              with 2,600+ automated executions to privacy tooling and financial
              intelligence backends.
            </motion.p>

            <motion.div className="hero-actions" variants={heroItem}>
              <a href="#projects" className="hero-cta hero-cta--primary">
                View Projects
                <ArrowUpRight size={16} strokeWidth={1.8} />
              </a>
              <a href="#resume" className="hero-cta hero-cta--ghost">
                Open Resume
              </a>
            </motion.div>

            <motion.nav className="hero-links" variants={heroItem}>
              <a href="https://github.com/keremburakyilmaz" target="_blank" rel="noopener noreferrer">
                <Github size={15} strokeWidth={1.5} />
                GitHub
              </a>
              <a href="https://linkedin.com/in/keremburakyilmaz" target="_blank" rel="noopener noreferrer">
                <Linkedin size={15} strokeWidth={1.5} />
                LinkedIn
              </a>
              <a href="mailto:kyilmaz22@ku.edu.tr">
                <Mail size={15} strokeWidth={1.5} />
                Email
              </a>
            </motion.nav>

          </motion.div>

          <motion.div
            className="hero-sidecar"
            initial={{ opacity: 0, x: 48, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.95, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero-sidecar-copy">
              <span className="hero-sidecar-label">Current Snapshot</span>
              <p>
                A quick view of what I am building, where I am learning, and the
                areas I am focused on right now.
              </p>
            </div>
            <div className="hero-status-grid hero-status-grid--stacked">
              {statusCards.map((card) => (
                <article key={card.label} className="hero-status-card">
                  <span className="hero-status-label">{card.label}</span>
                  <p className="hero-status-text">{card.value}</p>
                </article>
              ))}

              <article className="hero-focus-card">
                <div className="hero-focus-heading">
                  <span className="hero-status-label">Focus</span>
                  <span className="hero-focus-code">{'// roadmap.quant'}</span>
                </div>

                <h2 className="hero-focus-title">
                  From zero to quant-ready
                </h2>

                <p className="hero-focus-copy">
                  A six-month curriculum: math first, markets second, code always.
                  Built around the path from AI engineering toward ML quant research.
                </p>

                <div className="hero-focus-meta" aria-label="Quant roadmap summary">
                  {focusRoadmapStats.map((stat) => (
                    <div key={stat.label} className="hero-focus-stat">
                      <span>{stat.label}</span>
                      <strong>{stat.value}</strong>
                    </div>
                  ))}
                </div>

                <div className="hero-focus-track" aria-label="Quant roadmap phases">
                  {focusRoadmapPhases.map((phase) => (
                    <div
                      key={phase.number}
                      className="hero-focus-phase"
                      style={{ '--phase-accent': phase.accent }}
                    >
                      <div className="hero-focus-phase__marker">
                        {phase.number}
                      </div>
                      <div className="hero-focus-phase__body">
                        <div className="hero-focus-phase__topline">
                          <span>{phase.name}</span>
                          <small>{phase.range}</small>
                        </div>
                        <p>{phase.signal}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
