import { Coffee, Drumstick, Leaf, Pizza, Salad, UtensilsCrossed } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { MenuCategory } from '@/types';
import { cn } from '@/utils/cn';

export type CategoryValue = MenuCategory | 'all';

interface CategoryDef {
  value: CategoryValue;
  label: string;
  icon: LucideIcon | null;
}

const CATEGORIES: CategoryDef[] = [
  { value: 'all', label: 'All', icon: null },
  { value: 'pizza', label: 'Pizza', icon: Pizza },
  { value: 'burger', label: 'Burger', icon: UtensilsCrossed },
  { value: 'pasta', label: 'Pasta', icon: Leaf },
  { value: 'chicken', label: 'Chicken', icon: Drumstick },
  { value: 'salad', label: 'Salad', icon: Salad },
  { value: 'drinks', label: 'Drinks', icon: Coffee },
];

interface Props {
  active: CategoryValue;
  onChange: (value: CategoryValue) => void;
}

export const CategoryFilter = ({ active, onChange }: Props) => (
  <div
    role="tablist"
    aria-label="Menu categories"
    className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
  >
    {CATEGORIES.map((cat) => {
      const isActive = cat.value === active;
      const Icon = cat.icon;
      return (
        <button
          key={cat.value}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(cat.value)}
          className={cn(
            'inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border',
            isActive
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-brand-50 text-gray-700 border-brand-50 hover:bg-brand-100',
          )}
        >
          {Icon && <Icon className="h-4 w-4" />}
          {cat.label}
        </button>
      );
    })}
  </div>
);
