/**
 * Initial game state
 */
export const initialState = {
  sceneId: null,
  primacyId: null,
  stats: {
    honesty: 0,
    avoidance: 0,
    tenderness: 0,
    anger: 0,
    shame: 0,
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


