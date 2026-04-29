import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/api/orderApi', () => ({
  placeOrder: vi.fn(),
  fetchOrder: vi.fn(),
}));

import { placeOrder } from '@/api/orderApi';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { useCartStore } from '@/store/cartStore';
import type { Order } from '@/types';
import { sampleMenuItem } from './fixtures';
import { renderWithProviders } from './testUtils';

const placeOrderMock = vi.mocked(placeOrder);

const fakeOrder: Order = {
  id: 'ORD-12345',
  items: [
    {
      menuItemId: sampleMenuItem.id,
      name: sampleMenuItem.name,
      quantity: 1,
      price: sampleMenuItem.price,
    },
  ],
  customer: {
    name: 'Alex Morgan',
    phone: '9876543210',
    address: '123 Jubilee Hills, Hyderabad',
    pincode: '500033',
  },
  status: 'received',
  statusHistory: [{ status: 'received', at: new Date().toISOString() }],
  subtotal: sampleMenuItem.price,
  deliveryFee: 40,
  tax: Math.round(sampleMenuItem.price * 0.05 * 100) / 100,
  total: sampleMenuItem.price + 40 + sampleMenuItem.price * 0.05,
  createdAt: new Date().toISOString(),
  estimatedDelivery: '12:55 PM',
};

beforeEach(() => {
  useCartStore.setState({
    items: [{ ...sampleMenuItem, quantity: 1 }],
  });
  placeOrderMock.mockReset();
});

const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/^full name$/i), 'Alex Morgan');
  await user.type(screen.getByLabelText(/^phone number$/i), '9876543210');
  await user.type(
    screen.getByLabelText(/^street address$/i),
    '123 Jubilee Hills, Hyderabad',
  );
  await user.type(screen.getByLabelText(/^pincode$/i), '500033');
};

describe('CheckoutPage', () => {
  it('shows error under Name when submitted empty', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CheckoutPage />);
    await user.click(screen.getByRole('button', { name: /place order/i }));
    await waitFor(() =>
      expect(
        screen.getByText(/name must be at least 2 characters/i),
      ).toBeInTheDocument(),
    );
  });

  it('shows error under Phone for an invalid number', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CheckoutPage />);
    await user.type(screen.getByLabelText(/^phone number$/i), '12345');
    await user.click(screen.getByRole('button', { name: /place order/i }));
    await waitFor(() =>
      expect(
        screen.getByText(/please enter a valid phone number/i),
      ).toBeInTheDocument(),
    );
  });

  it('shows error under Address when too short', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CheckoutPage />);
    await user.type(screen.getByLabelText(/^street address$/i), 'short');
    await user.click(screen.getByRole('button', { name: /place order/i }));
    await waitFor(() =>
      expect(
        screen.getByText(/address must be at least 10 characters/i),
      ).toBeInTheDocument(),
    );
  });

  it('calls POST /api/orders with the correct payload on valid submit', async () => {
    placeOrderMock.mockResolvedValue(fakeOrder);
    const user = userEvent.setup();
    renderWithProviders(<CheckoutPage />);
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /place order/i }));
    await waitFor(() => expect(placeOrderMock).toHaveBeenCalledTimes(1));
    expect(placeOrderMock).toHaveBeenCalledWith({
      items: [{ menuItemId: sampleMenuItem.id, quantity: 1 }],
      customer: {
        name: 'Alex Morgan',
        phone: '9876543210',
        address: '123 Jubilee Hills, Hyderabad',
        pincode: '500033',
      },
    });
  });

  it('clears the cart on success', async () => {
    placeOrderMock.mockResolvedValue(fakeOrder);
    const user = userEvent.setup();
    renderWithProviders(<CheckoutPage />);
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /place order/i }));
    await waitFor(() =>
      expect(useCartStore.getState().items).toHaveLength(0),
    );
  });

  it('shows error toast when API call fails', async () => {
    placeOrderMock.mockRejectedValue(new Error('network'));
    const user = userEvent.setup();
    renderWithProviders(<CheckoutPage />);
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /place order/i }));
    await waitFor(() =>
      expect(
        screen.getByText(/failed to place order/i),
      ).toBeInTheDocument(),
    );
  });
});
