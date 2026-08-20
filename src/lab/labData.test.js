import {
  OMEN_CLOSINGS,
  OMEN_OPENINGS,
  OMEN_WEATHER_LINES,
  composeOmen,
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

test('omen composition stays coherent across weather and temperature families', () => {
  Object.keys(OMEN_WEATHER_LINES).forEach((weather) => {
    Object.keys(OMEN_CLOSINGS).forEach((closing) => {
      for (let index = 0; index < 50; index += 1) {
        const omen = composeOmen(`test:${weather}:${closing}:${index}`, weather, closing);
        expect(['wait', 'act', 'notice', 'protect', 'release']).toContain(omen.posture);
        expect(omen.opening).toBeTruthy();
        expect(omen.weatherLine).toBeTruthy();
        expect(omen.closing).toBeTruthy();
      }
    });
  });
});

test('action openings never pair with restraint weather lines', () => {
  const openings = [];
  for (let index = 0; index < 500; index += 1) {
    const omen = composeOmen(`regression:${index}`, 'clear', 'warm');
    openings.push(omen.opening);
  }
  expect(openings).not.toContain('What feels late is ready now. It will not remain patient.');
});
