import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RunningPortfolio from './components/RunningPortfolio/RunningPortfolio';

test('renders the systems portfolio', () => {
  render(
    <MemoryRouter>
      <RunningPortfolio />
    </MemoryRouter>
  );
  expect(screen.getByRole('heading', { name: /systems that keep running/i })).toBeInTheDocument();
  expect(screen.getByText('QUANTFUSION')).toBeInTheDocument();
});
