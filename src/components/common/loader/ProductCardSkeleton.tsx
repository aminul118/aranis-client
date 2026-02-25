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
        'bg-card/40 border-border overflow-hidden rounded-3xl border transition-all',
        isList && 'flex flex-col gap-6 p-4 sm:flex-row',
      )}
    >
      <div
        className={cn(
          'relative block overflow-hidden',
          isList ? 'aspect-square w-full rounded-2xl sm:w-48' : 'aspect-4/5',
        )}
      >
        <Skeleton className="h-full w-full" />
      </div>

      <div className={cn('flex flex-1 flex-col', isList ? 'py-2' : 'p-6')}>
        <div className="mb-4 flex items-start justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-10" />
        </div>

        <Skeleton className="mb-4 h-6 w-3/4" />

        {isList && (
          <div className="mb-6 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        )}

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-10 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
