export type MenuCategory =
  | 'pizza'
  | 'burger'
  | 'pasta'
  | 'salad'
  | 'drinks'
  | 'chicken';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: MenuCategory;
  rating: number;
  prepTime: string;
  isAvailable: boolean;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Customer {
  name: string;
  phone: string;
  address: string;
  pincode: string;
}

export type OrderStatus =
  | 'received'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered';

export interface StatusEvent {
  status: OrderStatus;
  at: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customer: Customer;
  status: OrderStatus;
  statusHistory: StatusEvent[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  createdAt: string;
  estimatedDelivery: string;
}
