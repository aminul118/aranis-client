'use client';

import { Button } from '@/components/ui/button';
import { Undo } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  className?: string;
  label?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
}

const BackButton = ({
  label = 'Back',
  variant = 'outline',
  className,
}: BackButtonProps) => {
  const router = useRouter();

  return (
    <Button
      className={className}
      variant={variant}
      onClick={() => router.back()}
    >
      <Undo size={16} />
      {label}
    </Button>
  );
};

export default BackButton;
