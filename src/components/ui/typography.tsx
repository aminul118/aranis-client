import { cn } from '@/lib/utils';
import * as React from 'react';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const H1 = ({ children, className, ...props }: TypographyProps) => {
  return (
    <h1
      className={cn(
        'text-center text-4xl font-bold tracking-tight lg:text-5xl',
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
};

const H2 = ({ children, className, ...props }: TypographyProps) => {
  return (
    <h2
      className={cn('text-3xl font-semibold tracking-tight', className)}
      {...props}
    >
      {children}
    </h2>
  );
};

const H3 = ({ children, className, ...props }: TypographyProps) => {
  return (
    <h3
      className={cn('text-2xl font-semibold tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

const P = ({ children, className, ...props }: TypographyProps) => {
  return (
    <p
      className={cn('leading-7 text-black/80 dark:text-white/70', className)}
      {...props}
    >
      {children}
    </p>
  );
};

export { H1, H2, H3, P };
