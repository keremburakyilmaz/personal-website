import { initialState } from './state';

/**
 * Game state reducer
 */
export function gameReducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...state, ...action.payload };

    case 'NAVIGATE':
      return {
        ...state,
        sceneId: action.payload.sceneId,
        history: [...state.history, { sceneId: state.sceneId, timestamp: Date.now() }],
      };

    case 'APPLY_EFFECTS':
      return applyEffects(state, action.payload.effects);

    case 'RESET':
      return {
        ...initialState,
        sceneId: action.payload.startSceneId || state.sceneId,
      };

    default:
      return state;
  }
}

/**
 * Apply effects to state
 */
function applyEffects(state, effects) {
  let newState = { ...state };

  if (effects.set) {
    Object.entries(effects.set).forEach(([key, value]) => {
      if (key === 'primacyId' && !newState.primacyId) {
        // Primacy lock: can only be set once
        newState.primacyId = value;
      } else if (key !== 'primacyId') {
        newState[key] = value;
      }
    });
  }

  if (effects.addStats) {
    newState.stats = { ...newState.stats };
    Object.entries(effects.addStats).forEach(([stat, value]) => {
      newState.stats[stat] = (newState.stats[stat] || 0) + value;
    });
  }

  if (effects.addClock) {
    newState.clocks = { ...newState.clocks };
    Object.entries(effects.addClock).forEach(([clock, value]) => {
      newState.clocks[clock] = (newState.clocks[clock] || 0) + value;
    });
  }

  if (effects.setFlags) {
    newState.flags = { ...newState.flags };
    effects.setFlags.forEach((flag) => {
      newState.flags[flag] = true;
    });
  }

  if (effects.addWeights) {
    newState.weights = { ...newState.weights };
    Object.entries(effects.addWeights).forEach(([weight, value]) => {
      newState.weights[weight] = (newState.weights[weight] || 0) + value;
    });
  }

  if (effects.addMemory) {
    newState.memories = [...newState.memories, effects.addMemory];
  }

  return newState;
}


