import { useEffect, useRef } from 'react';

export default function ChoiceList({ choices, onChoice }) {
  const containerRef = useRef(null);
  const choiceRefs = useRef([]);

  const handleKeyDown = (e, index) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = Math.min(index + 1, choices.length - 1);
        choiceRefs.current[nextIndex]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = Math.max(index - 1, 0);
        choiceRefs.current[prevIndex]?.focus();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onChoice(choices[index]);
        break;
      default:
        break;
    }
  };

  return (
    <div className="choice-list" ref={containerRef} role="listbox">
      {choices.map((choice, index) => (
        <button
          key={choice.id}
          ref={(el) => (choiceRefs.current[index] = el)}
          className="choice-button"
          onClick={() => onChoice(choice)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          role="option"
          tabIndex={index === 0 ? 0 : -1}
        >
          {choice.label}
        </button>
      ))}
    </div>
  );
}


