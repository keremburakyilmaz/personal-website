export default function ExperimentFrame({ number, title, question, status = 'LIVE', children, className = '' }) {
  return (
    <section className={`lab-experiment ${className}`} id={`experiment-${number}`} aria-labelledby={`experiment-${number}-title`}>
      <header className="lab-experiment__header">
        <div>
          <span className="lab-experiment__number">EXP / {number}</span>
          <h1 id={`experiment-${number}-title`}>{title}</h1>
        </div>
        <span className="lab-experiment__status"><i aria-hidden="true" />{status}</span>
      </header>
      <p className="lab-experiment__question">{question}</p>
      <div className="lab-experiment__body">{children}</div>
    </section>
  );
}
