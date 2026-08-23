import { useEffect, useMemo, useState } from 'react';
import './MarketRadar.css';
import '../../styles/route-system.css';
import { fetchLatestSnapshot, getSnapshotState } from './marketRadarData';
import { createPreviewSnapshot } from './previewSnapshot';

const MANIFEST_OVERRIDE = process.env.REACT_APP_MARKET_RADAR_MANIFEST_URL?.trim();
const PREVIEW_ENABLED = process.env.REACT_APP_MARKET_RADAR_PREVIEW === 'true'
  || (process.env.NODE_ENV === 'development' && !MANIFEST_OVERRIDE);

function formatTimestamp(value) {
  if (!value) return 'Not available';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(value));
}

function formatCalendarTimestamp(value) {
  if (!value) return { date: 'TBD', time: '—' };

  const date = new Date(value);
  return {
    date: new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
    }).format(date),
    time: new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(date),
  };
}

function inScope(item, scope) {
  return scope === 'all' || item.marketTags?.includes(scope);
}

function useMarketRadarSnapshot() {
  const previewSnapshot = useMemo(() => (
    PREVIEW_ENABLED ? createPreviewSnapshot() : null
  ), []);
  const [state, setState] = useState(() => (
    previewSnapshot
      ? { status: 'ready', snapshot: previewSnapshot, mode: 'preview', error: null }
      : { status: 'loading', snapshot: null, mode: 'live', error: null }
  ));
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (previewSnapshot) return undefined;

    const controller = new AbortController();

    fetchLatestSnapshot({
      manifestUrl: MANIFEST_OVERRIDE,
      signal: controller.signal,
    })
      .then(({ snapshot }) => {
        setState({ status: 'ready', snapshot, mode: 'live', error: null });
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setState({
          status: 'error',
          snapshot: null,
          mode: 'live',
          error: error.message,
        });
      });

    return () => controller.abort();
  }, [attempt, previewSnapshot]);

  const retry = () => {
    if (previewSnapshot) return;
    setState({ status: 'loading', snapshot: null, mode: 'live', error: null });
    setAttempt((value) => value + 1);
  };

  return { ...state, retry };
}

function StatusRail({ snapshot, mode }) {
  const coverage = snapshot.pipeline.coverage;
  const health = getSnapshotState(snapshot);

  return (
    <div className="mr-status-rail" aria-label="Snapshot status">
      <div className="mr-status-cell mr-status-cell--state">
        <span className={`mr-status-dot mr-status-dot--${health}`} aria-hidden="true" />
        <span className="mr-status-key">State</span>
        <strong>{mode === 'preview' ? 'Design preview' : health}</strong>
      </div>
      <div className="mr-status-cell">
        <span className="mr-status-key">Published</span>
        <strong>{formatTimestamp(snapshot.generatedAt)}</strong>
      </div>
      <div className="mr-status-cell">
        <span className="mr-status-key">Coverage</span>
        <strong>{coverage.successfulSources}/{coverage.expectedSources} sources</strong>
      </div>
      <div className="mr-status-cell">
        <span className="mr-status-key">Method</span>
        <strong>{snapshot.macroConditions.methodology.version}</strong>
      </div>
    </div>
  );
}

function EmptyState({ loading, error, onRetry }) {
  return (
    <div className="mr-empty" role="status" aria-live="polite">
      <span className="mr-empty__index">00</span>
      <div>
        <p className="mr-empty__label">
          {loading ? 'Resolving latest publication' : 'Snapshot unavailable'}
        </p>
        <h2>{loading ? 'Opening the public data channel.' : 'The engine has not published a readable snapshot yet.'}</h2>
        <p>
          {loading
            ? 'The manifest and its immutable snapshot are being verified.'
            : 'The interface fails closed: it will not substitute stale demo numbers for missing market data.'}
        </p>
        {error && <code>{error}</code>}
        {!loading && (
          <button className="mr-retry" type="button" onClick={onRetry}>
            Retry public feed
          </button>
        )}
      </div>
    </div>
  );
}

function MacroConditions({ conditions }) {
  return (
    <section className="mr-conditions" aria-labelledby="mr-conditions-title">
      <div className="mr-conditions__score">
        <span className="mr-kicker">Macro conditions / 100</span>
        <div className="mr-score-readout">
          <strong>{Math.round(conditions.score)}</strong>
          <span>{conditions.label}</span>
        </div>
      </div>
      <div className="mr-conditions__brief">
        <span className="mr-kicker">Current readout</span>
        <h2 id="mr-conditions-title">{conditions.summary}</h2>
        <div
          className="mr-scale"
          style={{ '--mr-score': `${conditions.score}%` }}
          aria-label={`Macro conditions score ${conditions.score} out of 100`}
        >
          <span className="mr-scale__marker" />
        </div>
        <div className="mr-scale__labels" aria-hidden="true">
          <span>Supportive</span>
          <span>Balanced</span>
          <span>Restrictive</span>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ index, id, title, meta }) {
  return (
    <div className="mr-section-heading">
      <span className="mr-section-index">{index}</span>
      <h2 id={id}>{title}</h2>
      <span>{meta}</span>
    </div>
  );
}

function ScopeControl({ scope, onChange }) {
  return (
    <div className="mr-scope" aria-label="Filter published details by market scope">
      <span>Detail scope</span>
      <div>
        <button
          type="button"
          aria-pressed={scope === 'all'}
          onClick={() => onChange('all')}
        >
          All markets
        </button>
        <button
          type="button"
          aria-pressed={scope === 'turkey'}
          onClick={() => onChange('turkey')}
        >
          Türkiye
        </button>
      </div>
    </div>
  );
}

function DriverLedger({ drivers }) {
  return (
    <section className="mr-section" aria-labelledby="mr-drivers-title">
      <SectionHeading
        index="01"
        id="mr-drivers-title"
        title="Driver ledger"
        meta={`${drivers.length} scored contributions`}
      />
      <div className="mr-ledger">
        {drivers.map((driver, index) => (
          <article className="mr-driver" key={driver.indicatorId}>
            <span className="mr-driver__index">{String(index + 1).padStart(2, '0')}</span>
            <div className="mr-driver__name">
              <strong>{driver.label}</strong>
              <span>{driver.direction} / weight {Math.round(driver.weight * 100)}%</span>
            </div>
            <p>{driver.explanation}</p>
            <strong
              className="mr-driver__contribution"
              data-direction={driver.direction}
            >
              {driver.contributionPoints > 0 ? '+' : ''}{driver.contributionPoints} pt
            </strong>
          </article>
        ))}
        {drivers.length === 0 && (
          <p className="mr-no-results">No scored drivers are published for this scope.</p>
        )}
      </div>
    </section>
  );
}

function IndicatorTape({ indicators }) {
  return (
    <section className="mr-section" aria-labelledby="mr-observations-title">
      <SectionHeading
        index="02"
        id="mr-observations-title"
        title="Current observations"
        meta={`${indicators.length} published inputs`}
      />
      <div className="mr-indicator-grid">
        {indicators.map((indicator) => (
          <article className="mr-indicator" key={indicator.id}>
            <div className="mr-indicator__topline">
              <span>{indicator.label}</span>
              <span className={`mr-freshness mr-freshness--${indicator.freshness.status}`}>
                {indicator.freshness.status}
              </span>
            </div>
            <strong>{indicator.displayValue}</strong>
            <div className="mr-indicator__change">
              <span>{indicator.change?.displayValue || 'No comparison'}</span>
              <span>{indicator.macroSignal}</span>
            </div>
            <a href={indicator.source.sourceUrl} target="_blank" rel="noreferrer">
              {indicator.source.sourceName}
            </a>
          </article>
        ))}
        {indicators.length === 0 && (
          <p className="mr-no-results">No current observations are published for this scope.</p>
        )}
      </div>
    </section>
  );
}

function Briefing({ digest, developments }) {
  return (
    <section className="mr-section" aria-labelledby="mr-briefing-title">
      <SectionHeading
        index="03"
        id="mr-briefing-title"
        title="Briefing"
        meta={`${digest.itemCount} referenced items`}
      />
      <div className="mr-briefing-grid">
        <article className="mr-digest">
          <span className="mr-kicker">24-hour readout</span>
          <h3>{digest.title}</h3>
          <p>{digest.summary}</p>
          <ul>
            {digest.highlights.map((highlight) => (
              <li key={highlight.id} data-impact={highlight.impact}>
                <span>{highlight.impact}</span>
                <p>{highlight.text}</p>
              </li>
            ))}
          </ul>
        </article>
        <div className="mr-developments">
          <span className="mr-kicker">Priority developments</span>
          {developments.map((development, index) => (
            <article key={development.id}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{development.headline}</h3>
                <p>{development.summary}</p>
                <small>{formatTimestamp(development.updatedAt)}</small>
              </div>
            </article>
          ))}
          {developments.length === 0 && (
            <p className="mr-no-results">No priority developments are published for this scope.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function StoriesAndCalendar({ stories, calendar }) {
  return (
    <section className="mr-section" aria-labelledby="mr-context-title">
      <SectionHeading
        index="04"
        id="mr-context-title"
        title="Context and schedule"
        meta={`${stories.length} stories / ${calendar.length} events`}
      />
      <div className="mr-context-grid">
        <div className="mr-stories">
          <span className="mr-kicker">Attributable stories</span>
          {stories.map((story, index) => (
            <article key={story.id}>
              <div className="mr-story__meta">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span>{story.category}</span>
                <span>{story.impact}</span>
              </div>
              <h3>
                <a href={story.url} target="_blank" rel="noreferrer">{story.headline}</a>
              </h3>
              <p>{story.whyItMatters}</p>
              <small>{story.publisher} / {formatTimestamp(story.publishedAt)}</small>
            </article>
          ))}
          {stories.length === 0 && (
            <p className="mr-no-results">No attributable stories are published for this scope.</p>
          )}
        </div>
        <div className="mr-calendar">
          <span className="mr-kicker">Official calendar</span>
          {calendar.map((event) => {
            const scheduled = formatCalendarTimestamp(event.scheduledAt);
            return (
              <article key={event.id}>
                <div className="mr-calendar__time">
                  <strong>{scheduled.date}</strong>
                  <span>{scheduled.time}</span>
                </div>
                <div>
                  <span className="mr-calendar__country">{event.countryCode} / {event.impact}</span>
                  <h3>{event.title}</h3>
                  <p>
                    {event.previous && `Previous ${event.previous}`}
                    {event.forecast && ` / Forecast ${event.forecast}`}
                    {!event.previous && !event.forecast && event.status}
                  </p>
                </div>
              </article>
            );
          })}
          {calendar.length === 0 && (
            <p className="mr-no-results">No official events are published for this scope.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function SourceHealth({ sources, coverage }) {
  return (
    <section className="mr-section" aria-labelledby="mr-sources-title">
      <SectionHeading
        index="05"
        id="mr-sources-title"
        title="Source health"
        meta={`${coverage.staleSources} stale / ${coverage.failedSources} unavailable`}
      />
      <div className="mr-source-table" role="table" aria-label="Published source health">
        <div className="mr-source-row mr-source-row--head" role="row">
          <span role="columnheader">State</span>
          <span role="columnheader">Source</span>
          <span role="columnheader">Used</span>
          <span role="columnheader">Last success</span>
        </div>
        {sources.map((source) => (
          <a
            className="mr-source-row"
            href={source.url}
            target="_blank"
            rel="noreferrer"
            role="row"
            key={source.id}
          >
            <span role="cell" data-status={source.status}>
              <i aria-hidden="true" />{source.status}
            </span>
            <strong role="cell">{source.name}<small>{source.type}</small></strong>
            <span role="cell">{source.itemsUsed}</span>
            <span role="cell">{formatTimestamp(source.lastSuccessAt)}</span>
          </a>
        ))}
        {sources.length === 0 && (
          <p className="mr-no-results">No source records are published for this scope.</p>
        )}
      </div>
    </section>
  );
}

function Methodology({ methodology, publicNote }) {
  return (
    <footer className="mr-methodology">
      <div>
        <span className="mr-kicker">Methodology / {methodology.id}</span>
        <h2>Every score can be reconstructed from the public inputs.</h2>
      </div>
      <div>
        <p>{methodology.description}</p>
        <code>{methodology.formula}</code>
        {publicNote && <small>{publicNote}</small>}
      </div>
    </footer>
  );
}

export default function MarketRadar() {
  const state = useMarketRadarSnapshot();
  const [scope, setScope] = useState('all');
  const snapshot = state.snapshot;
  const scopedData = useMemo(() => {
    if (!snapshot) return null;

    return {
      drivers: snapshot.macroConditions.drivers.filter((item) => inScope(item, scope)),
      indicators: snapshot.indicators.filter((item) => inScope(item, scope)),
      developments: snapshot.priorityDevelopments.filter((item) => inScope(item, scope)),
      stories: snapshot.stories.filter((item) => inScope(item, scope)),
      calendar: snapshot.calendar.filter((item) => inScope(item, scope)),
      sources: snapshot.sources.filter((item) => inScope(item, scope)),
    };
  }, [scope, snapshot]);

  return (
    <section className="market-radar-section" aria-labelledby="market-radar-title">
      <div className="mr-system-line" aria-hidden="true">
        <span>MR / 07</span>
        <span>Public macro intelligence</span>
        <span>Snapshot v1</span>
      </div>

      <header className="mr-header">
        <div>
          <span className="mr-eyebrow">Source-first market conditions engine</span>
          <h1 id="market-radar-title">Market Radar</h1>
        </div>
        <p>
          A compact macro readout built from attributable observations—not a trading terminal,
          prediction feed, or black-box market call.
        </p>
      </header>

      {state.status === 'ready' ? (
        <>
          <StatusRail snapshot={snapshot} mode={state.mode} />
          {state.mode === 'preview' && (
            <p className="mr-preview-note">
              Local design preview. Values are illustrative; production only renders verified public snapshots.
            </p>
          )}
          <MacroConditions conditions={snapshot.macroConditions} />
          <ScopeControl scope={scope} onChange={setScope} />
          <DriverLedger drivers={scopedData.drivers} />
          <IndicatorTape indicators={scopedData.indicators} />
          <Briefing digest={snapshot.digest} developments={scopedData.developments} />
          <StoriesAndCalendar stories={scopedData.stories} calendar={scopedData.calendar} />
          <SourceHealth sources={scopedData.sources} coverage={snapshot.pipeline.coverage} />
          <Methodology
            methodology={snapshot.macroConditions.methodology}
            publicNote={snapshot.pipeline.publicNote}
          />
        </>
      ) : (
        <EmptyState
          loading={state.status === 'loading'}
          error={state.error}
          onRetry={state.retry}
        />
      )}
    </section>
  );
}
