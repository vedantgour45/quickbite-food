import { api } from './axiosInstance';
import type { Order, PlaceOrderPayload } from '@/types';

export const placeOrder = async (
  payload: PlaceOrderPayload,
): Promise<Order> => {
  const { data } = await api.post<Order>('/api/orders', payload);
  return data;
};

export const fetchOrder = async (id: string): Promise<Order> => {
  const { data } = await api.get<Order>(`/api/orders/${id}`);
  return data;
};
