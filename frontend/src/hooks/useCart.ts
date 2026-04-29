import { useCartDerived, useCartStore } from '@/store/cartStore';

export const useCart = () => {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const { itemCount, subtotal } = useCartDerived();

  const findItem = (id: string) => items.find((i) => i.id === id);

  return {
    items,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    findItem,
  };
};
