import { useEffect } from 'react';
import ChoiceList from './ChoiceList';

function getBlockClassName(block) {
  if (block.speaker === 'someone') {
    return 'content-note-dialogue';
  }
  if (block.speaker === 'brain' || block.type === 'whisper') {
    return 'content-note-whisper';
  }
  return 'content-note-text';
}

export default function ContentNote({ scene, choices, onChoice, skipNote }) {
  useEffect(() => {
    if (skipNote) {
      // If skip flag is set, auto-advance to first choice
      const firstChoice = choices[0];
      if (firstChoice) {
        onChoice(firstChoice);
      }
    }
  }, [skipNote, choices, onChoice]);

  if (skipNote) {
    return null;
  }

  return (
    <div className="content-note">
      {scene.title && <h1 className="content-note-title">{scene.title}</h1>}
      
      <div className="content-note-blocks">
        {scene.blocks?.map((block, index) => {
          const className = getBlockClassName(block);
          return (
            <p key={index} className={className}>
              {block.text}
            </p>
          );
        })}
      </div>

      {choices.length > 0 && (
        <ChoiceList choices={choices} onChoice={onChoice} />
      )}
    </div>
  );
}

