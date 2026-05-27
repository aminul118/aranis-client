'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  label?: string;
}

const BackButton = ({ label = 'Go Back' }: BackButtonProps) => {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="group font-bold transition-all"
      onClick={() => router.back()}
    >
      <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
      {label}
    </Button>
  );
};

export default BackButton;
