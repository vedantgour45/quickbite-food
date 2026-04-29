import { beforeEach, describe, expect, it } from 'vitest';
import { useCartStore } from '@/store/cartStore';
import { sampleBurger, sampleMenuItem } from './fixtures';

const reset = () => useCartStore.setState({ items: [] });

const subtotalOf = () =>
  useCartStore
    .getState()
    .items.reduce((sum, i) => sum + i.price * i.quantity, 0);

const itemCountOf = () =>
  useCartStore
    .getState()
    .items.reduce((sum, i) => sum + i.quantity, 0);

describe('cartStore', () => {
  beforeEach(() => {
    reset();
  });

  it('addItem adds a new item with quantity 1', () => {
    useCartStore.getState().addItem(sampleMenuItem);
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(sampleMenuItem.id);
    expect(items[0].quantity).toBe(1);
  });

  it('addItem on an existing item increments quantity', () => {
    const { addItem } = useCartStore.getState();
    addItem(sampleMenuItem);
    addItem(sampleMenuItem);
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it('removeItem removes the item completely', () => {
    const { addItem, removeItem } = useCartStore.getState();
    addItem(sampleMenuItem);
    addItem(sampleBurger);
    removeItem(sampleMenuItem.id);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].id).toBe(sampleBurger.id);
  });

  it('updateQuantity to 0 removes the item', () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    addItem(sampleMenuItem);
    updateQuantity(sampleMenuItem.id, 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('clearCart empties the items array', () => {
    const { addItem, clearCart } = useCartStore.getState();
    addItem(sampleMenuItem);
    addItem(sampleBurger);
    clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('itemCount returns correct sum of all quantities', () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    addItem(sampleMenuItem);
    addItem(sampleMenuItem);
    addItem(sampleBurger);
    updateQuantity(sampleBurger.id, 3);
    expect(itemCountOf()).toBe(5);
  });

  it('subtotal returns correct sum of price * quantity', () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    addItem(sampleMenuItem); // 299 * 1
    addItem(sampleBurger); // 199 * 1
    updateQuantity(sampleBurger.id, 2); // 199 * 2 = 398
    expect(subtotalOf()).toBe(299 + 398);
  });
});
