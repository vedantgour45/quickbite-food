import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/formatters';

const DELIVERY_FEE = 40;
const TAX_RATE = 0.05;

export const useOrderTotals = () => {
  const { subtotal, itemCount } = useCart();
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + DELIVERY_FEE + tax) * 100) / 100;
  return { subtotal, tax, deliveryFee: DELIVERY_FEE, total, itemCount };
};

export const OrderSummary = () => {
  const navigate = useNavigate();
  const { subtotal, tax, deliveryFee, total, itemCount } = useOrderTotals();

  return (
    <aside
      data-testid="order-summary"
      className="bg-white rounded-2xl border border-brand-50 shadow-sm p-6 space-y-4"
    >
      <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span data-testid="summary-subtotal" className="font-medium">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-medium">{formatPrice(deliveryFee)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Taxes &amp; Fees</span>
          <span data-testid="summary-tax" className="font-medium">
            {formatPrice(tax)}
          </span>
        </div>
      </div>

      <div className="border-t border-dashed border-brand-100 pt-4">
        <div className="flex items-end justify-between">
          <p className="text-base font-semibold text-gray-900">Total</p>
          <p
            data-testid="summary-total"
            className="text-xl font-extrabold text-brand-600"
          >
            {formatPrice(total)}
          </p>
        </div>
        <p className="text-[11px] text-gray-400 text-right mt-0.5">
          Including Taxes
        </p>
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={() => navigate('/checkout')}
        disabled={itemCount === 0}
      >
        Proceed to Checkout
        <ArrowRight className="h-4 w-4" />
      </Button>
      <p className="text-[11px] text-gray-400 text-center">
        Estimated delivery time: 25–35 mins
      </p>
    </aside>
  );
};
