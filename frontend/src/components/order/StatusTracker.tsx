import type { OrderStatus, StatusEvent } from '@/types';
import { formatTime } from '@/utils/formatters';
import { StatusStep, type StepState } from './StatusStep';

const STEPS: { status: OrderStatus; label: string; activeSub: string }[] = [
  {
    status: 'received',
    label: 'Order Received',
    activeSub: 'Waiting for the kitchen to confirm.',
  },
  {
    status: 'preparing',
    label: 'Preparing your food',
    activeSub: 'The kitchen is working its magic.',
  },
  {
    status: 'out_for_delivery',
    label: 'Out for Delivery',
    activeSub: "Your rider is on the way.",
  },
  {
    status: 'delivered',
    label: 'Delivered',
    activeSub: 'Enjoy your meal!',
  },
];

interface Props {
  current: OrderStatus;
  history: StatusEvent[];
}

export const StatusTracker = ({ current, history }: Props) => {
  const currentIdx = STEPS.findIndex((s) => s.status === current);
  const historyMap = new Map(history.map((h) => [h.status, h.at]));

  return (
    <div className="bg-white rounded-2xl border border-brand-50 shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Order Status</h2>
      <ul>
        {STEPS.map((step, idx) => {
          const state: StepState =
            idx < currentIdx
              ? 'completed'
              : idx === currentIdx
                ? 'active'
                : 'pending';
          const at = historyMap.get(step.status);
          const subLabel =
            state === 'completed' && at
              ? formatTime(at)
              : state === 'active'
                ? step.activeSub
                : '';
          return (
            <StatusStep
              key={step.status}
              label={step.label}
              subLabel={subLabel || undefined}
              state={state}
              isLast={idx === STEPS.length - 1}
            />
          );
        })}
      </ul>
    </div>
  );
};
