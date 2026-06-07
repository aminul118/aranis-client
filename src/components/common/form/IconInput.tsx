import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import React from 'react';

export interface IconInputProps extends React.ComponentProps<'input'> {
  icon: LucideIcon;
  iconPosition?: 'left' | 'right';
  iconClassName?: string;
}

const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
  (
    { icon: Icon, iconPosition = 'left', iconClassName, className, ...props },
    ref,
  ) => {
    return (
      <div className="relative">
        <Icon
          className={cn(
            'text-muted-foreground absolute top-1/2 -translate-y-1/2',
            iconPosition === 'left' ? 'left-3' : 'right-3',
            iconClassName,
          )}
          size={18}
        />
        <Input
          ref={ref}
          className={cn(
            'h-12 rounded-xl border-2 focus:border-blue-500',
            iconPosition === 'left' ? 'pl-10' : 'pr-10',
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

IconInput.displayName = 'IconInput';

export default IconInput;
