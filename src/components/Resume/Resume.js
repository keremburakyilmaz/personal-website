import './Resume.css';
import { experience, education } from '../../data/constants';
import EditorialRow from '../EditorialRow/EditorialRow';

function DescriptionItem({ point }) {
  if (typeof point === 'string') {
    return <li>{point}</li>;
  }

  return (
    <li>
      {point.text}
      <a href={point.link.url} target="_blank" rel="noopener noreferrer" className="editorial-row__inline-link">
        {point.link.text}
      </a>
      {point.suffix}
    </li>
  );
}

export default function Resume() {
  return (
    <section id="resume" className="resume-section scroll-section">
      <div className="edu-section">
        <div className="page-header">
          <p className="page-header__label">Education</p>
          <h1 className="page-header__title">Academic <span>Background</span></h1>
          <p className="page-header__sub">Degrees, honors, and international study experience.</p>
        </div>

        <div className="edu-timeline">
          {education.map((edu) => (
            <div key={`${edu.degree}-${edu.period}`} className="edu-entry">
              <EditorialRow
                eyebrow={edu.period}
                title={edu.degree}
                titleLevel="h3"
                subtitle={edu.institution}
                body={edu.description ? <p className="editorial-row__copy">{edu.description}</p> : null}
                className="editorial-row--timeline"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="exp-section">
        <div className="page-header">
          <p className="page-header__label">Career</p>
          <h1 className="page-header__title">Professional <span>Experience</span></h1>
          <p className="page-header__sub">My journey through AI and entrepreneurship</p>
        </div>

        <div className="exp-timeline">
          {experience.map((job) => (
            <div key={`${job.company}-${job.period}`} className="exp-entry">
              <EditorialRow
                eyebrow={job.period}
                title={job.position}
                titleLevel="h3"
                subtitle={(
                  <>
                    at{' '}
                    {job.companyUrl ? (
                      <a href={job.companyUrl} target="_blank" rel="noopener noreferrer" className="editorial-row__inline-link">
                        {job.company}
                      </a>
                    ) : (
                      job.company
                    )}
                  </>
                )}
                body={(
                  <ul className="editorial-row__list editorial-row__copy">
                    {job.description.map((point, index) => (
                      <DescriptionItem key={index} point={point} />
                    ))}
                  </ul>
                )}
                className="editorial-row--timeline"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
