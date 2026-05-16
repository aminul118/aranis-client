'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const StatsSkeleton = () => {
  return (
    <div className="mx-auto w-full space-y-10 pb-20">
      {/* Prime Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-none bg-[#151722] shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24 bg-white/5" />
              <Skeleton className="h-10 w-10 rounded-xl bg-white/5" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-32 bg-white/5" />
              <Skeleton className="mt-2 h-4 w-40 bg-white/5" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Velocity Skeleton */}
        <Card className="col-span-1 border-none bg-[#151722] shadow-2xl">
          <CardHeader>
            <Skeleton className="h-6 w-32 bg-white/5" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white/5 p-4">
                  <Skeleton className="h-3 w-12 bg-white/10" />
                  <Skeleton className="mt-2 h-8 w-16 bg-white/10" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Distribution Skeleton */}
        <Card className="col-span-1 border-none bg-[#151722] shadow-2xl lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-40 bg-white/5" />
          </CardHeader>
          <CardContent className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20 bg-white/5" />
                  <Skeleton className="h-4 w-12 bg-white/5" />
                </div>
                <Skeleton className="h-2 w-full bg-white/5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsSkeleton;
