import './Projects.css';
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../../data/constants';

function ProjectLink({ link }) {
  const Icon = link.type === 'github' ? Github : link.type === 'internal' ? ArrowUpRight : ExternalLink;
  if (link.type === 'internal') {
    return (
      <Link to={link.url} className="project-link">
        <Icon size={13} strokeWidth={1.75} />
        {link.label}
      </Link>
    );
  }
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" className="project-link">
      <Icon size={13} strokeWidth={1.75} />
      {link.label}
    </a>
  );
}

export default function Projects() {
  return (
    <section className="projects-section">
      <div className="page-header">
        <p className="page-header__label">Selected work</p>
        <h1 className="page-header__title">Featured <span>Projects</span></h1>
        <p className="page-header__sub">ML systems, AI backends, and full-stack applications</p>
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
            <div className="project-row__meta">
              <div className="project-row__tags">
                {project.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="project-tag">{tag}</span>
                ))}
              </div>
              {project.links && project.links.length > 0 && (
                <div className="project-row__links">
                  {project.links.map((link, i) => (
                    <ProjectLink key={i} link={link} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
