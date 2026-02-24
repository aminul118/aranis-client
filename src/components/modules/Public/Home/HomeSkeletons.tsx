import { Skeleton } from '@/components/ui/skeleton';

export const BannerSkeleton = () => (
  <div className="relative h-[400px] w-full overflow-hidden lg:h-[700px]">
    <Skeleton className="h-full w-full" />
    <div className="absolute inset-x-0 bottom-0 p-8 lg:p-20">
      <Skeleton className="mb-4 h-4 w-24" />
      <Skeleton className="mb-6 h-12 w-3/4 lg:h-20" />
      <Skeleton className="h-10 w-40 rounded-full" />
    </div>
  </div>
);

export const CategorySkeleton = () => (
  <section className="py-24">
    <div className="container mx-auto px-4">
      <div className="mb-16 flex flex-col items-center">
        <Skeleton className="mb-4 h-10 w-64" />
        <Skeleton className="h-1 w-20 rounded-full" />
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="aspect-3/4 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  </section>
);

export const ProductGridSkeleton = ({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) => (
  <section className="bg-muted/50 py-24">
    <div className="container mx-auto px-4">
      <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
        <div>
          {title ? (
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{title}</h2>
          ) : (
            <Skeleton className="mb-4 h-10 w-64" />
          )}
          {subtitle ? (
            <p className="text-muted-foreground">{subtitle}</p>
          ) : (
            <Skeleton className="h-6 w-80" />
          )}
        </div>
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card/40 space-y-4 rounded-3xl border p-6">
            <Skeleton className="aspect-4/5 w-full rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-6 w-full" />
              <div className="flex items-center justify-between pt-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-10 w-1/3 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const HomeSkeletons = () => {
  return (
    <div className="space-y-8">
      <BannerSkeleton />
      <CategorySkeleton />
      <ProductGridSkeleton
        title="Featured Excellence"
        subtitle="Our hand-picked selections for this season"
      />
    </div>
  );
};
