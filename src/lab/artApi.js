const ART_API = 'https://openaccess-api.clevelandart.org/api/artworks/';
const RANDOM_TERMS = ['memory', 'night', 'gesture', 'home', 'weather', 'dream', 'distance', 'object'];

function normalizeArtwork(artwork) {
  const imageUrl = artwork?.images?.web?.url;
  if (!artwork || !imageUrl) return null;

  const artists = (artwork.creators || [])
    .filter((creator) => creator.use_in_caption !== false)
    .map((creator) => creator.description)
    .filter(Boolean)
    .join('; ');

  return {
    id: artwork.id,
    title: artwork.title,
    artist_display: artists || (artwork.culture || []).join(', '),
    date_display: artwork.creation_date,
    place_of_origin: (artwork.culture || []).join(', '),
    medium_display: artwork.technique || artwork.type,
    imageUrl,
    imageFallbackUrl: artwork.images?.print?.url || '',
    pageUrl: artwork.url,
    alt: artwork.images?.annotation || `${artwork.title}${artists ? ` by ${artists}` : ''}`,
  };
}

async function fetchArtworkList(query, signal) {
  const params = new URLSearchParams({
    q: query,
    has_image: '1',
    cc0: '1',
    limit: '40',
  });
  const response = await fetch(`${ART_API}?${params}`, { signal });
  if (!response.ok) throw new Error(`Museum archive returned ${response.status}`);
  const payload = await response.json();
  return (payload.data || []).map(normalizeArtwork).filter(Boolean);
}

export async function searchArtwork(query, signal) {
  const results = await fetchArtworkList(query, signal);
  if (!results.length) return null;
  return results[Math.floor(Math.random() * results.length)];
}

export async function randomArtwork(signal) {
  const term = RANDOM_TERMS[Math.floor(Math.random() * RANDOM_TERMS.length)];
  const results = await fetchArtworkList(term, signal);
  if (!results.length) return searchArtwork('art', signal);
  return results[Math.floor(Math.random() * results.length)];
}
