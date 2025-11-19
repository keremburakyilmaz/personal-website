import './Projects.css';
import { projects } from '../../data/constants';

export default function Projects() {
  return (
    <section className="projects-section">
      <div className="section-header">
        <h1>Featured <span>Projects</span></h1>
        <div className="section-subtitle">Innovative solutions leveraging cutting-edge AI technologies</div>
      </div>
      
      <div className="projects-grid">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <div className="project-number">{String(index + 1).padStart(2, '0')}</div>
            <div className="project-content">
              <h2 className="project-title">{project.title}</h2>
              <ul className="project-description">
                {project.description.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
              <div className="project-tags">
                {project.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="project-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

