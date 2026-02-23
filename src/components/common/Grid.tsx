import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GridProps {
  children: ReactNode;
  className?: string;
  cols?: number;
}

const Grid = ({ children, className, cols = 3 }: GridProps) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 2xl:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[cols as 1 | 2 | 3 | 4];

  return (
    <div
      className={cn(
        'grid gap-8 lg:gap-14',
        gridCols,
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Grid;
