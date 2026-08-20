import {
  OMEN_CLOSINGS,
  OMEN_OPENINGS,
  OMEN_WEATHER_LINES,
  omenClosingFamily,
} from './labData';

test('omen vocabulary has the intended authored range', () => {
  expect(OMEN_OPENINGS).toHaveLength(32);
  expect(Object.values(OMEN_WEATHER_LINES)).toHaveLength(6);
  Object.values(OMEN_WEATHER_LINES).forEach((lines) => expect(lines).toHaveLength(8));
  expect(Object.values(OMEN_CLOSINGS).flat()).toHaveLength(12);
});

test('omen closings follow daylight and temperature', () => {
  expect(omenClosingFamily(6, 1)).toBe('cold');
  expect(omenClosingFamily(18, 1)).toBe('mild');
  expect(omenClosingFamily(29, 1)).toBe('warm');
  expect(omenClosingFamily(29, 0)).toBe('night');
});
