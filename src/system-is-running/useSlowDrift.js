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
  const [paused, setPaused] = useState(false);

  // Slow variable drift - every 20 seconds
  useEffect(() => {
    if (paused) return;

    const id = setInterval(() => {
      setVariableState(prev => {
        const newState = { ...prev };
        // Update 1-2 random variables each cycle
        const numToUpdate = Math.random() > 0.5 ? 2 : 1;
        const shuffled = [...variables].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < numToUpdate; i++) {
          const v = shuffled[i];
          newState[v.key] = randomFrom(v.states);
        }
        return newState;
      });
    }, 20000);

    return () => clearInterval(id);
  }, [paused]);

  // Slow loop drift - every 60-90 seconds
  useEffect(() => {
    if (paused) return;

    const interval = 60000 + Math.random() * 30000; // 60-90 seconds
    const id = setInterval(() => {
      setCurrentLoop(randomFrom(loops));
    }, interval);

    return () => clearInterval(id);
  }, [paused]);

  const togglePause = useCallback(() => {
    setPaused(p => !p);
  }, []);

  return {
    variableState,
    currentLoop,
    paused,
    togglePause
  };
}
