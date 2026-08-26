const { copyFileSync, mkdirSync } = require('node:fs');
const { join } = require('node:path');

const buildDirectory = join(__dirname, '..', 'build');
const sourceIndex = join(buildDirectory, 'index.html');
const staticRoutes = [
  'projects',
  'resume',
  'contact',
  'spotify-brain',
  'quantfusion',
  'market-radar',
  'palimpsest',
  'system',
  'lab',
  'lab/found-object',
  'lab/somewhere',
  'lab/word-corridor',
  'lab/minor-omen',
  'lab/museum-detail',
  'lab/internet-weather',
  'be-my-valentine',
];

for (const route of staticRoutes) {
  const routeDirectory = join(buildDirectory, route);
  mkdirSync(routeDirectory, { recursive: true });
  copyFileSync(sourceIndex, join(routeDirectory, 'index.html'));
}

console.log(`Created static fallbacks for: ${staticRoutes.join(', ')}`);
