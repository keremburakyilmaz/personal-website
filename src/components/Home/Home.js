import './Home.css';

export default function Home() {
  return (
    <section className="home-section">

      {/* ── HERO ─────────────────────────────────────────── */}
      <div className="hero">
        <span className="hero-label">AI / ML Engineer · Istanbul</span>

        <h1 className="hero-name">
          Kerem Burak<br />
          Yılmaz
        </h1>

        <p className="hero-desc">
          Building intelligent systems — from RAG pipelines
          to full-stack deployments.
        </p>

        <nav className="hero-links">
          <a href="https://github.com/keremburakyilmaz" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://linkedin.com/in/keremburakyilmaz" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href="mailto:kyilmaz22@ku.edu.tr">
            Email
          </a>
        </nav>
      </div>

      {/* ── BOTTOM INFO ──────────────────────────────────── */}
      <div className="home-footer">
        <div className="home-footer-col">
          <span className="home-footer-label">Currently</span>
          <p className="home-footer-text">Co-founder &amp; CTO at AINA</p>
          <p className="home-footer-text">AI Engineer at Digitopia</p>
        </div>
        <div className="home-footer-col">
          <span className="home-footer-label">Education</span>
          <p className="home-footer-text">Koç University — CS &amp; Business</p>
          <p className="home-footer-text">KTH Stockholm — Exchange</p>
        </div>
        <div className="home-footer-col">
          <span className="home-footer-label">Focus</span>
          <p className="home-footer-text">Generative AI · RAG Systems</p>
          <p className="home-footer-text">MLOps · Full-Stack Development</p>
        </div>
      </div>

    </section>
  );
}
