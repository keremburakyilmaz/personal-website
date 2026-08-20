export const PLACES = [
  { name: 'Tromsø', country: 'Norway', latitude: 69.6492, longitude: 18.9553, timezone: 'Europe/Oslo' },
  { name: 'Ushuaia', country: 'Argentina', latitude: -54.8019, longitude: -68.303, timezone: 'America/Argentina/Ushuaia' },
  { name: 'Yakushima', country: 'Japan', latitude: 30.358, longitude: 130.528, timezone: 'Asia/Tokyo' },
  { name: 'Reykjavík', country: 'Iceland', latitude: 64.1466, longitude: -21.9426, timezone: 'Atlantic/Reykjavik' },
  { name: 'Marrakesh', country: 'Morocco', latitude: 31.6295, longitude: -7.9811, timezone: 'Africa/Casablanca' },
  { name: 'Dunedin', country: 'New Zealand', latitude: -45.8788, longitude: 170.5028, timezone: 'Pacific/Auckland' },
  { name: 'Nuuk', country: 'Greenland', latitude: 64.1835, longitude: -51.7216, timezone: 'America/Nuuk' },
  { name: 'Lamu', country: 'Kenya', latitude: -2.2717, longitude: 40.902, timezone: 'Africa/Nairobi' },
  { name: 'Valparaíso', country: 'Chile', latitude: -33.0472, longitude: -71.6127, timezone: 'America/Santiago' },
  { name: 'Svalbard', country: 'Norway', latitude: 78.2232, longitude: 15.6469, timezone: 'Arctic/Longyearbyen' },
  { name: 'Samarkand', country: 'Uzbekistan', latitude: 39.6542, longitude: 66.9597, timezone: 'Asia/Samarkand' },
  { name: 'Faroe Islands', country: 'Denmark', latitude: 62.0079, longitude: -6.7909, timezone: 'Atlantic/Faroe' },
];

export const WEATHER_CODES = {
  0: 'the sky is clear',
  1: 'the sky is mostly clear',
  2: 'clouds are passing through',
  3: 'the sky is overcast',
  45: 'fog is holding close to the ground',
  48: 'frost fog is gathering',
  51: 'a light drizzle is falling',
  53: 'drizzle is settling in',
  55: 'the rain is persistent',
  61: 'light rain is falling',
  63: 'rain is moving through',
  65: 'heavy rain is falling',
  71: 'light snow is falling',
  73: 'snow is settling',
  75: 'heavy snow is falling',
  77: 'snow grains are moving through the air',
  80: 'brief showers are passing',
  81: 'showers are gathering',
  82: 'heavy showers are passing',
  85: 'snow showers are passing',
  86: 'heavy snow showers are passing',
  95: 'a thunderstorm is nearby',
  96: 'a thunderstorm is carrying hail',
  99: 'a severe thunderstorm is carrying hail',
};

export function weatherSentence(code) {
  return WEATHER_CODES[code] || 'the atmosphere is withholding details';
}

export function stableHash(value) {
  return String(value).split('').reduce((hash, character) => (
    ((hash << 5) - hash) + character.charCodeAt(0)
  ) | 0, 0);
}

export function pickStable(items, seed, offset = 0) {
  if (!items.length) return '';
  return items[Math.abs(stableHash(`${seed}:${offset}`)) % items.length];
}

export const OMEN_OPENINGS = [
  'Leave one question unanswered.',
  'Do not mistake urgency for direction.',
  'An overlooked detail is asking to be noticed.',
  'The first explanation will be incomplete.',
  'Something ordinary will behave like a sign.',
  'A small delay is protecting you from a larger one.',
  'Return to the thought you dismissed too quickly.',
  'Today rewards the second attempt.',
  'Keep one small promise before making another.',
  'The thing you are avoiding has become simpler overnight.',
  'A familiar route will reveal an unfamiliar exit.',
  'Let the unfinished thing remain visible.',
  'Someone will misunderstand you in a useful way.',
  'Begin with the part that cannot impress anyone.',
  'An old assumption is nearing the end of its usefulness.',
  'The quieter option contains more information.',
  'Notice what becomes easier when no one is watching.',
  'A misplaced object will improve the day.',
  'Do not repair what is still becoming itself.',
  'The answer will arrive disguised as a practical detail.',
  'One refusal will create necessary space.',
  'The useful mistake has not happened yet.',
  'Choose the door that requires less explanation.',
  'A repeated thought is asking for a different response.',
  'Let one expectation expire without ceremony.',
  'The smallest task is carrying the largest message.',
  'What feels late may simply be ready now.',
  'A minor inconvenience will redirect your attention correctly.',
  'Keep the evidence that does not fit the story.',
  'The next useful question will sound almost impolite.',
  'Something you stopped noticing has continued to change.',
  'Make room for an outcome you would not have planned.',
];

export const OMEN_WEATHER_LINES = {
  clear: [
    'Clarity will be less useful than patience.',
    'The open sky is not permission to rush.',
    'What is visible is not necessarily resolved.',
    'An unobstructed view can still conceal the scale of things.',
    'Use the brightness to inspect, not to conclude.',
    'The horizon is offering distance, not escape.',
    'Nothing in the open sky requires an immediate answer.',
    'Certainty will cast the longest shadow today.',
  ],
  cloud: [
    'Wait for the shape of the problem to change.',
    'Uncertainty is moving, even when it looks still.',
    'A partial view is enough for the next step.',
    'The missing outline is part of the information.',
    'Let the day remain undecided a little longer.',
    'A softened edge may be more accurate than a sharp one.',
    'What is obscured has not necessarily disappeared.',
    'Conditions are changing without asking to be named.',
  ],
  rain: [
    'Avoid conclusions made before the rain stops.',
    'Let one plan dissolve without replacing it immediately.',
    'What returns after the weather matters more than what leaves.',
    'Allow the surface of things to become temporarily unreadable.',
    'A useful boundary is being redrawn by water.',
    'Listen for what becomes audible beneath the rain.',
    'Some plans improve after being made inconvenient.',
    'Do not measure progress by how dry you remain.',
  ],
  snow: [
    'Quiet changes are accumulating.',
    'Preserve the first mark you make today.',
    'Move slowly enough to notice what follows you.',
    'A blank surface is recording more than it reveals.',
    'Let accumulation perform the work of decision.',
    'The familiar route deserves fresh attention.',
    'Do not hurry to restore what the snow has simplified.',
    'Small differences will remain visible longer today.',
  ],
  storm: [
    'Postpone the argument you have already rehearsed.',
    'A loud signal may still contain no instruction.',
    'Protect the fragile thing before defending the important one.',
    'Wait until intensity stops impersonating certainty.',
    'Not every interruption requires your participation.',
    'Secure what matters and let the rest make noise.',
    'The first silence afterward will contain the useful part.',
    'Do not negotiate with a signal at its loudest.',
  ],
  fog: [
    'Do not force distance to become certainty.',
    'The next few metres are sufficient.',
    'Recognition will arrive before explanation.',
    'Let proximity replace the need for overview.',
    'A slower pace will reveal the available route.',
    'The hidden distance is not currently your problem.',
    'Trust the boundary you can touch.',
    'What emerges gradually may be easier to understand.',
  ],
};

export const OMEN_CLOSINGS = {
  cold: [
    'Keep warmth for what cannot ask for it.',
    'The day will open slowly; do not force the hinge.',
    'Carry one source of warmth that is not practical.',
  ],
  mild: [
    'Use the ordinary temperature to attempt the difficult thing.',
    'The day is neutral enough to reveal your own momentum.',
    'Nothing in the air is asking you to hurry or hide.',
  ],
  warm: [
    'Spend your energy before the heat spends it for you.',
    'Leave room between effort and exhaustion.',
    'What needs shade may also need time.',
  ],
  night: [
    'Do not demand daylight logic from an evening decision.',
    'Leave one conclusion for the version of you that wakes next.',
    'The dark is reducing the number of things that require attention.',
  ],
};

export function omenClosingFamily(temperature, isDay) {
  if (!isDay) return 'night';
  if (temperature < 12) return 'cold';
  if (temperature >= 24) return 'warm';
  return 'mild';
}

export function weatherFamily(code) {
  if ([45, 48].includes(code)) return 'fog';
  if (code >= 95) return 'storm';
  if (code >= 71 && code <= 86) return 'snow';
  if (code >= 51 && code <= 82) return 'rain';
  if ([1, 2, 3].includes(code)) return 'cloud';
  return 'clear';
}
