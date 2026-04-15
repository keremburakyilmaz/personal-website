import ChoiceList from './ChoiceList';

export default function SceneView({ scene, blocks, choices, onChoice, intrusiveLines, tone, pressureTier }) {
  return (
    <div className="scene-view">
      {scene.title && <h1 className="scene-title">{scene.title}</h1>}
      
      <div className="scene-blocks">
        {blocks.map((block, index) => {
          const BlockComponent = getBlockComponent(block.type, block.speaker);
          return (
            <BlockComponent key={index} block={block} tone={tone} />
          );
        })}
      </div>

      {intrusiveLines.length > 0 && (
        <div className="intrusive-lines">
          {intrusiveLines.map((line, index) => (
            <div key={index} className="intrusive-line">
              {line}
            </div>
          ))}
        </div>
      )}

      {choices.length > 0 && (
        <ChoiceList choices={choices} onChoice={onChoice} />
      )}
    </div>
  );
}

function getBlockComponent(type, speaker) {
  if (type === 'whisper' || speaker === 'brain') {
    return WhisperBlock;
  }
  if (speaker === 'someone') {
    return DialogueBlock;
  }
  return ParagraphBlock;
}

function ParagraphBlock({ block, tone }) {
  return <p className="block-paragraph">{block.text}</p>;
}

function DialogueBlock({ block, tone }) {
  return (
    <p className="block-dialogue">
      {block.text}
    </p>
  );
}

function WhisperBlock({ block, tone }) {
  return (
    <p className={`block-whisper ${block.emphasis ? 'emphasis' : ''}`}>
      {block.text}
    </p>
  );
}


