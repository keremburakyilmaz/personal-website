import { useEffect, useMemo, useState } from 'react';
import './MarketRadar.css';
import '../../styles/route-system.css';
import { fetchLatestSnapshot } from './marketRadarData';
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

function useMarketRadarSnapshot() {
  const previewSnapshot = useMemo(() => (
    PREVIEW_ENABLED ? createPreviewSnapshot() : null
  ), []);
  const [state, setState] = useState(() => (
    previewSnapshot
      ? { status: 'ready', snapshot: previewSnapshot, mode: 'preview', error: null }
      : { status: 'loading', snapshot: null, mode: 'live', error: null }
  ));

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
  }, [previewSnapshot]);

  return state;
}

function StatusRail({ snapshot, mode }) {
  const coverage = snapshot.pipeline.coverage;
  const expired = Date.parse(snapshot.validUntil) <= Date.now();
  const health = expired ? 'expired' : snapshot.pipeline.status;

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

function EmptyState({ loading, error }) {
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

function IndicatorTape({ indicators }) {
  return (
    <section className="mr-section" aria-labelledby="mr-observations-title">
      <div className="mr-section-heading">
        <span className="mr-section-index">01</span>
        <h2 id="mr-observations-title">Current observations</h2>
        <span>{indicators.length} published inputs</span>
      </div>
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
      </div>
    </section>
  );
}

export default function MarketRadar() {
  const state = useMarketRadarSnapshot();

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
          <StatusRail snapshot={state.snapshot} mode={state.mode} />
          {state.mode === 'preview' && (
            <p className="mr-preview-note">
              Local design preview. Values are illustrative; production only renders verified public snapshots.
            </p>
          )}
          <MacroConditions conditions={state.snapshot.macroConditions} />
          <IndicatorTape indicators={state.snapshot.indicators} />
        </>
      ) : (
        <EmptyState loading={state.status === 'loading'} error={state.error} />
      )}
    </section>
  );
}
