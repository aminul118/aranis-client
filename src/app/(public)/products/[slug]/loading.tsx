import Container from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-3xl" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-xl" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-32" />
            </div>

            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-32 rounded-full" />
                <Skeleton className="h-12 w-32 rounded-full" />
              </div>
            </div>

            <div className="space-y-6 pt-8">
              <div className="grid grid-cols-2 gap-6">
                <Skeleton className="h-14 w-full rounded-2xl" />
                <Skeleton className="h-14 w-full rounded-2xl" />
              </div>
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Bottom Tabs/Sections Skeleton */}
        <div className="mt-20 space-y-8">
          <div className="flex gap-8 border-b pb-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </Container>
    </div>
  );
}
