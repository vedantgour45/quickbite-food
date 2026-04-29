import { z } from 'zod';

const ORDER_STATUSES = [
  'received',
  'preparing',
  'out_for_delivery',
  'delivered',
] as const;

export const orderItemSchema = z.object({
  menuItemId: z.string().min(1, 'menuItemId is required'),
  quantity: z
    .number()
    .int()
    .positive('quantity must be a positive integer')
    .max(99, 'quantity per item cannot exceed 99'),
});

export const customerSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
});

export const placeOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Order must contain at least one item'),
  customer: customerSchema,
});

export const updateStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
