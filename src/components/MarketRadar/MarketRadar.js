import { useState } from 'react';
import './MarketRadar.css';
import mockData from './mockData.json';

export default function MarketRadar() {
  const [settings, setSettings] = useState({
    turkeyMode: true,
    breakingAlerts: true,
    emailDigest: true,
  });

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getRegimeClass = (score) => {
    if (score >= 60) return 'risk-on';
    if (score <= 40) return 'risk-off';
    return 'neutral';
  };

  const getRegimeLabel = (score) => {
    if (score >= 60) return 'Risk-On';
    if (score <= 40) return 'Risk-Off';
    return 'Neutral';
  };

  const getImpactDots = (impact) => {
    const levels = { high: 3, medium: 2, low: 1 };
    const filled = levels[impact] || 1;
    return Array(3).fill(null).map((_, i) => (
      <span 
        key={i} 
        className={`impact-dot ${i < filled ? `filled ${impact}` : ''}`}
      />
    ));
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="market-radar-section">
      {/* Header */}
      <div className="radar-header">
        <div className="radar-title-group">
          <h1>Market <span>Radar</span></h1>
          <p className="radar-subtitle">Macro events & breaking news that move markets</p>
        </div>
        <div className="radar-meta">
          <div className="last-updated">
            <span className="live-indicator"></span>
            Updated {formatTime(mockData.lastUpdated)}
          </div>
          <div className="regime-meter">
            <div>
              <div className="regime-label">Market Regime</div>
              <div className={`regime-status ${getRegimeClass(mockData.marketRegime.score)}`}>
                {getRegimeLabel(mockData.marketRegime.score)}
              </div>
            </div>
            <div className="regime-bar">
              <div 
                className={`regime-bar-fill ${getRegimeClass(mockData.marketRegime.score)}`}
                style={{ width: `${mockData.marketRegime.score}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Indicators */}
      <div className="indicators-row">
        <div className="indicator-chip">
          <span className="indicator-name">VIX</span>
          <span className="indicator-value">{mockData.marketRegime.indicators.vix.value}</span>
          <span className={`indicator-change ${mockData.marketRegime.indicators.vix.change >= 0 ? 'negative' : 'positive'}`}>
            {mockData.marketRegime.indicators.vix.change >= 0 ? '+' : ''}{mockData.marketRegime.indicators.vix.change}
          </span>
        </div>
        <div className="indicator-chip">
          <span className="indicator-name">DXY</span>
          <span className="indicator-value">{mockData.marketRegime.indicators.dxy.value}</span>
          <span className={`indicator-change ${mockData.marketRegime.indicators.dxy.change >= 0 ? 'positive' : 'negative'}`}>
            {mockData.marketRegime.indicators.dxy.change >= 0 ? '+' : ''}{mockData.marketRegime.indicators.dxy.change}
          </span>
        </div>
        <div className="indicator-chip">
          <span className="indicator-name">US 10Y</span>
          <span className="indicator-value">{mockData.marketRegime.indicators.usty10.value}%</span>
          <span className={`indicator-change ${mockData.marketRegime.indicators.usty10.change >= 0 ? 'negative' : 'positive'}`}>
            {mockData.marketRegime.indicators.usty10.change >= 0 ? '+' : ''}{mockData.marketRegime.indicators.usty10.change}
          </span>
        </div>
      </div>

      {/* Breaking Alerts */}
      {mockData.breakingAlerts.length > 0 && (
        <div className="breaking-alerts">
          {mockData.breakingAlerts.map(alert => (
            <div key={alert.id} className="alert-item">
              <svg className="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              <div className="alert-content">
                <div className="alert-headline">{alert.headline}</div>
                <div className="alert-meta">
                  {formatTime(alert.timestamp)} • {alert.sources.join(', ')}
                </div>
              </div>
              <div className="alert-score">{alert.score}</div>
              {alert.isNew && <span className="alert-new-badge">New</span>}
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions" style={{ marginBottom: '1.5rem' }}>
        <button className="action-button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          Send Test Email
        </button>
        <button className="action-button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
          Refresh Now
        </button>
        <button className="action-button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Preview Digest
        </button>
      </div>

      {/* Dashboard Grid */}
      <div className="radar-dashboard">
        {/* Top Stories */}
        <div className="radar-card top-stories-card">
          <div className="card-header">
            <h2 className="card-title">
              <svg className="card-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              What Matters Today
            </h2>
          </div>
          <div className="top-stories-list">
            {mockData.keyStories.map(story => (
              <div key={story.id} className={`story-item ${story.impact}`}>
                <div className="story-header">
                  <div className="story-headline">{story.headline}</div>
                  <div className="story-meta">
                    <span className={`impact-badge ${story.impact}`}>{story.impact}</span>
                    <span className="category-tag">{story.category}</span>
                  </div>
                </div>
                <p className="story-why">{story.whyItMatters}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Calendar */}
        <div className="radar-card calendar-card">
          <div className="card-header">
            <h2 className="card-title">
              <svg className="card-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Today's Calendar
            </h2>
            <span className="card-action">Full calendar →</span>
          </div>
          <div className="calendar-list">
            {mockData.todayCalendar.map(event => (
              <div key={event.id} className="calendar-item">
                <div className="calendar-time">{event.time}</div>
                <div className="calendar-event">
                  <div className="calendar-event-name">{event.event}</div>
                  <div className="calendar-event-detail">
                    Prev: {event.previous} | Fcst: {event.forecast}
                  </div>
                </div>
                <div className="calendar-impact">
                  {getImpactDots(event.impact)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Catalysts */}
        <div className="radar-card">
          <div className="card-header">
            <h2 className="card-title">
              <svg className="card-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              What to Watch Next
            </h2>
          </div>
          <div className="catalysts-list">
            {mockData.upcomingCatalysts.map((catalyst, idx) => (
              <div key={idx} className="catalyst-item">
                <span className="catalyst-date">{formatDate(catalyst.date)}</span>
                <span className="catalyst-event">{catalyst.event}</span>
                <span className={`impact-badge ${catalyst.impact}`}>{catalyst.impact}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Digest History */}
        <div className="radar-card digest-card">
          <div className="card-header">
            <h2 className="card-title">
              <svg className="card-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              Recent Digests
            </h2>
            <span className="card-action">View all →</span>
          </div>
          <div className="digest-list">
            {mockData.recentDigests.map(digest => (
              <div key={digest.id} className="digest-item">
                <div className="digest-header">
                  <span className="digest-date">{formatDate(digest.date)}</span>
                  <span className="digest-count">{digest.itemCount} items</span>
                </div>
                <div className="digest-title">{digest.title}</div>
                <p className="digest-summary">{digest.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sources Status */}
        <div className="radar-card">
          <div className="card-header">
            <h2 className="card-title">
              <svg className="card-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
              Sources Status
            </h2>
          </div>
          <div className="sources-grid">
            {mockData.sources.map(source => (
              <div key={source.id} className="source-item">
                <span className={`source-status ${source.status}`}></span>
                <div className="source-info">
                  <div className="source-name">{source.name}</div>
                  <div className="source-type">{source.type}</div>
                </div>
                <span className="source-items">{source.itemsToday}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="radar-card settings-card">
          <div className="card-header">
            <h2 className="card-title">
              <svg className="card-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              Settings
            </h2>
          </div>
          <div className="settings-section">
            <div className="setting-row">
              <div>
                <div className="setting-label">Turkey Mode</div>
                <div className="setting-description">Include CBRT, USD/TRY, Turkey CDS</div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.turkeyMode}
                  onChange={() => toggleSetting('turkeyMode')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-row">
              <div>
                <div className="setting-label">Breaking Alerts</div>
                <div className="setting-description">Email when score &gt; 80</div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.breakingAlerts}
                  onChange={() => toggleSetting('breakingAlerts')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-row">
              <div>
                <div className="setting-label">Daily Digest</div>
                <div className="setting-description">Send at 08:30 local time</div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.emailDigest}
                  onChange={() => toggleSetting('emailDigest')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
