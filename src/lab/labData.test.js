import {
  OMEN_CLOSINGS,
  OMEN_OPENINGS,
  OMEN_WEATHER_LINES,
  composeOmen,
  omenClosingFamily,
  weatherFamily,
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

test('omen composition stays coherent across weather and temperature families', () => {
  Object.keys(OMEN_WEATHER_LINES).forEach((weather) => {
    Object.keys(OMEN_CLOSINGS).forEach((closing) => {
      for (let index = 0; index < 50; index += 1) {
        const omen = composeOmen(`test:${weather}:${closing}:${index}`, weather, closing);
        expect(['wait', 'act', 'notice', 'protect', 'release']).toContain(omen.posture);
        expect(['attention', 'timing', 'change', 'boundary', 'evidence']).toContain(omen.motif);
        expect(omen.opening).toBeTruthy();
        expect(omen.weatherLine).toBeTruthy();
        expect(omen.closing).toBeTruthy();
      }
    });
  });
});

test('every authored line remains reachable through a coherent thread', () => {
  const openings = new Set();
  const weatherLines = Object.fromEntries(
    Object.keys(OMEN_WEATHER_LINES).map((weather) => [weather, new Set()])
  );
  const closings = new Set();

  Object.keys(OMEN_WEATHER_LINES).forEach((weather) => {
    Object.keys(OMEN_CLOSINGS).forEach((closing) => {
      for (let index = 0; index < 2000; index += 1) {
        const omen = composeOmen(`coverage:${weather}:${closing}:${index}`, weather, closing);
        openings.add(omen.opening);
        weatherLines[weather].add(omen.weatherLine);
        closings.add(omen.closing);
      }
    });
  });

  expect(OMEN_OPENINGS.filter((line) => !openings.has(line))).toEqual([]);
  Object.entries(OMEN_WEATHER_LINES).forEach(([weather, lines]) => {
    expect(lines.filter((line) => !weatherLines[weather].has(line))).toEqual([]);
  });
  expect(Object.values(OMEN_CLOSINGS).flat().filter((line) => !closings.has(line))).toEqual([]);
});

test('rain showers are not classified as snow', () => {
  [80, 81, 82].forEach((code) => expect(weatherFamily(code)).toBe('rain'));
  [71, 77, 85, 86].forEach((code) => expect(weatherFamily(code)).toBe('snow'));
});

test('action openings never pair with restraint weather lines', () => {
  const openings = [];
  for (let index = 0; index < 500; index += 1) {
    const omen = composeOmen(`regression:${index}`, 'clear', 'warm');
    openings.push(omen.opening);
  }
  expect(openings).not.toContain('What feels late is ready now. It will not remain patient.');
});
