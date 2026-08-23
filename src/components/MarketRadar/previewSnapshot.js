function isoFrom(now, offsetHours) {
  return new Date(now.getTime() + (offsetHours * 60 * 60 * 1000)).toISOString();
}

function makeSource(id, name, sourceUrl, retrievedAt) {
  return {
    sourceId: id,
    sourceName: name,
    sourceType: 'official',
    sourceUrl,
    retrievedAt,
  };
}

export function createPreviewSnapshot(now = new Date()) {
  const generatedAt = isoFrom(now, 0);
  const observedAt = isoFrom(now, -15);
  const retrievedAt = isoFrom(now, -1);
  const validUntil = isoFrom(now, 6.5);
  const treasury = makeSource(
    'us-treasury-rates',
    'U.S. Department of the Treasury',
    'https://home.treasury.gov/resource-center/data-chart-center/interest-rates',
    retrievedAt,
  );
  const fred = makeSource(
    'federal-reserve-broad-dollar',
    'Federal Reserve Bank of St. Louis',
    'https://fred.stlouisfed.org/series/DTWEXBGS',
    retrievedAt,
  );
  const cbrt = makeSource(
    'cbrt-usd-try',
    'Central Bank of the Republic of Türkiye',
    'https://www.tcmb.gov.tr/',
    retrievedAt,
  );
  const indicator = (id, label, displayValue, change, macroSignal, source, tags) => ({
    id,
    label,
    rawValue: Number.parseFloat(displayValue),
    displayValue,
    unit: 'preview',
    change: { rawValue: 0, displayValue: change, period: 'previous-observation', direction: 'flat' },
    observedAt,
    retrievedAt,
    freshness: { status: 'fresh', ageSeconds: 3600, maxAgeSeconds: 172800 },
    macroSignal,
    source,
    marketTags: tags,
  });

  return {
    schemaVersion: 1,
    id: 'mr-20990101t000000z',
    generatedAt,
    validUntil,
    pipeline: {
      runId: 'run-design-preview',
      status: 'healthy',
      startedAt: isoFrom(now, -0.5),
      completedAt: generatedAt,
      coverage: {
        expectedSources: 9,
        successfulSources: 7,
        staleSources: 1,
        failedSources: 1,
        marketTags: ['global', 'united-states', 'turkey', 'rates', 'fx'],
      },
      publicNote: 'Local interface preview. All displayed values are illustrative.',
    },
    macroConditions: {
      score: 55,
      label: 'balanced',
      summary: 'Rate levels keep conditions firm while a positively sloped U.S. curve offsets part of the pressure. The Turkey-specific currency input remains isolated from the global readout.',
      scoreScale: {
        minimum: 0,
        maximum: 100,
        higherMeans: 'More restrictive macro-financial conditions',
      },
      methodology: {
        id: 'macro-conditions-v1',
        version: '1.0.0',
        description: 'Deterministic weighted score built only from published macro indicators.',
        baselineScore: 50,
        formula: 'score = clamp(baselineScore + sum(driver contributionPoints), 0, 100)',
      },
      drivers: [],
    },
    indicators: [
      indicator('us-treasury-2y', 'U.S. Treasury 2Y', '4.25%', '-3 bp', 'tightening', treasury, ['global', 'united-states', 'rates']),
      indicator('us-treasury-10y', 'U.S. Treasury 10Y', '4.50%', '-2 bp', 'tightening', treasury, ['global', 'united-states', 'rates']),
      indicator('us-curve-2s10s', 'U.S. 2Y–10Y curve', '+25 bp', '+1 bp', 'easing', treasury, ['global', 'united-states', 'rates']),
      indicator('fed-broad-usd', 'Broad U.S. dollar', '110.40', '+0.20', 'tightening', fred, ['global', 'united-states', 'fx']),
      indicator('cbrt-usd-try', 'CBRT USD/TRY', '35.5000', '+0.0800', 'tightening', cbrt, ['turkey', 'fx']),
    ],
    priorityDevelopments: [],
    stories: [],
    calendar: [],
    digest: {
      id: 'digest-design-preview',
      periodStart: isoFrom(now, -24),
      periodEnd: generatedAt,
      generatedAt,
      title: 'Illustrative engine readout',
      summary: 'Design preview only.',
      highlights: [],
      storyIds: [],
      itemCount: 0,
      marketTags: ['global'],
    },
    sources: [],
  };
}
