/**
 * Persistence layer for game state
 */

const STORAGE_KEY = 'what-you-remember-game-state';

/**
 * Save game state to localStorage
 */
export function saveGameState(state) {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.warn('Failed to save game state:', error);
  }
}

/**
 * Load game state from localStorage
 */
export function loadGameState() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized) {
      return JSON.parse(serialized);
    }
  } catch (error) {
    console.warn('Failed to load game state:', error);
  }
  return null;
}

/**
 * Clear saved game state
 */
export function clearGameState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear game state:', error);
  }
}

/**
 * Check if there's a saved game
 */
export function hasSavedGame() {
  return localStorage.getItem(STORAGE_KEY) !== null;
}


