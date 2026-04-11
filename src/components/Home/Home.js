import './Home.css';
import profile_picture from "../../assets/profile_picture.jpg";

const TICKER_ITEMS = [
  "Machine Learning", "MLOps", "Generative AI", "RAG Systems",
  "FastAPI", "Docker", "AWS", "LangGraph", "LLMs", "Fine-tuning",
  "React", "Flutter", "Supabase", "Python", "Quantitative Analysis",
  "Computer Vision", "NLP", "Data Engineering",
];

export default function Home() {
  return (
    <section className="home-section">

      {/* ── HERO ─────────────────────────────────────────── */}
      <div className="hero">
        <div className="hero-text">
          <span className="hero-eyebrow">AI/ML Engineer · Istanbul, Turkey</span>
          <h1 className="hero-name">
            Kerem Burak<br />
            <span className="hero-name__accent">Yılmaz</span>
          </h1>
          <p className="hero-tagline">
            Building intelligent systems — from RAG pipelines to full-stack deployments.
          </p>
          <div className="social-links">
            <a href="https://github.com/keremburakyilmaz" target="_blank" rel="noopener noreferrer" className="social-link">
              GitHub <span className="social-arrow">→</span>
            </a>
            <a href="https://linkedin.com/in/keremburakyilmaz" target="_blank" rel="noopener noreferrer" className="social-link">
              LinkedIn <span className="social-arrow">→</span>
            </a>
            <a href="mailto:kyilmaz22@ku.edu.tr" className="social-link">
              Email <span className="social-arrow">→</span>
            </a>
          </div>
        </div>

        <div className="hero-photo-col">
          <div className="hero-photo-frame">
            <img
              src={profile_picture}
              alt="Kerem Burak Yılmaz"
              className="hero-photo"
            />
          </div>
        </div>
      </div>

      {/* ── TICKER ───────────────────────────────────────── */}
      <div className="skill-ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="ticker-item">
              {item} <span className="ticker-sep">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── EXPERTISE CARDS ──────────────────────────────── */}
      <div className="expertise-cards">
        <div className="expertise-card">
          <span className="expertise-card__num">01</span>
          <h3 className="expertise-card__title">AI &amp; ML Engineering</h3>
          <p className="expertise-card__desc">Generative AI, RAG systems, quantitative analysis.</p>
        </div>
        <div className="expertise-card">
          <span className="expertise-card__num">02</span>
          <h3 className="expertise-card__title">Full-Stack &amp; MLOps</h3>
          <p className="expertise-card__desc">Docker, FastAPI, AWS, MLflow, fine-tuning pipelines.</p>
        </div>
        <div className="expertise-card">
          <span className="expertise-card__num">03</span>
          <h3 className="expertise-card__title">Programming &amp; Collaboration</h3>
          <p className="expertise-card__desc">OOP, data structures, UI/UX, hackathons.</p>
        </div>
      </div>

    </section>
  );
}
