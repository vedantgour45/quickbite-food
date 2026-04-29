import { Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import type { CartItem as CartItemT } from '@/types';
import { formatPriceWhole } from '@/utils/formatters';
import { resolveImageUrl } from '@/utils/imageUrl';
import { QuantityStepper } from '@/components/menu/QuantityStepper';

interface Props {
  item: CartItemT;
}

export const CartItem = ({ item }: Props) => {
  const { updateQuantity, removeItem } = useCart();
  const lineTotal = item.price * item.quantity;

  return (
    <div
      data-testid={`cart-item-${item.id}`}
      className="flex items-center gap-4 bg-white rounded-2xl border border-brand-50 p-3 shadow-sm"
    >
      <img
        src={resolveImageUrl(item.image)}
        alt={item.name}
        className="h-[60px] w-[60px] rounded-xl object-cover flex-shrink-0"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{item.name}</p>
        <p className="text-sm font-bold text-brand-600 mt-0.5">
          {formatPriceWhole(lineTotal)}
        </p>
      </div>
      <QuantityStepper
        quantity={item.quantity}
        size="sm"
        onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
        onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
      />
      <button
        type="button"
        aria-label={`Remove ${item.name}`}
        onClick={() => removeItem(item.id)}
        className="text-gray-400 hover:text-brand-600 p-2 rounded-full hover:bg-brand-50 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};
