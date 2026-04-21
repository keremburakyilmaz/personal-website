import { useState, useEffect, useRef } from 'react';
import { logLines } from './logLines';

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function useLogStream(paused) {
  const startRef = useRef(Date.now());
  const idRef = useRef(0);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    if (paused) return;
    let timer;
    const tick = () => {
      setLines(prev => {
        const ts = Math.floor((Date.now() - startRef.current) / 1000);
        const next = [...prev, { id: idRef.current++, ts, text: randomFrom(logLines) }];
        return next.slice(-8);
      });
      timer = setTimeout(tick, 500 + Math.random() * 900);
    };
    timer = setTimeout(tick, 300);
    return () => clearTimeout(timer);
  }, [paused]);

  return lines;
}
