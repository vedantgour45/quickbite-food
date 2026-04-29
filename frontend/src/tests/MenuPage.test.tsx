import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/api/menuApi', () => ({
  fetchMenu: vi.fn(),
  fetchMenuItem: vi.fn(),
}));

import { fetchMenu } from '@/api/menuApi';
import { MenuPage } from '@/pages/MenuPage';
import { useCartStore } from '@/store/cartStore';
import { sampleBurger, sampleMenuItem } from './fixtures';
import { renderWithProviders } from './testUtils';

const fetchMenuMock = vi.mocked(fetchMenu);

beforeEach(() => {
  useCartStore.setState({ items: [] });
  fetchMenuMock.mockReset();
});

describe('MenuPage', () => {
  it('shows skeleton cards while loading', () => {
    fetchMenuMock.mockImplementation(() => new Promise(() => {}));
    renderWithProviders(<MenuPage />);
    expect(screen.getByTestId('menu-loading')).toBeInTheDocument();
  });

  it('shows error state with retry on failure', async () => {
    fetchMenuMock.mockRejectedValue(new Error('boom'));
    renderWithProviders(<MenuPage />);
    await waitFor(() =>
      expect(screen.getByTestId('menu-error')).toBeInTheDocument(),
    );
    expect(screen.getByRole('button', { name: /try again/i })).toBeEnabled();
  });

  it('renders menu items on success', async () => {
    fetchMenuMock.mockResolvedValue([sampleMenuItem, sampleBurger]);
    renderWithProviders(<MenuPage />);
    await waitFor(() =>
      expect(screen.getByText(sampleMenuItem.name)).toBeInTheDocument(),
    );
    expect(screen.getByText(sampleBurger.name)).toBeInTheDocument();
  });

  it('category filter hides items not in the selected category', async () => {
    fetchMenuMock.mockResolvedValue([sampleMenuItem, sampleBurger]);
    const user = userEvent.setup();
    renderWithProviders(<MenuPage />);
    await waitFor(() =>
      expect(screen.getByText(sampleMenuItem.name)).toBeInTheDocument(),
    );
    await user.click(screen.getByRole('tab', { name: /pizza/i }));
    expect(screen.getByText(sampleMenuItem.name)).toBeInTheDocument();
    expect(screen.queryByText(sampleBurger.name)).not.toBeInTheDocument();
  });

  it('search bar filters items by name (after debounce)', async () => {
    fetchMenuMock.mockResolvedValue([sampleMenuItem, sampleBurger]);
    const user = userEvent.setup();
    renderWithProviders(<MenuPage />);
    await waitFor(() =>
      expect(screen.getByText(sampleMenuItem.name)).toBeInTheDocument(),
    );
    const search = screen.getByLabelText(/search menu/i);
    await user.type(search, 'burger');
    await waitFor(
      () => {
        expect(screen.queryByText(sampleMenuItem.name)).not.toBeInTheDocument();
        expect(screen.getByText(sampleBurger.name)).toBeInTheDocument();
      },
      { timeout: 1500 },
    );
  });

  it('clicking Add adds the item to the cart store', async () => {
    fetchMenuMock.mockResolvedValue([sampleMenuItem]);
    const user = userEvent.setup();
    renderWithProviders(<MenuPage />);
    await waitFor(() =>
      expect(screen.getByText(sampleMenuItem.name)).toBeInTheDocument(),
    );
    await user.click(
      screen.getByRole('button', { name: /add margherita pizza/i }),
    );
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].id).toBe(sampleMenuItem.id);
  });
});
