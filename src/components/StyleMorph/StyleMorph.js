import { useState, useRef, useCallback } from 'react';
import './StyleMorph.css';

const API_BASE = "https://style-morph.onrender.com";

const STYLES = [
  { name: 'pixel_art',    label: 'Pixel Art',    icon: '🎮' },
  { name: 'cel_shaded',   label: 'Cel Shaded',   icon: '🎨' },
  { name: 'watercolor',   label: 'Watercolor',   icon: '🖌️' },
  { name: 'dark_fantasy', label: 'Dark Fantasy', icon: '🌑' },
  { name: 'anime',        label: 'Anime',        icon: '✨' },
  { name: 'concept_art',  label: 'Concept Art',  icon: '🖼️' },
];

function ScoreBar({ label, value }) {
  return (
    <div className="sm-score-row">
      <span className="sm-score-label">{label}</span>
      <div className="sm-score-track">
        <div className="sm-score-fill" style={{ width: `${value * 10}%` }} />
      </div>
      <span className="sm-score-value">{value}/10</span>
    </div>
  );
}

function VariantCard({ variant, rank }) {
  const { scores, image_b64 } = variant;
  return (
    <div className={`sm-card ${rank === 0 ? 'sm-card--top' : ''}`}>
      {rank === 0 && <span className="sm-badge">Best Match</span>}
      <div className="sm-card-image-wrap">
        <img
          src={`data:image/png;base64,${image_b64}`}
          alt={`Variant ${rank + 1}`}
          className="sm-card-image"
        />
      </div>
      <div className="sm-card-scores">
        <div className="sm-overall">
          <span className="sm-overall-label">Overall</span>
          <span className="sm-overall-value">{scores.overall}</span>
        </div>
        <ScoreBar label="Structure" value={scores.structural_fidelity} />
        <ScoreBar label="Style"     value={scores.style_match} />
        <ScoreBar label="Quality"   value={scores.quality} />
        {scores.summary && (
          <p className="sm-summary">{scores.summary}</p>
        )}
      </div>
    </div>
  );
}

export default function StyleMorph() {
  const [file, setFile]           = useState(null);
  const [preview, setPreview]     = useState(null);
  const [styleName, setStyleName] = useState('pixel_art');
  const [status, setStatus]       = useState('idle'); // idle | loading | done | error
  const [results, setResults]     = useState(null);
  const [errorMsg, setErrorMsg]   = useState('');
  const [dragging, setDragging]   = useState(false);
  const [health, setHealth]       = useState('unknown'); // unknown | checking | ok | down
  const inputRef = useRef(null);

  const checkHealth = async () => {
    setHealth('checking');
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(10_000) });
      setHealth(res.ok ? 'ok' : 'down');
    } catch {
      setHealth('down');
    }
  };

  const handleFile = useCallback((f) => {
    if (!f) return;
    setFile(f);
    setResults(null);
    setStatus('idle');
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const friendlyError = (status, detail) => {
    if (status === 429) return 'API quota reached — please try again in a few minutes.';
    if (status === 503) return detail || 'Service temporarily unavailable. Please try again shortly.';
    if (status === 0)   return 'Could not reach the server. It may be waking up — wait 30 seconds and retry.';
    return detail || `Unexpected error (${status}). Please try again.`;
  };

  const handleGenerate = async () => {
    if (!file) return;
    setStatus('loading');
    setErrorMsg('');
    setResults(null);

    const form = new FormData();
    form.append('image', file);
    form.append('style_name', styleName);

    // 10 min timeout — 4 sequential generations + 4 evaluations on free tier
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 600_000);

    try {
      const res = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        body: form,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw Object.assign(new Error(), { httpStatus: res.status, detail: body.detail });
      }

      const data = await res.json();
      setResults(data);
      setStatus('done');
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        setErrorMsg('Request timed out. The server may be cold-starting — wait 30 seconds and retry.');
      } else {
        setErrorMsg(friendlyError(err.httpStatus ?? 0, err.detail));
      }
      setStatus('error');
    }
  };

  const selectedStyle = STYLES.find(s => s.name === styleName);

  return (
    <section className="sm-section">
      <div className="page-header">
        <span className="page-header__label">Portfolio Project</span>
        <h1 className="page-header__title">
          Style<span className="sm-accent">Morph</span>
        </h1>
        <p className="page-header__sub">
          Upload a sketch or reference image - get 4 game-ready art variants in your chosen style,
          each automatically scored by an AI judge on structure, style match, and quality.
        </p>
        <div className="sm-stack-pills">
          {['SDXL · HuggingFace', 'ControlNet', 'Groq Judge', 'FastAPI'].map(t => (
            <span key={t} className="sm-pill">{t}</span>
          ))}
        </div>

        <button
          className={`sm-health-btn sm-health-btn--${health}`}
          onClick={checkHealth}
          disabled={health === 'checking'}
        >
          <span className={`sm-health-dot sm-health-dot--${health}`} />
          {health === 'unknown' && 'Check API Status'}
          {health === 'checking' && 'Checking…'}
          {health === 'ok' && 'API Online'}
          {health === 'down' && 'API Offline - Retry?'}
        </button>
      </div>

      <div className="sm-layout">
        {/* ── Left panel: controls ── */}
        <div className="sm-controls">
          {/* Upload */}
          <div
            className={`sm-dropzone ${dragging ? 'sm-dropzone--over' : ''} ${preview ? 'sm-dropzone--filled' : ''}`}
            onClick={() => inputRef.current?.click()}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files[0])}
            />
            {preview ? (
              <img src={preview} alt="Uploaded sketch" className="sm-preview-img" />
            ) : (
              <div className="sm-dropzone-placeholder">
                <span className="sm-drop-icon">⬆</span>
                <span className="sm-drop-primary">Drop your sketch here</span>
                <span className="sm-drop-secondary">PNG, JPG, WebP · click to browse</span>
              </div>
            )}
          </div>

          {/* Style picker */}
          <div className="sm-style-grid">
            {STYLES.map(s => (
              <button
                key={s.name}
                className={`sm-style-btn ${styleName === s.name ? 'sm-style-btn--active' : ''}`}
                onClick={() => setStyleName(s.name)}
              >
                <span className="sm-style-icon">{s.icon}</span>
                <span className="sm-style-name">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Generate */}
          <button
            className="sm-generate-btn"
            onClick={handleGenerate}
            disabled={!file || status === 'loading'}
          >
            {status === 'loading' ? (
              <>
                <span className="sm-spinner" />
                Generating {selectedStyle?.label} variants…
              </>
            ) : (
              `Generate ${selectedStyle?.label} Variants`
            )}
          </button>

          {status === 'error' && (
            <div className="sm-error">
              <span>{errorMsg}</span>
              <button className="sm-retry-btn" onClick={handleGenerate}>Retry</button>
            </div>
          )}
        </div>

        {/* ── Right panel: results ── */}
        <div className="sm-results">
          {status === 'idle' && !results && (
            <div className="sm-results-empty">
              <span className="sm-empty-icon">🎨</span>
              <p>Upload a sketch and choose a style to generate variants.</p>
            </div>
          )}

          {status === 'loading' && (
            <div className="sm-results-empty">
              <span className="sm-empty-icon">⏳</span>
              <p>Running pipeline · evaluating with Groq judge…</p>
              <p className="sm-loading-sub">This takes ~60s on the free tier.</p>
            </div>
          )}

          {status === 'done' && results && (
            <>
              <div className="sm-results-header">
                <h2>{results.style} - {results.variants.length} variants</h2>
                <span className="sm-results-sub">Sorted by overall AI score</span>
              </div>
              <div className="sm-cards-grid">
                {results.variants.map((v, i) => (
                  <VariantCard key={v.id} variant={v} rank={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
