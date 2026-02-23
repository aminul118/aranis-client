import CardSkeleton from '@/components/common/loader/CardSkeleton';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedProjectSkeleton = () => {
  return (
    <CardSkeleton count={6}>
      <Card className="space-y-2 p-4 shadow-sm">
        <Skeleton className="mx-auto mt-2 h-4 w-3/4" />
        <Skeleton className="h-40 w-full rounded-lg" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </Card>
    </CardSkeleton>
  );
};

export default FeaturedProjectSkeleton;
