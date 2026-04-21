import { useState, useEffect } from 'react';

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export function useMeters(paused) {
  const [meters, setMeters] = useState({
    cognitive: 78,
    anxiety: 84,
    bandwidth: 22
  });

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setMeters(prev => {
        const spike = Math.random() < 0.15;
        const k = spike ? 14 : 5;
        return {
          cognitive: clamp(prev.cognitive + (Math.random() - 0.4) * k, 55, 100),
          anxiety:   clamp(prev.anxiety   + (Math.random() - 0.4) * k, 60, 100),
          bandwidth: clamp(prev.bandwidth + (Math.random() - 0.6) * k, 5,  45)
        };
      });
    }, 900);
    return () => clearInterval(id);
  }, [paused]);

  return meters;
}
