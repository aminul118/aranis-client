import { cn } from '@/lib/utils';
import { Loader, Loader2 } from 'lucide-react';

type SpinnerProps = {
  className?: string;
  size?: number;
  variant?: 'default' | 'round';
};

const ButtonSpinner = ({
  className,
  size = 16,
  variant = 'default',
}: SpinnerProps) => {
  const Icon = variant === 'round' ? Loader2 : Loader;

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Icon size={size} className="animate-spin" />
    </div>
  );
};

export default ButtonSpinner;
