import { Link } from 'react-router-dom';
import { variables } from './variables';
import { useSystemClock } from './useSystemClock';
import { useSlowDrift } from './useSlowDrift';
import { useMeters } from './useMeters';
import { useProcesses } from './useProcesses';
import { useLogStream } from './useLogStream';
import './System.css';

function pad(n, w = 2) {
  return String(n).padStart(w, '0');
}

function formatUptime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

function Meter({ label, value, tone }) {
  const filled = Math.round(value / 5);
  const bar = '▓'.repeat(filled) + '░'.repeat(20 - filled);
  return (
    <div className={`meter meter-${tone}`}>
      <span className="meter-label">{label}</span>
      <span className="meter-bar">{bar}</span>
      <span className="meter-value">{String(Math.round(value)).padStart(3, ' ')}%</span>
    </div>
  );
}

export default function SystemRunning() {
  const seconds = useSystemClock();
  const { variableState, currentLoop, loopRetries, paused, togglePause } = useSlowDrift();
  const meters = useMeters(paused);
  const procs = useProcesses(paused);
  const logs = useLogStream(paused);

  const maxLabel = Math.max(...variables.map(v => v.label.length));

  return (
    <div className="system-container">
      <div className="system-content">
        <div className="system-header">
          <span className="system-title">the system is running</span>
          <span className="system-status">status: overcommitted</span>
        </div>

        <div className="system-meters">
          <Meter label="cognitive load" value={meters.cognitive} tone="warn" />
          <Meter label="anxiety" value={meters.anxiety} tone="alert" />
          <Meter label="bandwidth" value={meters.bandwidth} tone="low" />
        </div>

        <div className="system-variables">
          {variables.map(v => (
            <div key={v.key} className="system-variable">
              <span className="variable-label">
                {v.label.padEnd(maxLabel, ' ')}:
              </span>
              <span className="variable-value">
                {variableState[v.key]}
              </span>
            </div>
          ))}
        </div>

        <div className="system-processes">
          <div className="panel-title">— running thoughts ({procs.length}) —</div>
          <div className="proc proc-header">
            <span className="col-pid">PID</span>
            <span className="col-state">STATE</span>
            <span className="col-name">NAME</span>
            <span className="col-meta">META</span>
          </div>
          {procs.map(p => (
            <div key={p.pid} className={`proc proc-${p.state}`}>
              <span className="col-pid">{String(p.pid).padStart(4, '0')}</span>
              <span className="col-state">{p.state}</span>
              <span className="col-name">{p.name}</span>
              <span className="col-meta">
                {p.stuck ? `retry ${p.retries}` : `t+${p.age}`}
              </span>
            </div>
          ))}
        </div>

        <div className="system-log">
          <div className="panel-title">— log stream —</div>
          {logs.length === 0 && (
            <div className="log-line log-empty">waiting…</div>
          )}
          {logs.map((l, i) => (
            <div
              key={l.id}
              className="log-line"
              style={{ opacity: 0.35 + (i + 1) / logs.length * 0.65 }}
            >
              <span className="log-ts">{formatUptime(l.ts)}</span>
              <span className="log-text">▸ {l.text}</span>
            </div>
          ))}
        </div>

        <div className="system-loop">
          <span className="loop-label">current loop:</span>
          <span className="loop-value">{currentLoop}</span>
          <span className="loop-meta">(retry #{loopRetries})</span>
        </div>

        <div className="system-uptime">
          <span className="uptime-label">uptime:</span>
          <span className="uptime-value">{formatUptime(seconds)}</span>
        </div>

        <div className="system-footnote">
          note: the pause button slows the display. it does not silence the system.
        </div>

        <div className="system-control">
          <button className="pause-button" onClick={togglePause}>
            {paused ? 'resume' : 'pause updates'}
          </button>
        </div>

        <div className="system-back">
          <Link to="/" className="back-link">← back</Link>
        </div>
      </div>
    </div>
  );
}
