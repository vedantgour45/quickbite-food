import type { MenuItem } from '@/types';
import { MenuCard } from './MenuCard';

interface Props {
  items: MenuItem[];
  onSelect: (item: MenuItem) => void;
  onAdd: (item: MenuItem) => void;
}

export const MenuGrid = ({ items, onSelect, onAdd }: Props) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    {items.map((item) => (
      <MenuCard
        key={item.id}
        item={item}
        onSelect={onSelect}
        onAdd={onAdd}
      />
    ))}
  </div>
);
