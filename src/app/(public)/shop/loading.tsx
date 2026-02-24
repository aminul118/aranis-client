import Container from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/skeleton';

export default function ShopLoading() {
  return (
    <div className="min-h-screen pt-20">
      <Container>
        {/* Header Skeleton */}
        <div className="mb-12 space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-64" />
        </div>

        {/* Filters and Search Skeleton */}
        <div className="mb-12 flex flex-wrap gap-4">
          <Skeleton className="h-10 w-40 rounded-full" />
          <Skeleton className="h-10 w-40 rounded-full" />
          <Skeleton className="h-10 w-40 rounded-full" />
          <div className="ml-auto">
            <Skeleton className="h-10 w-64 rounded-full" />
          </div>
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-4 rounded-3xl border p-4">
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
                <div className="flex items-center justify-between pt-4">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-10 w-1/4 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
