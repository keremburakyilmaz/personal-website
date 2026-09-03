import { spotifyPlaylists } from './spotifyPlaylists';

test('keeps the public mood playlists in their curated order', () => {
  expect(spotifyPlaylists.map(({ name }) => name)).toEqual([
    'beautiful damage',
    'somewhere unreal',
    'sun through blinds',
    'quiet collapse',
    'velvet static',
    'controlled detonation',
    'love without the holiday',
    'back from the dead'
  ]);

  expect(new Set(spotifyPlaylists.map(({ url }) => url)).size).toBe(8);
  spotifyPlaylists.forEach(({ url }) => {
    expect(url).toMatch(/^https:\/\/open\.spotify\.com\/playlist\/[A-Za-z0-9]+$/);
  });
});
