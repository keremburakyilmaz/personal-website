export default function SettingsDrawer({ state, onClose, onRestart, validationResult }) {
  return (
    <div className="settings-drawer-overlay" onClick={onClose}>
      <div className="settings-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Debug Panel</h2>
          <button className="settings-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="settings-content">
          <section className="settings-section">
            <h3>Current State</h3>
            <div className="settings-state">
              <div className="state-item">
                <strong>Scene:</strong> {state.sceneId}
              </div>
              <div className="state-item">
                <strong>Primacy:</strong> {state.primacyId || 'Not set'}
              </div>
            </div>
          </section>

          <section className="settings-section">
            <h3>Stats</h3>
            <div className="settings-stats">
              {Object.entries(state.stats).map(([key, value]) => (
                <div key={key} className="stat-item">
                  <strong>{key}:</strong> {value}
                </div>
              ))}
            </div>
          </section>

          <section className="settings-section">
            <h3>Clocks</h3>
            <div className="settings-clocks">
              {Object.entries(state.clocks).map(([key, value]) => (
                <div key={key} className="clock-item">
                  <strong>{key}:</strong> {value}
                </div>
              ))}
            </div>
          </section>

          <section className="settings-section">
            <h3>Flags</h3>
            <div className="settings-flags">
              {Object.keys(state.flags).length === 0 ? (
                <div className="no-flags">No flags set</div>
              ) : (
                Object.keys(state.flags).map((flag) => (
                  <div key={flag} className="flag-item">
                    {flag}
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="settings-section">
            <h3>Memories</h3>
            <div className="settings-memories">
              {state.memories.length === 0 ? (
                <div className="no-memories">No memories yet</div>
              ) : (
                state.memories.map((memory, index) => (
                  <div key={index} className="memory-item">
                    <strong>{memory.label}</strong> ({memory.kind})
                  </div>
                ))
              )}
            </div>
          </section>

          {validationResult && (
            <section className="settings-section">
              <h3>Story Validation</h3>
              <div className="validation-result">
                <div className={`validation-status ${validationResult.valid ? 'valid' : 'invalid'}`}>
                  {validationResult.valid ? '✓ Valid' : '✗ Invalid'}
                </div>
                {validationResult.errors.length > 0 && (
                  <div className="validation-errors">
                    <strong>Errors:</strong>
                    <ul>
                      {validationResult.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {validationResult.warnings.length > 0 && (
                  <div className="validation-warnings">
                    <strong>Warnings:</strong>
                    <ul>
                      {validationResult.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          <section className="settings-actions">
            <button className="settings-restart" onClick={onRestart}>
              Restart Game
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}


