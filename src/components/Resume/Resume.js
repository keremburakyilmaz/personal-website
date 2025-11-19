import './Resume.css';
import { experience, education, skills } from '../../data/constants';

export default function Resume() {
  return (
    <section className="resume-section">
      <div className="section-header">
        <h1>Professional <span>Experience</span></h1>
        <div className="section-subtitle">My journey through AI and entrepreneurship</div>
      </div>
      
      <div className="timeline-container">
        {experience.map((job, index) => (
          <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
            <div className="timeline-content">
              <div className="timeline-period">{job.period}</div>
              <div className="timeline-header">
                <h3>{job.position}</h3>
                <span>at {job.company}</span>
              </div>
              <ul className="timeline-description">
                {job.description.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
            <div className="timeline-dot"></div>
          </div>
        ))}
      </div>
      
      <div className="education-section">
        <div className="section-header">
          <h1>Education & <span>Skills</span></h1>
        </div>
        
        <div className="education-cards">
          {education.map((edu, index) => (
            <div key={index} className="education-card">
              <div className="education-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                </svg>
              </div>
              <div className="education-content">
                <h3>{edu.degree}</h3>
                <div className="education-institution">{edu.institution}</div>
                <div className="education-period">{edu.period}</div>
                <p>{edu.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="skills-section">
          <h3>Technical Expertise</h3>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <div key={index} className="skill-item">
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

