import { Clock, Flame, Plus, Star } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import type { MenuItem } from '@/types';
import { formatPriceWhole } from '@/utils/formatters';
import { resolveImageUrl } from '@/utils/imageUrl';
import { QuantityStepper } from './QuantityStepper';

interface Props {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  onAdd: (item: MenuItem) => void;
}

export const MenuCard = ({ item, onSelect, onAdd }: Props) => {
  const { findItem, updateQuantity } = useCart();
  const cartItem = findItem(item.id);

  return (
    <article
      className="rounded-2xl bg-white shadow-sm border border-brand-50 overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onSelect(item)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
        <img
          src={resolveImageUrl(item.image)}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 text-xs font-semibold shadow-sm">
          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
          {item.rating.toFixed(1)}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {item.name}
          </h3>
          <span className="font-bold text-brand-600 whitespace-nowrap">
            {formatPriceWhole(item.price)}
          </span>
        </div>

        <p className="text-xs text-gray-500 line-clamp-2 flex-1">
          {item.description}
        </p>

        <div className="flex items-center gap-3 text-[11px] text-gray-500">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {item.prepTime}
          </span>
          <span className="inline-flex items-center gap-1">
            <Flame className="h-3 w-3" />
            {item.category}
          </span>
        </div>

        <div
          className="pt-1"
          onClick={(e) => e.stopPropagation()}
        >
          {cartItem ? (
            <QuantityStepper
              quantity={cartItem.quantity}
              onDecrement={() =>
                updateQuantity(item.id, cartItem.quantity - 1)
              }
              onIncrement={() =>
                updateQuantity(item.id, cartItem.quantity + 1)
              }
            />
          ) : (
            <button
              type="button"
              onClick={() => onAdd(item)}
              className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-brand-50 text-gray-600 hover:text-brand-700 text-sm font-semibold px-4 py-2 rounded-full transition-colors"
              aria-label={`Add ${item.name} to cart`}
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
