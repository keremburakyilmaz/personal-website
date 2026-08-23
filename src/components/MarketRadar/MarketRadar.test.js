import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import MarketRadar from './MarketRadar';
import { fetchLatestSnapshot, MarketRadarDataError } from './marketRadarData';
import { createPreviewSnapshot } from './previewSnapshot';

jest.mock('./marketRadarData', () => {
  const actual = jest.requireActual('./marketRadarData');
  return {
    ...actual,
    fetchLatestSnapshot: jest.fn(),
  };
});

describe('Market Radar interface', () => {
  beforeEach(() => {
    fetchLatestSnapshot.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders the verified snapshot contract and filters evidence to Türkiye', async () => {
    const snapshot = createPreviewSnapshot(new Date('2026-08-23T12:00:00Z'));
    snapshot.calendar[0].status = 'released';
    snapshot.calendar[0].actual = '3.1%';
    snapshot.calendar[0].forecast = '3.0%';
    fetchLatestSnapshot.mockResolvedValue({
      manifest: { publishedAt: '2026-08-23T12:00:05Z' },
      snapshot,
    });

    render(<MarketRadar />);

    expect(await screen.findByRole('heading', { name: 'Driver ledger' })).toBeInTheDocument();
    expect(screen.getAllByText('U.S. Treasury 2Y')).not.toHaveLength(0);
    expect(screen.getAllByText('CBRT USD/TRY')).not.toHaveLength(0);
    expect(screen.getByText('US / high / released')).toBeInTheDocument();
    expect(screen.getByText('Actual 3.1% / Forecast 3.0% / Previous Illustrative'))
      .toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Türkiye' }));

    expect(screen.getByRole('button', { name: 'Türkiye' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByText('U.S. Treasury 2Y')).not.toBeInTheDocument();
    expect(screen.getAllByText('CBRT USD/TRY')).not.toHaveLength(0);
  });

  test('fails closed and retries the public feed', async () => {
    const snapshot = createPreviewSnapshot(new Date('2026-08-23T12:00:00Z'));
    fetchLatestSnapshot
      .mockRejectedValueOnce(new MarketRadarDataError('Latest manifest could not be reached.'))
      .mockResolvedValueOnce({
        manifest: { publishedAt: '2026-08-23T12:00:05Z' },
        snapshot,
      });

    render(<MarketRadar />);

    expect(await screen.findByText('Snapshot unavailable')).toBeInTheDocument();
    expect(screen.getByText(/will not substitute stale demo numbers/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Retry public feed' }));

    await waitFor(() => expect(fetchLatestSnapshot).toHaveBeenCalledTimes(2));
    expect(await screen.findByRole('heading', { name: 'Driver ledger' })).toBeInTheDocument();
  });

  test('marks an open snapshot expired when its validity window ends', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-08-23T18:29:59Z'));
    const snapshot = createPreviewSnapshot(new Date('2026-08-23T12:00:00Z'));
    fetchLatestSnapshot.mockResolvedValue({
      manifest: { publishedAt: '2026-08-23T12:00:05Z' },
      snapshot,
    });

    render(<MarketRadar />);
    await act(async () => {});

    const rail = screen.getByLabelText('Snapshot status');
    expect(within(rail).getByText('healthy')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(within(rail).getByText('expired')).toBeInTheDocument();
  });
});
