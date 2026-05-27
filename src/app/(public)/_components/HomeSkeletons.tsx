import { Skeleton } from '@/components/ui/skeleton';

export const BannerSkeleton = () => (
  <section className="bg-background w-full pb-4">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_320px]">
        {/* Main Slider Skeleton */}
        <div className="bg-muted relative h-[340px] overflow-hidden rounded-2xl sm:h-[420px] lg:h-[480px]">
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
            <Skeleton className="mb-4 h-6 w-24 rounded-full" />
            <Skeleton className="mb-3 h-12 w-3/4 rounded-lg md:h-16" />
            <Skeleton className="mb-6 h-4 w-1/2 rounded" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>

        {/* Mini Banners Skeleton */}
        <div className="hidden flex-col gap-3 lg:flex">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-muted relative flex-1 overflow-hidden rounded-2xl"
            >
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <Skeleton className="mb-1 h-3 w-16" />
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export const ProductGridSkeleton = ({
  title,
  subtitle,
  variant = 'muted',
}: {
  title?: string;
  subtitle?: string;
  variant?: 'muted' | 'background';
}) => (
  <section
    className={cn(
      'py-24',
      variant === 'muted' ? 'bg-muted/50' : 'bg-background',
    )}
  >
    <div className="container mx-auto px-4">
      <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
        <div className="space-y-4">
          {title ? (
            <h2 className="text-3xl font-black tracking-tighter md:text-5xl">
              {title}
            </h2>
          ) : (
            <Skeleton className="h-12 w-64 rounded-xl" />
          )}
          {subtitle ? (
            <p className="text-muted-foreground font-medium">{subtitle}</p>
          ) : (
            <Skeleton className="h-6 w-80 rounded-lg" />
          )}
        </div>
        <Skeleton className="h-6 w-32 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-6">
            <div className="bg-muted/30 relative aspect-4/5 w-full overflow-hidden rounded-[2.5rem]">
              <div className="bg-muted/40 absolute top-6 right-6 h-6 w-16 rounded-full" />
            </div>
            <div className="space-y-3 px-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-7 w-full" />
              <div className="flex items-center justify-between pt-4">
                <Skeleton className="h-10 w-24 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Add cn helper if not available, or import it
import { cn } from '@/lib/utils';

export const HomeSkeletons = () => {
  return (
    <div className="space-y-0">
      <BannerSkeleton />
      <ProductGridSkeleton
        title="Featured Excellence"
        subtitle="Our hand-picked selections for this season"
        variant="muted"
      />
      <ProductGridSkeleton title="The Highest Rating" variant="background" />
      <ProductGridSkeleton title="Most Wanted Now" variant="muted" />
    </div>
  );
};
