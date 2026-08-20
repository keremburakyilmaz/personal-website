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
  'Leave one question unanswered. It is safer while it thinks you have forgotten.',
  'Do not mistake urgency for direction. Something wants you moving before you look.',
  'An overlooked detail has survived every version of the story.',
  'The first explanation will arrive too quickly. Let it pass.',
  'Something ordinary will repeat once too often.',
  'A small delay is holding something closed.',
  'Return to the thought you dismissed. It has changed since then.',
  'The second attempt should happen before the first one finds its way back.',
  'Keep the smallest promise first. The others are listening.',
  'What you are avoiding became easier overnight. Ask what changed.',
  'A familiar route has acquired an exit you do not remember.',
  'Leave the unfinished thing where you can see it. Check it again at dusk.',
  'Someone will misunderstand you accurately.',
  'Begin with the part no one was meant to notice.',
  'An old assumption has begun making decisions without you.',
  'The quieter option is carrying a warning.',
  'Notice what only happens when no one is watching.',
  'A misplaced object will be found somewhere it has never been.',
  'Do not repair what changed while you were away.',
  'The answer will arrive as a practical detail with no clear owner.',
  'One refusal will close a door that should not have opened.',
  'The useful mistake has not happened yet. Do not volunteer for it.',
  'Choose the door that was not open yesterday.',
  'A repeated thought is rehearsing you.',
  'Let one expectation expire before it acquires a purpose of its own.',
  'The smallest task is where the damage first becomes visible.',
  'What feels late is ready now. It will not remain patient.',
  'A minor inconvenience is moving you out of something’s way.',
  'Keep the evidence that refuses to fit. It may be the only honest part.',
  'The next useful question will make the room go quiet.',
  'Something you stopped noticing has continued without you.',
  'Make room for the outcome no one remembers choosing.',
];

export const OMEN_WEATHER_LINES = {
  clear: [
    'Clarity will expose the wrong certainty first.',
    'The open sky leaves nowhere for the warning to hide.',
    'What is visible has already been altered.',
    'An unobstructed view will show you what moved.',
    'Use the brightness to inspect the edges. One of them is new.',
    'The horizon is offering distance, not escape.',
    'Nothing in the open sky requires an answer. Something below it does.',
    'Certainty will cast the wrong shadow today.',
  ],
  cloud: [
    'Wait for the shape of the problem to change. It already has.',
    'The clouds are moving. The shadow below them is not.',
    'A partial view is enough. Do not wait for the missing part to return.',
    'The missing outline is becoming more accurate.',
    'Let the day remain undecided until the second shadow passes.',
    'A softened edge may be hiding a sharper one.',
    'What is obscured has not disappeared. It has moved closer.',
    'Conditions are changing around the thing that remains still.',
  ],
  rain: [
    'Avoid conclusions made before the rain stops. One has already been made for you.',
    'Let one plan dissolve. Do not retrieve what the water carries off.',
    'What returns after the rain will not be in its original place.',
    'Allow the surface to become unreadable. Something underneath is correcting it.',
    'Water is redrawing a boundary you crossed without seeing.',
    'Listen beneath the rain. The repeated sound is not water.',
    'The inconvenient plan is the one that noticed the change.',
    'Do not measure progress by how dry you remain. Check what followed you inside.',
  ],
  snow: [
    'Quiet changes are accumulating where the light cannot reach.',
    'Preserve the first mark you make. The next one may not be yours.',
    'Move slowly enough to notice which tracks do not follow you.',
    'The blank surface has already recorded an arrival.',
    'Let accumulation make the decision. It has covered the alternative.',
    'The familiar route is missing one familiar thing.',
    'Do not restore what the snow chose to hide.',
    'Small differences will remain visible. Count them before dusk.',
  ],
  storm: [
    'Postpone the argument. The storm has learned your strongest point.',
    'The loudest signal is arriving from the wrong direction.',
    'Protect the fragile thing. The important one can already defend itself.',
    'Wait until intensity stops speaking in your voice.',
    'Not every interruption wants your attention. One wants the door.',
    'Secure what matters. Let the rest reveal what it came for.',
    'The first silence afterward will not be empty.',
    'Do not answer a signal at its loudest. It may hear you.',
  ],
  fog: [
    'Do not force distance to become certainty. It is moving.',
    'The next few metres are enough. Cross them before they change.',
    'Recognition will arrive before the thing it belongs to.',
    'Let proximity replace overview. The danger is already local.',
    'A slower pace will reveal who has been matching it.',
    'The hidden distance is not your problem. The shortening distance is.',
    'Trust the boundary you can touch. Do not touch it twice.',
    'What emerges gradually has had time to study you.',
  ],
};

export const OMEN_CLOSINGS = {
  cold: [
    'Keep one room warm even if no one enters it.',
    'The day will open slowly. Listen for the hinge that answers.',
    'Carry warmth. You may need to prove where you have been.',
  ],
  mild: [
    'The ordinary air will make the unusual thing harder to excuse.',
    'Nothing in the weather is responsible for what happens next.',
    'The day offers no resistance. Notice who uses that.',
  ],
  warm: [
    'Spend your energy before the heat decides where it goes.',
    'Leave room between effort and exhaustion. Something waits there.',
    'What needs shade has already been exposed.',
  ],
  night: [
    'Do not demand daylight logic from what follows you home.',
    'Leave one conclusion for morning. It may not survive the night.',
    'The dark is reducing the number of witnesses.',
  ],
};

const OMEN_POSTURES = ['wait', 'act', 'notice', 'protect', 'release'];

const OPENING_POSTURES = [
  ['wait'], ['wait'], ['notice'], ['wait'], ['notice'], ['wait', 'protect'],
  ['notice'], ['act'], ['act'], ['act'], ['notice'], ['wait'],
  ['notice', 'release'], ['act'], ['notice', 'release'], ['wait', 'notice'],
  ['notice'], ['notice'], ['wait', 'release'], ['notice'], ['protect', 'release'],
  ['wait'], ['act'], ['act', 'notice'], ['release'], ['act', 'notice'],
  ['act'], ['notice'], ['notice'], ['act'], ['notice'], ['release'],
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

const CLOSING_POSTURES = {
  cold: [['protect'], ['wait', 'release'], ['notice']],
  mild: [['act'], ['act'], ['wait', 'release']],
  warm: [['act'], ['wait', 'protect'], ['wait', 'protect', 'release']],
  night: [['wait'], ['wait'], ['wait', 'protect', 'release']],
};

function entriesForPosture(lines, postureMap, posture) {
  return lines.filter((_, index) => postureMap[index].includes(posture));
}

export function composeOmen(seed, weather, closing) {
  const weatherLines = OMEN_WEATHER_LINES[weather] || OMEN_WEATHER_LINES.clear;
  const weatherPostures = WEATHER_LINE_POSTURES[weather] || WEATHER_LINE_POSTURES.clear;
  const closingLines = OMEN_CLOSINGS[closing] || OMEN_CLOSINGS.mild;
  const closingPostures = CLOSING_POSTURES[closing] || CLOSING_POSTURES.mild;
  const compatiblePostures = OMEN_POSTURES.filter((posture) => (
    weatherPostures.some((postures) => postures.includes(posture))
    && closingPostures.some((postures) => postures.includes(posture))
    && OPENING_POSTURES.some((postures) => postures.includes(posture))
  ));
  const posture = pickStable(compatiblePostures, seed);

  return {
    posture,
    opening: pickStable(entriesForPosture(OMEN_OPENINGS, OPENING_POSTURES, posture), seed, 1),
    weatherLine: pickStable(entriesForPosture(weatherLines, weatherPostures, posture), seed, 2),
    closing: pickStable(entriesForPosture(closingLines, closingPostures, posture), seed, 3),
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
  if (code >= 71 && code <= 86) return 'snow';
  if (code >= 51 && code <= 82) return 'rain';
  if ([1, 2, 3].includes(code)) return 'cloud';
  return 'clear';
}
