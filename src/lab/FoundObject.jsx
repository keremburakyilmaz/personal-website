import { useEffect, useRef, useState } from 'react';
import ExperimentFrame from './ExperimentFrame';
import ArtworkImage from './ArtworkImage';
import { searchArtwork } from './artApi';

const REFLECTIONS = [
  'What did you notice before you understood what you were looking at?',
  'Which part of this object feels most familiar, and why?',
  'What would change if this work had appeared one day earlier?',
  'Name the detail you would preserve if the rest disappeared.',
  'What is this object refusing to explain?',
];

export default function FoundObject() {
  const [query, setQuery] = useState('waiting for something that already happened');
  const [artwork, setArtwork] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const requestRef = useRef(null);

  useEffect(() => () => requestRef.current?.abort(), []);

  const findObject = async (event) => {
    event?.preventDefault();
    const cleaned = query.trim();
    if (!cleaned) return;
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setStatus('searching');
    setError('');
    try {
      let result = await searchArtwork(cleaned, controller.signal);
      if (!result) result = await searchArtwork('memory', controller.signal);
      if (!result) throw new Error('The archive returned no visible objects.');
      setArtwork(result);
      setStatus('found');
    } catch (requestError) {
      if (requestError.name === 'AbortError') return;
      setError('The archive is quiet right now. Your sentence remains here.');
      setStatus('error');
    }
  };

  const reflection = artwork
    ? REFLECTIONS[Math.abs(artwork.id) % REFLECTIONS.length]
    : '';

  return (
    <ExperimentFrame
      number="001"
      title="Found Object"
      question="Give the archive a thought. It will return an object."
    >
      <form className="lab-input-line" onSubmit={findObject}>
        <label htmlFor="found-object-query">THOUGHT / FRAGMENT</label>
        <div>
          <input
            id="found-object-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            maxLength={180}
          />
          <button type="submit" disabled={status === 'searching'}>
            {status === 'searching' ? 'SEARCHING…' : artwork ? 'FIND ANOTHER' : 'SEARCH ARCHIVE'}
          </button>
        </div>
      </form>

      {error && <p className="lab-message lab-message--error" role="status">{error}</p>}

      {artwork && (
        <article className="found-object" aria-live="polite">
          <div className="found-object__image">
            <ArtworkImage artwork={artwork} alt={artwork.alt} />
          </div>
          <div className="found-object__record">
            <span>ARCHIVE MATCH / {String(artwork.id).padStart(6, '0')}</span>
            <h3>{artwork.title}</h3>
            <p>{artwork.artist_display || 'Artist unrecorded'}</p>
            <dl>
              <div><dt>DATE</dt><dd>{artwork.date_display || 'Unknown'}</dd></div>
              <div><dt>ORIGIN</dt><dd>{artwork.place_of_origin || 'Unknown'}</dd></div>
              <div><dt>MEDIUM</dt><dd>{artwork.medium_display || 'Not recorded'}</dd></div>
            </dl>
            <blockquote>{reflection}</blockquote>
            <a href={artwork.pageUrl} target="_blank" rel="noreferrer">VIEW MUSEUM RECORD ↗</a>
          </div>
        </article>
      )}

      {!artwork && status !== 'searching' && (
        <div className="lab-empty-state">The object has not been selected yet.</div>
      )}
    </ExperimentFrame>
  );
}
