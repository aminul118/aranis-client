'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const UserDashboardLoading = () => {
  return (
    <div className="container mx-auto animate-pulse space-y-8 px-6 py-8">
      {/* Welcome Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-l-muted border-l-4">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-40 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboardLoading;
