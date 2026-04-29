import { Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { MenuItem } from '@/types';
import { formatPriceWhole } from '@/utils/formatters';
import { resolveImageUrl } from '@/utils/imageUrl';
import { MenuImage } from './MenuImage';

interface Props {
  item: MenuItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (item: MenuItem) => void;
}

export const ItemDetailModal = ({
  item,
  open,
  onOpenChange,
  onAdd,
}: Props) => {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
        >
          <div className="aspect-[16/9] bg-brand-50 overflow-hidden">
            <MenuImage
              src={resolveImageUrl(item.image)}
              alt={item.name}
              category={item.category}
              loading="eager"
              className="w-full h-full object-cover"
              iconClassName="h-20 w-20"
            />
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <DialogTitle className="text-xl font-bold text-gray-900">
                {item.name}
              </DialogTitle>
              <span className="text-xl font-bold text-brand-600">
                {formatPriceWhole(item.price)}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                {item.rating.toFixed(1)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {item.prepTime}
              </span>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              {item.description}
            </p>

            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                onAdd(item);
                onOpenChange(false);
              }}
            >
              Add to Cart
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
