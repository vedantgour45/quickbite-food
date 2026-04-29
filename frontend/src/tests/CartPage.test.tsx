import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { CartPage } from '@/pages/CartPage';
import { useCartStore } from '@/store/cartStore';
import { sampleBurger, sampleMenuItem } from './fixtures';
import { renderWithProviders } from './testUtils';

beforeEach(() => {
  useCartStore.setState({ items: [] });
});

describe('CartPage', () => {
  it('shows empty state when cart has no items', () => {
    renderWithProviders(<CartPage />);
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /go back to menu/i }),
    ).toBeInTheDocument();
  });

  it('renders one row per cart item', () => {
    useCartStore.setState({
      items: [
        { ...sampleMenuItem, quantity: 2 },
        { ...sampleBurger, quantity: 1 },
      ],
    });
    renderWithProviders(<CartPage />);
    expect(
      screen.getByTestId(`cart-item-${sampleMenuItem.id}`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`cart-item-${sampleBurger.id}`),
    ).toBeInTheDocument();
  });

  it('clicking + on the stepper increments quantity', async () => {
    useCartStore.setState({
      items: [{ ...sampleMenuItem, quantity: 1 }],
    });
    const user = userEvent.setup();
    renderWithProviders(<CartPage />);
    const incButtons = screen.getAllByLabelText(/increase quantity/i);
    await user.click(incButtons[0]);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it('clicking the trash icon removes the item', async () => {
    useCartStore.setState({
      items: [{ ...sampleMenuItem, quantity: 1 }],
    });
    const user = userEvent.setup();
    renderWithProviders(<CartPage />);
    await user.click(
      screen.getByLabelText(`Remove ${sampleMenuItem.name}`),
    );
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('order summary shows correct subtotal, tax, and total', () => {
    useCartStore.setState({
      items: [
        { ...sampleMenuItem, quantity: 2 }, // 299 * 2 = 598
        { ...sampleBurger, quantity: 1 }, // 199
      ],
    });
    renderWithProviders(<CartPage />);
    // subtotal = 598 + 199 = 797, tax = 39.85, delivery = 40, total = 876.85
    expect(screen.getByTestId('summary-subtotal')).toHaveTextContent(
      '₹797.00',
    );
    expect(screen.getByTestId('summary-tax')).toHaveTextContent('₹39.85');
    expect(screen.getByTestId('summary-total')).toHaveTextContent(
      '₹876.85',
    );
  });
});
