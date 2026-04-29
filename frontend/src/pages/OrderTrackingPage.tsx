import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, ChevronLeft, Radio } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { fetchOrder } from '@/api/orderApi';
import { Button } from '@/components/ui/button';
import { DeliveryAgentCard } from '@/components/order/DeliveryAgentCard';
import { StatusTracker } from '@/components/order/StatusTracker';
import { useOrderSSE } from '@/hooks/useOrderSSE';
import type { OrderStatus } from '@/types';
import { formatPrice } from '@/utils/formatters';

const STATUS_INDEX: Record<OrderStatus, number> = {
  received: 0,
  preparing: 1,
  out_for_delivery: 2,
  delivered: 3,
};

const headlineFor = (status: OrderStatus, name: string) => {
  switch (status) {
    case 'received':
      return `Hang tight, ${name}!`;
    case 'preparing':
      return `Hang tight, ${name}!`;
    case 'out_for_delivery':
      return `Almost there, ${name}!`;
    case 'delivered':
      return `Enjoy your meal, ${name}!`;
  }
};

const subheadlineFor = (status: OrderStatus) => {
  switch (status) {
    case 'received':
      return 'Your order has been received.';
    case 'preparing':
      return 'is being prepared.';
    case 'out_for_delivery':
      return 'is on the way.';
    case 'delivered':
      return 'has been delivered.';
  }
};

const bannerTitleFor = (status: OrderStatus) => {
  switch (status) {
    case 'received':
      return 'Order Placed Successfully!';
    case 'preparing':
      return 'Your order is being prepared!';
    case 'out_for_delivery':
      return 'Your order is on the way!';
    case 'delivered':
      return 'Order Delivered Successfully!';
  }
};

export const OrderTrackingPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrder(id ?? ''),
    enabled: !!id,
  });

  const { status: liveStatus, history, connected } = useOrderSSE({
    orderId: id,
    initialStatus: order?.status,
    initialHistory: order?.statusHistory,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 text-center text-gray-500">
        Loading your order…
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 text-center">
        <p className="text-lg font-semibold text-gray-900 mb-2">
          We couldn't find that order.
        </p>
        <Button asChild>
          <Link to="/">Back to Menu</Link>
        </Button>
      </div>
    );
  }

  const currentStatus = liveStatus ?? order.status;
  const currentIdx = STATUS_INDEX[currentStatus];
  const progress = ((currentIdx + 1) / 4) * 100;
  const showAgent =
    currentStatus === 'out_for_delivery' || currentStatus === 'delivered';
  const customerFirstName = order.customer.name.split(' ')[0];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-6">
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
        <CheckCircle2 className="h-6 w-6 text-emerald-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-semibold text-emerald-900">
            {bannerTitleFor(currentStatus)}
          </p>
          <p className="text-xs text-emerald-700">
            Order ID: <span className="font-mono">{order.id}</span> · Estimated
            arrival {order.estimatedDelivery}
          </p>
        </div>
        {connected && (
          <span
            data-testid="live-indicator"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"
          >
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            LIVE
          </span>
        )}
      </div>

      <div className="text-center pt-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
          {headlineFor(currentStatus, customerFirstName)}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Your order from <span className="font-semibold">QuickBite</span>{' '}
          {subheadlineFor(currentStatus)}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-brand-50 shadow-sm overflow-hidden">
        <div className="h-1.5 bg-brand-100 relative overflow-hidden">
          <div
            data-testid="progress-bar"
            className="absolute inset-y-0 left-0 bg-brand-600 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="p-6 text-center">
          <p className="text-xs uppercase tracking-wider text-gray-400">
            Estimated arrival
          </p>
          <p className="text-3xl font-extrabold text-brand-600 mt-1">
            {order.estimatedDelivery}
          </p>
        </div>
      </div>

      <StatusTracker current={currentStatus} history={history} />

      {showAgent && <DeliveryAgentCard />}

      <div className="bg-white rounded-2xl border border-brand-50 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
          <span className="text-xs text-brand-600 font-mono bg-brand-50 px-2 py-1 rounded">
            #{order.id}
          </span>
        </div>
        <ul className="divide-y divide-brand-50">
          {order.items.map((line) => (
            <li
              key={line.menuItemId}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded">
                  {line.quantity}x
                </span>
                <span className="font-medium text-gray-900">{line.name}</span>
              </div>
              <span className="font-medium">
                {formatPrice(line.price * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="border-t border-brand-50 pt-4 mt-4 space-y-1.5 text-sm">
          <Row label="Subtotal" value={formatPrice(order.subtotal)} />
          <Row label="Delivery Fee" value={formatPrice(order.deliveryFee)} />
          <Row label="Taxes & Fees" value={formatPrice(order.tax)} />
          <div className="flex items-center justify-between pt-2 border-t border-dashed border-brand-100 mt-2 text-base font-bold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Delivering to: {order.customer.address}
        </p>
      </div>

      <div className="text-center">
        <Button variant="outline" asChild>
          <Link to="/">
            <ChevronLeft className="h-4 w-4" />
            Back to Menu
          </Link>
        </Button>
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-gray-600">
    <span>{label}</span>
    <span className="text-gray-900">{value}</span>
  </div>
);
