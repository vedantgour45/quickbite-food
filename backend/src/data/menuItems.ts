import type { MenuItem } from '../types';

export const menuItems: MenuItem[] = [
  {
    id: 'pizza-margherita',
    name: 'Margherita Pizza',
    description:
      'Classic hand-tossed pizza with San Marzano tomato sauce, fresh mozzarella, and basil leaves.',
    price: 299,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
    category: 'pizza',
    rating: 4.6,
    prepTime: '20-25 min',
    isAvailable: true,
  },
  {
    id: 'pizza-paneer-tikka',
    name: 'Paneer Tikka Pizza',
    description:
      'Tandoori-spiced paneer cubes, onions, and capsicum on a creamy tikka base, topped with mozzarella.',
    price: 379,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    category: 'pizza',
    rating: 4.7,
    prepTime: '20-25 min',
    isAvailable: true,
  },
  {
    id: 'burger-classic-cheese',
    name: 'Classic Cheeseburger',
    description:
      'Juicy grilled patty with melted cheddar, lettuce, tomato, and house sauce in a brioche bun.',
    price: 199,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    category: 'burger',
    rating: 4.5,
    prepTime: '15-20 min',
    isAvailable: true,
  },
  {
    id: 'burger-crispy-chicken',
    name: 'Crispy Chicken Burger',
    description:
      'Buttermilk-fried chicken thigh, slaw, pickles, and chipotle mayo in a soft potato bun.',
    price: 229,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80',
    category: 'burger',
    rating: 4.6,
    prepTime: '15-20 min',
    isAvailable: true,
  },
  {
    id: 'pasta-arrabbiata',
    name: 'Spaghetti Arrabbiata',
    description:
      'Spaghetti tossed in spicy tomato sauce with garlic, chilli flakes, and Italian herbs.',
    price: 259,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
    category: 'pasta',
    rating: 4.4,
    prepTime: '18-22 min',
    isAvailable: true,
  },
  {
    id: 'pasta-penne-alfredo',
    name: 'Penne Alfredo',
    description:
      'Penne in a velvety parmesan cream sauce finished with cracked black pepper and parsley.',
    price: 279,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&q=80',
    category: 'pasta',
    rating: 4.5,
    prepTime: '18-22 min',
    isAvailable: true,
  },
  {
    id: 'chicken-grilled-bowl',
    name: 'Grilled Chicken Bowl',
    description:
      'Lemon-herb grilled chicken over saffron rice with roasted veg and garlic yogurt drizzle.',
    price: 319,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
    category: 'chicken',
    rating: 4.7,
    prepTime: '20-25 min',
    isAvailable: true,
  },
  {
    id: 'chicken-tandoori',
    name: 'Tandoori Chicken',
    description:
      'Bone-in chicken marinated in yogurt and Kashmiri spices, charred in a clay tandoor.',
    price: 349,
    image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?w=800&q=80',
    category: 'chicken',
    rating: 4.8,
    prepTime: '25-30 min',
    isAvailable: true,
  },
  {
    id: 'salad-caesar',
    name: 'Caesar Salad',
    description:
      'Crisp romaine, garlic croutons, shaved parmesan, and creamy anchovy Caesar dressing.',
    price: 219,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&q=80',
    category: 'salad',
    rating: 4.3,
    prepTime: '10-15 min',
    isAvailable: true,
  },
  {
    id: 'salad-greek',
    name: 'Greek Salad',
    description:
      'Cucumber, tomato, olives, red onion, and feta with lemon-oregano vinaigrette.',
    price: 239,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    category: 'salad',
    rating: 4.4,
    prepTime: '10-15 min',
    isAvailable: true,
  },
  {
    id: 'drink-mango-lassi',
    name: 'Mango Lassi',
    description:
      'Thick blended yogurt drink with sweet Alphonso mango pulp and a hint of cardamom.',
    price: 99,
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=800&q=80',
    category: 'drinks',
    rating: 4.6,
    prepTime: '5-10 min',
    isAvailable: true,
  },
  {
    id: 'drink-cold-coffee',
    name: 'Cold Coffee',
    description:
      'Chilled milk-and-espresso blend with vanilla, topped with whipped cream and cocoa.',
    price: 149,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80',
    category: 'drinks',
    rating: 4.5,
    prepTime: '5-10 min',
    isAvailable: true,
  },
];

export const findMenuItem = (id: string): MenuItem | undefined =>
  menuItems.find((item) => item.id === id);
