export const DEFAULT_MANIFEST_URL = 'https://radar-data.keremburakyilmaz.com/v1/latest.json';

const SNAPSHOT_PATH_PATTERN = /^v1\/snapshots\/\d{4}\/\d{2}\/\d{2}\/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}Z-[a-f0-9]{64}\.json$/;

export class MarketRadarDataError extends Error {
  constructor(message) {
    super(message);
    this.name = 'MarketRadarDataError';
  }
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasOnlyKeys(value, allowedKeys) {
  return Object.keys(value).every((key) => allowedKeys.includes(key));
}

function hasOwn(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function isTimestamp(value) {
  if (typeof value !== 'string'
      || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?Z$/.test(value)) {
    return false;
  }

  const parsed = Date.parse(value);
  return Number.isFinite(parsed)
    && new Date(parsed).toISOString().slice(0, 19) === value.slice(0, 19);
}

function isSafeText(value, maximum) {
  return typeof value === 'string'
    && value.length > 0
    && value.length <= maximum
    && !/[<>]/.test(value)
    && !/javascript:/i.test(value);
}

function isIdentifier(value) {
  return isSafeText(value, 96)
    && value.length >= 2
    && /^[a-z0-9][a-z0-9._:-]*$/.test(value);
}

function isSlug(value) {
  return isSafeText(value, 48)
    && value.length >= 2
    && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function isNumberBetween(value, minimum, maximum) {
  return Number.isFinite(value) && value >= minimum && value <= maximum;
}

function isIntegerBetween(value, minimum, maximum) {
  return Number.isInteger(value) && value >= minimum && value <= maximum;
}

function isArrayBetween(value, minimum, maximum, predicate) {
  return Array.isArray(value)
    && value.length >= minimum
    && value.length <= maximum
    && value.every(predicate);
}

function isHttpsUrl(value) {
  if (!isSafeText(value, 500)
      || value.length < 12
      || !/^https:\/\/(?![^/]*@)[^\s<>]+$/.test(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

function hasMarketTags(value) {
  return isArrayBetween(value, 1, 12, isSlug) && new Set(value).size === value.length;
}

function isProvenance(value) {
  return isObject(value)
    && hasOnlyKeys(value, ['sourceId', 'sourceName', 'sourceType', 'sourceUrl', 'retrievedAt'])
    && isIdentifier(value.sourceId)
    && isSafeText(value.sourceName, 80)
    && ['official', 'public-data', 'news'].includes(value.sourceType)
    && isHttpsUrl(value.sourceUrl)
    && isTimestamp(value.retrievedAt);
}

function isOfficialSource(value) {
  return isProvenance(value) && value.sourceType === 'official';
}

function isImpact(value) {
  return ['low', 'medium', 'high'].includes(value);
}

function isNullableDisplayText(value) {
  return value === null || isSafeText(value, 48);
}

function isIndicatorChange(value) {
  return value === null || (
    isObject(value)
    && hasOnlyKeys(value, ['rawValue', 'displayValue', 'period', 'direction'])
    && isNumberBetween(value.rawValue, -1_000_000_000, 1_000_000_000)
    && isSafeText(value.displayValue, 32)
    && ['previous-observation', 'one-day', 'one-week'].includes(value.period)
    && ['up', 'down', 'flat'].includes(value.direction)
  );
}

function isFreshness(value) {
  return isObject(value)
    && hasOnlyKeys(value, ['status', 'ageSeconds', 'maxAgeSeconds'])
    && ['fresh', 'stale'].includes(value.status)
    && isIntegerBetween(value.ageSeconds, 0, 2_592_000)
    && isIntegerBetween(value.maxAgeSeconds, 60, 1_209_600);
}

function isDriver(value) {
  return isObject(value)
    && hasOnlyKeys(value, [
      'indicatorId',
      'label',
      'weight',
      'normalizedSignal',
      'contributionPoints',
      'direction',
      'explanation',
      'marketTags',
    ])
    && isIdentifier(value.indicatorId)
    && isSafeText(value.label, 80)
    && Number.isFinite(value.weight)
    && value.weight > 0
    && value.weight <= 1
    && isNumberBetween(value.normalizedSignal, -1, 1)
    && isNumberBetween(value.contributionPoints, -50, 50)
    && ['supportive', 'balanced', 'restrictive'].includes(value.direction)
    && isSafeText(value.explanation, 240)
    && hasMarketTags(value.marketTags);
}

function isIndicator(value) {
  return isObject(value)
    && hasOnlyKeys(value, [
      'id',
      'label',
      'rawValue',
      'displayValue',
      'unit',
      'change',
      'observedAt',
      'retrievedAt',
      'freshness',
      'macroSignal',
      'source',
      'marketTags',
    ])
    && isIdentifier(value.id)
    && isSafeText(value.label, 80)
    && isNumberBetween(value.rawValue, -1_000_000_000, 1_000_000_000)
    && isSafeText(value.displayValue, 32)
    && ['percent', 'basis-points', 'index', 'currency-rate'].includes(value.unit)
    && isIndicatorChange(value.change)
    && isTimestamp(value.observedAt)
    && isTimestamp(value.retrievedAt)
    && isFreshness(value.freshness)
    && ['easing', 'neutral', 'tightening', 'mixed'].includes(value.macroSignal)
    && isProvenance(value.source)
    && hasMarketTags(value.marketTags);
}

function isDevelopment(value) {
  return isObject(value)
    && hasOnlyKeys(value, [
      'id',
      'headline',
      'summary',
      'impact',
      'firstSeenAt',
      'updatedAt',
      'provenance',
      'marketTags',
    ])
    && isIdentifier(value.id)
    && isSafeText(value.headline, 240)
    && isSafeText(value.summary, 800)
    && isImpact(value.impact)
    && isTimestamp(value.firstSeenAt)
    && isTimestamp(value.updatedAt)
    && isArrayBetween(value.provenance, 1, 5, isProvenance)
    && hasMarketTags(value.marketTags);
}

function isStory(value) {
  return isObject(value)
    && hasOnlyKeys(value, [
      'id',
      'headline',
      'summary',
      'whyItMatters',
      'url',
      'publisher',
      'publishedAt',
      'retrievedAt',
      'impact',
      'category',
      'provenance',
      'marketTags',
    ])
    && isIdentifier(value.id)
    && isSafeText(value.headline, 240)
    && isSafeText(value.summary, 800)
    && isSafeText(value.whyItMatters, 800)
    && isHttpsUrl(value.url)
    && isSafeText(value.publisher, 80)
    && isTimestamp(value.publishedAt)
    && isTimestamp(value.retrievedAt)
    && isImpact(value.impact)
    && isSlug(value.category)
    && isArrayBetween(value.provenance, 1, 5, isProvenance)
    && hasMarketTags(value.marketTags);
}

function isCalendarEvent(value) {
  return isObject(value)
    && hasOnlyKeys(value, [
      'id',
      'title',
      'countryCode',
      'scheduledAt',
      'timezone',
      'status',
      'impact',
      'previous',
      'forecast',
      'actual',
      'unit',
      'referencePeriod',
      'marketTags',
      'source',
    ])
    && isIdentifier(value.id)
    && isSafeText(value.title, 240)
    && /^[A-Z]{2}$/.test(value.countryCode)
    && isTimestamp(value.scheduledAt)
    && typeof value.timezone === 'string'
    && value.timezone.length >= 3
    && value.timezone.length <= 64
    && /^[A-Za-z_]+(?:\/[A-Za-z0-9_+.-]+)+$/.test(value.timezone)
    && ['scheduled', 'released', 'revised', 'cancelled'].includes(value.status)
    && isImpact(value.impact)
    && isNullableDisplayText(value.previous)
    && isNullableDisplayText(value.forecast)
    && isNullableDisplayText(value.actual)
    && isNullableDisplayText(value.unit)
    && (!hasOwn(value, 'referencePeriod') || isSafeText(value.referencePeriod, 80))
    && hasMarketTags(value.marketTags)
    && isOfficialSource(value.source);
}

function isSourceHealth(value) {
  return isObject(value)
    && hasOnlyKeys(value, [
      'id',
      'name',
      'type',
      'url',
      'status',
      'lastAttemptAt',
      'lastSuccessAt',
      'itemsUsed',
      'marketTags',
      'publicMessage',
    ])
    && isIdentifier(value.id)
    && isSafeText(value.name, 80)
    && ['official', 'public-data', 'news'].includes(value.type)
    && isHttpsUrl(value.url)
    && ['healthy', 'stale', 'unavailable'].includes(value.status)
    && isTimestamp(value.lastAttemptAt)
    && (value.lastSuccessAt === null || isTimestamp(value.lastSuccessAt))
    && isIntegerBetween(value.itemsUsed, 0, 10_000)
    && hasMarketTags(value.marketTags)
    && (!hasOwn(value, 'publicMessage') || isSafeText(value.publicMessage, 240));
}

function isDigestHighlight(value) {
  return isObject(value)
    && hasOnlyKeys(value, ['id', 'text', 'impact', 'relatedStoryIds'])
    && isIdentifier(value.id)
    && isSafeText(value.text, 800)
    && isImpact(value.impact)
    && isArrayBetween(value.relatedStoryIds, 0, 12, isIdentifier)
    && new Set(value.relatedStoryIds).size === value.relatedStoryIds.length;
}

function isDigest(value) {
  return isObject(value)
    && hasOnlyKeys(value, [
      'id',
      'periodStart',
      'periodEnd',
      'generatedAt',
      'title',
      'summary',
      'highlights',
      'storyIds',
      'itemCount',
      'marketTags',
    ])
    && isIdentifier(value.id)
    && isTimestamp(value.periodStart)
    && isTimestamp(value.periodEnd)
    && isTimestamp(value.generatedAt)
    && isSafeText(value.title, 240)
    && isSafeText(value.summary, 800)
    && isArrayBetween(value.highlights, 1, 12, isDigestHighlight)
    && isArrayBetween(value.storyIds, 0, 30, isIdentifier)
    && new Set(value.storyIds).size === value.storyIds.length
    && isIntegerBetween(value.itemCount, 0, 500)
    && hasMarketTags(value.marketTags);
}

function isCoverage(value) {
  return isObject(value)
    && hasOnlyKeys(value, [
      'expectedSources',
      'successfulSources',
      'staleSources',
      'failedSources',
      'marketTags',
    ])
    && isIntegerBetween(value.expectedSources, 1, 64)
    && isIntegerBetween(value.successfulSources, 0, 64)
    && isIntegerBetween(value.staleSources, 0, 64)
    && isIntegerBetween(value.failedSources, 0, 64)
    && hasMarketTags(value.marketTags);
}

function isMacroConditions(value) {
  return isObject(value)
    && hasOnlyKeys(value, ['score', 'label', 'summary', 'scoreScale', 'methodology', 'drivers'])
    && isNumberBetween(value.score, 0, 100)
    && ['supportive', 'balanced', 'restrictive'].includes(value.label)
    && isSafeText(value.summary, 800)
    && isObject(value.scoreScale)
    && hasOnlyKeys(value.scoreScale, ['minimum', 'maximum', 'higherMeans'])
    && value.scoreScale.minimum === 0
    && value.scoreScale.maximum === 100
    && value.scoreScale.higherMeans === 'More restrictive macro-financial conditions'
    && isObject(value.methodology)
    && hasOnlyKeys(value.methodology, [
      'id',
      'version',
      'description',
      'baselineScore',
      'formula',
    ])
    && isSlug(value.methodology.id)
    && /^[0-9]+\.[0-9]+\.[0-9]+$/.test(value.methodology.version)
    && isSafeText(value.methodology.description, 800)
    && isNumberBetween(value.methodology.baselineScore, 0, 100)
    && isSafeText(value.methodology.formula, 240)
    && isArrayBetween(value.drivers, 1, 12, isDriver);
}

function hasValidSnapshotSemantics(value) {
  const generatedAt = Date.parse(value.generatedAt);
  const validUntil = Date.parse(value.validUntil);
  const startedAt = Date.parse(value.pipeline.startedAt);
  const completedAt = Date.parse(value.pipeline.completedAt);
  if (validUntil <= generatedAt
      || completedAt < startedAt
      || completedAt > generatedAt + (5 * 60 * 1000)) {
    return false;
  }

  const { coverage } = value.pipeline;
  if (coverage.successfulSources + coverage.staleSources + coverage.failedSources
        !== coverage.expectedSources
      || coverage.expectedSources !== value.sources.length) {
    return false;
  }

  const actualSourceCounts = value.sources.reduce((counts, source) => ({
    ...counts,
    [source.status]: counts[source.status] + 1,
  }), { healthy: 0, stale: 0, unavailable: 0 });
  if (actualSourceCounts.healthy !== coverage.successfulSources
      || actualSourceCounts.stale !== coverage.staleSources
      || actualSourceCounts.unavailable !== coverage.failedSources) {
    return false;
  }

  const { drivers, methodology, score, label } = value.macroConditions;
  const weightSum = drivers.reduce((sum, driver) => sum + driver.weight, 0);
  const contributionSum = drivers.reduce(
    (sum, driver) => sum + driver.contributionPoints,
    0,
  );
  const expectedScore = Math.max(0, Math.min(100, methodology.baselineScore + contributionSum));
  const expectedLabel = score < 40 ? 'supportive' : score < 60 ? 'balanced' : 'restrictive';
  if (Math.abs(weightSum - 1) > 0.001
      || Math.abs(score - expectedScore) > 0.11
      || label !== expectedLabel) {
    return false;
  }

  const indicatorIds = value.indicators.map((indicator) => indicator.id);
  const indicatorIdSet = new Set(indicatorIds);
  if (indicatorIdSet.size !== indicatorIds.length
      || drivers.some((driver) => !indicatorIdSet.has(driver.indicatorId))
      || value.indicators.some(
        (indicator) => Date.parse(indicator.observedAt) > Date.parse(indicator.retrievedAt) + (5 * 60 * 1000),
      )) {
    return false;
  }

  const storyIds = value.stories.map((story) => story.id);
  const storyIdSet = new Set(storyIds);
  if (storyIdSet.size !== storyIds.length
      || value.digest.storyIds.some((storyId) => !storyIdSet.has(storyId))) {
    return false;
  }

  const sourceIds = value.sources.map((source) => source.id);
  return new Set(sourceIds).size === sourceIds.length;
}

export function validateManifest(value) {
  if (!isObject(value)
      || !hasOnlyKeys(value, ['manifestVersion', 'publishedAt', 'snapshot'])
      || value.manifestVersion !== 1
      || !isTimestamp(value.publishedAt)
      || !isObject(value.snapshot)
      || !hasOnlyKeys(value.snapshot, [
        'schemaVersion',
        'id',
        'path',
        'generatedAt',
        'validUntil',
        'sizeBytes',
        'sha256',
      ])
      || value.snapshot.schemaVersion !== 1
      || !/^mr-\d{8}t\d{6}z$/.test(value.snapshot.id)
      || !SNAPSHOT_PATH_PATTERN.test(value.snapshot.path)
      || !isTimestamp(value.snapshot.generatedAt)
      || !isTimestamp(value.snapshot.validUntil)
      || !Number.isInteger(value.snapshot.sizeBytes)
      || value.snapshot.sizeBytes <= 0
      || value.snapshot.sizeBytes > 524288
      || !/^[a-f0-9]{64}$/.test(value.snapshot.sha256)
      || value.snapshot.path !== (
        `v1/snapshots/${value.snapshot.generatedAt.slice(0, 10).replace(/-/g, '/')}/`
        + `${value.snapshot.generatedAt.slice(0, 19).replace(/:/g, '-')}Z-`
        + `${value.snapshot.sha256}.json`
      )
      || Date.parse(value.snapshot.validUntil) <= Date.parse(value.snapshot.generatedAt)
      || Date.parse(value.publishedAt) < Date.parse(value.snapshot.generatedAt)) {
    throw new MarketRadarDataError('Latest publication manifest is invalid.');
  }

  return value;
}

export function validateSnapshot(value) {
  if (!isObject(value)
      || !hasOnlyKeys(value, [
        'schemaVersion',
        'id',
        'generatedAt',
        'validUntil',
        'pipeline',
        'macroConditions',
        'indicators',
        'priorityDevelopments',
        'stories',
        'calendar',
        'digest',
        'sources',
      ])
      || value.schemaVersion !== 1
      || !/^mr-\d{8}t\d{6}z$/.test(value.id)
      || !isTimestamp(value.generatedAt)
      || !isTimestamp(value.validUntil)
      || !isObject(value.pipeline)
      || !hasOnlyKeys(value.pipeline, [
        'runId',
        'status',
        'startedAt',
        'completedAt',
        'coverage',
        'publicNote',
      ])
      || !isIdentifier(value.pipeline.runId)
      || !['healthy', 'degraded'].includes(value.pipeline.status)
      || !isTimestamp(value.pipeline.startedAt)
      || !isTimestamp(value.pipeline.completedAt)
      || !isCoverage(value.pipeline.coverage)
      || (hasOwn(value.pipeline, 'publicNote') && !isSafeText(value.pipeline.publicNote, 240))
      || !isMacroConditions(value.macroConditions)
      || !isArrayBetween(value.indicators, 1, 24, isIndicator)
      || !isArrayBetween(value.priorityDevelopments, 0, 12, isDevelopment)
      || !isArrayBetween(value.stories, 0, 30, isStory)
      || !isArrayBetween(value.calendar, 0, 40, isCalendarEvent)
      || !isDigest(value.digest)
      || !isArrayBetween(value.sources, 1, 24, isSourceHealth)
      || !hasValidSnapshotSemantics(value)) {
    throw new MarketRadarDataError('Published snapshot does not match contract v1.');
  }

  return value;
}

function resolveManifestUrl(manifestUrl, allowInsecureLocalhost) {
  let manifest;
  try {
    manifest = new URL(manifestUrl, window.location.origin);
  } catch {
    throw new MarketRadarDataError('Manifest URL is invalid.');
  }

  const localHostnames = new Set(['localhost', '127.0.0.1', '[::1]']);
  const isLocalTrial = allowInsecureLocalhost
    && localHostnames.has(manifest.hostname)
    && manifest.origin === window.location.origin;
  if (manifest.protocol !== 'https:' && !isLocalTrial) {
    throw new MarketRadarDataError('Manifest must use HTTPS.');
  }

  return manifest;
}

export function resolveSnapshotUrl(
  manifestUrl,
  snapshotPath,
  { allowInsecureLocalhost = false } = {},
) {
  if (!SNAPSHOT_PATH_PATTERN.test(snapshotPath)) {
    throw new MarketRadarDataError('Snapshot path is invalid.');
  }

  const manifest = resolveManifestUrl(manifestUrl, allowInsecureLocalhost);

  return new URL(`/${snapshotPath}`, manifest.origin).toString();
}

export function getSnapshotState(snapshot, now = Date.now()) {
  return Date.parse(snapshot.validUntil) <= now ? 'expired' : snapshot.pipeline.status;
}

async function sha256Hex(buffer) {
  if (!window.crypto?.subtle) {
    throw new MarketRadarDataError('Snapshot integrity verification is unavailable.');
  }

  const digest = await window.crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function requireResponse(response, label) {
  if (!response.ok) {
    throw new MarketRadarDataError(`${label} returned HTTP ${response.status}.`);
  }
  return response;
}

async function requestJsonResponse(fetchImpl, url, options, label) {
  try {
    return await requireResponse(await fetchImpl(url, options), label);
  } catch (error) {
    if (error?.name === 'AbortError' || error instanceof MarketRadarDataError) throw error;
    throw new MarketRadarDataError(`${label} could not be reached.`);
  }
}

export async function fetchLatestSnapshot({
  manifestUrl = DEFAULT_MANIFEST_URL,
  fetchImpl = window.fetch,
  allowInsecureLocalhost = false,
  signal,
} = {}) {
  if (typeof fetchImpl !== 'function') {
    throw new MarketRadarDataError('Snapshot retrieval is unavailable.');
  }

  const resolvedManifestUrl = resolveManifestUrl(
    manifestUrl || DEFAULT_MANIFEST_URL,
    allowInsecureLocalhost,
  ).toString();
  const manifestResponse = await requestJsonResponse(fetchImpl, resolvedManifestUrl, {
    cache: 'no-store',
    credentials: 'omit',
    headers: { Accept: 'application/json' },
    signal,
  }, 'Latest manifest');
  let manifestPayload;
  try {
    manifestPayload = await manifestResponse.json();
  } catch {
    throw new MarketRadarDataError('Latest publication manifest is not valid JSON.');
  }
  const manifest = validateManifest(manifestPayload);
  const snapshotUrl = resolveSnapshotUrl(
    resolvedManifestUrl,
    manifest.snapshot.path,
    { allowInsecureLocalhost },
  );
  const snapshotResponse = await requestJsonResponse(fetchImpl, snapshotUrl, {
    cache: 'force-cache',
    credentials: 'omit',
    headers: { Accept: 'application/json' },
    signal,
  }, 'Immutable snapshot');

  const snapshotBuffer = await snapshotResponse.arrayBuffer();
  if (snapshotBuffer.byteLength !== manifest.snapshot.sizeBytes) {
    throw new MarketRadarDataError('Snapshot size does not match its manifest.');
  }

  const digest = await sha256Hex(snapshotBuffer);
  if (digest !== manifest.snapshot.sha256) {
    throw new MarketRadarDataError('Snapshot integrity check failed.');
  }

  let snapshot;
  try {
    snapshot = JSON.parse(new TextDecoder().decode(snapshotBuffer));
  } catch {
    throw new MarketRadarDataError('Snapshot is not valid JSON.');
  }
  validateSnapshot(snapshot);

  if (snapshot.id !== manifest.snapshot.id
      || snapshot.schemaVersion !== manifest.snapshot.schemaVersion
      || snapshot.generatedAt !== manifest.snapshot.generatedAt
      || snapshot.validUntil !== manifest.snapshot.validUntil) {
    throw new MarketRadarDataError('Snapshot metadata does not match its manifest.');
  }

  return { manifest, snapshot, snapshotUrl };
}
