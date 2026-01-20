import ChoiceList from './ChoiceList';
import { getDerivedTone, getPressureTier } from '../engine/selectors';
import reflectionLinesData from '../data/reflectionLines.json';

function getBlockClassName(block) {
  if (block.speaker === 'someone') {
    return 'reflection-dialogue';
  }
  if (block.speaker === 'brain' || block.type === 'whisper') {
    return 'reflection-whisper';
  }
  return 'reflection-text';
}

export default function ReflectionView({ scene, state, choices, onChoice }) {
  const tone = getDerivedTone(state);

  // Generate reflection lines based on state using reflectionLines.json
  const reflectionLines = generateReflectionLines(state, tone);

  return (
    <div className="reflection-view">
      {scene.title && <h1 className="reflection-title">{scene.title}</h1>}
      
      <div className="reflection-blocks">
        {scene.blocks?.map((block, index) => {
          const className = getBlockClassName(block);
          return (
            <p key={index} className={className}>
              {block.text}
            </p>
          );
        })}
      </div>

      <div className="reflection-lines">
        {reflectionLines.map((line, index) => (
          <p key={index} className="reflection-line">
            {line}
          </p>
        ))}
      </div>

      {choices.length > 0 && (
        <ChoiceList choices={choices} onChoice={onChoice} />
      )}
    </div>
  );
}

function generateReflectionLines(state, tone) {
  const lines = [];
  const { honesty, avoidance, tenderness, anger, shame } = state.stats;
  const pressureTier = getPressureTier(state);

  // 1. Primacy-based lines (if primacy is set)
  if (state.primacyId && reflectionLinesData.primacy[state.primacyId]) {
    const primacyLines = reflectionLinesData.primacy[state.primacyId];
    // Pick 1-2 random lines from primacy
    const selected = shuffleArray([...primacyLines]).slice(0, Math.min(2, primacyLines.length));
    lines.push(...selected);
  }

  // 2. Dominant stat lines
  const stats = { honesty, avoidance, tenderness, anger, shame };
  const dominantStat = Object.entries(stats).reduce((a, b) => (stats[a[0]] > stats[b[0]] ? a : b))[0];
  const dominantValue = stats[dominantStat];
  
  if (dominantValue > 2 && reflectionLinesData.dominant[dominantStat]) {
    const dominantLines = reflectionLinesData.dominant[dominantStat];
    const selected = shuffleArray([...dominantLines])[0];
    if (selected) lines.push(selected);
  }

  // 3. Suppression lines
  const hasSuppression = Object.keys(state.flags).some((flag) =>
    flag.includes('suppressed') || flag.includes('postponed')
  );
  const suppressionKey = hasSuppression ? 'present' : 'absent';
  if (reflectionLinesData.suppression[suppressionKey]) {
    const suppressionLines = reflectionLinesData.suppression[suppressionKey];
    const selected = shuffleArray([...suppressionLines])[0];
    if (selected) lines.push(selected);
  }

  // 4. Pressure tier lines
  const pressureKey = pressureTier === 'high' ? 'high' : pressureTier === 'medium' ? 'mid' : 'low';
  if (reflectionLinesData.pressureTier[pressureKey]) {
    const pressureLines = reflectionLinesData.pressureTier[pressureKey];
    const selected = shuffleArray([...pressureLines])[0];
    if (selected) lines.push(selected);
  }

  // Default if no lines were selected
  if (lines.length === 0) {
    lines.push("You told the story as it came to you.");
  }

  return lines;
}

// Helper function to shuffle array (Fisher-Yates)
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


