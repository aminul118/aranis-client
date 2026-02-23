import { Card } from '@/components/ui/card';
import Container from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import React from 'react';

interface SkeletonGridProps {
  count?: number;
  columns?: 1 | 2 | 3 | 4;
  gap?: string;
  className?: string;
  children?: React.ReactNode;
}

const gridMap = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
};

export default function SkeletonGrid({
  count = 3,
  columns = 3,
  gap = 'gap-4',
  className,
  children,
}: SkeletonGridProps) {
  return (
    <Container>
      <div
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2',
          gridMap[columns],
          gap,
          className,
        )}
      >
        {Array.from({ length: count }).map((_, index) => (
          <React.Fragment key={index}>
            {children ?? <DefaultCardSkeleton />}
          </React.Fragment>
        ))}
      </div>
    </Container>
  );
}

const DefaultCardSkeleton = () => {
  return (
    <Card className="space-y-4 p-4 shadow-sm">
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full rounded-md" />
    </Card>
  );
};
