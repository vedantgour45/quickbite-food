export const MenuCardSkeleton = () => (
  <div className="rounded-2xl bg-white shadow-sm border border-brand-50 overflow-hidden">
    <div className="aspect-[4/3] bg-brand-100 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="h-4 w-2/3 bg-brand-100 animate-pulse rounded" />
        <div className="h-4 w-12 bg-brand-100 animate-pulse rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-3 w-20 bg-brand-100 animate-pulse rounded" />
        <div className="h-3 w-16 bg-brand-100 animate-pulse rounded" />
      </div>
      <div className="h-9 w-24 bg-brand-100 animate-pulse rounded-full" />
    </div>
  </div>
);
