/**
 * Game rules that create the "memory bias" feeling
 */

/**
 * Primacy lock: first memory choice sets primacyId permanently
 * (Handled in reducer - primacyId can only be set once)
 */

/**
 * Weighting: supporting choices raise avoidance; contradictory choices raise honesty + pressure
 * (Handled via effects in story.json)
 */

/**
 * Suppression: suppressing contradictions raises avoidance + pressure and sets a suppress-flag
 * (Handled via effects in story.json)
 */

/**
 * Drift: derived "tone" tag from stats that affects text rendering + available choices
 * (Handled in selectors.getDerivedTone)
 */

/**
 * Pressure thresholds: at pressure >= 6, remove certain "gentle/reflective" options; add intrusive lines
 * (Handled via conditions in story.json choices)
 */

/**
 * Filter choices based on pressure thresholds
 */
export function filterChoicesByPressure(choices, pressure) {
  if (pressure >= 6) {
    // Remove gentle/reflective options at high pressure
    return choices.filter((choice) => {
      const tags = choice.tags || [];
      return !tags.includes('gentle') && !tags.includes('reflective');
    });
  }
  return choices;
}

/**
 * Get intrusive lines based on pressure
 */
export function getIntrusiveLines(pressure, tone) {
  if (pressure < 6) return [];

  const lines = [
    "You feel the story pulling at you.",
    "Something doesn't fit.",
    "The memory shifts when you look away.",
    "You're editing as you speak.",
  ];

  if (pressure >= 8) {
    lines.push("The contradiction won't stay buried.");
    lines.push("You can feel the weight of what you're not saying.");
  }

  return lines;
}

/**
 * Apply tone to text blocks
 */
export function applyToneToBlocks(blocks, tone) {
  if (tone === 'intrusive' || tone === 'sharp') {
    // Add subtle emphasis to certain blocks
    return blocks.map((block) => {
      if (block.type === 'whisper') {
        return { ...block, type: 'whisper', emphasis: true };
      }
      return block;
    });
  }
  return blocks;
}


