import { useMutation } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '@/api/orderApi';
import { DeliveryForm } from '@/components/checkout/DeliveryForm';
import { useOrderTotals } from '@/components/cart/OrderSummary';
import { useToast } from '@/components/ui/toast';
import { useCart } from '@/hooks/useCart';
import type { Customer, Order } from '@/types';
import { formatPrice, formatPriceWhole } from '@/utils/formatters';
import { resolveImageUrl } from '@/utils/imageUrl';
import { MenuImage } from '@/components/menu/MenuImage';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const totals = useOrderTotals();
  const { show } = useToast();

  const isOrderPlaced = useRef(false);

  useEffect(() => {
    if (items.length === 0 && !isOrderPlaced.current) {
      navigate('/', { replace: true });
    }
  }, [items.length, navigate]);

  const mutation = useMutation<Order, Error, Customer>({
    mutationFn: (customer) =>
      placeOrder({
        items: items.map((i) => ({
          menuItemId: i.id,
          quantity: i.quantity,
        })),
        customer,
      }),
    onSuccess: (order) => {
      isOrderPlaced.current = true;
      clearCart();
      navigate(`/order/${order.id}`, { replace: true });
    },
    onError: () => {
      show('Failed to place order. Please try again.', 'error');
    },
  });

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="h-10 w-10 rounded-full bg-white border border-brand-100 flex items-center justify-center hover:bg-brand-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DeliveryForm
            onSubmit={(customer) => mutation.mutate(customer)}
            isSubmitting={mutation.isPending}
            totalLabel={formatPriceWhole(totals.total)}
          />
        </div>
        <div>
          <aside className="bg-white rounded-2xl border border-brand-50 shadow-sm p-6 space-y-5 sticky top-20">
            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
            <ul className="space-y-3 max-h-72 overflow-auto pr-1">
              {items.map((i) => (
                <li
                  key={i.id}
                  className="flex items-center gap-3 text-sm"
                >
                  <MenuImage
                    src={resolveImageUrl(i.image)}
                    alt={i.name}
                    category={i.category}
                    className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                    iconClassName="h-4 w-4"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {i.name}
                    </p>
                    <p className="text-xs text-gray-400">Qty: {i.quantity}</p>
                  </div>
                  <span className="font-medium">
                    {formatPriceWhole(i.price * i.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-brand-50 pt-4 space-y-1.5 text-sm">
              <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
              <Row label="Taxes & Fees" value={formatPrice(totals.tax)} />
              <Row
                label="Delivery Fee"
                value={formatPrice(totals.deliveryFee)}
              />
              <div className="flex items-center justify-between text-base font-bold pt-2 border-t border-dashed border-brand-100 mt-2">
                <span>Total</span>
                <span className="text-brand-600">
                  {formatPrice(totals.total)}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-gray-600">
    <span>{label}</span>
    <span className="text-gray-900 font-medium">{value}</span>
  </div>
);
