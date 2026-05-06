import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, BarChart, Bar, Legend,
  AreaChart, Area,
} from 'recharts';
import {
  ShieldCheck, Activity, RefreshCw, Sparkles, Copy, Check, Loader2,
  PlayCircle, Share2, Trash2, Plus, AlertTriangle, FileText, Send,
} from 'lucide-react';
import './QuantFusion.css';

const API = 'https://quantfusion-q2as.onrender.com';
const DEMO = [
  { ticker: 'JEPI', weight: 0.30 },
  { ticker: 'JEPQ', weight: 0.30 },
  { ticker: 'VOO',  weight: 0.20 },
  { ticker: 'QQQ',  weight: 0.20 },
];
const SAMPLE_PROMPTS = [
  'What is the risk profile of my portfolio?',
  'How should I rebalance to maximize Sharpe?',
  'What is the current market regime?',
  'How did my portfolio perform over the last year?',
  'Did any of my holdings beat earnings last quarter?',
];

const DETAIL_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'optimize', label: 'Optimize' },
  { id: 'performance', label: 'Performance' },
  { id: 'filings', label: 'Filings' },
  { id: 'share', label: 'Save' },
];

const fmt = {
  pct: (v, d = 2) => v == null ? 'â€”' : `${(v * 100).toFixed(d)}%`,
  num: (v, d = 2) => v == null ? 'â€”' : Number(v).toFixed(d),
  money: (v) => v == null ? 'â€”' : v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
  cap: (v) => {
    if (v == null) return 'â€”';
    if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
    if (v >= 1e9)  return `$${(v / 1e9).toFixed(2)}B`;
    if (v >= 1e6)  return `$${(v / 1e6).toFixed(1)}M`;
    return `$${v}`;
  },
  date: (s) => s ? new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'â€”',
};

const rangeFill = (value, min, max) => {
  const n = Number(value);
  if (!Number.isFinite(n) || max <= min) return '0%';
  return `${Math.max(0, Math.min(1, (n - min) / (max - min))) * 100}%`;
};

async function api(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText} â€” ${text.slice(0, 200)}`);
  }
  return res.json();
}

function Spinner({ size = 14 }) {
  return <Loader2 size={size} className="qf-spin" />;
}

function StatusBanner() {
  const [status, setStatus] = useState('checking');
  useEffect(() => {
    let cancelled = false;
    api('/api/health').then(
      (d) => !cancelled && setStatus(d.status === 'ok' ? 'ok' : 'down'),
      () => !cancelled && setStatus('down'),
    );
    return () => { cancelled = true; };
  }, []);
  const color = status === 'ok' ? '#7ed09b' : status === 'down' ? '#e08987' : '#c9b8a1';
  const label = status === 'ok' ? 'Service online' : status === 'down' ? 'Service unreachable' : 'Pingingâ€¦';
  return (
    <span className="qf-status">
      <span className="qf-status__dot" style={{ background: color }} />
      {label}
    </span>
  );
}

function PortfolioCommandCenter({
  holdings,
  running,
  readOnly,
  validation,
  loadDemo,
  blank,
  analyze,
}) {
  const total = holdings.reduce((s, h) => s + (Number(h.weight) || 0), 0);
  const tickers = holdings.filter(h => h.ticker).length;
  const ready = Math.abs(total - 1) <= 0.01 && tickers > 0;
  const validationLabel = validation
    ? `${validation.valid.length} valid${validation.invalid.length ? `, ${validation.invalid.length} invalid` : ''}`
    : 'Not validated';

  return (
    <div className="qf-command">
      <div className="qf-command__copy">
        <span className="qf-eyebrow">Portfolio setup</span>
        <h2>Build a clean portfolio, then run the full analysis.</h2>
        <p>
          Start with the demo allocation or enter your own holdings. The report will turn the raw metrics into
          a portfolio summary, optimization options, backtests, filings, and an agent-ready snapshot.
        </p>
      </div>
      <div className="qf-command__panel">
        <div className="qf-command__stats">
          <div>
            <span>Holdings</span>
            <strong>{tickers}</strong>
          </div>
          <div>
            <span>Total weight</span>
            <strong className={ready ? 'good' : 'warn'}>{(total * 100).toFixed(1)}%</strong>
          </div>
          <div>
            <span>Validation</span>
            <strong>{validationLabel}</strong>
          </div>
        </div>
        <div className="qf-command__actions">
          <button className="qf-btn qf-btn--ghost" onClick={loadDemo} disabled={readOnly}>
            Load demo
          </button>
          <button className="qf-btn qf-btn--ghost" onClick={blank} disabled={readOnly}>
            New portfolio
          </button>
          <button className="qf-btn qf-btn--accent" onClick={analyze} disabled={running || readOnly || !ready}>
            {running ? <Spinner /> : <Activity size={14} />} {running ? 'Analyzing...' : 'Analyze portfolio'}
          </button>
        </div>
        {!ready && (
          <p className="qf-command__hint">Weights need to total 100% before analysis. Use normalize if you are close.</p>
        )}
      </div>
    </div>
  );
}

function getPortfolioScore(risk) {
  if (!risk) return null;
  let score = 70;
  if (risk.sharpe != null) score += Math.max(-22, Math.min(22, (risk.sharpe - 0.8) * 18));
  if (risk.annualized_volatility != null) score += Math.max(-18, Math.min(10, (0.22 - risk.annualized_volatility) * 80));
  if (risk.max_drawdown != null) score += Math.max(-18, Math.min(8, (0.22 + risk.max_drawdown) * 55));
  return Math.round(Math.max(0, Math.min(100, score)));
}

function bestOptimization(report) {
  const options = [
    ['Max Sharpe', report?.optimized_mvo],
    ['Risk parity', report?.optimized_rp],
    ['Regime blended', report?.optimized_blended],
  ].filter(([, value]) => value);
  if (!options.length) return null;
  return options.reduce((best, current) => {
    const bestSharpe = best[1]?.sharpe ?? -Infinity;
    const currentSharpe = current[1]?.sharpe ?? -Infinity;
    return currentSharpe > bestSharpe ? current : best;
  });
}

function buildFrontierSeries(frontier, mode) {
  const raw = (frontier || [])
    .map(p => ({
      x: Number(p.volatility),
      y: mode === 'return'
        ? Number(p.expected_return)
        : Number(p.expected_return) / Math.max(Number(p.volatility), 1e-6),
      weights: p.weights,
    }))
    .filter(p => Number.isFinite(p.x) && Number.isFinite(p.y))
    .sort((a, b) => a.x - b.x);

  const unique = [];
  raw.forEach(point => {
    const last = unique[unique.length - 1];
    if (last && Math.abs(point.x - last.x) < 0.00025) {
      if (point.y > last.y) Object.assign(last, point);
      return;
    }
    unique.push(point);
  });

  if (mode !== 'return') return unique;

  let bestReturn = -Infinity;
  return unique.filter(point => {
    if (point.y + 0.00001 < bestReturn) return false;
    bestReturn = Math.max(bestReturn, point.y);
    return true;
  });
}

function FrontierTooltip({ active, payload, label, mode }) {
  if (!active || !payload?.length) return null;
  const point = payload.find(item => item.dataKey === 'y')?.payload || payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="qf-chart-tooltip">
      <strong>Vol {fmt.pct(label ?? point.x, 2)}</strong>
      <span>{mode === 'return' ? 'Expected return' : 'Sharpe'}</span>
      <em>{mode === 'return' ? fmt.pct(point.y, 2) : fmt.num(point.y, 2)}</em>
    </div>
  );
}

function OverviewDashboard({ report, holdings, onSelectTab }) {
  const risk = report?.risk || {};
  const score = getPortfolioScore(risk);
  const best = bestOptimization(report);
  const topHolding = holdings.reduce((max, h) => Number(h.weight) > Number(max.weight || 0) ? h : max, {});
  const regime = report?.regime?.regime || 'Unknown';
  const actions = [];
  const optimizerDelta = best ? best[1].sharpe - (risk.sharpe || 0) : null;
  const volLabel = risk.annualized_volatility == null
    ? 'Pending'
    : risk.annualized_volatility < 0.16 ? 'Calm'
    : risk.annualized_volatility < 0.24 ? 'Moderate'
    : 'Elevated';
  const drawdownLabel = risk.max_drawdown == null
    ? 'Pending'
    : risk.max_drawdown > -0.15 ? 'Contained'
    : risk.max_drawdown > -0.25 ? 'Watch'
    : 'Stress point';

  if ((topHolding.weight || 0) >= 0.35) {
    actions.push(`${topHolding.ticker} is carrying ${(topHolding.weight * 100).toFixed(0)}% of the portfolio. Check concentration before optimizing.`);
  }
  if (risk.max_drawdown != null && risk.max_drawdown <= -0.25) {
    actions.push(`Max drawdown is ${fmt.pct(risk.max_drawdown, 1)}. Review the Performance tab before accepting higher-return allocations.`);
  }
  if (risk.annualized_volatility != null && risk.annualized_volatility >= 0.24) {
    actions.push(`Volatility is elevated at ${fmt.pct(risk.annualized_volatility, 1)}. Compare the risk parity and min-volatility runs.`);
  }
  if (best) {
    actions.push(`${best[0]} currently has the strongest Sharpe profile at ${fmt.num(best[1].sharpe, 2)}.`);
  }
  if (String(regime).toLowerCase() === 'bull') {
    actions.push('Bull regime detected. Compare the Max Sharpe result with the current allocation before adding more growth exposure.');
  } else if (String(regime).toLowerCase() === 'bear') {
    actions.push('Bear regime detected. Check the defensive optimizer and drawdown behavior before making allocation changes.');
  } else {
    actions.push('Sideways or uncertain regime. Prioritize resilience and review the backtest stability before chasing return.');
  }
  actions.push('Open Performance to confirm the recommendation holds across the 1Y and 3Y backtests.');

  const briefs = [
    {
      label: 'Risk posture',
      value: volLabel,
      text: `${fmt.pct(risk.annualized_volatility, 1)} annualized volatility with ${fmt.pct(risk.var_historical, 2)} 1-day VaR.`,
    },
    {
      label: 'Drawdown check',
      value: drawdownLabel,
      text: `Worst peak-to-trough move is ${fmt.pct(risk.max_drawdown, 1)} over the lookback window.`,
    },
    {
      label: 'Optimizer edge',
      value: optimizerDelta == null ? 'Pending' : `${optimizerDelta >= 0 ? '+' : ''}${optimizerDelta.toFixed(2)}`,
      text: best ? `${best[0]} Sharpe is ${fmt.num(best[1].sharpe, 2)} versus current ${fmt.num(risk.sharpe, 2)}.` : 'Run optimization to compare candidate allocations.',
    },
  ];

  const scoreLabel = score == null ? 'Pending' : score >= 78 ? 'Strong' : score >= 58 ? 'Balanced' : 'Needs review';

  return (
    <div className="qf-overview">
      <div className="qf-overview__hero">
        <div className="qf-score" style={{ '--score': score ?? 0 }}>
          <span>{score ?? '--'}</span>
        </div>
        <div>
          <span className="qf-eyebrow">Portfolio overview</span>
          <h2>{scoreLabel} portfolio profile</h2>
          <p>
            QuantFusion analyzed {holdings.length} holdings against risk, return, market regime, optimization,
            backtest behavior, and filings signals.
          </p>
        </div>
      </div>

      <div className="qf-overview__metrics">
        <div><span>Sharpe</span><strong>{fmt.num(risk.sharpe, 2)}</strong></div>
        <div><span>Volatility</span><strong>{fmt.pct(risk.annualized_volatility, 1)}</strong></div>
        <div><span>Max drawdown</span><strong>{fmt.pct(risk.max_drawdown, 1)}</strong></div>
        <div><span>Regime</span><strong>{regime}</strong></div>
      </div>

      <div className="qf-overview__body">
        <div className="qf-insights">
          <div className="qf-section__head qf-section__head--compact"><h3>Next best actions</h3></div>
          {actions.slice(0, 3).map((action, i) => (
            <div className="qf-insight" key={action}>
              <span>{i + 1}</span>
              <p>{action}</p>
            </div>
          ))}
          <div className="qf-brief-grid">
            {briefs.map(brief => (
              <div className="qf-brief" key={brief.label}>
                <span>{brief.label}</span>
                <strong>{brief.value}</strong>
                <p>{brief.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="qf-overview__side">
          <AllocationSummary holdings={holdings} />
          <div className="qf-overview__shortcuts">
            <button className="qf-shortcut" onClick={() => onSelectTab('optimize')}>
              <PlayCircle size={16} />
              <span>Compare optimizers</span>
            </button>
            <button className="qf-shortcut" onClick={() => onSelectTab('performance')}>
              <Activity size={16} />
              <span>Inspect backtests</span>
            </button>
            <button className="qf-shortcut" onClick={() => onSelectTab('filings')}>
              <FileText size={16} />
              <span>Fetch filing signals</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailTabs({ activeTab, setActiveTab }) {
  return (
    <div className="qf-detail-tabs" role="tablist" aria-label="QuantFusion report sections">
      {DETAIL_TABS.map(tab => (
        <button
          key={tab.id}
          className={activeTab === tab.id ? 'on' : ''}
          onClick={() => setActiveTab(tab.id)}
          role="tab"
          aria-selected={activeTab === tab.id}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function EmptyAnalysisState({ running }) {
  const steps = [
    'Validate holdings',
    'Pull market data',
    'Measure portfolio risk',
    'Compare optimizers',
    'Backtest performance',
    'Generate commentary',
  ];

  return (
    <div className={`qf-pipeline ${running ? 'running' : ''}`}>
      <div>
        <span className="qf-eyebrow">{running ? 'Analysis running' : 'Ready when you are'}</span>
        <h2>{running ? 'QuantFusion is building the report.' : 'Run one analysis and get a guided portfolio brief.'}</h2>
        <p>
          The full pipeline combines risk metrics, efficient frontier search, optimizer comparison, regime detection,
          backtests, filing signals, and AI commentary into a single report.
        </p>
      </div>
      <div className="qf-pipeline__steps">
        {steps.map((step, i) => (
          <div className="qf-pipeline__step" key={step}>
            <span>{running && i === 1 ? <Spinner size={12} /> : i + 1}</span>
            <p>{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AllocationSummary({ holdings }) {
  const cleaned = holdings
    .filter(h => h.ticker)
    .map(h => ({ ...h, weight: Number(h.weight) || 0 }))
    .sort((a, b) => b.weight - a.weight);
  const top = cleaned.slice(0, 5);
  const remaining = cleaned.slice(5).reduce((sum, h) => sum + h.weight, 0);
  const total = cleaned.reduce((sum, h) => sum + h.weight, 0);

  return (
    <div className="qf-allocation">
      <div className="qf-section__head qf-section__head--compact"><h3>Current allocation</h3></div>
      <div className="qf-allocation__bar" aria-label="Portfolio allocation">
        {top.map((h, i) => (
          <span
            key={h.ticker}
            style={{ width: `${Math.max(h.weight / Math.max(total, 0.001) * 100, 4)}%` }}
            title={`${h.ticker}: ${fmt.pct(h.weight, 1)}`}
            className={`tone-${(i % 5) + 1}`}
          />
        ))}
        {remaining > 0 && (
          <span
            style={{ width: `${Math.max(remaining / Math.max(total, 0.001) * 100, 4)}%` }}
            title={`Other: ${fmt.pct(remaining, 1)}`}
            className="tone-other"
          />
        )}
      </div>
      <div className="qf-allocation__list">
        {top.map(h => (
          <div key={h.ticker}>
            <span>{h.ticker}</span>
            <strong>{fmt.pct(h.weight, 1)}</strong>
          </div>
        ))}
        {remaining > 0 && (
          <div>
            <span>Other</span>
            <strong>{fmt.pct(remaining, 1)}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

function OptimizerComparison({ report, baselineRisk, onOpenLab }) {
  const rows = [
    ['Max Sharpe', report?.optimized_mvo],
    ['Risk parity', report?.optimized_rp],
    ['Regime blended', report?.optimized_blended],
  ].filter(([, value]) => value);

  if (!rows.length) return null;

  const best = rows.reduce((winner, row) => {
    const winnerSharpe = winner[1]?.sharpe ?? -Infinity;
    const rowSharpe = row[1]?.sharpe ?? -Infinity;
    return rowSharpe > winnerSharpe ? row : winner;
  });

  return (
    <div className="qf-optimizer-summary">
      <div className="qf-optimizer-summary__head">
        <div>
          <span className="qf-eyebrow">Optimizer comparison</span>
          <h2>{best[0]} is the current best candidate.</h2>
          <p>Use this table as the decision layer, then inspect the frontier and weight charts below.</p>
        </div>
        <button className="qf-btn qf-btn--ghost" onClick={onOpenLab}>
          <PlayCircle size={13} /> Run more scenarios
        </button>
      </div>
      <div className="qf-optimizer-table">
        <div className="qf-optimizer-table__head">
          <span>Method</span>
          <span>Return</span>
          <span>Vol</span>
          <span>Sharpe</span>
          <span>Delta</span>
        </div>
        {rows.map(([label, row]) => {
          const delta = row.sharpe - (baselineRisk?.sharpe || 0);
          return (
            <div className={`qf-optimizer-table__row ${label === best[0] ? 'best' : ''}`} key={label}>
              <strong>{label}</strong>
              <span>{fmt.pct(row.expected_return, 1)}</span>
              <span>{fmt.pct(row.volatility, 1)}</span>
              <span>{fmt.num(row.sharpe, 2)}</span>
              <span className={delta >= 0 ? 'pos' : 'neg'}>{delta >= 0 ? '+' : ''}{delta.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HoldingsEditor({ holdings, setHoldings, readOnly, fundamentals, validate, validation }) {
  const total = holdings.reduce((s, h) => s + (Number(h.weight) || 0), 0);
  const update = (i, patch) => setHoldings(h => h.map((row, j) => j === i ? { ...row, ...patch } : row));
  const remove = (i) => setHoldings(h => h.filter((_, j) => j !== i));
  const add = () => holdings.length < 20 && setHoldings(h => [...h, { ticker: '', weight: 0 }]);
  const normalize = () => {
    if (total <= 0) return;
    setHoldings(h => h.map(r => ({ ...r, weight: (Number(r.weight) || 0) / total })));
  };
  const isInvalid = (t) => validation?.invalid?.includes(t.toUpperCase());

  return (
    <div className="qf-table">
      <div className="qf-table__head">
        <span>Ticker</span>
        <span>Weight</span>
        <span>Sector</span>
        <span>Market cap</span>
        <span>P/E</span>
        <span></span>
      </div>
      {holdings.map((row, i) => {
        const f = fundamentals[row.ticker?.toUpperCase()] || {};
        return (
          <div key={i} className={`qf-table__row ${isInvalid(row.ticker) ? 'invalid' : ''}`}>
            <input
              className="qf-input"
              value={row.ticker}
              disabled={readOnly}
              placeholder="AAPL"
              maxLength={16}
              onChange={(e) => update(i, { ticker: e.target.value.toUpperCase() })}
            />
            <div className="qf-weight-cell">
              <input
                type="range" min="0" max="1" step="0.01"
                value={row.weight}
                disabled={readOnly}
                style={{ '--range-fill': rangeFill(row.weight, 0, 1) }}
                onChange={(e) => update(i, { weight: Number(e.target.value) })}
              />
              <input
                type="number" min="0" max="100" step="0.5"
                className="qf-input qf-input--narrow"
                value={(row.weight * 100).toFixed(1)}
                disabled={readOnly}
                onChange={(e) => update(i, { weight: Math.max(0, Math.min(1, Number(e.target.value) / 100)) })}
              />
              <span className="qf-pct-suffix">%</span>
            </div>
            <span className="qf-cell-muted">{f.sector || 'â€”'}</span>
            <span className="qf-cell-muted">{fmt.cap(f.market_cap)}</span>
            <span className="qf-cell-muted">{fmt.num(f.trailing_pe)}</span>
            <button className="qf-icon-btn" disabled={readOnly} onClick={() => remove(i)} aria-label="remove">
              <Trash2 size={14} />
            </button>
          </div>
        );
      })}
      <div className="qf-table__foot">
        <div className="qf-table__total">
          Total: <strong style={{ color: Math.abs(total - 1) < 0.001 ? '#7ed09b' : '#e0c187' }}>
            {(total * 100).toFixed(1)}%
          </strong>
        </div>
        <div className="qf-table__actions">
          <button className="qf-btn qf-btn--ghost" disabled={readOnly} onClick={add}>
            <Plus size={13} /> Add row
          </button>
          <button className="qf-btn qf-btn--ghost" disabled={readOnly} onClick={normalize}>
            Normalize to 100%
          </button>
          <button className="qf-btn qf-btn--ghost" disabled={readOnly} onClick={validate}>
            Validate tickers
          </button>
        </div>
      </div>
      {validation && (
        <div className="qf-validation">
          {validation.valid.length > 0 && <span className="qf-pill qf-pill--ok">{validation.valid.length} valid</span>}
          {validation.invalid.length > 0 && (
            <span className="qf-pill qf-pill--bad">
              {validation.invalid.length} unrecognized: {validation.invalid.join(', ')}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

const RISK_TILES = [
  { key: 'sharpe',          label: 'Sharpe',    fmt: (v) => fmt.num(v, 2), def: 'Excess return per unit of total volatility. Higher is better; >1 is solid, >2 is exceptional.' },
  { key: 'annualized_volatility', label: 'Volatility',fmt: (v) => fmt.pct(v, 1), def: 'Annualized standard deviation of daily returns â€” the size of typical swings.' },
  { key: 'var_historical',  label: 'VaR 95%',   fmt: (v) => fmt.pct(v, 2), def: 'Historical 1-day 95% Value-at-Risk: the loss exceeded only 5% of trading days.' },
  { key: 'max_drawdown',    label: 'Max DD',    fmt: (v) => fmt.pct(v, 1), def: 'Worst peak-to-trough decline â€” your deepest drawdown over the lookback window.' },
  { key: 'beta',            label: 'Beta',      fmt: (v) => fmt.num(v, 2), def: 'Sensitivity to SPY: 1.0 moves with the market; <1 is defensive, >1 is amplified.' },
];

function RiskTiles({ risk, holdings, recompute, recomputing }) {
  const [flipped, setFlipped] = useState({});
  return (
    <div className="qf-section">
      <div className="qf-section__head">
        <h2>Risk Dashboard</h2>
        <button className="qf-btn qf-btn--ghost" onClick={recompute} disabled={recomputing}>
          {recomputing ? <Spinner /> : <RefreshCw size={13} />} Recompute risk only
        </button>
      </div>
      <div className="qf-tiles">
        {RISK_TILES.map(t => (
          <button
            key={t.key}
            className={`qf-tile ${flipped[t.key] ? 'flipped' : ''}`}
            onClick={() => setFlipped(f => ({ ...f, [t.key]: !f[t.key] }))}
          >
            <div className="qf-tile__face qf-tile__face--front">
              <span className="qf-tile__label">{t.label}</span>
              <span className="qf-tile__value">{t.fmt(risk?.[t.key])}</span>
            </div>
            <div className="qf-tile__face qf-tile__face--back">
              <span className="qf-tile__def">{t.def}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function FrontierChart({ frontier, optimized }) {
  const [mode, setMode] = useState('return');
  if (!frontier?.length) return null;
  const series = buildFrontierSeries(frontier, mode);
  const opts = optimized.filter(Boolean).map(o => ({
    name: o.method + (o.target ? `:${o.target}` : ''),
    x: o.volatility,
    y: mode === 'return' ? o.expected_return : o.sharpe,
  }));
  return (
    <div className="qf-section">
      <div className="qf-section__head">
        <h2>Efficient Frontier</h2>
        <div className="qf-tabs">
          <button className={mode === 'return' ? 'on' : ''} onClick={() => setMode('return')}>Return Ã- Vol</button>
          <button className={mode === 'sharpe' ? 'on' : ''} onClick={() => setMode('sharpe')}>Sharpe Ã- Vol</button>
        </div>
      </div>
      <div className="qf-chart">
        <ResponsiveContainer width="100%" height={340}>
          <AreaChart data={series} margin={{ top: 12, right: 24, left: 0, bottom: 18 }}>
            <defs>
              <linearGradient id="qf-frontier-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c9b8a1" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#c9b8a1" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis type="number" dataKey="x" stroke="#7d786f" tickFormatter={(v) => `${(v*100).toFixed(0)}%`}
                   label={{ value: 'Annualized volatility', position: 'insideBottom', offset: -8, fill: '#7d786f', fontSize: 11 }} />
            <YAxis type="number" dataKey="y" stroke="#7d786f"
                   tickFormatter={(v) => mode === 'return' ? `${(v*100).toFixed(0)}%` : v.toFixed(1)}
                   label={{ value: mode === 'return' ? 'Expected return' : 'Sharpe', angle: -90, position: 'insideLeft', fill: '#7d786f', fontSize: 11 }} />
            <Tooltip cursor={{ stroke: 'rgba(201,184,161,0.28)', strokeWidth: 1 }}
                     content={<FrontierTooltip mode={mode} />} />
            <Area type="monotone" dataKey="y" name="Frontier" stroke="#c9b8a1" strokeWidth={4}
                  fill="url(#qf-frontier-fill)" dot={false} activeDot={false} />
            <Line type="monotone" dataKey="y" stroke="rgba(255,255,255,0.16)" strokeWidth={1}
                  dot={false} activeDot={false} isAnimationActive={false} />
            <Scatter name="Optimized portfolios" data={opts} fill="#e08987" shape="circle" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="qf-frontier-markers">
          {opts.map(o => (
            <div className="qf-frontier-marker" key={o.name}>
              <span />
              <strong>{o.name}</strong>
              <em>{fmt.pct(o.x, 1)} vol Â· {mode === 'return' ? fmt.pct(o.y, 1) : `${fmt.num(o.y, 2)} Sharpe`}</em>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WeightsBar({ before, after }) {
  const tickers = Array.from(new Set([...Object.keys(before || {}), ...Object.keys(after || {})]));
  const data = tickers.map(t => ({ ticker: t, before: (before?.[t] || 0) * 100, after: (after?.[t] || 0) * 100 }));
  return (
    <div className="qf-weights-bar">
      <ResponsiveContainer width="100%" height={Math.max(170, tickers.length * 48)}>
        <BarChart data={data} layout="vertical" margin={{ left: 12, right: 12 }}>
          <XAxis type="number" stroke="#7d786f" tickFormatter={(v) => `${v}%`} />
          <YAxis type="category" dataKey="ticker" stroke="#7d786f" width={56} />
          <Tooltip cursor={{ fill: 'rgba(201,184,161,0.04)' }}
                   contentStyle={{ background: '#101010', border: '1px solid rgba(255,255,255,0.1)' }}
                   formatter={(v) => `${Number(v).toFixed(1)}%`} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="before" fill="#6f6a61" name="Current" activeBar={false} />
          <Bar dataKey="after" fill="#c9b8a1" name="Optimized" activeBar={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function OptimizationLab({ report, holdings, baselineRisk }) {
  const [results, setResults] = useState({
    mvo_max: report.optimized_mvo,
    rp: report.optimized_rp,
    blended: report.optimized_blended,
  });
  const [busy, setBusy] = useState({});
  const [targetReturn, setTargetReturn] = useState(0.10);
  const [view, setView] = useState({ ticker: holdings[0]?.ticker || '', view_return: 0.08, confidence: 0.5 });

  const run = useCallback(async (key, body) => {
    setBusy(b => ({ ...b, [key]: true }));
    try {
      const r = await api('/api/optimize/stateless', { method: 'POST', body: JSON.stringify(body) });
      setResults(s => ({ ...s, [key]: r }));
    } catch (e) {
      alert(`Optimize failed: ${e.message}`);
    } finally {
      setBusy(b => ({ ...b, [key]: false }));
    }
  }, []);

  const before = useMemo(() => Object.fromEntries(holdings.map(h => [h.ticker, h.weight])), [holdings]);

  const cards = [
    { key: 'mvo_max', title: 'MVO Â· Max Sharpe', desc: 'Mean-variance frontier optimized for the highest risk-adjusted return.',
      run: () => run('mvo_max', { method: 'mvo', target: 'max_sharpe', holdings }) },
    { key: 'mvo_min', title: 'MVO Â· Min Vol', desc: 'Lowest-variance allocation â€” the global minimum-volatility portfolio.',
      run: () => run('mvo_min', { method: 'mvo', target: 'min_vol', holdings }) },
    { key: 'mvo_target', title: 'MVO Â· Target Return', desc: `Minimum-vol portfolio hitting the chosen return target.`,
      extra: (
        <div className="qf-card-extra">
          <label>Target return: {fmt.pct(targetReturn, 1)}</label>
          <input type="range" min="0.02" max="0.25" step="0.005" value={targetReturn}
                 style={{ '--range-fill': rangeFill(targetReturn, 0.02, 0.25) }}
                 onChange={(e) => setTargetReturn(Number(e.target.value))} />
        </div>
      ),
      run: () => run('mvo_target', { method: 'mvo', target: 'target_return', holdings, constraints: { target_return: targetReturn } }) },
    { key: 'rp', title: 'Risk Parity', desc: 'Each asset contributes equally to total portfolio risk.',
      run: () => run('rp', { method: 'risk_parity', holdings }) },
    { key: 'bl', title: 'Blackâ€“Litterman', desc: 'Blend equilibrium priors with your subjective views.',
      extra: (
        <div className="qf-card-extra">
          <div className="qf-views-row">
            <select value={view.ticker} onChange={(e) => setView(v => ({ ...v, ticker: e.target.value }))} className="qf-input">
              {holdings.map(h => <option key={h.ticker} value={h.ticker}>{h.ticker}</option>)}
            </select>
            <input className="qf-input qf-input--narrow" type="number" step="0.01"
                   value={view.view_return}
                   onChange={(e) => setView(v => ({ ...v, view_return: Number(e.target.value) }))} />
            <select value={view.confidence} onChange={(e) => setView(v => ({ ...v, confidence: Number(e.target.value) }))} className="qf-input">
              <option value={0.25}>Low</option>
              <option value={0.5}>Medium</option>
              <option value={0.75}>High</option>
            </select>
          </div>
          <span className="qf-cell-muted">View: {view.ticker} â†’ {fmt.pct(view.view_return, 1)} annual</span>
        </div>
      ),
      run: () => run('bl', { method: 'black_litterman', holdings, views: [view] }) },
    { key: 'blended', title: 'Regime-Blended', desc: 'Weighted blend of MVO, Risk Parity, and defensive sleeves based on the detected regime.',
      run: () => run('blended', { method: 'regime_blended', holdings }) },
    { key: 'tilt', title: 'Earnings Tilt', desc: 'Tilts weights toward holdings with positive earnings momentum.',
      run: () => run('tilt', { method: 'earnings_tilt', holdings }) },
  ];

  return (
    <div className="qf-section">
      <div className="qf-section__head"><h2>Optimization Lab</h2></div>
      <div className="qf-cards">
        {cards.map(c => {
          const r = results[c.key];
          const dSharpe = r ? r.sharpe - (baselineRisk?.sharpe || 0) : null;
          return (
            <div className="qf-card" key={c.key}>
              <div className="qf-card__head">
                <h3>{c.title}</h3>
                <button className="qf-btn qf-btn--small" onClick={c.run} disabled={busy[c.key]}>
                  {busy[c.key] ? <Spinner /> : <PlayCircle size={13} />} Run
                </button>
              </div>
              <p className="qf-card__desc">{c.desc}</p>
              {c.extra}
              {r && (
                <>
                  <div className="qf-card__metrics">
                    <span>Return <strong>{fmt.pct(r.expected_return, 1)}</strong></span>
                    <span>Vol <strong>{fmt.pct(r.volatility, 1)}</strong></span>
                    <span>Sharpe <strong>{fmt.num(r.sharpe, 2)}</strong></span>
                    {dSharpe != null && (
                      <span className={`qf-delta ${dSharpe >= 0 ? 'pos' : 'neg'}`}>
                        Î”Sharpe {dSharpe >= 0 ? '+' : ''}{dSharpe.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <WeightsBar before={before} after={r.weights} />
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RegimeDetector({ regime, refresh }) {
  const [busy, setBusy] = useState(false);
  const [snap, setSnap] = useState(regime);
  useEffect(() => setSnap(regime), [regime]);
  const probs = snap?.probabilities || {};
  const order = ['bull', 'sideways', 'bear'];
  const onRefresh = async () => {
    setBusy(true);
    try { setSnap(await api('/api/regime/current')); refresh?.(); }
    catch (e) { alert(`Regime refresh failed: ${e.message}`); }
    finally { setBusy(false); }
  };
  return (
    <div className="qf-section">
      <div className="qf-section__head">
        <h2>Regime Detector</h2>
        <button className="qf-btn qf-btn--ghost" onClick={onRefresh} disabled={busy}>
          {busy ? <Spinner /> : <RefreshCw size={13} />} Refresh
        </button>
      </div>
      <div className="qf-regime">
        <div className="qf-regime__bars">
          {order.map(k => (
            <div key={k} className="qf-regime__bar">
              <div className="qf-regime__bar-label">{k}</div>
              <div className="qf-regime__bar-track">
                <div className="qf-regime__bar-fill" style={{ width: `${(probs[k] || 0) * 100}%`,
                  background: k === 'bull' ? '#7ed09b' : k === 'bear' ? '#e08987' : '#c9b8a1' }} />
              </div>
              <div className="qf-regime__bar-pct">{fmt.pct(probs[k] || 0, 0)}</div>
            </div>
          ))}
        </div>
        <div className="qf-regime__main">
          <div className="qf-regime__ring" style={{ '--p': (snap?.confidence || 0) * 100 }}>
            <span>{fmt.pct(snap?.confidence || 0, 0)}</span>
          </div>
          <div className="qf-regime__label">
            <span className="qf-cell-muted">Detected regime</span>
            <strong>{snap?.regime || 'â€”'}</strong>
            <span className="qf-cell-muted">{snap?.ts ? new Date(snap.ts).toLocaleString() : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EarningsPipeline({ holdings, signals, fetchEarnings, fetchSignals }) {
  const [forms, setForms] = useState({});
  const [busy, setBusy] = useState({});
  const [openSignals, setOpenSignals] = useState({});

  const onFetch = async (t) => {
    setBusy(b => ({ ...b, [t]: true }));
    try { await fetchEarnings(t, forms[t] || '8-K'); }
    catch (e) { alert(`Earnings fetch failed: ${e.message}`); }
    finally { setBusy(b => ({ ...b, [t]: false })); }
  };
  const onShowSignals = async (t) => {
    if (openSignals[t]) { setOpenSignals(s => ({ ...s, [t]: null })); return; }
    try { const r = await fetchSignals(t); setOpenSignals(s => ({ ...s, [t]: r })); }
    catch (e) { alert(`Signals fetch failed: ${e.message}`); }
  };

  return (
    <div className="qf-section">
      <div className="qf-section__head"><h2>Filings & Signals</h2></div>
      <div className="qf-cards qf-cards--earnings">
        {holdings.map(h => {
          const s = signals[h.ticker];
          const beat = s?.eps_actual != null && s?.eps_estimate != null
            ? s.eps_actual >= s.eps_estimate : null;
          return (
            <div className="qf-card" key={h.ticker}>
              <div className="qf-card__head">
                <h3>{h.ticker}</h3>
                <div className="qf-row">
                  <select className="qf-input qf-input--narrow"
                          value={forms[h.ticker] || '8-K'}
                          onChange={(e) => setForms(f => ({ ...f, [h.ticker]: e.target.value }))}>
                    <option>8-K</option><option>10-Q</option><option>10-K</option>
                  </select>
                  <button className="qf-btn qf-btn--small" onClick={() => onFetch(h.ticker)} disabled={busy[h.ticker]}>
                    {busy[h.ticker] ? <Spinner /> : <FileText size={13} />} Fetch
                  </button>
                </div>
              </div>
              {s ? (
                <div className="qf-earn">
                  <div className="qf-earn__row">
                    <span>EPS</span>
                    <span><strong>{fmt.num(s.eps_actual)}</strong> vs est {fmt.num(s.eps_estimate)}</span>
                    {beat != null && (
                      <span className={`qf-pill ${beat ? 'qf-pill--ok' : 'qf-pill--bad'}`}>
                        {beat ? 'Beat' : 'Miss'}
                      </span>
                    )}
                  </div>
                  <div className="qf-earn__row">
                    <span>Revenue</span><span>{fmt.cap(s.revenue)}</span>
                  </div>
                  <div className="qf-earn__row">
                    <span>Sentiment</span>
                    <span className={`qf-pill qf-pill--${s.sentiment === 'positive' ? 'ok' : s.sentiment === 'negative' ? 'bad' : 'neutral'}`}>
                      {s.sentiment || 'neutral'}
                    </span>
                  </div>
                  <div className="qf-earn__row">
                    <span>Filing</span>
                    <span>{fmt.date(s.filing_date)} Â· {s.form_type} Â· {s.pages}pp</span>
                  </div>
                  {s.exhibit_url && (
                    <a className="qf-link" href={s.exhibit_url} target="_blank" rel="noopener noreferrer">
                      View on EDGAR â†-
                    </a>
                  )}
                </div>
              ) : (
                <p className="qf-cell-muted">No filing fetched yet.</p>
              )}
              <button className="qf-link qf-link--btn" onClick={() => onShowSignals(h.ticker)}>
                {openSignals[h.ticker] ? 'Hide stored signals' : 'View stored signals'}
              </button>
              {openSignals[h.ticker]?.records?.length > 0 && (
                <div className="qf-signals">
                  {openSignals[h.ticker].records.slice(0, 5).map((r, i) => (
                    <div key={i} className="qf-signals__row">
                      <span>{fmt.date(r.filing_date)}</span>
                      <span>{r.form_type}</span>
                      <span>{r.sentiment}</span>
                      <span>EPS {fmt.num(r.eps_actual)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BacktestTheater({ bt1y, bt3y, holdings, optimized }) {
  const [busy, setBusy] = useState(null);
  const [override, setOverride] = useState(null);

  const runWith = async (label, weightsObj) => {
    setBusy(label);
    try {
      const newHoldings = Object.entries(weightsObj).map(([ticker, weight]) => ({ ticker, weight }));
      const r = await api('/api/backtest/run', {
        method: 'POST',
        body: JSON.stringify({ holdings: newHoldings, lookback_years: 3, rebalance_freq: 'monthly' }),
      });
      setOverride({ label, result: r });
    } catch (e) { alert(`Backtest failed: ${e.message}`); }
    finally { setBusy(null); }
  };

  const renderCurve = (bt, title) => {
    if (!bt?.equity_curve?.length) return null;
    const data = bt.equity_curve.map(p => ({ d: p.date, v: p.value }));
    return (
      <div className="qf-bt-curve">
        <div className="qf-bt-head"><strong>{title}</strong></div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="d" stroke="#7d786f" hide />
            <YAxis stroke="#7d786f" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ background: '#101010', border: '1px solid rgba(255,255,255,0.1)' }}
                     formatter={(v) => fmt.money(v)} />
            <Line type="monotone" dataKey="v" stroke="#c9b8a1" strokeWidth={1.6} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <div className="qf-bt-stats">
          <span>End: <strong>{fmt.money(data[data.length-1]?.v)}</strong></span>
          <span>Sharpe <strong>{fmt.num(bt.metrics?.sharpe)}</strong></span>
          <span>Max DD <strong>{fmt.pct(bt.metrics?.max_drawdown, 1)}</strong></span>
          <span>Alpha <strong>{fmt.pct(bt.metrics?.alpha, 1)}</strong></span>
          <span>Beta <strong>{fmt.num(bt.metrics?.beta)}</strong></span>
        </div>
      </div>
    );
  };

  const renderHeatmap = (bt) => {
    if (!bt?.monthly_returns?.length) return null;
    const rows = bt.monthly_returns.map(m => {
      const r = typeof m.return === 'number' ? m.return : (m.return_pct ?? 0);
      let label;
      if (typeof m.month === 'string') {
        label = m.month;
      } else if (m.year != null && m.month != null) {
        label = `${m.year}-${String(m.month).padStart(2, '0')}`;
      } else {
        label = '';
      }
      return { r, label };
    });
    const max = Math.max(...rows.map(({ r }) => Math.abs(r)), 0.001);
    return (
      <div className="qf-heatmap">
        {rows.slice(-36).map(({ r, label }, i) => {
          const intensity = Math.min(Math.abs(r) / max, 1);
          const color = r >= 0
            ? `rgba(126, 208, 155, ${0.15 + intensity * 0.85})`
            : `rgba(224, 137, 135, ${0.15 + intensity * 0.85})`;
          return (
            <div key={i} className="qf-heatmap__cell" style={{ background: color }}
                 title={`${label}: ${fmt.pct(r, 2)}`}>
              <span>{label.slice(2, 7)}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="qf-section">
      <div className="qf-section__head">
        <h2>Performance</h2>
        <div className="qf-row">
          {optimized && (
            <button className="qf-btn qf-btn--ghost" onClick={() => runWith('Optimized', optimized.weights)}
                    disabled={busy === 'Optimized'}>
              {busy === 'Optimized' ? <Spinner /> : <PlayCircle size={13} />} Backtest optimized
            </button>
          )}
          <button className="qf-btn qf-btn--ghost"
                  onClick={() => runWith('Current', Object.fromEntries(holdings.map(h => [h.ticker, h.weight])))}
                  disabled={busy === 'Current'}>
            {busy === 'Current' ? <Spinner /> : <PlayCircle size={13} />} Re-backtest current
          </button>
        </div>
      </div>
      <div className="qf-bt-grid">
        {renderCurve(bt1y, '1-Year')}
        {renderCurve(bt3y, '3-Year')}
      </div>
      {renderHeatmap(bt3y)}
      {override && (
        <div className="qf-bt-override">
          <div className="qf-section__head"><h3>Override Â· {override.label}</h3></div>
          {renderCurve(override.result, `${override.label} (3-year)`)}
        </div>
      )}
    </div>
  );
}

function Commentary({ text }) {
  const [shown, setShown] = useState('');
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!text) return;
    setShown('');
    let i = 0;
    const id = setInterval(() => {
      i += 3;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 12);
    return () => clearInterval(id);
  }, [text]);
  if (!text) return null;
  return (
    <div className="qf-section">
      <div className="qf-section__head">
        <h2>AI Commentary</h2>
        <span className="qf-pill qf-pill--neutral"><Sparkles size={11} /> Cached narrative</span>
      </div>
      <div className="qf-commentary">
        <p>{shown}<span className="qf-cursor">â-</span></p>
        <button className="qf-link qf-link--btn" onClick={() => setOpen(o => !o)}>
          {open ? 'Hide inputs' : 'Why this commentary?'}
        </button>
        {open && (
          <ul className="qf-commentary__inputs">
            <li>Regime probabilities & confidence</li>
            <li>Sharpe, volatility, max drawdown</li>
            <li>VaR/CVaR percentiles</li>
            <li>Earnings beats/misses across holdings</li>
            <li>1Y vs 3Y backtest divergence</li>
          </ul>
        )}
      </div>
    </div>
  );
}

function ChatDock({ portfolioId }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const ref = useRef(null);

  const send = async (q) => {
    if (!q.trim()) return;
    setMsgs(m => [...m, { role: 'user', text: q }]);
    setInput('');
    if (!portfolioId) {
      setMsgs(m => [...m, { role: 'agent', text: 'The agent endpoint requires a saved portfolio_id. Save the analysis first to enable chat.', intent: 'unavailable' }]);
      return;
    }
    setBusy(true);
    try {
      const r = await api('/api/agent/query', { method: 'POST',
        body: JSON.stringify({ query: q, portfolio_id: portfolioId }) });
      setMsgs(m => [...m, { role: 'agent', text: r.response, intent: r.intent, data: r.data }]);
    } catch (e) {
      setMsgs(m => [...m, { role: 'agent', text: `Error: ${e.message}`, intent: 'error' }]);
    } finally { setBusy(false); }
  };

  useEffect(() => { ref.current?.scrollTo(0, ref.current.scrollHeight); }, [msgs]);

  return (
    <>
      <button className="qf-chat-fab" onClick={() => setOpen(o => !o)}>
        {open ? 'Ã-' : 'â-‡ Ask'}
      </button>
      {open && (
        <div className="qf-chat">
          <div className="qf-chat__head">
            <strong>Portfolio Agent</strong>
            <span className="qf-cell-muted">{portfolioId ? 'connected' : 'requires saved portfolio'}</span>
          </div>
          <div className="qf-chat__chips">
            {SAMPLE_PROMPTS.map(p => (
              <button key={p} onClick={() => send(p)}>{p}</button>
            ))}
          </div>
          <div className="qf-chat__log" ref={ref}>
            {msgs.map((m, i) => (
              <div key={i} className={`qf-chat__msg qf-chat__msg--${m.role}`}>
                {m.intent && m.role === 'agent' && (
                  <span className="qf-pill qf-pill--neutral">intent: {m.intent}</span>
                )}
                <p>{m.text}</p>
                {m.data && (
                  <details><summary>raw data</summary>
                    <pre>{JSON.stringify(m.data, null, 2)}</pre>
                  </details>
                )}
              </div>
            ))}
            {busy && <div className="qf-chat__msg qf-chat__msg--agent"><Spinner /> thinkingâ€¦</div>}
          </div>
          <form className="qf-chat__input" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about your portfolioâ€¦" />
            <button type="submit" disabled={busy}><Send size={14} /></button>
          </form>
        </div>
      )}
    </>
  );
}

function ShareBar({ holdings, disabled, onSaved }) {
  const [days, setDays] = useState(30);
  const [busy, setBusy] = useState(false);
  const [share, setShare] = useState(null);
  const [copied, setCopied] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      const r = await api('/api/analyzer/save', { method: 'POST',
        body: JSON.stringify({ holdings, expires_in_days: days }) });
      const url = r.share_url.startsWith('http') ? r.share_url
                : `${window.location.origin}${window.location.pathname}?token=${r.token}`;
      setShare({ ...r, url });
      onSaved?.(r.token);
    } catch (e) { alert(`Save failed: ${e.message}`); }
    finally { setBusy(false); }
  };
  const copy = () => {
    navigator.clipboard.writeText(share.url);
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="qf-section">
      <div className="qf-section__head"><h2>Save Snapshot</h2></div>
      <div className="qf-share">
        <label>Expires in {days} days</label>
        <input type="range" min="1" max="90" value={days}
               style={{ '--range-fill': rangeFill(days, 1, 90) }}
               onChange={(e) => setDays(Number(e.target.value))} />
        <button className="qf-btn" onClick={save} disabled={busy || disabled}>
          {busy ? <Spinner /> : <Share2 size={13} />} Save snapshot
        </button>
        {share && (
          <div className="qf-share__result">
            <code>{share.url}</code>
            <button className="qf-icon-btn" onClick={copy}>
              {copied ? <Check size={13} /> : <Copy size={13} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const ENDPOINT_MAP = [
  ['GET /api/health', 'Hero status banner'],
  ['POST /api/analyzer/validate', 'Ticker validation'],
  ['GET /api/market/fundamentals/{ticker}', 'Sector / market cap / P/E per row'],
  ['GET /api/market/prices', 'Price series'],
  ['POST /api/analyzer/run', 'Full report on Analyze'],
  ['POST /api/risk/analyze', 'Recompute risk only'],
  ['POST /api/optimize/stateless', 'Optimization Lab cards'],
  ['GET /api/regime/current', 'Regime refresh'],
  ['POST /api/backtest/run', 'Backtest theater overrides'],
  ['POST /api/documents/earnings', 'Per-holding earnings fetch'],
  ['GET /api/documents/signals/{ticker}', 'Stored-signals timeline'],
  ['POST /api/agent/query', 'Chat dock'],
  ['POST /api/analyzer/save', 'Share button'],
  ['GET /api/analyzer/snapshot/{token}', 'Read-only shared view'],
];

function MethodsFooter() {
  const [open, setOpen] = useState(false);
  return (
    <div className="qf-section qf-footer">
      <button className="qf-link qf-link--btn" onClick={() => setOpen(o => !o)}>
        {open ? 'â-¾' : 'â-¸'} Endpoint coverage map
      </button>
      {open && (
        <table className="qf-endpoints">
          <thead><tr><th>Endpoint</th><th>Used by</th></tr></thead>
          <tbody>
            {ENDPOINT_MAP.map(([e, u]) => (
              <tr key={e}><td><code>{e}</code></td><td>{u}</td></tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="qf-footer__note">
        Rate limits: <code>/analyzer/run</code> is 3/min Â· <code>/analyzer/validate</code> is 30/min.
        Methods reference and source: <a className="qf-link" href="https://github.com/keremburakyilmaz/QuantFusion" target="_blank" rel="noopener noreferrer">GitHub â†-</a>
      </p>
    </div>
  );
}

export default function QuantFusion() {
  const [params] = useSearchParams();
  const sharedToken = params.get('token');

  const [holdings, setHoldings] = useState(DEMO);
  const [report, setReport] = useState(null);
  const [running, setRunning] = useState(false);
  const [recomputing, setRecomputing] = useState(false);
  const [validation, setValidation] = useState(null);
  const [fundamentals, setFundamentals] = useState({});
  const [signals, setSignals] = useState({});
  const [error, setError] = useState(null);
  const [readOnly, setReadOnly] = useState(false);
  const [savedToken, setSavedToken] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // load shared snapshot if ?token=
  useEffect(() => {
    if (!sharedToken) return;
    setReadOnly(true);
    api(`/api/analyzer/snapshot/${sharedToken}`).then(
      (s) => { setHoldings(s.holdings); setReport(s.report); setActiveTab('overview'); },
      (e) => setError(`Could not load snapshot: ${e.message}`),
    );
  }, [sharedToken]);

  // fundamentals on holdings change
  useEffect(() => {
    const tickers = holdings.map(h => h.ticker?.toUpperCase()).filter(Boolean);
    tickers.forEach(t => {
      if (fundamentals[t]) return;
      api(`/api/market/fundamentals/${t}`).then(
        (f) => setFundamentals(s => ({ ...s, [t]: f })),
        () => {},
      );
    });
  }, [holdings, fundamentals]);

  const loadDemo = () => { setHoldings(DEMO); setReport(null); setValidation(null); };
  const blank   = () => { setHoldings([{ ticker: '', weight: 0 }]); setReport(null); setValidation(null); };

  const validate = async () => {
    const tickers = holdings.map(h => h.ticker).filter(Boolean);
    if (!tickers.length) return;
    try {
      const v = await api('/api/analyzer/validate', { method: 'POST', body: JSON.stringify({ tickers }) });
      setValidation(v);
    } catch (e) { alert(`Validate failed: ${e.message}`); }
  };

  const analyze = async () => {
    const total = holdings.reduce((s, h) => s + (Number(h.weight) || 0), 0);
    if (Math.abs(total - 1) > 0.01) { alert('Weights must sum to 100%. Use "Normalize" first.'); return; }
    setRunning(true); setError(null);
    try {
      const r = await api('/api/analyzer/run', { method: 'POST', body: JSON.stringify({ holdings }) });
      setReport(r);
      setActiveTab('overview');
    } catch (e) { setError(`Analyze failed: ${e.message}`); }
    finally { setRunning(false); }
  };

  const recomputeRisk = async () => {
    setRecomputing(true);
    try {
      const r = await api('/api/risk/analyze', { method: 'POST', body: JSON.stringify({ holdings }) });
      setReport(rep => rep ? { ...rep, risk: r } : rep);
    } catch (e) { alert(`Risk failed: ${e.message}`); }
    finally { setRecomputing(false); }
  };

  const fetchEarnings = async (ticker, form_type) => {
    const r = await api('/api/documents/earnings', { method: 'POST',
      body: JSON.stringify({ ticker, form_type }) });
    setSignals(s => ({ ...s, [ticker]: { ...r.signals, filing_date: r.filing_date, form_type: r.form_type, pages: r.pages } }));
  };
  const fetchSignals = (ticker) => api(`/api/documents/signals/${ticker}`);

  return (
    <section className="qf-page scroll-section">
      <div className="page-header">
        <p className="page-header__label">QuantFusion Â· Showcase</p>
        <h1 className="page-header__title">Portfolio intelligence, <span>made inspectable</span></h1>
        <p className="page-header__sub">
          A FastAPI portfolio analytics platform â€” risk, optimization, regime detection, earnings OCR, and an
          LLM agent â€” wired end-to-end. <StatusBanner />
        </p>
      </div>

      {error && <div className="qf-error"><AlertTriangle size={14} /> {error}</div>}
      {readOnly && (
        <div className="qf-readonly"><ShieldCheck size={14} /> Read-only shared snapshot Â· token <code>{sharedToken}</code></div>
      )}

      <PortfolioCommandCenter
        holdings={holdings}
        running={running}
        readOnly={readOnly}
        validation={validation}
        loadDemo={loadDemo}
        blank={blank}
        analyze={analyze}
      />

      <div className="qf-hero-cta">
        <button className="qf-btn qf-btn--primary" onClick={loadDemo} disabled={readOnly}>
          Load demo portfolio
        </button>
        <button className="qf-btn qf-btn--ghost" onClick={blank} disabled={readOnly}>
          Build your own
        </button>
        <button className="qf-btn qf-btn--accent" onClick={analyze} disabled={running || readOnly}>
          {running ? <Spinner /> : <Activity size={14} />} {running ? 'Running full analysisâ€¦' : 'Analyze'}
        </button>
      </div>

      <HoldingsEditor
        holdings={holdings}
        setHoldings={setHoldings}
        readOnly={readOnly}
        fundamentals={fundamentals}
        validate={validate}
        validation={validation}
      />

      {!report && <EmptyAnalysisState running={running} />}

      {false && !report && !running && (
        <div className="qf-placeholder">
          Click <strong>Analyze</strong> to run the full pipeline: risk metrics, efficient frontier (150 points),
          MVO/RP/Blended optimization, 1Y &amp; 3Y backtests, regime classification, and AI commentary.
          Expect <strong>30â€“60s</strong> on first call (cold start + market data fetch).
        </div>
      )}

      {report && (
        <>
          <OverviewDashboard report={report} holdings={holdings} onSelectTab={setActiveTab} />
          <DetailTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === 'overview' && (
            <>
              {report.regime_commentary && <Commentary text={report.regime_commentary} />}
              <RiskTiles risk={report.risk} holdings={holdings} recompute={recomputeRisk} recomputing={recomputing} />
              {report.regime && <RegimeDetector regime={report.regime} />}
            </>
          )}

          {activeTab === 'optimize' && (
            <>
              <OptimizerComparison
                report={report}
                baselineRisk={report.risk}
                onOpenLab={() => document.querySelector('.qf-cards')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              />
              <FrontierChart frontier={report.frontier}
                optimized={[report.optimized_mvo, report.optimized_rp, report.optimized_blended]} />
              <OptimizationLab report={report} holdings={holdings} baselineRisk={report.risk} />
            </>
          )}

          {activeTab === 'performance' && (
            <BacktestTheater bt1y={report.backtest_1y} bt3y={report.backtest_3y}
              holdings={holdings} optimized={report.optimized_mvo} />
          )}

          {activeTab === 'filings' && (
            <EarningsPipeline holdings={holdings} signals={signals}
              fetchEarnings={fetchEarnings} fetchSignals={fetchSignals} />
          )}

          {activeTab === 'share' && (
            <>
              {!readOnly && <ShareBar holdings={holdings} disabled={running} onSaved={setSavedToken} />}
              <MethodsFooter />
            </>
          )}
        </>
      )}

      {!report && <MethodsFooter />}
      <ChatDock portfolioId={savedToken || sharedToken} />
    </section>
  );
}
