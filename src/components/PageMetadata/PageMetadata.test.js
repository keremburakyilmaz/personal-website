import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PageMetadata from './PageMetadata';

test('normalizes a trailing slash when selecting route metadata', () => {
  render(
    <MemoryRouter initialEntries={['/market-radar/']}>
      <PageMetadata />
    </MemoryRouter>
  );

  expect(document.title).toBe('Market Radar | Kerem Burak Yılmaz');
  expect(document.head.querySelector('meta[property="og:url"]')).toHaveAttribute(
    'content',
    'https://keremburakyilmaz.com/market-radar'
  );
});
