export const LAB_EXPERIMENTS = [
  {
    number: '001',
    slug: 'found-object',
    title: 'Found Object',
    type: 'ARCHIVE',
    status: 'LIVE',
    description: 'Give the archive a thought. It will return an object.',
  },
  {
    number: '003',
    slug: 'somewhere',
    title: 'Somewhere, It Is…',
    type: 'WEATHER',
    status: 'LIVE',
    description: 'A live postcard from a place that did not ask to be observed.',
  },
  {
    number: '004',
    slug: 'word-corridor',
    title: 'Word Corridor',
    type: 'LANGUAGE',
    status: 'LIVE',
    description: 'Choose a word. Keep choosing until it becomes somewhere else.',
  },
  {
    number: '005',
    slug: 'minor-omen',
    title: 'Minor Omen',
    type: 'RULE SYSTEM',
    status: 'DAILY',
    description: 'One small, deterministic warning for Istanbul each day.',
  },
  {
    number: '008',
    slug: 'museum-detail',
    title: 'Museum Detail',
    type: 'ARCHIVE',
    status: 'LIVE',
    description: 'The archive gives you a fragment before it gives you the whole.',
  },
  {
    number: '010',
    slug: 'internet-weather',
    title: 'Internet Weather',
    type: 'BROWSER',
    status: 'LOCAL',
    description: 'A fictional forecast derived from conditions around this browser.',
  },
];

export function experimentPath(experiment) {
  return `/lab/${experiment.slug}`;
}

export function experimentNeighbors(slug) {
  const index = LAB_EXPERIMENTS.findIndex((experiment) => experiment.slug === slug);
  if (index < 0) return null;
  return {
    experiment: LAB_EXPERIMENTS[index],
    previous: LAB_EXPERIMENTS[(index - 1 + LAB_EXPERIMENTS.length) % LAB_EXPERIMENTS.length],
    next: LAB_EXPERIMENTS[(index + 1) % LAB_EXPERIMENTS.length],
  };
}
