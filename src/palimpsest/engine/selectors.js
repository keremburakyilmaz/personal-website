/**
 * Selectors for game state
 */

export function getCurrentScene(state, story) {
  if (!state.sceneId || !story?.scenes) return null;
  return story.scenes.find((scene) => scene.id === state.sceneId);
}

export function getAvailableChoices(state, scene) {
  if (!scene?.choices) return [];

  return scene.choices.filter((choice) => {
    if (!choice.conditions) return true;

    return choice.conditions.every((condition) => {
      return evaluateCondition(state, condition);
    });
  });
}

export function evaluateCondition(state, condition) {
  switch (condition.type) {
    case 'flag':
      if (condition.op === 'isTrue') {
        return !!state.flags[condition.flag];
      }
      if (condition.op === 'isFalse') {
        return !state.flags[condition.flag];
      }
      return false;

    case 'stat':
      const statValue = state.stats[condition.stat] || 0;
      return compareValues(statValue, condition.op, condition.value);

    case 'clock':
      const clockValue = state.clocks[condition.clock] || 0;
      return compareValues(clockValue, condition.op, condition.value);

    case 'primacy':
      if (condition.op === 'equals') {
        return state.primacyId === condition.value;
      }
      if (condition.op === 'notEquals') {
        return state.primacyId !== condition.value;
      }
      return false;

    default:
      return true;
  }
}

function compareValues(actual, op, expected) {
  switch (op) {
    case '>=':
      return actual >= expected;
    case '<=':
      return actual <= expected;
    case '>':
      return actual > expected;
    case '<':
      return actual < expected;
    case '===':
    case '==':
      return actual === expected;
    case '!==':
    case '!=':
      return actual !== expected;
    default:
      return true;
  }
}

export function getDerivedTone(state) {
  const { clarity, protection, grief, resentment, doubt, pressure } = {
    ...state.stats,
    pressure: state.clocks.pressure || 0,
  };

  if (pressure >= 6) return 'intrusive';
  if (clarity > protection && clarity > 3) return 'honest';
  if (protection > clarity && protection > 3) return 'protective';
  if (grief > resentment && grief > 2) return 'tender';
  if (resentment > grief && resentment > 2) return 'sharp';
  if (doubt > 3) return 'guilty';
  return 'neutral';
}

export function getPressureTier(state) {
  const pressure = state.clocks.pressure || 0;
  if (pressure >= 8) return 'high';
  if (pressure >= 6) return 'medium';
  if (pressure >= 3) return 'low';
  return 'none';
}


