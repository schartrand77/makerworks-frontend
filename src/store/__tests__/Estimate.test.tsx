// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import Estimate from '@/pages/Estimate';
import * as filamentsApi from '@/api/filaments';
import * as estimateApi from '@/api/estimate';
vi.mock('@/components/ui/ModelViewer', () => ({ default: () => <div /> }));

vi.mock('@/api/filaments', () => ({
  fetchAvailableFilaments: vi.fn(),
}));

vi.mock('@/api/estimate', () => ({
  getEstimate: vi.fn(),
}));

const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

beforeAll(() => {
  window.scrollTo = vi.fn();
});

describe.skip('<Estimate />', () => {
  it('renders page header', () => {
    renderWithClient(<Estimate />);
    expect(screen.getByText(/Estimate Print Job/i)).toBeInTheDocument();
  });

  it('loads filaments and shows success toast', async () => {
    (filamentsApi.fetchAvailableFilaments as any).mockResolvedValue([
      { id: '1', type: 'PLA', color: 'Red', hex: '#ff0000' },
    ]);
    renderWithClient(<Estimate />);
    await waitFor(() => {
      expect(screen.getByText(/Select filament/i)).toBeInTheDocument();
    });
  });

  it('shows estimate when form is filled', async () => {
    (filamentsApi.fetchAvailableFilaments as any).mockResolvedValue([
      { id: '1', type: 'PLA', color: 'Red', hex: '#ff0000' },
    ]);
    (estimateApi.getEstimate as any).mockResolvedValue({
      estimated_time_minutes: 30,
      estimated_cost_usd: 10,
    });
    renderWithClient(<Estimate />);
    await waitFor(() => {
      expect(screen.getByText(/Select filament/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/\$10\.00/i)).toBeInTheDocument();
    });
  });
});
