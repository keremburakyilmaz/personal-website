import { useReducer, useEffect, useState } from 'react';
import { gameReducer } from '../engine/reducer';
import { createInitialState } from '../engine/state';
import { saveGameState, loadGameState, clearGameState } from '../engine/persistence';
import { validateStory } from '../engine/validateStory';
import { getCurrentScene, getAvailableChoices, getDerivedTone, getPressureTier } from '../engine/selectors';
import { filterChoicesByPressure, getIntrusiveLines, applyToneToBlocks } from '../engine/rules';
import SceneView from './SceneView';
import ContentNote from './ContentNote';
import ReflectionView from './ReflectionView';
import EndingView from './EndingView';
import SettingsDrawer from './SettingsDrawer';
import storyData from '../data/story.json';
import '../styles/game.css';

export default function GameRoute() {
  const [state, dispatch] = useReducer(
    gameReducer,
    null,
    () => {
      const saved = loadGameState();
      if (saved) {
        return saved;
      }
      return createInitialState(storyData.startSceneId);
    }
  );

  const [showSettings, setShowSettings] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  // Validate story on mount
  useEffect(() => {
    const result = validateStory(storyData);
    setValidationResult(result);
    if (!result.valid && process.env.NODE_ENV === 'development') {
      console.error('Story validation errors:', result.errors);
      console.warn('Story validation warnings:', result.warnings);
    }
  }, []);

  // Save state after every change
  useEffect(() => {
    if (state.sceneId) {
      saveGameState(state);
    }
  }, [state]);

  const handleChoice = (choice) => {
    // Apply effects
    if (choice.effects) {
      dispatch({ type: 'APPLY_EFFECTS', payload: { effects: choice.effects } });
    }

    // Navigate
    if (choice.next) {
      dispatch({ type: 'NAVIGATE', payload: { sceneId: choice.next } });
    }
  };

  const handleRestart = () => {
    clearGameState();
    dispatch({ type: 'RESET', payload: { startSceneId: storyData.startSceneId } });
  };

  const scene = getCurrentScene(state, storyData);
  if (!scene) {
    return <div className="game-container">Loading...</div>;
  }

  const availableChoices = getAvailableChoices(state, scene);
  const filteredChoices = filterChoicesByPressure(availableChoices, state.clocks.pressure || 0);
  const tone = getDerivedTone(state);
  const pressureTier = getPressureTier(state);
  const intrusiveLines = getIntrusiveLines(state.clocks.pressure || 0, tone);
  const blocksWithTone = applyToneToBlocks(scene.blocks || [], tone);

  // Route to appropriate view based on scene kind
  if (scene.kind === 'prompt' && scene.id === 'p_content_note') {
    return (
      <div className="game-container">
        <ContentNote
          scene={scene}
          choices={filteredChoices}
          onChoice={handleChoice}
          skipNote={state.flags.skip_content_note}
        />
        {process.env.NODE_ENV === 'development' && (
          <button
            className="dev-settings-toggle"
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Toggle settings"
          >
            ⚙️
          </button>
        )}
        {showSettings && (
          <SettingsDrawer
            state={state}
            onClose={() => setShowSettings(false)}
            onRestart={handleRestart}
            validationResult={validationResult}
          />
        )}
      </div>
    );
  }

  if (scene.kind === 'reflection') {
    return (
      <div className="game-container">
        <ReflectionView
          scene={scene}
          state={state}
          choices={filteredChoices}
          onChoice={handleChoice}
        />
        {process.env.NODE_ENV === 'development' && (
          <button
            className="dev-settings-toggle"
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Toggle settings"
          >
            ⚙️
          </button>
        )}
        {showSettings && (
          <SettingsDrawer
            state={state}
            onClose={() => setShowSettings(false)}
            onRestart={handleRestart}
            validationResult={validationResult}
          />
        )}
      </div>
    );
  }

  if (scene.kind === 'ending') {
    return (
      <div className="game-container">
        <EndingView
          scene={scene}
          state={state}
          onRestart={handleRestart}
        />
        {process.env.NODE_ENV === 'development' && (
          <button
            className="dev-settings-toggle"
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Toggle settings"
          >
            ⚙️
          </button>
        )}
        {showSettings && (
          <SettingsDrawer
            state={state}
            onClose={() => setShowSettings(false)}
            onRestart={handleRestart}
            validationResult={validationResult}
          />
        )}
      </div>
    );
  }

  // Default: SceneView for prompt, memory, question, crossroads
  return (
    <div className="game-container">
      <SceneView
        scene={scene}
        blocks={blocksWithTone}
        choices={filteredChoices}
        onChoice={handleChoice}
        intrusiveLines={intrusiveLines}
        tone={tone}
        pressureTier={pressureTier}
      />
      {process.env.NODE_ENV === 'development' && (
        <button
          className="dev-settings-toggle"
          onClick={() => setShowSettings(!showSettings)}
          aria-label="Toggle settings"
        >
          ⚙️
        </button>
      )}
      {showSettings && (
        <SettingsDrawer
          state={state}
          onClose={() => setShowSettings(false)}
          onRestart={handleRestart}
          validationResult={validationResult}
        />
      )}
    </div>
  );
}


