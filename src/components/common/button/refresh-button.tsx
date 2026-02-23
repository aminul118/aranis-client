'use client';

import { Button } from '@/components/ui/button';
import { useTransition } from '@/context/useTransition';
import { RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RefreshButtonProps {
  size?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
  showLabel?: boolean;
}

const RefreshButton = ({
  size = 'default',
  variant = 'default',
  showLabel = true,
}: RefreshButtonProps) => {
  const router = useRouter();
  const { startTransition, isPending } = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };
  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleRefresh}
      disabled={isPending}
    >
      <RefreshCcw
        className={`h-4 w-4 ${isPending ? 'animate-spin' : ''} ${
          showLabel ? 'mr-2' : ''
        }`}
      />
      {showLabel && 'Refresh'}
    </Button>
  );
};

export default RefreshButton;
