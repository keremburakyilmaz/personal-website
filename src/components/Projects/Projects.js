import './Projects.css';
import { projects } from '../../data/constants';

export default function Projects() {
  return (
    <section className="projects-section">
      <div className="page-header">
        <p className="page-header__label">Selected work</p>
        <h1 className="page-header__title">Featured <span>Projects</span></h1>
        <p className="page-header__sub">Innovative solutions leveraging cutting-edge AI technologies</p>
      </div>

      <div className="project-list">
        {projects.map((project, index) => (
          <div key={index} className="project-row">
            <div className="project-row__top">
              <span className="project-row__num">{String(index + 1).padStart(2, '0')}</span>
              <h2 className="project-row__title">{project.title}</h2>
            </div>
            <ul className="project-row__desc">
              {project.description.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
            <div className="project-row__tags">
              {project.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="project-tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
