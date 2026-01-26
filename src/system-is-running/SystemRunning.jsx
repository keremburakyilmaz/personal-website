import { Link } from 'react-router-dom';
import { variables } from './variables';
import { useSystemClock } from './useSystemClock';
import { useSlowDrift } from './useSlowDrift';
import './System.css';

function formatUptime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [hrs, mins, secs]
    .map(n => String(n).padStart(2, '0'))
    .join(':');
}

export default function SystemRunning() {
  const seconds = useSystemClock();
  const { variableState, currentLoop, paused, togglePause } = useSlowDrift();

  // Find the longest label for alignment
  const maxLabelLength = Math.max(...variables.map(v => v.label.length));

  return (
    <div className="system-container">
      <div className="system-content">
        <div className="system-header">
          <span className="system-title">the system is running</span>
        </div>

        <div className="system-variables">
          {variables.map(v => (
            <div key={v.key} className="system-variable" /* title={v.hover} */>
              <span className="variable-label">
                {v.label.padEnd(maxLabelLength, ' ')}:
              </span>
              <span className="variable-value">
                {variableState[v.key]}
              </span>
            </div>
          ))}
        </div>

        <div className="system-loop">
          <span className="loop-label">current loop:</span>
          <span className="loop-value">{currentLoop}</span>
        </div>

        <div className="system-uptime">
          <span className="uptime-label">uptime:</span>
          <span className="uptime-value">{formatUptime(seconds)}</span>
        </div>

        <div className="system-control">
          <button 
            className="pause-button"
            onClick={togglePause}
          >
            {paused ? 'resume updates' : 'pause updates'}
          </button>
        </div>

        <div className="system-back">
          <Link to="/" className="back-link">← back</Link>
        </div>
      </div>
    </div>
  );
}
