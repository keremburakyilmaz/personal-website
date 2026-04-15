/**
 * Initial game state
 */
export const initialState = {
  sceneId: null,
  primacyId: null,
  stats: {
    clarity: 0,
    protection: 0,
    grief: 0,
    resentment: 0,
    doubt: 0,
  },
  clocks: {
    pressure: 0,
  },
  flags: {},
  weights: {},
  memories: [],
  history: [],
};

/**
 * Create a fresh game state
 */
export function createInitialState(startSceneId) {
  return {
    ...initialState,
    sceneId: startSceneId,
  };
}


