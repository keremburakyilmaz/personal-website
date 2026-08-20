import { Link } from 'react-router-dom';
import { experimentPath, LAB_EXPERIMENTS } from './experiments';
import './Lab.css';

export default function LabRoute() {
  return (
    <div className="lab-page">
      <header className="lab-hero" id="top">
        <div className="lab-hero__eyebrow">
          <span>NODE / LAB</span>
          <span>{String(LAB_EXPERIMENTS.length).padStart(2, '0')} ACTIVE EXPERIMENTS</span>
        </div>
        <h1>Small instruments<br />for unnecessary things.</h1>
        <p>
          A cabinet of browser-sized curiosities. No accounts, no objectives,
          and very little practical value.
        </p>
      </header>

      <nav className="lab-directory" aria-label="Experiment index">
        {LAB_EXPERIMENTS.map((experiment) => (
          <Link key={experiment.number} to={experimentPath(experiment)}>
            <div className="lab-directory__meta">
              <span>EXP / {experiment.number}</span>
              <span>{experiment.type}</span>
              <span className="lab-index__status"><i aria-hidden="true" />{experiment.status}</span>
            </div>
            <h2>{experiment.title}</h2>
            <p>{experiment.description}</p>
            <span className="lab-directory__open">OPEN INSTRUMENT ↗</span>
          </Link>
        ))}
      </nav>

      <footer className="lab-footer">
        <span>END OF INDEX</span>
        <a href="#top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>RETURN TO INDEX ↑</a>
      </footer>
    </div>
  );
}
