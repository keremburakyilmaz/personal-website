import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LabRoute from './LabRoute';
import SystemRunning from '../system-is-running/SystemRunning';

beforeEach(() => {
  global.fetch = jest.fn(() => new Promise(() => {}));
  HTMLCanvasElement.prototype.getContext = jest.fn(() => null);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders the lab index and requested experiments', () => {
  render(
    <MemoryRouter>
      <LabRoute />
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: /small instruments/i })).toBeInTheDocument();
  expect(screen.getAllByText('Found Object').length).toBeGreaterThan(0);
  expect(screen.queryByText('The System Is Listening')).not.toBeInTheDocument();
  expect(screen.getAllByText('Internet Weather').length).toBeGreaterThan(0);
  expect(screen.queryByText('Leave This Here')).not.toBeInTheDocument();
  expect(screen.queryByText('The Button Has Concerns')).not.toBeInTheDocument();
  expect(screen.queryByText('A Very Small Universe')).not.toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalled();
});

test('system remains separate from the lab', () => {
  render(
    <MemoryRouter initialEntries={['/system?mode=listening']}>
      <SystemRunning />
    </MemoryRouter>
  );

  expect(screen.getByText('the system is running')).toBeInTheDocument();
  expect(screen.queryByText(/system is listening/i)).not.toBeInTheDocument();
});
