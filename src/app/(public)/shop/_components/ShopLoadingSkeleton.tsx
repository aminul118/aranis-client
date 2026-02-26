'use client';

import ProductCardSkeleton from '@/components/common/loader/ProductCardSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function ShopLoadingSkeleton() {
  return (
    <div className="bg-background mt-8 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header Skeleton */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-64" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>

        <div className="flex items-start gap-12">
          {/* Sidebar Skeleton */}
          <aside className="sticky top-32 hidden w-64 shrink-0 flex-col gap-10 lg:flex">
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-6 w-32" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Product Grid Skeleton */}
          <main className="flex-1">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 xl:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} viewMode="grid" />
              ))}
            </div>

            <div className="border-border mt-12 flex justify-center border-t pt-12">
              <Skeleton className="h-10 w-64" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
