'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ProductCardSkeletonProps {
  viewMode?: 'grid' | 'list';
}

const ProductCardSkeleton = ({
  viewMode = 'grid',
}: ProductCardSkeletonProps) => {
  const isList = viewMode === 'list';

  return (
    <div
      className={cn(
        'group relative overflow-hidden bg-white dark:bg-zinc-900/50',
        isList && 'flex flex-row gap-8',
      )}
    >
      {/* Image Container Skeleton */}
      <div
        className={cn(
          'relative overflow-hidden bg-zinc-100 dark:bg-zinc-800',
          isList
            ? 'aspect-square w-40 shrink-0 sm:w-64'
            : 'aspect-[3.8/5] w-full',
        )}
      >
        <Skeleton className="h-full w-full" />

        {/* Wishlist Button Skeleton */}
        <div className="absolute top-4 right-4 z-20">
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div
        className={cn(
          'flex flex-1 flex-col',
          isList ? 'py-4 pr-4' : 'p-5 pt-4',
        )}
      >
        <div className="mb-3 flex items-center justify-between">
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Title Skeleton */}
        <Skeleton className="mb-4 h-5 w-3/4" />

        {/* List Mode Description */}
        {isList && (
          <div className="mb-6 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        )}

        {/* Bottom Bar: Price & Button */}
        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-24" />
          </div>

          {/* Add to Cart Button Skeleton */}
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
