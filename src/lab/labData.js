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
  let hash = stableHash(`${seed}:${offset}`) >>> 0;
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x7feb352d);
  hash ^= hash >>> 15;
  hash = Math.imul(hash, 0x846ca68b);
  hash ^= hash >>> 16;
  return items[(hash >>> 0) % items.length];
}

export const OMEN_OPENINGS = [
  'Leave one question unanswered.',
  'Urgency is pointing the wrong way.',
  'One detail survived every version.',
  'Let the first explanation pass.',
  'Something ordinary will happen twice.',
  'A small delay is holding the door.',
  'Return to the thought you dismissed.',
  'Begin again before habit notices.',
  'Keep the smallest promise first.',
  'What you avoided became easier overnight.',
  'The familiar route has a new exit.',
  'Leave it unfinished until dusk.',
  'Someone will misunderstand you accurately.',
  'Begin where no one was looking.',
  'An old assumption is deciding for you.',
  'The quieter option carries a warning.',
  'Notice what stops when watched.',
  'The lost object remembers another room.',
  'Do not repair yesterday’s change.',
  'The answer has no clear owner.',
  'One refusal will close the wrong door.',
  'Do not force the useful mistake.',
  'Choose yesterday’s closed door.',
  'A repeated thought is rehearsing you.',
  'Let one expectation expire.',
  'The smallest task shows the damage.',
  'What feels late is ready.',
  'An inconvenience is moving you aside.',
  'Keep the evidence that refuses to fit.',
  'The right question will quiet the room.',
  'Something unnoticed continued without you.',
  'Make room for the unchosen outcome.',
];

export const OMEN_WEATHER_LINES = {
  clear: [
    'Clarity exposes the wrong certainty.',
    'The warning has nowhere to hide.',
    'What is visible has been altered.',
    'The open view reveals what moved.',
    'Inspect the edges; one is new.',
    'The horizon keeps its exits hidden.',
    'The answer is below the open sky.',
    'Certainty casts the wrong shadow.',
  ],
  cloud: [
    'The problem changed shape already.',
    'The clouds moved; the shadow stayed.',
    'The partial view is enough.',
    'Absence is defining the shape.',
    'Wait for the second shadow.',
    'The soft edge conceals something sharp.',
    'What disappeared has moved closer.',
    'Everything moves around the still thing.',
  ],
  rain: [
    'Wait until the rain stops.',
    'Let one plan dissolve.',
    'What returns will be elsewhere.',
    'Let the surface become unreadable.',
    'Water redraws the crossed boundary.',
    'The repeated sound is not rain.',
    'The inconvenient plan noticed the change.',
    'Something followed you inside.',
  ],
  snow: [
    'Quiet changes are accumulating.',
    'Preserve the first mark.',
    'Some tracks arrived before yours.',
    'The blank surface recorded an arrival.',
    'Let accumulation decide.',
    'The familiar route is missing something.',
    'Leave what the snow concealed.',
    'Count the differences before dusk.',
  ],
  storm: [
    'Postpone the argument; the storm listened.',
    'The loudest signal points elsewhere.',
    'Protect the fragile thing.',
    'Wait until the noise loses your voice.',
    'One interruption wants the door.',
    'Secure what matters; release the rest.',
    'The first silence will not be empty.',
    'Do not answer the loudest signal.',
  ],
  fog: [
    'Distance is moving.',
    'Cross the next few metres.',
    'Recognition will arrive first.',
    'The danger is already near.',
    'Something is matching your pace.',
    'The distance is shortening.',
    'Touch the boundary only once.',
    'What emerges has studied you.',
  ],
};

export const OMEN_CLOSINGS = {
  cold: [
    'Keep one room warm.',
    'Listen for the first thing yielding.',
    'Carry warmth somewhere unexpected.',
  ],
  mild: [
    'Ordinary air excuses nothing.',
    'The weather takes no responsibility.',
    'Notice who uses the easy day.',
  ],
  warm: [
    'Spend your energy before the heat.',
    'Leave room before exhaustion.',
    'Something exposed still needs shade.',
  ],
  night: [
    'Daylight rules will not follow you home.',
    'Leave one conclusion for morning.',
    'The dark is reducing the number of witnesses.',
  ],
};

const OMEN_POSTURES = ['wait', 'act', 'notice', 'protect', 'release'];
const OMEN_MOTIFS = ['attention', 'timing', 'change', 'boundary', 'evidence'];

const OPENING_POSTURES = [
  ['wait'], ['wait'], ['notice'], ['wait'], ['notice'], ['wait', 'protect'],
  ['notice'], ['act'], ['act'], ['act'], ['notice'], ['wait'],
  ['notice', 'release'], ['act'], ['notice', 'release'], ['wait', 'notice'],
  ['notice'], ['notice'], ['wait', 'release'], ['notice'], ['protect', 'release'],
  ['wait'], ['act'], ['act', 'notice'], ['release'], ['act', 'notice'],
  ['act'], ['notice'], ['notice'], ['act'], ['notice'], ['release'],
];

const OPENING_MOTIFS = [
  ['attention', 'timing'], ['timing'], ['evidence'], ['timing', 'evidence'],
  ['attention'], ['timing', 'boundary'], ['attention', 'change'], ['timing', 'change'],
  ['attention'], ['change', 'evidence'], ['boundary', 'change'], ['attention', 'timing'],
  ['evidence'], ['attention', 'evidence'], ['attention', 'change'], ['attention'],
  ['attention', 'evidence'], ['evidence'], ['change'], ['attention', 'evidence'],
  ['boundary'], ['timing'], ['boundary', 'change'], ['attention'],
  ['change'], ['attention', 'evidence'], ['timing'], ['change', 'boundary'],
  ['evidence'], ['attention', 'evidence'], ['attention', 'change'], ['change', 'evidence'],
];

const WEATHER_LINE_POSTURES = {
  clear: [
    ['wait'], ['wait'], ['wait', 'notice'], ['notice'],
    ['wait', 'notice'], ['notice', 'release'], ['wait'], ['wait', 'notice'],
  ],
  cloud: [
    ['wait'], ['wait', 'notice'], ['act'], ['notice'],
    ['wait'], ['notice'], ['notice'], ['notice', 'release'],
  ],
  rain: [
    ['wait'], ['wait', 'release'], ['notice'], ['wait'],
    ['notice', 'release'], ['notice'], ['notice', 'release'], ['notice'],
  ],
  snow: [
    ['notice'], ['act', 'notice'], ['wait', 'notice'], ['notice'],
    ['wait', 'release'], ['notice'], ['wait', 'release'], ['notice'],
  ],
  storm: [
    ['wait'], ['wait', 'notice'], ['protect'], ['wait'],
    ['wait', 'protect'], ['protect', 'release'], ['wait', 'notice'], ['wait'],
  ],
  fog: [
    ['wait'], ['act'], ['notice'], ['notice'],
    ['wait', 'notice'], ['wait'], ['act', 'protect'], ['wait', 'notice'],
  ],
};

const WEATHER_LINE_MOTIFS = {
  clear: [
    ['evidence'], ['attention', 'evidence'], ['change', 'evidence'], ['change', 'evidence'],
    ['attention', 'boundary'], ['boundary'], ['attention'], ['evidence'],
  ],
  cloud: [
    ['timing', 'change'], ['change', 'evidence'], ['timing', 'evidence'], ['evidence'],
    ['timing'], ['boundary', 'evidence'], ['attention', 'boundary'], ['change'],
  ],
  rain: [
    ['timing', 'evidence'], ['change'], ['change'], ['timing', 'change'],
    ['change', 'boundary'], ['attention', 'evidence'], ['change', 'evidence'], ['boundary', 'evidence'],
  ],
  snow: [
    ['attention', 'change'], ['attention', 'evidence'], ['attention', 'evidence'], ['evidence'],
    ['change'], ['attention', 'evidence'], ['change'], ['attention', 'evidence'],
  ],
  storm: [
    ['timing'], ['evidence'], ['boundary'], ['timing'],
    ['boundary'], ['boundary', 'change'], ['attention'], ['timing', 'boundary'],
  ],
  fog: [
    ['change', 'evidence'], ['timing', 'boundary'], ['attention', 'evidence'], ['boundary'],
    ['attention', 'evidence'], ['boundary'], ['boundary'], ['attention', 'timing'],
  ],
};

const CLOSING_POSTURES = {
  cold: [['protect'], ['wait', 'release'], ['notice']],
  mild: [['act'], ['act'], ['wait', 'release']],
  warm: [['act'], ['wait', 'protect'], ['wait', 'protect', 'release']],
  night: [['wait'], ['wait'], ['wait', 'protect', 'release']],
};

const CLOSING_MOTIFS = {
  cold: [
    ['boundary'], ['timing', 'change'], ['attention', 'boundary', 'change', 'evidence'],
  ],
  mild: [
    ['attention', 'evidence'], ['boundary', 'evidence'], ['attention', 'evidence'],
  ],
  warm: [
    ['timing'], ['timing', 'boundary'], ['boundary', 'evidence'],
  ],
  night: [
    ['attention', 'boundary'], ['timing'], ['attention', 'evidence'],
  ],
};

function entriesForThread(lines, postureMap, motifMap, posture, motif) {
  return lines.filter((_, index) => (
    postureMap[index].includes(posture) && motifMap[index].includes(motif)
  ));
}

export function composeOmen(seed, weather, closing) {
  const weatherLines = OMEN_WEATHER_LINES[weather] || OMEN_WEATHER_LINES.clear;
  const weatherPostures = WEATHER_LINE_POSTURES[weather] || WEATHER_LINE_POSTURES.clear;
  const weatherMotifs = WEATHER_LINE_MOTIFS[weather] || WEATHER_LINE_MOTIFS.clear;
  const closingLines = OMEN_CLOSINGS[closing] || OMEN_CLOSINGS.mild;
  const closingPostures = CLOSING_POSTURES[closing] || CLOSING_POSTURES.mild;
  const closingMotifs = CLOSING_MOTIFS[closing] || CLOSING_MOTIFS.mild;
  const compatibleThreads = OMEN_POSTURES.flatMap((posture) => (
    OMEN_MOTIFS
      .filter((motif) => (
        entriesForThread(OMEN_OPENINGS, OPENING_POSTURES, OPENING_MOTIFS, posture, motif).length
        && entriesForThread(weatherLines, weatherPostures, weatherMotifs, posture, motif).length
        && entriesForThread(closingLines, closingPostures, closingMotifs, posture, motif).length
      ))
      .map((motif) => ({ posture, motif }))
  ));
  const thread = pickStable(compatibleThreads, seed);
  const { posture, motif } = thread;

  return {
    posture,
    motif,
    opening: pickStable(
      entriesForThread(OMEN_OPENINGS, OPENING_POSTURES, OPENING_MOTIFS, posture, motif),
      seed,
      1
    ),
    weatherLine: pickStable(
      entriesForThread(weatherLines, weatherPostures, weatherMotifs, posture, motif),
      seed,
      2
    ),
    closing: pickStable(
      entriesForThread(closingLines, closingPostures, closingMotifs, posture, motif),
      seed,
      3
    ),
  };
}

export function omenClosingFamily(temperature, isDay) {
  if (!isDay) return 'night';
  if (temperature < 12) return 'cold';
  if (temperature >= 24) return 'warm';
  return 'mild';
}

export function weatherFamily(code) {
  if ([45, 48].includes(code)) return 'fog';
  if (code >= 95) return 'storm';
  if ((code >= 71 && code <= 77) || [85, 86].includes(code)) return 'snow';
  if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82)) return 'rain';
  if ([1, 2, 3].includes(code)) return 'cloud';
  return 'clear';
}
