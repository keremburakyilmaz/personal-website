/**
 * Story validation - checks story.json structure
 */

export function validateStory(story) {
  const errors = [];
  const warnings = [];

  if (!story) {
    errors.push('Story is null or undefined');
    return { valid: false, errors, warnings };
  }

  // Check meta
  if (!story.meta) {
    errors.push('Missing meta object');
  } else {
    if (!story.meta.id) errors.push('Missing meta.id');
    if (!story.meta.title) warnings.push('Missing meta.title');
  }

  // Check startSceneId
  if (!story.startSceneId) {
    errors.push('Missing startSceneId');
  }

  // Check scenes
  if (!story.scenes || !Array.isArray(story.scenes)) {
    errors.push('Missing or invalid scenes array');
    return { valid: false, errors, warnings };
  }

  if (story.scenes.length === 0) {
    errors.push('Scenes array is empty');
  }

  // Build scene map
  const sceneMap = new Map();
  story.scenes.forEach((scene) => {
    if (!scene.id) {
      errors.push('Scene missing id');
      return;
    }
    if (sceneMap.has(scene.id)) {
      errors.push(`Duplicate scene id: ${scene.id}`);
    }
    sceneMap.set(scene.id, scene);
  });

  // Check startSceneId exists
  if (story.startSceneId && !sceneMap.has(story.startSceneId)) {
    errors.push(`startSceneId "${story.startSceneId}" does not exist in scenes`);
  }

  // Validate each scene
  story.scenes.forEach((scene) => {
    validateScene(scene, sceneMap, errors, warnings);
  });

  // Check for unreachable scenes
  if (story.startSceneId) {
    const reachable = findReachableScenes(story.startSceneId, sceneMap);
    const allSceneIds = new Set(sceneMap.keys());
    const unreachable = Array.from(allSceneIds).filter((id) => !reachable.has(id));
    if (unreachable.length > 0) {
      warnings.push(`Unreachable scenes: ${unreachable.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function validateScene(scene, sceneMap, errors, warnings) {
  if (!scene.kind) {
    warnings.push(`Scene ${scene.id} missing kind`);
  }

  const validKinds = ['prompt', 'memory', 'question', 'crossroads', 'reflection', 'ending'];
  if (scene.kind && !validKinds.includes(scene.kind)) {
    warnings.push(`Scene ${scene.id} has invalid kind: ${scene.kind}`);
  }

  // Check choices
  if (scene.choices) {
    if (!Array.isArray(scene.choices)) {
      errors.push(`Scene ${scene.id} has invalid choices (not an array)`);
      return;
    }

    if (scene.choices.length === 0 && scene.kind !== 'ending' && scene.kind !== 'reflection') {
      warnings.push(`Scene ${scene.id} has no choices (may be unreachable)`);
    }

    scene.choices.forEach((choice, index) => {
      if (!choice.id) {
        errors.push(`Scene ${scene.id}, choice ${index} missing id`);
      }
      if (!choice.label) {
        errors.push(`Scene ${scene.id}, choice ${index} missing label`);
      }
      if (!choice.next) {
        if (scene.kind !== 'ending') {
          warnings.push(`Scene ${scene.id}, choice ${index} missing next (may be intentional)`);
        }
      } else if (!sceneMap.has(choice.next)) {
        errors.push(`Scene ${scene.id}, choice ${index} references non-existent scene: ${choice.next}`);
      }

      // Validate conditions
      if (choice.conditions) {
        choice.conditions.forEach((condition, condIndex) => {
          if (!condition.type) {
            errors.push(`Scene ${scene.id}, choice ${index}, condition ${condIndex} missing type`);
          }
        });
      }
    });
  } else if (scene.kind !== 'ending' && scene.kind !== 'reflection') {
    warnings.push(`Scene ${scene.id} has no choices`);
  }
}

function findReachableScenes(startId, sceneMap) {
  const reachable = new Set();
  const visited = new Set();

  function traverse(sceneId) {
    if (visited.has(sceneId) || !sceneMap.has(sceneId)) return;
    visited.add(sceneId);
    reachable.add(sceneId);

    const scene = sceneMap.get(sceneId);
    if (scene.choices) {
      scene.choices.forEach((choice) => {
        if (choice.next) {
          traverse(choice.next);
        }
      });
    }
  }

  traverse(startId);
  return reachable;
}


