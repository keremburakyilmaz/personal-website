import { useState, useEffect, useRef } from 'react';
import { processNames } from './processes';

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeProc(pid) {
  const stuck = Math.random() < 0.35;
  const interrupted = !stuck && Math.random() < 0.18;
  return {
    pid,
    name: randomFrom(processNames),
    state: stuck ? 'looping' : interrupted ? 'interrupt' : 'running',
    stuck,
    retries: stuck ? Math.floor(Math.random() * 400) + 40 : 0,
    age: 0,
    ttl: stuck ? Infinity : Math.floor(Math.random() * 8) + 3
  };
}

export function useProcesses(paused) {
  const pidRef = useRef(1000);
  const [procs, setProcs] = useState(() => {
    const arr = [];
    for (let i = 0; i < 7; i++) {
      arr.push(makeProc(pidRef.current++));
    }
    return arr;
  });

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setProcs(prev => {
        let next = prev
          .map(p => ({
            ...p,
            age: p.age + 1,
            retries: p.stuck ? p.retries + Math.floor(Math.random() * 6) + 1 : p.retries
          }))
          .filter(p => p.age < p.ttl);

        const spawnN = Math.random() < 0.5 ? 2 : 1;
        for (let i = 0; i < spawnN; i++) {
          next.push(makeProc(pidRef.current++));
        }
        if (next.length > 9) next = next.slice(-9);
        return next;
      });
    }, 1700);
    return () => clearInterval(id);
  }, [paused]);

  return procs;
}
