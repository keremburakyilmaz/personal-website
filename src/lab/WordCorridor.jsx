import { useEffect, useRef, useState } from 'react';
import ExperimentFrame from './ExperimentFrame';

const FALLBACKS = {
  home: ['shelter', 'return', 'familiar', 'distance', 'belonging'],
  silence: ['pause', 'distance', 'unsaid', 'stillness', 'listening'],
  memory: ['trace', 'return', 'fragment', 'afterimage', 'rehearsal'],
  light: ['window', 'signal', 'morning', 'exposure', 'distance'],
};

export default function WordCorridor() {
  const [entry, setEntry] = useState('home');
  const [trail, setTrail] = useState([]);
  const [choices, setChoices] = useState([]);
  const [status, setStatus] = useState('idle');
  const controllerRef = useRef(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const enterWord = async (word) => {
    const cleaned = word.trim().toLowerCase().replace(/[^a-zà-ž'-]/gi, '');
    if (!cleaned) return;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setStatus('loading');
    try {
      const params = new URLSearchParams({ ml: cleaned, max: '12' });
      const response = await fetch(`https://api.datamuse.com/words?${params}`, { signal: controller.signal });
      if (!response.ok) throw new Error('corridor unavailable');
      const payload = await response.json();
      const next = payload
        .map((item) => item.word)
        .filter((candidate) => candidate && candidate !== cleaned && !candidate.includes(' '))
        .slice(0, 7);
      if (!next.length) throw new Error('no doors');
      setTrail((current) => [...current, cleaned].slice(-8));
      setChoices(next);
      setEntry(cleaned);
      setStatus('ready');
    } catch (error) {
      if (error.name === 'AbortError') return;
      const fallback = FALLBACKS[cleaned] || ['elsewhere', 'echo', 'almost', 'return', 'unspoken'];
      setTrail((current) => [...current, cleaned].slice(-8));
      setChoices(fallback);
      setEntry(cleaned);
      setStatus('fallback');
    }
  };

  const submit = (event) => {
    event.preventDefault();
    enterWord(entry);
  };

  const reset = () => {
    controllerRef.current?.abort();
    setEntry('home');
    setTrail([]);
    setChoices([]);
    setStatus('idle');
  };

  return (
    <ExperimentFrame
      number="004"
      title="Word Corridor"
      question="Choose a word. Keep choosing until it becomes somewhere else."
    >
      <form className="lab-input-line" onSubmit={submit}>
        <label htmlFor="corridor-entry">FIRST DOOR</label>
        <div>
          <input
            id="corridor-entry"
            value={entry}
            onChange={(event) => setEntry(event.target.value)}
            maxLength={40}
          />
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'OPENING…' : 'ENTER'}
          </button>
        </div>
      </form>

      {trail.length > 0 && (
        <div className="corridor" aria-live="polite">
          <div className="corridor__trail">
            {trail.map((word, index) => (
              <span key={`${word}-${index}`}>{word}{index < trail.length - 1 ? ' →' : ''}</span>
            ))}
          </div>
          <div className="corridor__doors">
            {choices.map((word) => (
              <button type="button" key={word} onClick={() => enterWord(word)}>{word}</button>
            ))}
          </div>
          {trail.length >= 5 && (
            <blockquote>{trail.join(' / ')}</blockquote>
          )}
          <button className="lab-text-button" type="button" onClick={reset}>RETURN TO ENTRANCE</button>
        </div>
      )}

      {trail.length === 0 && <div className="lab-empty-state">No doors have been opened.</div>}
    </ExperimentFrame>
  );
}
