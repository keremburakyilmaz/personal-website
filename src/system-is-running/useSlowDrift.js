import { useState, useEffect, useCallback } from 'react';
import { variables } from './variables';
import { loops } from './loops';

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createInitialState() {
  const state = {};
  variables.forEach(v => {
    state[v.key] = randomFrom(v.states);
  });
  return state;
}

export function useSlowDrift() {
  const [variableState, setVariableState] = useState(createInitialState);
  const [currentLoop, setCurrentLoop] = useState(() => randomFrom(loops));
  const [loopRetries, setLoopRetries] = useState(() => Math.floor(Math.random() * 300) + 50);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setVariableState(prev => {
        const next = { ...prev };
        const n = 2 + Math.floor(Math.random() * 3);
        const shuffled = [...variables].sort(() => Math.random() - 0.5);
        for (let i = 0; i < n; i++) {
          next[shuffled[i].key] = randomFrom(shuffled[i].states);
        }
        return next;
      });
    }, 2500);
    return () => clearInterval(id);
  }, [paused]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setLoopRetries(r => r + Math.floor(Math.random() * 4) + 1);
    }, 1200);
    return () => clearInterval(id);
  }, [paused]);

  useEffect(() => {
    if (paused) return;
    const interval = 15000 + Math.random() * 12000;
    const id = setInterval(() => {
      setCurrentLoop(randomFrom(loops));
      setLoopRetries(Math.floor(Math.random() * 40));
    }, interval);
    return () => clearInterval(id);
  }, [paused]);

  const togglePause = useCallback(() => {
    setPaused(p => !p);
  }, []);

  return {
    variableState,
    currentLoop,
    loopRetries,
    paused,
    togglePause
  };
}
