import { cn } from '@/lib/utils';
import { Children, SectionProps } from '@/types';

type TContainer = Children &
  SectionProps & {
    className?: string;
    background?: string;
  };

const Container = ({
  background,
  className,
  children,
  ...props
}: TContainer) => {
  return (
    <section {...props} className={cn('px-4 py-12 lg:py-20', background)}>
      <div className={cn('container mx-auto', className)}> {children}</div>
    </section>
  );
};

export default Container;
