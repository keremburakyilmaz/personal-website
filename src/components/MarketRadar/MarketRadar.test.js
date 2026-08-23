import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

  test('renders the verified snapshot contract and filters evidence to Türkiye', async () => {
    const snapshot = createPreviewSnapshot(new Date('2026-08-23T12:00:00Z'));
    fetchLatestSnapshot.mockResolvedValue({ snapshot });

    render(<MarketRadar />);

    expect(await screen.findByRole('heading', { name: 'Driver ledger' })).toBeInTheDocument();
    expect(screen.getAllByText('U.S. Treasury 2Y')).not.toHaveLength(0);
    expect(screen.getAllByText('CBRT USD/TRY')).not.toHaveLength(0);

    fireEvent.click(screen.getByRole('button', { name: 'Türkiye' }));

    expect(screen.getByRole('button', { name: 'Türkiye' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByText('U.S. Treasury 2Y')).not.toBeInTheDocument();
    expect(screen.getAllByText('CBRT USD/TRY')).not.toHaveLength(0);
  });

  test('fails closed and retries the public feed', async () => {
    const snapshot = createPreviewSnapshot(new Date('2026-08-23T12:00:00Z'));
    fetchLatestSnapshot
      .mockRejectedValueOnce(new MarketRadarDataError('Latest manifest could not be reached.'))
      .mockResolvedValueOnce({ snapshot });

    render(<MarketRadar />);

    expect(await screen.findByText('Snapshot unavailable')).toBeInTheDocument();
    expect(screen.getByText(/will not substitute stale demo numbers/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Retry public feed' }));

    await waitFor(() => expect(fetchLatestSnapshot).toHaveBeenCalledTimes(2));
    expect(await screen.findByRole('heading', { name: 'Driver ledger' })).toBeInTheDocument();
  });
});
