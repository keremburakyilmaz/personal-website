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
  expect(view.sourceLabel).toBe('Baseline active');
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
