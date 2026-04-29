import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export type StepState = 'completed' | 'active' | 'pending';

interface Props {
  label: string;
  subLabel?: string;
  state: StepState;
  isLast?: boolean;
}

export const StatusStep = ({ label, subLabel, state, isLast }: Props) => (
  <li
    data-testid={`status-step-${state}`}
    className="relative flex gap-4 pb-6 last:pb-0"
  >
    {!isLast && (
      <span
        aria-hidden
        className={cn(
          'absolute left-3 top-7 bottom-0 w-0.5',
          state === 'completed' ? 'bg-brand-600' : 'bg-brand-100',
        )}
      />
    )}

    <div className="relative z-10 mt-0.5">
      {state === 'active' ? (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="h-6 w-6 rounded-full bg-brand-600 flex items-center justify-center"
        >
          <span className="h-2 w-2 rounded-full bg-white" />
        </motion.div>
      ) : state === 'completed' ? (
        <div className="h-6 w-6 rounded-full bg-brand-600 flex items-center justify-center text-white">
          <Check className="h-3.5 w-3.5" />
        </div>
      ) : (
        <div className="h-6 w-6 rounded-full bg-brand-100 border-2 border-brand-100" />
      )}
    </div>

    <div className="flex-1 -mt-0.5">
      <p
        className={cn(
          'font-semibold',
          state === 'pending' ? 'text-gray-400' : 'text-gray-900',
          state === 'active' && 'text-brand-600',
        )}
      >
        {label}
      </p>
      {subLabel && (
        <p
          className={cn(
            'text-xs',
            state === 'active' ? 'text-brand-600' : 'text-gray-500',
          )}
        >
          {subLabel}
        </p>
      )}
    </div>
  </li>
);
