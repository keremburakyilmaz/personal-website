import { render, screen } from '@testing-library/react';
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
  expect(screen.getByText('05 ACTIVE')).toBeInTheDocument();
  expect(screen.getAllByText('MARKET RADAR').length).toBeGreaterThan(0);
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
