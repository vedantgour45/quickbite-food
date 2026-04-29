import { motion } from 'framer-motion';
import { Bike, Phone, Star } from 'lucide-react';

export const DeliveryAgentCard = () => (
  <motion.div
    data-testid="delivery-agent-card"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-2xl border border-brand-50 shadow-sm p-5 flex items-center gap-4"
  >
    <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
      RK
    </div>
    <div className="flex-1">
      <p className="font-semibold text-gray-900">Ravi Kumar</p>
      <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
        <span className="inline-flex items-center gap-1">
          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
          4.8
        </span>
        <span className="inline-flex items-center gap-1">
          <Bike className="h-3.5 w-3.5" />
          Bicycle
        </span>
      </div>
    </div>
    <button
      type="button"
      className="h-10 w-10 rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 flex items-center justify-center transition-colors"
      aria-label="Call delivery agent"
    >
      <Phone className="h-4 w-4" />
    </button>
  </motion.div>
);
