/**
 * Game rules that create the "memory bias" feeling
 */

/**
 * Filter choices based on pressure thresholds.
 * At high pressure, gentle/reflective options become unavailable.
 */
export function filterChoicesByPressure(choices, pressure) {
  if (pressure >= 6) {
    return choices.filter((choice) => {
      const tags = choice.tags || [];
      return !tags.includes('gentle') && !tags.includes('reflective');
    });
  }
  return choices;
}

/**
 * Get intrusive lines based on pressure — the voice you can't silence.
 */
export function getIntrusiveLines(pressure, tone) {
  if (pressure < 6) return [];

  const lines = [
    "The night is running out.",
    "You're editing the memory as you write it.",
    "Which version is this — the third? The fourth?",
    "They can't correct you anymore. That should make this easier. It doesn't.",
  ];

  if (pressure >= 8) {
    lines.push("You can feel the morning coming. The page is still wrong.");
    lines.push("Every sentence you write erases the one that was true.");
  }

  return lines;
}

/**
 * Apply tone to text blocks — under intrusive/sharp tone, whispers gain emphasis
 */
export function applyToneToBlocks(blocks, tone) {
  if (tone === 'intrusive' || tone === 'sharp') {
    return blocks.map((block) => {
      if (block.type === 'whisper') {
        return { ...block, type: 'whisper', emphasis: true };
      }
      return block;
    });
  }
  return blocks;
}
