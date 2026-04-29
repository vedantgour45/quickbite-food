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
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 pb-32 space-y-8">
      {/* Hero Banner */}
      <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80"
          alt="Delicious food spread"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-md">
            Cravings, Satisfied.
          </h1>
          <p className="text-lg md:text-xl font-medium max-w-2xl drop-shadow-sm opacity-90">
            Discover the best meals in town, prepared fresh and delivered straight to your door.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Explore Menu
        </h2>
        <div className="w-full md:w-72">
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </div>

      <div>
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
