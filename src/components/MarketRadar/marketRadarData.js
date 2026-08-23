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
      || !/^[a-f0-9]{64}$/.test(value.snapshot.sha256)) {
    throw new MarketRadarDataError('Latest publication manifest is invalid.');
  }

  return value;
}

export function validateSnapshot(value) {
  if (!isObject(value)
      || value.schemaVersion !== 1
      || typeof value.id !== 'string'
      || !isTimestamp(value.generatedAt)
      || !isTimestamp(value.validUntil)
      || !isObject(value.pipeline)
      || !isObject(value.pipeline.coverage)
      || !isObject(value.macroConditions)
      || typeof value.macroConditions.score !== 'number'
      || !['supportive', 'balanced', 'restrictive'].includes(value.macroConditions.label)
      || !isObject(value.macroConditions.methodology)
      || !Array.isArray(value.macroConditions.drivers)
      || !Array.isArray(value.indicators)
      || !Array.isArray(value.priorityDevelopments)
      || !Array.isArray(value.stories)
      || !Array.isArray(value.calendar)
      || !isObject(value.digest)
      || !Array.isArray(value.sources)) {
    throw new MarketRadarDataError('Published snapshot does not match contract v1.');
  }

  return value;
}

export function resolveSnapshotUrl(manifestUrl, snapshotPath) {
  if (!SNAPSHOT_PATH_PATTERN.test(snapshotPath)) {
    throw new MarketRadarDataError('Snapshot path is invalid.');
  }

  const manifest = new URL(manifestUrl);
  if (manifest.protocol !== 'https:') {
    throw new MarketRadarDataError('Manifest must use HTTPS.');
  }

  return new URL(`/${snapshotPath}`, manifest.origin).toString();
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

export async function fetchLatestSnapshot({
  manifestUrl = DEFAULT_MANIFEST_URL,
  fetchImpl = window.fetch,
  signal,
} = {}) {
  if (typeof fetchImpl !== 'function') {
    throw new MarketRadarDataError('Snapshot retrieval is unavailable.');
  }

  const resolvedManifestUrl = manifestUrl || DEFAULT_MANIFEST_URL;
  const manifestResponse = await fetchImpl(resolvedManifestUrl, {
    cache: 'no-store',
    credentials: 'omit',
    headers: { Accept: 'application/json' },
    signal,
  });
  await requireResponse(manifestResponse, 'Latest manifest');
  const manifest = validateManifest(await manifestResponse.json());
  const snapshotUrl = resolveSnapshotUrl(resolvedManifestUrl, manifest.snapshot.path);
  const snapshotResponse = await fetchImpl(snapshotUrl, {
    cache: 'force-cache',
    credentials: 'omit',
    headers: { Accept: 'application/json' },
    signal,
  });
  await requireResponse(snapshotResponse, 'Immutable snapshot');

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
