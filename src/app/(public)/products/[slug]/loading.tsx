import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailLoading() {
  return (
    <div className="bg-background min-h-screen pt-28 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* Breadcrumb/Back link skeleton */}
        <div className="mb-12 flex items-center gap-3">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          {/* Image Section Skeleton */}
          <div className="space-y-4 lg:col-span-7">
            <Skeleton className="aspect-square w-full rounded-4xl md:aspect-4/5" />
            <div className="flex gap-4 overflow-hidden py-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  className="h-24 w-20 shrink-0 rounded-2xl md:h-28 md:w-24"
                />
              ))}
            </div>
          </div>

          {/* Content Section Skeleton */}
          <div className="flex flex-col pt-4 lg:col-span-5">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32 rounded-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-12 w-full lg:h-16" />
                <Skeleton className="h-12 w-3/4 lg:h-16" />
                <Skeleton className="h-6 w-48" />
              </div>

              <div className="flex items-center gap-6">
                <Skeleton className="h-16 w-32" />
                <Skeleton className="h-10 w-24" />
              </div>

              <div className="bg-border/50 h-px w-full" />

              <div className="space-y-6">
                <div className="space-y-4">
                  <Skeleton className="h-4 w-32" />
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-12 w-16 rounded-2xl" />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-6 md:flex-row">
                <Skeleton className="h-16 flex-1 rounded-3xl" />
                <Skeleton className="h-16 flex-1 rounded-3xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
