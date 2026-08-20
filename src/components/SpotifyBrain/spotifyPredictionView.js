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
  two_stage_model: {
    label: 'Switch model active',
    detail: 'A calibrated model first estimates continuation versus switching, then ranks likely destination moods.'
  },
  majority_baseline: {
    label: 'History baseline',
    detail: 'Recent context did not beat the recency-weighted historical distribution on the latest temporal holdout.'
  },
  persistence_baseline: {
    label: 'Continuity baseline',
    detail: 'The learned model did not beat session continuity on the latest temporal holdout.'
  },
  contextual_transition_baseline: {
    label: 'Context baseline',
    detail: 'A smoothed recent-sequence and time-context transition is more reliable than the learned model.'
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
    calibrated_model_probability: 'Calibrated likelihood',
    estimated_baseline_probability: 'Estimated likelihood',
    legacy_model_score: 'Model score'
  };

  const predictability = ['high', 'medium', 'low'].includes(prediction.predictability)
    ? prediction.predictability
    : null;
  const contextLabels = {
    seq3: 'three-track, time and session context',
    seq2: 'two-track and time context',
    last: 'latest-mood context',
    global: 'global listening history'
  };

  return {
    directions,
    source,
    sourceLabel: sourceInfo.label,
    sourceDetail: sourceInfo.detail,
    isBaseline: source.endsWith('_baseline'),
    confidence: clampProbability(prediction.confidence),
    confidenceLabel: confidenceLabels[confidenceKind] || 'Prediction score',
    modelVersion: prediction.model_version || null,
    validationReliability: prediction.validation_reliability == null
      ? null
      : clampProbability(prediction.validation_reliability),
    predictability,
    predictabilityLabel: predictability
      ? `${predictability[0].toUpperCase()}${predictability.slice(1)} predictability`
      : null,
    normalizedEntropy: prediction.normalized_entropy == null
      ? null
      : clampProbability(prediction.normalized_entropy),
    abstained: prediction.abstained === true,
    switchProbability: prediction.switch_probability == null
      ? null
      : clampProbability(prediction.switch_probability),
    contextLevel: prediction.context_level || null,
    contextDescription: contextLabels[prediction.context_level] || null,
    recentWindowSize: Number.isFinite(Number(prediction.recent_window_size))
      ? Number(prediction.recent_window_size)
      : null
  };
}
