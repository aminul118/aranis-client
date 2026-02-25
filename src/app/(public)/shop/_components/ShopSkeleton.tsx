'use client';

import ProductCardSkeleton from '@/components/common/loader/ProductCardSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

const ShopSkeleton = () => {
  return (
    <div className="mt-8 min-h-screen animate-pulse">
      <div className="container mx-auto px-4">
        {/* Header Skeleton */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>

        <div className="flex items-start gap-12">
          {/* Sidebar Skeleton */}
          <aside className="sticky top-32 hidden w-64 shrink-0 flex-col gap-10 lg:flex">
            {/* Category Filter Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>

            {/* Color Filter Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Skeleton key={i} className="h-8 w-8 rounded-full" />
                ))}
              </div>
            </div>

            {/* Size Filter Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-md" />
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <main className="flex-1">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 xl:grid-cols-3 2xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <ProductCardSkeleton key={i} viewMode="grid" />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopSkeleton;
