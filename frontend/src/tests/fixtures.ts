import type { MenuItem } from '@/types';

export const sampleMenuItem: MenuItem = {
  id: 'pizza-margherita',
  name: 'Margherita Pizza',
  description: 'Classic hand-tossed pizza with tomato and mozzarella.',
  price: 299,
  image: 'https://example.test/pizza.jpg',
  category: 'pizza',
  rating: 4.6,
  prepTime: '20-25 min',
  isAvailable: true,
};

export const sampleBurger: MenuItem = {
  id: 'burger-classic',
  name: 'Classic Cheeseburger',
  description: 'Cheddar, lettuce, tomato, brioche bun.',
  price: 199,
  image: 'https://example.test/burger.jpg',
  category: 'burger',
  rating: 4.5,
  prepTime: '15-20 min',
  isAvailable: true,
};
