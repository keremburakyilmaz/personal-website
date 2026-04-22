import './EditorialRow.css';

export default function EditorialRow({
  lead,
  eyebrow,
  title,
  subtitle,
  body,
  footer,
  titleLevel = 'h2',
  className = '',
}) {
  const TitleTag = titleLevel;
  const bodyClassName = `editorial-row__body ${lead ? 'editorial-row__body--offset' : ''}`.trim();
  const footerClassName = `editorial-row__footer ${lead ? 'editorial-row__footer--offset' : ''}`.trim();

  return (
    <article className={`editorial-row ${className}`.trim()}>
      <div className="editorial-row__top">
        {lead && <span className="editorial-row__lead">{lead}</span>}
        <div className="editorial-row__heading">
          {eyebrow && <span className="editorial-row__eyebrow">{eyebrow}</span>}
          <TitleTag className="editorial-row__title">{title}</TitleTag>
          {subtitle && <div className="editorial-row__subtitle">{subtitle}</div>}
        </div>
      </div>

      {body && <div className={bodyClassName}>{body}</div>}
      {footer && <div className={footerClassName}>{footer}</div>}
    </article>
  );
}
