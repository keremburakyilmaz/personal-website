import './Projects.css';
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../../data/constants';
import EditorialRow from '../EditorialRow/EditorialRow';

function ProjectLink({ link }) {
  const Icon = link.type === 'github' ? Github : link.type === 'internal' ? ArrowUpRight : ExternalLink;
  if (link.type === 'internal') {
    return (
      <Link to={link.url} className="editorial-row__link">
        <Icon size={13} strokeWidth={1.75} />
        {link.label}
      </Link>
    );
  }
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" className="editorial-row__link">
      <Icon size={13} strokeWidth={1.75} />
      {link.label}
    </a>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="projects-section scroll-section">
      <div className="page-header">
        <p className="page-header__label">Selected work</p>
        <h1 className="page-header__title">Featured <span>Projects</span></h1>
        <p className="page-header__sub">ML systems, AI backends, and full-stack applications</p>
      </div>

      <div className="project-list">
        {projects.map((project, index) => (
          <EditorialRow
            key={project.title}
            lead={String(index + 1).padStart(2, '0')}
            title={project.title}
            body={(
              <ul className="editorial-row__list">
                {project.description.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            )}
            footer={(
              <>
                <div className="editorial-row__tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="editorial-row__tag">{tag}</span>
                  ))}
                </div>
                {project.links && project.links.length > 0 && (
                  <div className="editorial-row__links">
                    {project.links.map((link, i) => (
                      <ProjectLink key={i} link={link} />
                    ))}
                  </div>
                )}
              </>
            )}
          />
        ))}
      </div>
    </section>
  );
}
