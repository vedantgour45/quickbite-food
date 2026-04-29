import {
  Coffee,
  Drumstick,
  ImageOff,
  Leaf,
  Pizza,
  Salad,
  UtensilsCrossed,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { MenuCategory } from '@/types';
import { cn } from '@/utils/cn';

const CATEGORY_ICONS: Record<MenuCategory, LucideIcon> = {
  pizza: Pizza,
  burger: UtensilsCrossed,
  pasta: Leaf,
  chicken: Drumstick,
  salad: Salad,
  drinks: Coffee,
};

interface Props {
  src: string;
  alt: string;
  category?: MenuCategory;
  className?: string;
  iconClassName?: string;
  loading?: 'eager' | 'lazy';
}

// Renders the menu photo, with an automatic fallback when the URL is missing
// or fails to load. The fallback is a soft brand-tinted gradient with a
// category icon so the layout never collapses to a broken-image glyph.
export const MenuImage = ({
  src,
  alt,
  category,
  className,
  iconClassName,
  loading = 'lazy',
}: Props) => {
  const [errored, setErrored] = useState(false);

  // If the underlying URL changes (different item, new fetch), give the new
  // src a fresh chance to load before showing the fallback.
  useEffect(() => {
    setErrored(false);
  }, [src]);

  if (errored || !src) {
    const Icon = category ? CATEGORY_ICONS[category] : ImageOff;
    return (
      <div
        role="img"
        aria-label={alt || 'Image unavailable'}
        data-testid="menu-image-fallback"
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-brand-100 via-brand-50 to-white text-brand-400',
          className,
        )}
      >
        <Icon className={cn('h-1/3 w-1/3 min-h-4 min-w-4', iconClassName)} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setErrored(true)}
      className={className}
    />
  );
};
