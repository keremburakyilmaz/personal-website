import { useCallback, useEffect, useState } from 'react';
import ExperimentFrame from './ExperimentFrame';
import ArtworkImage from './ArtworkImage';
import { randomArtwork } from './artApi';

export default function MuseumDetail() {
  const [artwork, setArtwork] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [status, setStatus] = useState('loading');
  const [sequence, setSequence] = useState(0);

  const load = useCallback(async (signal) => {
    setStatus('loading');
    setRevealed(false);
    try {
      const result = await randomArtwork(signal);
      if (!result) throw new Error('no artwork');
      setArtwork(result);
      setStatus('ready');
    } catch (error) {
      if (error.name !== 'AbortError') setStatus('error');
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load, sequence]);

  return (
    <ExperimentFrame
      number="008"
      title="Museum Detail"
      question="The archive gives you a fragment before it gives you the whole."
    >
      {status === 'loading' && <div className="lab-empty-state">Selecting a detail from the archive.</div>}
      {status === 'error' && (
        <div className="lab-empty-state">
          The gallery doors are temporarily closed.
          <button className="lab-text-button" type="button" onClick={() => setSequence((value) => value + 1)}>TRY ANOTHER DOOR</button>
        </div>
      )}
      {artwork && status === 'ready' && (
        <div className={`museum-detail ${revealed ? 'museum-detail--revealed' : ''}`}>
          <div className="museum-detail__image">
            <ArtworkImage artwork={artwork} alt={revealed ? artwork.alt : 'A cropped detail from an unidentified artwork'} />
            {!revealed && <span>ARCHIVE FRAGMENT</span>}
          </div>
          <div className="museum-detail__prompt" aria-live="polite">
            {!revealed ? (
              <>
                <span>CLUE / {artwork.date_display || 'DATE UNKNOWN'}</span>
                <h3>What do you think exists beyond this frame?</h3>
                <p>{artwork.medium_display || 'The medium is being withheld.'}</p>
                <button type="button" onClick={() => setRevealed(true)}>REVEAL THE WORK</button>
              </>
            ) : (
              <>
                <span>FULL RECORD / {artwork.id}</span>
                <h3>{artwork.title}</h3>
                <p>{artwork.artist_display || 'Artist unrecorded'} · {artwork.date_display || 'Date unknown'}</p>
                <a href={artwork.pageUrl} target="_blank" rel="noreferrer">VIEW MUSEUM RECORD ↗</a>
                <button type="button" onClick={() => setSequence((value) => value + 1)}>ANOTHER DETAIL</button>
              </>
            )}
          </div>
        </div>
      )}
    </ExperimentFrame>
  );
}
