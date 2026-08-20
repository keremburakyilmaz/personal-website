import { buildPredictionView } from './spotifyPredictionView';

test('keeps the legacy dashboard export readable', () => {
  const view = buildPredictionView({
    mood_cluster_id: 2,
    mood_label: 'Low energy, negative',
    confidence: 0.55
  });

  expect(view.sourceLabel).toBe('Compatible export');
  expect(view.confidenceLabel).toBe('Model score');
  expect(view.directions).toEqual([
    { clusterId: 2, label: 'Low energy, negative', probability: 0.55 }
  ]);
});

test('sorts repaired distributions and identifies a baseline honestly', () => {
  const view = buildPredictionView({
    prediction_source: 'majority_baseline',
    confidence_kind: 'validation_accuracy',
    confidence: 0.604,
    model_version: '13d2d314',
    mood_distribution: [
      { mood_cluster_id: 0, mood_label: 'High energy, negative', probability: 0.09 },
      { mood_cluster_id: 1, mood_label: 'High energy, neutral', probability: 0.63 },
      { mood_cluster_id: 2, mood_label: 'Low energy, acoustic', probability: 0.28 }
    ]
  });

  expect(view.isBaseline).toBe(true);
  expect(view.sourceLabel).toBe('History baseline');
  expect(view.confidenceLabel).toBe('Observed holdout reliability');
  expect(view.directions.map((direction) => direction.clusterId)).toEqual([1, 2, 0]);
});

test('does not describe an uncalibrated score as confidence', () => {
  const view = buildPredictionView({
    prediction_source: 'model',
    confidence_kind: 'uncalibrated_model_probability',
    confidence: 1.4
  });

  expect(view.confidence).toBe(1);
  expect(view.confidenceLabel).toBe('Uncalibrated model score');
  expect(view.sourceDetail).toMatch(/not an exact next track/i);
});

test('exposes contextual reliability, uncertainty and abstention separately', () => {
  const view = buildPredictionView({
    prediction_source: 'contextual_transition_baseline',
    confidence_kind: 'estimated_baseline_probability',
    confidence: 0.42,
    validation_reliability: 0.61,
    predictability: 'low',
    normalized_entropy: 0.91,
    abstained: true,
    switch_probability: 0.73,
    context_level: 'seq3',
    recent_window_size: 5
  });

  expect(view.sourceLabel).toBe('Context baseline');
  expect(view.confidenceLabel).toBe('Estimated likelihood');
  expect(view.validationReliability).toBe(0.61);
  expect(view.predictabilityLabel).toBe('Low predictability');
  expect(view.abstained).toBe(true);
  expect(view.switchProbability).toBe(0.73);
  expect(view.contextDescription).toMatch(/three-track/i);
  expect(view.recentWindowSize).toBe(5);
});

test('describes the two-stage switch model without calling it a baseline', () => {
  const view = buildPredictionView({ prediction_source: 'two_stage_model' });

  expect(view.sourceLabel).toBe('Switch model active');
  expect(view.isBaseline).toBe(false);
  expect(view.sourceDetail).toMatch(/continuation versus switching/i);
});
