import { Request, Response } from 'express';
import { findMenuItem } from '../data/menuItems';
import { HttpError } from '../middleware/errorHandler';
import { generateOrderId, orderStore } from '../store/orderStore';
import {
  placeOrderSchema,
  updateStatusSchema,
} from '../validators/order.validator';
import type { Order, OrderItem, OrderStatus } from '../types';

const DELIVERY_FEE = 40;
const TAX_RATE = 0.05;
const ESTIMATED_DELIVERY_MINUTES = 40;

// SSE infrastructure --------------------------------------------------------

type Subscriber = Response;
const subscribers = new Map<string, Set<Subscriber>>();

const STATUS_FLOW: OrderStatus[] = [
  'received',
  'preparing',
  'out_for_delivery',
  'delivered',
];

// Default 15s per spec. Tests override via setStatusInterval().
let statusIntervalMs = 15000;
export const setStatusIntervalMs = (ms: number): void => {
  statusIntervalMs = ms;
};

const broadcast = (
  orderId: string,
  status: OrderStatus,
  at: string,
): void => {
  const subs = subscribers.get(orderId);
  if (!subs) return;
  const payload = `data: ${JSON.stringify({ id: orderId, status, at })}\n\n`;
  for (const sub of subs) {
    sub.write(payload);
  }
};

const advanceStatus = (orderId: string): void => {
  const interval = setInterval(() => {
    const order = orderStore.get(orderId);
    if (!order) {
      clearInterval(interval);
      return;
    }
    const idx = STATUS_FLOW.indexOf(order.status);
    if (idx === -1 || idx === STATUS_FLOW.length - 1) {
      clearInterval(interval);
      return;
    }
    const next = STATUS_FLOW[idx + 1];
    const updated = orderStore.setStatus(orderId, next);
    if (updated) {
      const lastEvent =
        updated.statusHistory[updated.statusHistory.length - 1];
      broadcast(orderId, updated.status, lastEvent.at);
    }
    if (next === 'delivered') {
      clearInterval(interval);
    }
  }, statusIntervalMs);

  // Don't keep the Node process alive just for this timer.
  if (typeof interval.unref === 'function') {
    interval.unref();
  }
};

// Helpers -------------------------------------------------------------------

const round2 = (value: number): number => Math.round(value * 100) / 100;

const formatTime = (date: Date): string =>
  date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

// Controllers ---------------------------------------------------------------

export const placeOrder = (req: Request, res: Response): void => {
  const parsed = placeOrderSchema.parse(req.body);

  const items: OrderItem[] = [];
  let subtotal = 0;

  for (const lineItem of parsed.items) {
    const menuItem = findMenuItem(lineItem.menuItemId);
    if (!menuItem) {
      throw new HttpError(
        400,
        `Menu item not found: ${lineItem.menuItemId}`,
      );
    }
    const lineTotal = menuItem.price * lineItem.quantity;
    subtotal += lineTotal;
    items.push({
      menuItemId: menuItem.id,
      name: menuItem.name,
      quantity: lineItem.quantity,
      price: menuItem.price,
    });
  }

  const tax = round2(subtotal * TAX_RATE);
  const total = round2(subtotal + DELIVERY_FEE + tax);
  const now = new Date();
  const eta = new Date(now.getTime() + ESTIMATED_DELIVERY_MINUTES * 60_000);

  const createdAt = now.toISOString();
  const order: Order = {
    id: generateOrderId(),
    items,
    customer: parsed.customer,
    status: 'received',
    statusHistory: [{ status: 'received', at: createdAt }],
    subtotal: round2(subtotal),
    deliveryFee: DELIVERY_FEE,
    tax,
    total,
    createdAt,
    estimatedDelivery: formatTime(eta),
  };

  orderStore.save(order);
  advanceStatus(order.id);

  res.status(201).json(order);
};

export const getOrder = (req: Request, res: Response): void => {
  const order = orderStore.get(req.params.id);
  if (!order) {
    throw new HttpError(404, 'Order not found');
  }
  res.json(order);
};

export const getOrderStatus = (req: Request, res: Response): void => {
  const order = orderStore.get(req.params.id);
  if (!order) {
    throw new HttpError(404, 'Order not found');
  }
  res.json({ id: order.id, status: order.status });
};

export const updateOrderStatus = (req: Request, res: Response): void => {
  const { status } = updateStatusSchema.parse(req.body);
  const existing = orderStore.get(req.params.id);
  if (!existing) {
    throw new HttpError(404, 'Order not found');
  }
  const currentIdx = STATUS_FLOW.indexOf(existing.status);
  const nextIdx = STATUS_FLOW.indexOf(status);
  if (nextIdx < currentIdx) {
    throw new HttpError(
      400,
      `Cannot move order from ${existing.status} back to ${status}`,
    );
  }
  const updated = orderStore.setStatus(req.params.id, status);
  if (!updated) {
    throw new HttpError(404, 'Order not found');
  }
  const lastEvent = updated.statusHistory[updated.statusHistory.length - 1];
  broadcast(updated.id, updated.status, lastEvent.at);
  res.json(updated);
};

export const streamOrderStatus = (req: Request, res: Response): void => {
  const order = orderStore.get(req.params.id);
  if (!order) {
    throw new HttpError(404, 'Order not found');
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  const lastEvent = order.statusHistory[order.statusHistory.length - 1];
  res.write(
    `data: ${JSON.stringify({
      id: order.id,
      status: order.status,
      at: lastEvent?.at ?? order.createdAt,
    })}\n\n`,
  );

  if (!subscribers.has(order.id)) {
    subscribers.set(order.id, new Set());
  }
  const subs = subscribers.get(order.id);
  subs?.add(res);

  req.on('close', () => {
    subs?.delete(res);
    if (subs && subs.size === 0) {
      subscribers.delete(order.id);
    }
  });
};

// Test helper to clear SSE state between runs.
export const _resetSubscribers = (): void => {
  subscribers.clear();
};
