'use client';

import { Skeleton } from '@/components/ui/skeleton';

const OrderListSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-card/50 border-border overflow-hidden rounded-3xl border"
        >
          {/* Order Header Skeleton */}
          <div className="border-border/50 bg-muted/20 flex flex-col justify-between gap-6 border-b p-6 md:flex-row md:items-center md:p-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-32 rounded-full" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>

          <div className="space-y-6 p-6 md:p-8">
            {/* Status Stepper placeholder */}
            <div className="bg-muted/30 border-border/50 rounded-2xl border p-4">
              <Skeleton className="mb-4 h-3 w-32" />
              <div className="flex items-center justify-between px-4">
                {[1, 2, 3, 4].map((s) => (
                  <Skeleton key={s} className="h-8 w-8 rounded-full" />
                ))}
              </div>
            </div>

            {/* Items Skeleton */}
            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div key={item} className="flex items-center gap-6">
                  <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-8 w-16 rounded-full" />
                </div>
              ))}
            </div>

            {/* Footer Skeleton */}
            <div className="border-border/30 flex items-center justify-between border-t pt-6">
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderListSkeleton;
