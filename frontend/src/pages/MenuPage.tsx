import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { fetchMenu } from '@/api/menuApi';
import { CartSummaryBar } from '@/components/cart/CartSummaryBar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { CategoryFilter, type CategoryValue } from '@/components/menu/CategoryFilter';
import { ItemDetailModal } from '@/components/menu/ItemDetailModal';
import { MenuCardSkeleton } from '@/components/menu/MenuCardSkeleton';
import { MenuGrid } from '@/components/menu/MenuGrid';
import { SearchBar } from '@/components/menu/SearchBar';
import { useCart } from '@/hooks/useCart';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { MenuItem } from '@/types';

export const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryValue>('all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 250);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { addItem } = useCart();
  const { show } = useToast();

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['menu'],
    queryFn: () => fetchMenu(),
  });

  const items = useMemo(() => {
    if (!data) return [];
    const trimmed = debouncedSearch.trim().toLowerCase();
    return data.filter((i) => {
      const matchesCategory =
        activeCategory === 'all' || i.category === activeCategory;
      const matchesSearch =
        trimmed.length === 0 || i.name.toLowerCase().includes(trimmed);
      return matchesCategory && matchesSearch;
    });
  }, [data, activeCategory, debouncedSearch]);

  const handleAdd = (item: MenuItem) => {
    addItem(item);
    show(`${item.name} added to cart`);
  };

  const handleSelect = (item: MenuItem) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 pb-32">
      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-5">
        Explore Menu
      </h1>

      <div className="mb-8">
        <CategoryFilter
          active={activeCategory}
          onChange={setActiveCategory}
        />
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          data-testid="menu-loading"
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <MenuCardSkeleton key={idx} />
          ))}
        </div>
      ) : isError ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-testid="menu-error"
        >
          <p className="text-lg font-semibold text-gray-900 mb-1">
            Something went wrong
          </p>
          <p className="text-sm text-gray-500 mb-5">
            We couldn't load the menu. Please try again.
          </p>
          <Button
            onClick={() => refetch()}
            disabled={isFetching}
          >
            Try Again
          </Button>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No menu items match your search.
        </div>
      ) : (
        <MenuGrid
          items={items}
          onAdd={handleAdd}
          onSelect={handleSelect}
        />
      )}

      <ItemDetailModal
        item={selectedItem}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onAdd={handleAdd}
      />

      <CartSummaryBar />
    </div>
  );
};
