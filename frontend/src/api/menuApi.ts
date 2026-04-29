import { api } from './axiosInstance';
import type { MenuCategory, MenuItem } from '@/types';

export const fetchMenu = async (
  category?: MenuCategory | 'all',
): Promise<MenuItem[]> => {
  const params =
    category && category !== 'all' ? { category } : undefined;
  const { data } = await api.get<MenuItem[]>('/api/menu', { params });
  return data;
};

export const fetchMenuItem = async (id: string): Promise<MenuItem> => {
  const { data } = await api.get<MenuItem>(`/api/menu/${id}`);
  return data;
};
