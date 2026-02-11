import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronDown, Quote, Calendar, Sparkles, /*Home, Plane, Star, Sun,*/ Music, ExternalLink, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import './Valentine.css';

// ==========================================
// FLOATING HEARTS COMPONENT
// ==========================================
const FloatingHearts = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const newHearts = [];
    for (let i = 0; i < 15; i++) {
      newHearts.push({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 20 + 12,
        duration: Math.random() * 10 + 15,
        delay: Math.random() * 10,
      });
    }
    setHearts(newHearts);
  }, []);

  return (
    <div className="floating-hearts-container">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="floating-heart"
            style={{ left: `${heart.x}%` }}
            initial={{ y: '110vh', opacity: 0 }}
            animate={{ 
              y: '-10vh', 
              opacity: [0, 0.7, 0.7, 0],
              x: [0, Math.sin(heart.id) * 50, Math.sin(heart.id) * -30, 0]
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <Heart size={heart.size} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// HERO SECTION COMPONENT
// ==========================================
const HeroSection = () => {
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section className="valentine-hero bg-gradient-valentine">
      {/* Decorative elements */}
      <motion.div
        className="hero-decorative-heart"
        style={{ top: '5rem', left: '2.5rem' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <Heart size={80} />
      </motion.div>
      <motion.div
        className="hero-decorative-heart"
        style={{ bottom: '8rem', right: '4rem', opacity: 0.15 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        <Heart size={60} />
      </motion.div>

      {/* Main content */}
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="hero-main-heart"
        >
          <Heart size={64} style={{ animation: 'pulse 2s infinite' }} />
        </motion.div>

        <motion.p
          className="font-script hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          A letter from my heart
        </motion.p>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          To My <span className="highlight">Valentine</span>
        </motion.h1>

        <motion.p
          className="hero-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Every moment with you is a treasure I hold dear in my heart
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <div className="scroll-indicator-wrapper">
        <motion.button
          onClick={scrollToContent}
          className="scroll-indicator font-script"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ 
            opacity: { delay: 1.5 },
            y: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          }}
        >
          <span>Scroll to explore</span>
          <ChevronDown size={28} />
        </motion.button>
      </div>
    </section>
  );
};

// ==========================================
// LOVE LETTER SECTION COMPONENT
// ==========================================
const LoveLetterSection = () => {
  return (
    <section className="love-letter-section bg-gradient-romantic">
      {/* Decorative background hearts */}
      <div className="love-letter-bg-hearts">
        <Heart className="heart-1" size={120} style={{ fill: 'currentColor' }} />
        <Heart className="heart-2" size={80} style={{ fill: 'currentColor' }} />
      </div>

      <div className="love-letter-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="love-letter-header"
        >
          <Quote className="quote-icon" size={48} />
          <h2>My Love Letter to You</h2>
          <div className="divider" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="love-letter-card"
        >
          <div className="font-script love-letter-content">
            <p>My Dearest,</p>
            
            <p>
              Since we have sat in the science avlu and talked about literally everything, you have
              not left my mind even for a single second. You texting me that you had enjoyed the time
              with me, binded my heart to yours. And I haven't been able to imagine my life without you.
            </p>

            <p>
              Ever since you have been in my life, my world has been brighter, funnier, lovelier, and 
              most importantly, more meaningful. I am so lucky to have you in my life. Without you, I
              would be just a man who works and games, but you showed me what loving someone means.
            </p>
            
            <p>
              Thank you for loving me, for caring for me, and for making every ordinary 
              moment lovely. I promise to cherish you, to stand by you, and to 
              love and care foryou more with each passing day.
            </p>

            <p>
              Thank you for everything, thank you for every good morning and night message you have sent me,
              thank you for every little snack you got me, thank you for giving me your shoulder whenever I needed one,
              and thank you for always supporting me. I love you more than I can express myself.
              I hope that you will always be my valentine, and I will always be yours. 
            </p>
            
            <p className="signature">
              Forever and always yours,<br />
              <span className="name">your boy</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ==========================================
// TOGETHER COUNTER COMPONENT
// ==========================================
const RELATIONSHIP_START_DATE = new Date('2024-10-01'); 

const TogetherCounter = () => {
  const [timeUnits, setTimeUnits] = useState([
    { value: 0, label: 'Years' },
    { value: 0, label: 'Months' },
    { value: 0, label: 'Days' },
    { value: 0, label: 'Hours' },
    { value: 0, label: 'Minutes' },
    { value: 0, label: 'Seconds' },
  ]);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const diff = now.getTime() - RELATIONSHIP_START_DATE.getTime();
      
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      const years = Math.floor(days / 365);
      const months = Math.floor((days % 365) / 30);
      const remainingDays = days % 30;
      const remainingHours = hours % 24;
      const remainingMinutes = minutes % 60;
      const remainingSeconds = seconds % 60;

      setTimeUnits([
        { value: years, label: 'Years' },
        { value: months, label: 'Months' },
        { value: remainingDays, label: 'Days' },
        { value: remainingHours, label: 'Hours' },
        { value: remainingMinutes, label: 'Minutes' },
        { value: remainingSeconds, label: 'Seconds' },
      ]);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <section className="together-counter-section">
      <div className="together-counter-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="together-counter-header"
        >
          <div className="icons">
            <Calendar className="calendar-icon" size={32} />
            <span className="heart-icon"><Heart size={24} /></span>
          </div>
          <h2>Together Since</h2>
          <p className="font-script start-date">{formatDate(RELATIONSHIP_START_DATE)}</p>
        </motion.div>

        <div className="counter-grid">
          {timeUnits.map((unit, index) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="counter-card"
            >
              <motion.span
                key={unit.value}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="counter-value"
              >
                {unit.value}
              </motion.span>
              <span className="counter-label">{unit.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="font-script counter-footer"
        >
          ...and counting more 💕
        </motion.p>
      </div>
    </section>
  );
};

// ==========================================
// REASONS SECTION COMPONENT
// ==========================================
const reasons = [
  "Your cutest smile that lights up my day",
  "The way you laugh at my silly jokes",
  "How you always know exactly what I crave",
  "Your kindness that always touches me",
  "The warmth of your hand in mine",
  "Your patience and understanding",
  "The way you believe in me, even when I don't",
  "Your beautiful soul that's always full of love",
  "How you make ordinary moments magical",
  "You always being you",
];

const ReasonsSection = () => {
  return (
    <section className="reasons-section bg-gradient-romantic">
      <div className="reasons-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="reasons-header"
        >
          <h2>Reasons I Love You</h2>
          <p className="font-script">There are countless reasons, but here are just a few...</p>
          <div className="divider" />
        </motion.div>

        <div className="reasons-list">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="reason-card">
                <div className="reason-icon">
                  <Heart size={24} />
                </div>
                <div className="reason-content">
                  <span className="reason-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="reason-text">{reason}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// FUTURE DREAMS SECTION COMPONENT
// ==========================================
/*
const dreams = [
  {
    icon: Home,
    title: "Our Dream Home",
    description: "A cozy place filled with love, laughter, and memories we'll cherish forever",
  },
  {
    icon: Plane,
    title: "Adventures Together",
    description: "Exploring the world hand in hand, collecting moments from every corner of the earth",
  },
  {
    icon: Heart,
    title: "Growing Old Together",
    description: "Rocking chairs on a porch, reminiscing about our beautiful life journey",
  },
  {
    icon: Star,
    title: "Achieving Dreams",
    description: "Supporting each other's aspirations and celebrating every victory, big or small",
  },
  {
    icon: Sun,
    title: "Everyday Magic",
    description: "Finding joy in simple moments — morning coffee, evening walks, and quiet nights",
  },
];



const FutureDreamsSection = () => {
  return (
    <section className="future-dreams-section">
      <div className="future-dreams-bg">
        <div className="blob-1" />
        <div className="blob-2" />
      </div>

      <div className="future-dreams-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="future-dreams-header"
        >
          <Sparkles className="sparkles-icon" size={32} />
          <h2>Our Future Dreams</h2>
          <p className="font-script">All the beautiful tomorrows I can't wait to share with you</p>
          <div className="divider" />
        </motion.div>

        <div className="dreams-grid">
          {dreams.map((dream, index) => {
            const IconComponent = dream.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <div className="dream-card">
                  <div className="dream-icon">
                    <IconComponent size={28} />
                  </div>
                  <h3>{dream.title}</h3>
                  <p>{dream.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
*/

// ==========================================
// VALENTINE QUIZ COMPONENT
// ==========================================
const ValentineQuiz = () => {
  const [answered, setAnswered] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleYes = () => {
    setAnswered(true);
    
    // Fire confetti
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#ff6b8a', '#ff8fa3', '#ffc2d1', '#ffb3c1', '#ff4d6d'],
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  const handleNoHover = () => {
    if (containerRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      const maxX = container.width / 2 - 80;
      const maxY = container.height / 2 - 40;
      
      setNoButtonPosition({
        x: (Math.random() - 0.5) * maxX * 2,
        y: (Math.random() - 0.5) * maxY * 2,
      });
    }
  };

  return (
    <section className="valentine-quiz-section bg-gradient-valentine">
      <div ref={containerRef} className="quiz-container">
        <AnimatePresence mode="wait">
          {!answered ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="quiz-question"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="quiz-heart"
              >
                <Heart size={80} />
              </motion.div>

              <h2 className="quiz-title">
                Will You Be My <span className="highlight">Valentine?</span>
              </h2>

              <p className="font-script quiz-subtitle">
                I have one very important question...
              </p>

              <div className="quiz-buttons">
                <button onClick={handleYes} className="btn-yes">
                  <Heart size={24} />
                  Yes, I will! 💕
                </button>

                <motion.div
                  animate={noButtonPosition}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <button
                    onMouseEnter={handleNoHover}
                    onTouchStart={handleNoHover}
                    className="btn-no"
                  >
                    No 😢
                  </button>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="answer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="quiz-answer"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="quiz-sparkles"
              >
                <Sparkles size={80} />
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                You Made Me So <span className="highlight">Happy!</span> 🎉
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="font-script quiz-answer-text"
              >
                I knew you'd say yes! I love you more than words can ever express 💕
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="quiz-hearts-row"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [0, -20, 0],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      delay: 0.8 + i * 0.1,
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 0.5
                    }}
                  >
                    <Heart size={32} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// ==========================================
// MUSIC PLAYER COMPONENT
// ==========================================
// TODO: Add your music links here!
const musicLinks = [
  {
    name: "for my forever valentine <3",
    platform: "Spotify",
    url: "https://open.spotify.com/playlist/0JoXJ8T2c3XOPz63wegdUP?si=dfGpq4e5RhCWDQoC-fZuUg&pt=1cad136fd9ced415bac99cbec3417ef7",
    icon: "🎵",
  },
  {
    name: "for my forever valentine 🔥",
    platform: "YouTube Music",
    url: "https://open.spotify.com/playlist/6dGKEZxKiYyUnC0MQLhF3v?si=vbx-dWeESjWqwCe4jKgPfw&pt=18fb69b8d6125bb1acd3cbbec089cc81",
    icon: "🎶",
  },
];

const MusicPlayer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating music button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="music-toggle-btn"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Music size={24} />
      </motion.button>

      {/* Music panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="music-backdrop"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="music-panel"
            >
              <div className="music-panel-content">
                <div className="music-panel-header">
                  <div className="music-panel-title">
                    <div className="music-panel-icon">
                      <Music size={20} />
                    </div>
                    <div>
                      <h3>Our Music</h3>
                      <p>Songs that remind me of us</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="music-close-btn"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="music-links">
                  {musicLinks.map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="music-link"
                    >
                      <div className="music-link-info">
                        <span className="music-link-emoji">{link.icon}</span>
                        <div>
                          <p className="music-link-name">{link.name}</p>
                          <p className="music-link-platform">{link.platform}</p>
                        </div>
                      </div>
                      <ExternalLink size={18} />
                    </motion.a>
                  ))}
                </div>

                <div className="music-panel-footer font-script">
                  <Heart size={16} />
                  Music makes every moment magical
                  <Heart size={16} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// ==========================================
// FOOTER COMPONENT
// ==========================================
/*
const Footer = () => {
  return (
    <footer className="valentine-footer">
      <div className="valentine-footer-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="heart-icon">
            <Heart size={24} />
          </div>
          
          <p className="font-script message">
            Made with all my love, just for you
          </p>
          
          <p className="submessage">
            Forever yours, today and always 💕
          </p>
        </motion.div>
      </div>
    </footer>
  );
};
*/

// ==========================================
// MAIN VALENTINE PAGE COMPONENT
// ==========================================
const Valentine = () => {
  return (
    <div className="valentine-page">
      <FloatingHearts />
      <HeroSection />
      <LoveLetterSection />
      <TogetherCounter />
      <ReasonsSection />
      <ValentineQuiz />
      <MusicPlayer />
    </div>
  );
};

export default Valentine;
