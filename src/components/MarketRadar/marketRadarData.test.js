import {
  DEFAULT_MANIFEST_URL,
  fetchLatestSnapshot,
  getSnapshotState,
  MarketRadarDataError,
  resolveSnapshotUrl,
  validateManifest,
  validateSnapshot,
} from './marketRadarData';
import { createPreviewSnapshot } from './previewSnapshot';

const digest = 'a'.repeat(64);
const snapshotPath = `v1/snapshots/2026/08/23/2026-08-23T12-00-00Z-${digest}.json`;

function createManifest(overrides = {}) {
  return {
    manifestVersion: 1,
    publishedAt: '2026-08-23T12:00:05Z',
    snapshot: {
      schemaVersion: 1,
      id: 'mr-20260823t120000z',
      path: snapshotPath,
      generatedAt: '2026-08-23T12:00:00Z',
      validUntil: '2026-08-23T18:30:00Z',
      sizeBytes: 14263,
      sha256: digest,
      ...overrides,
    },
  };
}

describe('Market Radar public data boundary', () => {
  test('accepts the canonical preview snapshot shape', () => {
    const snapshot = createPreviewSnapshot(new Date('2026-08-23T12:00:00Z'));

    expect(validateSnapshot(snapshot)).toBe(snapshot);
  });

  test('resolves only a safe same-origin immutable snapshot path', () => {
    expect(resolveSnapshotUrl(DEFAULT_MANIFEST_URL, snapshotPath)).toBe(
      `https://radar-data.keremburakyilmaz.com/${snapshotPath}`,
    );
    expect(() => resolveSnapshotUrl(DEFAULT_MANIFEST_URL, 'https://evil.example/snapshot.json'))
      .toThrow(MarketRadarDataError);
    expect(() => resolveSnapshotUrl('http://radar-data.example/v1/latest.json', snapshotPath))
      .toThrow('Manifest must use HTTPS.');
  });

  test('rejects a manifest whose path does not contain its declared digest', () => {
    expect(() => validateManifest(createManifest({ sha256: 'b'.repeat(64) })))
      .toThrow('Latest publication manifest is invalid.');
  });

  test('rejects an oversized public snapshot before retrieval', () => {
    expect(() => validateManifest(createManifest({ sizeBytes: 524289 })))
      .toThrow('Latest publication manifest is invalid.');
  });

  test('marks valid snapshots expired without changing their pipeline status', () => {
    const snapshot = createPreviewSnapshot(new Date('2026-08-23T12:00:00Z'));

    expect(getSnapshotState(snapshot, Date.parse('2026-08-23T12:30:00Z'))).toBe('healthy');
    expect(getSnapshotState(snapshot, Date.parse('2026-08-23T19:00:00Z'))).toBe('expired');
  });

  test('turns network failures into a bounded public error', async () => {
    const fetchImpl = jest.fn().mockRejectedValue(new TypeError('private network detail'));

    await expect(fetchLatestSnapshot({ fetchImpl }))
      .rejects.toThrow('Latest manifest could not be reached.');
  });
});
