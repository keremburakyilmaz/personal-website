import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://keremburakyilmaz.com';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

const ROUTE_METADATA = {
  '/': {
    title: 'Kerem Burak Yılmaz | Systems Engineer',
    description: 'Kerem Burak Yılmaz builds production AI systems, ML pipelines, financial intelligence backends, and product infrastructure.',
  },
  '/spotify-brain': {
    title: 'Spotify Brain | Kerem Burak Yılmaz',
    description: 'An interactive listening-intelligence system that maps recent music, mood trajectories, predictions, and model performance.',
  },
  '/quantfusion': {
    title: 'QuantFusion | Kerem Burak Yılmaz',
    description: 'An inspectable portfolio-intelligence interface for allocation, risk, optimization, market regimes, and financial signals.',
  },
  '/market-radar': {
    title: 'Market Radar | Kerem Burak Yılmaz',
    description: 'An experimental market-monitoring interface for stories, signals, regimes, and scheduled events.',
  },
  '/palimpsest': {
    title: 'Palimpsest | Kerem Burak Yılmaz',
    description: 'An interactive narrative experiment about memory, choices, repetition, and the traces a reader leaves behind.',
  },
  '/system': {
    title: 'The System Is Running | Kerem Burak Yılmaz',
    description: 'A live generative systems interface tracking processes, loops, cognitive load, and an overcommitted machine.',
  },
  '/lab': {
    title: 'Lab | Kerem Burak Yılmaz',
    description: 'Small interactive browser instruments built from archives, weather, language, rules, and unnecessary observations.',
  },
  '/lab/found-object': {
    title: 'Found Object | Lab',
    description: 'Give the archive a thought and receive an unexpected museum object in return.',
  },
  '/lab/somewhere': {
    title: 'Somewhere, It Is… | Lab',
    description: 'A live atmospheric postcard from a randomly selected place and its current weather.',
  },
  '/lab/word-corridor': {
    title: 'Word Corridor | Lab',
    description: 'Choose one word after another until language becomes somewhere else.',
  },
  '/lab/minor-omen': {
    title: 'Minor Omen | Lab',
    description: 'A small deterministic daily warning assembled from the conditions around Istanbul.',
  },
  '/lab/museum-detail': {
    title: 'Museum Detail | Lab',
    description: 'See an archival fragment before the museum reveals the object it belongs to.',
  },
  '/lab/internet-weather': {
    title: 'Internet Weather | Lab',
    description: 'A fictional forecast derived from the conditions surrounding this browser.',
  },
  '/be-my-valentine': {
    title: 'Be My Valentine',
    description: 'A private interactive love letter.',
  },
};

function setMeta(selector, attribute, value) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    const [key, keyValue] = attribute;
    element.setAttribute(key, keyValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', value);
}

export default function PageMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const metadata = ROUTE_METADATA[pathname] || {
      title: '404 | Kerem Burak Yılmaz',
      description: 'The requested path does not exist on keremburakyilmaz.com.',
    };
    const canonicalUrl = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;

    document.title = metadata.title;
    document.head.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
    setMeta('meta[name="description"]', ['name', 'description'], metadata.description);
    setMeta('meta[property="og:title"]', ['property', 'og:title'], metadata.title);
    setMeta('meta[property="og:description"]', ['property', 'og:description'], metadata.description);
    setMeta('meta[property="og:url"]', ['property', 'og:url'], canonicalUrl);
    setMeta('meta[property="og:image"]', ['property', 'og:image'], DEFAULT_IMAGE);
    setMeta('meta[name="twitter:title"]', ['name', 'twitter:title'], metadata.title);
    setMeta('meta[name="twitter:description"]', ['name', 'twitter:description'], metadata.description);
    setMeta('meta[name="twitter:image"]', ['name', 'twitter:image'], DEFAULT_IMAGE);
  }, [pathname]);

  return null;
}
