import { randomBytes } from 'node:crypto';
import type { Order, OrderStatus } from '../types';

const orders = new Map<string, Order>();

export const orderStore = {
  save(order: Order): Order {
    orders.set(order.id, order);
    return order;
  },

  get(id: string): Order | undefined {
    return orders.get(id);
  },

  setStatus(id: string, status: OrderStatus): Order | undefined {
    const existing = orders.get(id);
    if (!existing) return undefined;
    if (existing.status === status) return existing;
    const event = { status, at: new Date().toISOString() };
    const updated: Order = {
      ...existing,
      status,
      statusHistory: [...existing.statusHistory, event],
    };
    orders.set(id, updated);
    return updated;
  },

  list(): Order[] {
    return Array.from(orders.values());
  },

  reset(): void {
    orders.clear();
  },
};

// 12 hex chars = 48 bits of entropy → not enumerable like the old 5-digit ID.
export const generateOrderId = (): string => {
  const id = randomBytes(6).toString('hex').toUpperCase();
  return `ORD-${id}`;
};
