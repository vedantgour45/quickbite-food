import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

interface MockEventSourceLike {
  onmessage: ((ev: MessageEvent) => void) | null;
  emit: (data: unknown) => void;
}

declare global {
  // eslint-disable-next-line no-var
  var MockEventSource: {
    instances: MockEventSourceLike[];
  };
}

vi.mock('@/api/orderApi', () => ({
  fetchOrder: vi.fn(),
  placeOrder: vi.fn(),
}));

import { fetchOrder } from '@/api/orderApi';
import { ToastProvider } from '@/components/ui/toast';
import { OrderTrackingPage } from '@/pages/OrderTrackingPage';
import type { Order, OrderStatus } from '@/types';

const fetchOrderMock = vi.mocked(fetchOrder);

const STATUS_FLOW: OrderStatus[] = [
  'received',
  'preparing',
  'out_for_delivery',
  'delivered',
];

const buildOrder = (status: OrderStatus): Order => {
  const idx = STATUS_FLOW.indexOf(status);
  const baseTime = new Date('2026-04-28T12:15:00').getTime();
  const history = STATUS_FLOW.slice(0, idx + 1).map((s, i) => ({
    status: s,
    at: new Date(baseTime + i * 15 * 60_000).toISOString(),
  }));
  return {
    id: 'ORD-12345',
    items: [
      {
        menuItemId: 'pizza-margherita',
        name: 'Margherita Pizza',
        quantity: 1,
        price: 299,
      },
    ],
    customer: {
      name: 'Alex Morgan',
      phone: '9876543210',
      address: '123 Jubilee Hills, Hyderabad',
      pincode: '500033',
    },
    status,
    statusHistory: history,
    subtotal: 299,
    deliveryFee: 40,
    tax: 14.95,
    total: 353.95,
    createdAt: new Date(baseTime).toISOString(),
    estimatedDelivery: '12:55 PM',
  };
};

const renderTrackingPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/order/ORD-12345']}>
        <ToastProvider>
          <Routes>
            <Route path="/order/:id" element={<OrderTrackingPage />} />
          </Routes>
        </ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

beforeEach(() => {
  fetchOrderMock.mockReset();
  if (globalThis.MockEventSource?.instances) {
    globalThis.MockEventSource.instances.length = 0;
  }
});

describe('OrderTrackingPage', () => {
  it('renders all four status steps', async () => {
    fetchOrderMock.mockResolvedValue(buildOrder('received'));
    renderTrackingPage();
    await waitFor(() =>
      expect(screen.getByText(/order received/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/preparing your food/i)).toBeInTheDocument();
    expect(screen.getByText(/out for delivery/i)).toBeInTheDocument();
    expect(screen.getByText(/^delivered$/i)).toBeInTheDocument();
  });

  it('marks the current status as active', async () => {
    fetchOrderMock.mockResolvedValue(buildOrder('preparing'));
    renderTrackingPage();
    await waitFor(() => {
      const active = screen.getAllByTestId('status-step-active');
      expect(active).toHaveLength(1);
    });
  });

  it('marks earlier steps as completed', async () => {
    fetchOrderMock.mockResolvedValue(buildOrder('out_for_delivery'));
    renderTrackingPage();
    await waitFor(() => {
      const completed = screen.getAllByTestId('status-step-completed');
      expect(completed.length).toBe(2);
    });
  });

  it('marks later steps as pending', async () => {
    fetchOrderMock.mockResolvedValue(buildOrder('received'));
    renderTrackingPage();
    await waitFor(() => {
      const pending = screen.getAllByTestId('status-step-pending');
      expect(pending.length).toBe(3);
    });
  });

  it('does not render delivery agent card when status is received', async () => {
    fetchOrderMock.mockResolvedValue(buildOrder('received'));
    renderTrackingPage();
    await waitFor(() =>
      expect(screen.getByText(/order received/i)).toBeInTheDocument(),
    );
    expect(
      screen.queryByTestId('delivery-agent-card'),
    ).not.toBeInTheDocument();
  });

  it('renders delivery agent card when status is out_for_delivery', async () => {
    fetchOrderMock.mockResolvedValue(buildOrder('out_for_delivery'));
    renderTrackingPage();
    await waitFor(() =>
      expect(screen.getByTestId('delivery-agent-card')).toBeInTheDocument(),
    );
    expect(screen.getByText(/ravi kumar/i)).toBeInTheDocument();
  });

  it('advances the tracker live when an SSE event arrives', async () => {
    fetchOrderMock.mockResolvedValue(buildOrder('received'));
    renderTrackingPage();
    await waitFor(() =>
      expect(screen.getAllByTestId('status-step-active')[0]).toHaveTextContent(
        /order received/i,
      ),
    );

    const source = globalThis.MockEventSource.instances.at(-1);
    expect(source).toBeDefined();
    act(() => {
      source?.emit({
        id: 'ORD-12345',
        status: 'preparing',
        at: new Date().toISOString(),
      });
    });

    await waitFor(() => {
      expect(
        screen.getAllByTestId('status-step-active')[0],
      ).toHaveTextContent(/preparing your food/i);
    });
    expect(screen.getAllByTestId('status-step-completed')).toHaveLength(1);
  });
});
