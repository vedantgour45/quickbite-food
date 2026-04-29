import { ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';

export const Header = () => {
  const { itemCount } = useCart();
  const location = useLocation();
  const cartActive = location.pathname.startsWith('/cart');

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-brand-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="font-display text-2xl font-extrabold text-brand-600 tracking-tight"
        >
          QuickBite
        </Link>

        <Link
          to="/cart"
          aria-label="Cart"
          className={`relative ${cartActive ? 'text-brand-600' : 'text-gray-700'} hover:text-brand-600 transition-colors`}
        >
          <ShoppingCart className="h-6 w-6" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-brand-600 text-white text-[11px] font-semibold rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};
