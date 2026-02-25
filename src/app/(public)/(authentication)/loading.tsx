import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const AuthLoading = () => {
  return (
    <section className="center">
      <div className="mx-auto flex w-full max-w-sm items-center justify-center rounded-lg md:max-w-4xl">
        <Card className="w-full max-w-5xl overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            {/* Form Section Skeleton */}
            <div className="p-6 md:p-8">
              <div className="mb-6 flex flex-col items-center space-y-4">
                {/* Logo Skeleton */}
                <Skeleton className="mt-6 h-12 w-32" />
                {/* Subtitle Skeleton */}
                <Skeleton className="h-4 w-48 opacity-60" />
              </div>

              {/* Form Fields Skeletons */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <Skeleton className="mt-4 h-11 w-full rounded-md" />
              </div>

              {/* Footer Skeleton */}
              <div className="mt-8 flex justify-center">
                <Skeleton className="h-4 w-40" />
              </div>
            </div>

            {/* Image Section Skeleton */}
            <div className="bg-muted/30 relative hidden md:block">
              <Skeleton className="h-full w-full" />
              {/* Overlay pulse */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-32 w-32 animate-pulse rounded-full bg-white/5 blur-3xl" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AuthLoading;
