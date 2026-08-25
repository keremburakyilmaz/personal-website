import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import RunningPortfolio from './components/RunningPortfolio/RunningPortfolio';

test('renders the systems portfolio', () => {
  render(
    <MemoryRouter>
      <RunningPortfolio />
    </MemoryRouter>
  );
  expect(screen.getByRole('heading', { name: /systems that keep running/i })).toBeInTheDocument();
  expect(screen.getAllByText('QUANTFUSION').length).toBeGreaterThan(0);
  expect(screen.getByText('06 ACTIVE')).toBeInTheDocument();
  expect(screen.getAllByText('MARKET RADAR').length).toBeGreaterThan(0);
  expect(screen.getAllByText('LAB').length).toBeGreaterThan(0);
  expect(screen.getByText('Quantus Labs')).toBeInTheDocument();
  expect(screen.getByText('Software Engineering')).toBeInTheDocument();
  expect(screen.getByText('June 2026 - Present')).toBeInTheDocument();
  expect(
    within(screen.getByRole('region', { name: /live machine note/i }))
      .getByRole('link', { name: /no current market read/i })
  ).toHaveAttribute('href', '/market-radar');
});

test('renders the custom 404 page for an unknown route', () => {
  render(
    <MemoryRouter initialEntries={['/not-a-real-route']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByRole('banner')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /this path does not belong to the system/i })).toBeInTheDocument();
  expect(screen.getByText('/not-a-real-route')).toBeInTheDocument();
});
