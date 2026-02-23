import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GridProps {
  children: ReactNode;
  className?: string;
}

const Grid = ({ children, className }: GridProps) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14 2xl:grid-cols-3',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Grid;
