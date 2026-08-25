const { copyFileSync, mkdirSync } = require('node:fs');
const { join } = require('node:path');

const buildDirectory = join(__dirname, '..', 'build');
const sourceIndex = join(buildDirectory, 'index.html');
const staticRoutes = ['market-radar'];

for (const route of staticRoutes) {
  const routeDirectory = join(buildDirectory, route);
  mkdirSync(routeDirectory, { recursive: true });
  copyFileSync(sourceIndex, join(routeDirectory, 'index.html'));
}

console.log(`Created static fallbacks for: ${staticRoutes.join(', ')}`);
