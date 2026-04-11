import './Resume.css';
import { experience, education, skills } from '../../data/constants';

export default function Resume() {
  return (
    <section className="resume-section">

      {/* ── EXPERIENCE ───────────────────────────────────────── */}
      <div className="page-header">
        <p className="page-header__label">Career</p>
        <h1 className="page-header__title">Professional <span>Experience</span></h1>
        <p className="page-header__sub">My journey through AI and entrepreneurship</p>
      </div>

      <div className="exp-timeline">
        {experience.map((job, index) => (
          <div key={index} className="exp-entry">
            <div className="exp-entry__period">{job.period}</div>
            <div className="exp-entry__body">
              <h3 className="exp-entry__role">{job.position}</h3>
              <span className="exp-entry__company">at {job.company}</span>
              <ul className="exp-entry__desc">
                {job.description.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* ── EDUCATION & SKILLS ──────────────────────────────── */}
      <div className="edu-section">
        <div className="section-header">
          <h1>Education &amp; <span>Skills</span></h1>
        </div>


        <div className="edu-cards">
          {education.map((edu, index) => (
            <div key={index} className="edu-card">
              <div className="edu-card__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                </svg>
              </div>
              <div className="edu-card__body">
                <h3 className="edu-card__degree">{edu.degree}</h3>
                <div className="edu-card__institution">{edu.institution}</div>
                <div className="edu-card__period">{edu.period}</div>
                {edu.description && <p className="edu-card__desc">{edu.description}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="skills-block">
          <h3 className="skills-block__title">Technical Expertise</h3>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <div key={index} className="skill-item">{skill}</div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
