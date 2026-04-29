import { Minus, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Props {
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const QuantityStepper = ({
  quantity,
  onDecrement,
  onIncrement,
  className,
  size = 'md',
}: Props) => {
  const buttonSize = size === 'sm' ? 'h-7 w-7' : 'h-8 w-8';
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-brand-50 p-1',
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={onDecrement}
        className={cn(
          'rounded-full bg-white text-brand-600 hover:bg-brand-100 flex items-center justify-center transition-colors',
          buttonSize,
        )}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span
        className="min-w-[24px] text-center text-sm font-semibold"
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={onIncrement}
        className={cn(
          'rounded-full bg-brand-600 text-white hover:bg-brand-700 flex items-center justify-center transition-colors',
          buttonSize,
        )}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
