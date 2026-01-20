function getBlockClassName(block) {
  if (block.speaker === 'someone') {
    return 'ending-dialogue';
  }
  if (block.speaker === 'brain' || block.type === 'whisper') {
    return 'ending-whisper';
  }
  return 'ending-text';
}

export default function EndingView({ scene, state, onRestart }) {
  return (
    <div className="ending-view">
      {scene.title && <h1 className="ending-title">{scene.title}</h1>}
      
      <div className="ending-blocks">
        {scene.blocks?.map((block, index) => {
          const className = getBlockClassName(block);
          return (
            <p key={index} className={className}>
              {block.text}
            </p>
          );
        })}
      </div>

      <div className="ending-actions">
        <button className="ending-restart-button" onClick={onRestart}>
          Restart with a different first memory
        </button>
      </div>
    </div>
  );
}


