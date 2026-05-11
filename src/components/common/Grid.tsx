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
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
  }[cols as 1 | 2 | 3 | 4];

  return (
    <div className={cn('grid gap-3 lg:gap-14', gridCols, className)}>
      {children}
    </div>
  );
};

export default Grid;
