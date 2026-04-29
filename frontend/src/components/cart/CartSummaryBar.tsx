import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { formatPriceWhole } from '@/utils/formatters';

export const CartSummaryBar = () => {
  const { itemCount, subtotal } = useCart();
  const visible = itemCount > 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="fixed bottom-6 inset-x-0 z-30 px-4 flex justify-center pointer-events-none"
        >
          <Link
            to="/cart"
            className="pointer-events-auto flex items-center justify-between gap-6 bg-brand-700 text-white rounded-full pl-3 pr-5 py-3 shadow-xl hover:bg-brand-600 transition-colors w-full max-w-md"
          >
            <span className="flex items-center gap-3 min-w-0">
              <span className="bg-white/20 rounded-full h-8 w-8 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {itemCount}
              </span>
              <span className="font-medium truncate">
                {itemCount === 1 ? 'Item in Cart' : 'Items in Cart'}
              </span>
            </span>
            <span className="flex items-center gap-2 font-semibold whitespace-nowrap">
              {formatPriceWhole(subtotal)}
              <ChevronRight className="h-4 w-4" />
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
