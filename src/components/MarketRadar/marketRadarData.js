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

function isTimestamp(value) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

function isText(value) {
  return typeof value === 'string' && value.length > 0;
}

function isHttpsUrl(value) {
  if (!isText(value)) return false;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function hasMarketTags(value) {
  return Array.isArray(value) && value.length > 0 && value.every(isText);
}

function isProvenance(value) {
  return isObject(value)
    && isText(value.sourceId)
    && isText(value.sourceName)
    && isHttpsUrl(value.sourceUrl)
    && isTimestamp(value.retrievedAt);
}

function isDriver(value) {
  return isObject(value)
    && isText(value.indicatorId)
    && isText(value.label)
    && Number.isFinite(value.weight)
    && Number.isFinite(value.contributionPoints)
    && ['supportive', 'balanced', 'restrictive'].includes(value.direction)
    && isText(value.explanation)
    && hasMarketTags(value.marketTags);
}

function isIndicator(value) {
  return isObject(value)
    && isText(value.id)
    && isText(value.label)
    && isText(value.displayValue)
    && isTimestamp(value.observedAt)
    && isTimestamp(value.retrievedAt)
    && isObject(value.freshness)
    && ['fresh', 'stale'].includes(value.freshness.status)
    && ['easing', 'neutral', 'tightening', 'mixed'].includes(value.macroSignal)
    && isProvenance(value.source)
    && hasMarketTags(value.marketTags);
}

function isDevelopment(value) {
  return isObject(value)
    && isText(value.id)
    && isText(value.headline)
    && isText(value.summary)
    && isTimestamp(value.updatedAt)
    && hasMarketTags(value.marketTags);
}

function isStory(value) {
  return isObject(value)
    && isText(value.id)
    && isText(value.headline)
    && isText(value.whyItMatters)
    && isHttpsUrl(value.url)
    && isText(value.publisher)
    && isTimestamp(value.publishedAt)
    && hasMarketTags(value.marketTags);
}

function isCalendarEvent(value) {
  return isObject(value)
    && isText(value.id)
    && isText(value.title)
    && /^[A-Z]{2}$/.test(value.countryCode)
    && isTimestamp(value.scheduledAt)
    && ['scheduled', 'released', 'revised', 'cancelled'].includes(value.status)
    && hasMarketTags(value.marketTags);
}

function isSourceHealth(value) {
  return isObject(value)
    && isText(value.id)
    && isText(value.name)
    && ['official', 'public-data', 'news'].includes(value.type)
    && isHttpsUrl(value.url)
    && ['healthy', 'stale', 'unavailable'].includes(value.status)
    && isTimestamp(value.lastAttemptAt)
    && (value.lastSuccessAt === null || isTimestamp(value.lastSuccessAt))
    && Number.isInteger(value.itemsUsed)
    && hasMarketTags(value.marketTags);
}

function isDigestHighlight(value) {
  return isObject(value)
    && isText(value.id)
    && isText(value.text)
    && ['low', 'medium', 'high'].includes(value.impact)
    && Array.isArray(value.relatedStoryIds);
}

export function validateManifest(value) {
  if (!isObject(value)
      || value.manifestVersion !== 1
      || !isTimestamp(value.publishedAt)
      || !isObject(value.snapshot)
      || value.snapshot.schemaVersion !== 1
      || typeof value.snapshot.id !== 'string'
      || !SNAPSHOT_PATH_PATTERN.test(value.snapshot.path)
      || !isTimestamp(value.snapshot.generatedAt)
      || !isTimestamp(value.snapshot.validUntil)
      || !Number.isInteger(value.snapshot.sizeBytes)
      || value.snapshot.sizeBytes <= 0
      || value.snapshot.sizeBytes > 524288
      || !/^[a-f0-9]{64}$/.test(value.snapshot.sha256)
      || !value.snapshot.path.endsWith(`-${value.snapshot.sha256}.json`)
      || Date.parse(value.snapshot.validUntil) <= Date.parse(value.snapshot.generatedAt)
      || Date.parse(value.publishedAt) < Date.parse(value.snapshot.generatedAt)) {
    throw new MarketRadarDataError('Latest publication manifest is invalid.');
  }

  return value;
}

export function validateSnapshot(value) {
  if (!isObject(value)
      || value.schemaVersion !== 1
      || !/^mr-\d{8}t\d{6}z$/.test(value.id)
      || !isTimestamp(value.generatedAt)
      || !isTimestamp(value.validUntil)
      || !isObject(value.pipeline)
      || !['healthy', 'degraded'].includes(value.pipeline.status)
      || !isObject(value.pipeline.coverage)
      || !Number.isInteger(value.pipeline.coverage.expectedSources)
      || !Number.isInteger(value.pipeline.coverage.successfulSources)
      || !Number.isInteger(value.pipeline.coverage.staleSources)
      || !Number.isInteger(value.pipeline.coverage.failedSources)
      || !isObject(value.macroConditions)
      || !Number.isFinite(value.macroConditions.score)
      || value.macroConditions.score < 0
      || value.macroConditions.score > 100
      || !['supportive', 'balanced', 'restrictive'].includes(value.macroConditions.label)
      || !isText(value.macroConditions.summary)
      || !isObject(value.macroConditions.methodology)
      || !isText(value.macroConditions.methodology.id)
      || !isText(value.macroConditions.methodology.version)
      || !isText(value.macroConditions.methodology.description)
      || !isText(value.macroConditions.methodology.formula)
      || !Array.isArray(value.macroConditions.drivers)
      || !value.macroConditions.drivers.every(isDriver)
      || !Array.isArray(value.indicators)
      || !value.indicators.every(isIndicator)
      || !Array.isArray(value.priorityDevelopments)
      || !value.priorityDevelopments.every(isDevelopment)
      || !Array.isArray(value.stories)
      || !value.stories.every(isStory)
      || !Array.isArray(value.calendar)
      || !value.calendar.every(isCalendarEvent)
      || !isObject(value.digest)
      || !isText(value.digest.title)
      || !isText(value.digest.summary)
      || !Array.isArray(value.digest.highlights)
      || !value.digest.highlights.every(isDigestHighlight)
      || !Number.isInteger(value.digest.itemCount)
      || !Array.isArray(value.sources)
      || !value.sources.every(isSourceHealth)
      || Date.parse(value.validUntil) <= Date.parse(value.generatedAt)) {
    throw new MarketRadarDataError('Published snapshot does not match contract v1.');
  }

  return value;
}

export function resolveSnapshotUrl(manifestUrl, snapshotPath) {
  if (!SNAPSHOT_PATH_PATTERN.test(snapshotPath)) {
    throw new MarketRadarDataError('Snapshot path is invalid.');
  }

  let manifest;
  try {
    manifest = new URL(manifestUrl);
  } catch {
    throw new MarketRadarDataError('Manifest URL is invalid.');
  }
  if (manifest.protocol !== 'https:') {
    throw new MarketRadarDataError('Manifest must use HTTPS.');
  }

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
  signal,
} = {}) {
  if (typeof fetchImpl !== 'function') {
    throw new MarketRadarDataError('Snapshot retrieval is unavailable.');
  }

  const resolvedManifestUrl = manifestUrl || DEFAULT_MANIFEST_URL;
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
  const snapshotUrl = resolveSnapshotUrl(resolvedManifestUrl, manifest.snapshot.path);
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
