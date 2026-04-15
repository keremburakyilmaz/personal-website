import './Home.css';
import { Github, Linkedin, Mail } from 'lucide-react';
import wave from '../../assets/great_wave.jpg';


export default function Home() {
  return (
    <section className="home-section">

      {/* ── HERO ─────────────────────────────────────────── */}
      <div className="hero">

        {/* Background wave image */}
        <div className="hero-wave-bg" aria-hidden="true">
          <img src={wave} alt="" className="hero-wave-img" />
        </div>


        <div className="hero-content">
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
          </nav>

          <div className="hero-status">
            <div className="hero-status-line">
              <span className="hero-status-label">Currently</span>
              <span className="hero-status-text">AI Engineer at Digitopia · Full Stack Engineer at Turkish Technology</span>
            </div>
            <div className="hero-status-line">
              <span className="hero-status-label">Education</span>
              <span className="hero-status-text">Koç University, CS &amp; Business</span>
            </div>
            <div className="hero-status-line">
              <span className="hero-status-label">Focus</span>
              <span className="hero-status-text">AI Workflows · Generative AI · RAG Systems · MLOps</span>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
