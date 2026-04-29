import { ArrowLeft, Plus, ShoppingCart, Utensils } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem } from '@/components/cart/CartItem';
import { OrderSummary } from '@/components/cart/OrderSummary';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

export const CartPage = () => {
  const navigate = useNavigate();
  const { items } = useCart();
  const isEmpty = items.length === 0;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center gap-3 mb-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="h-10 w-10 rounded-full bg-white border border-brand-100 flex items-center justify-center hover:bg-brand-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Your Order
        </h1>
      </div>
      <p className="text-sm text-gray-500 mb-8 ml-[3.25rem]">
        Review your items before proceeding to checkout.
      </p>

      {isEmpty ? (
        <div
          data-testid="cart-empty"
          className="bg-white rounded-2xl border border-brand-50 shadow-sm p-10 max-w-xl mx-auto flex flex-col items-center text-center"
        >
          <div className="relative mb-6">
            <div className="h-32 w-32 rounded-full bg-brand-50 flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-brand-600" />
            </div>
            <div className="absolute top-2 right-0 h-3 w-3 rounded-full bg-teal-300" />
            <div className="absolute bottom-3 left-0 h-2 w-2 rounded-full bg-brand-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Your cart is feeling light
          </h2>
          <p className="text-sm text-gray-500 max-w-sm mt-2 mb-6">
            Looks like you haven't added anything yet. Discover our delicious menu
            and satisfy your cravings!
          </p>
          <Button asChild size="lg">
            <Link to="/">
              <Utensils className="h-4 w-4" />
              Go back to Menu
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
            <Link
              to="/"
              className="block w-full text-center py-4 px-5 rounded-2xl border-2 border-dashed border-brand-200 text-brand-600 font-medium hover:bg-brand-50 transition-colors"
            >
              <Plus className="inline h-4 w-4 mr-2" />
              Add more items from menu
            </Link>
          </div>
          <div>
            <OrderSummary />
          </div>
        </div>
      )}
    </div>
  );
};
