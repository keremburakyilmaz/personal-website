const clampProbability = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(1, Math.max(0, number));
};

const sourceCopy = {
  model: {
    label: 'Model active',
    detail: 'Ranked model probabilities; they describe direction, not an exact next track.'
  },
  majority_baseline: {
    label: 'Baseline active',
    detail: 'The learned model did not beat the historical majority on the latest temporal holdout.'
  },
  persistence_baseline: {
    label: 'Baseline active',
    detail: 'The learned model did not beat session continuity on the latest temporal holdout.'
  }
};

export function buildPredictionView(prediction = {}) {
  const source = prediction.prediction_source || 'legacy_model';
  const sourceInfo = sourceCopy[source] || {
    label: source.endsWith('_baseline') ? 'Baseline active' : 'Compatible export',
    detail: source.endsWith('_baseline')
      ? 'A verified simple baseline is safer than the current learned model.'
      : 'Awaiting the repaired prediction export; showing the latest compatible estimate.'
  };

  const suppliedDirections = Array.isArray(prediction.mood_distribution)
    ? prediction.mood_distribution
    : [];
  const directions = suppliedDirections
    .filter((direction) => direction && direction.mood_label)
    .map((direction) => ({
      clusterId: direction.mood_cluster_id,
      label: direction.mood_label,
      probability: clampProbability(direction.probability)
    }))
    .sort((left, right) => right.probability - left.probability)
    .slice(0, 3);

  if (directions.length === 0 && prediction.mood_label) {
    directions.push({
      clusterId: prediction.mood_cluster_id,
      label: prediction.mood_label,
      probability: clampProbability(prediction.confidence)
    });
  }

  const confidenceKind = prediction.confidence_kind || 'legacy_model_score';
  const confidenceLabels = {
    validation_accuracy: 'Observed holdout reliability',
    uncalibrated_model_probability: 'Uncalibrated model score',
    legacy_model_score: 'Model score'
  };

  return {
    directions,
    source,
    sourceLabel: sourceInfo.label,
    sourceDetail: sourceInfo.detail,
    isBaseline: source.endsWith('_baseline'),
    confidence: clampProbability(prediction.confidence),
    confidenceLabel: confidenceLabels[confidenceKind] || 'Prediction score',
    modelVersion: prediction.model_version || null
  };
}
