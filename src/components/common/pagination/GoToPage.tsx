'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTransition } from '@/context/useTransition';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface GoToPageProps {
  totalPage: number;
  label?: string;
  className?: string;
}

const GoToPage = ({
  totalPage,
  label = 'Page :',
  className,
}: GoToPageProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { startTransition, isPending } = useTransition();

  const currentPage = Number(searchParams.get('page')) || 1;

  const [value, setValue] = useState(String(currentPage));
  const [error, setError] = useState('');

  // keep input synced with URL
  useEffect(() => {
    setValue(String(currentPage));
  }, [currentPage]);

  const handlePageChange = (e: string) => {
    setValue(e);
    setError('');
  };

  const handleGoToPage = () => {
    const pageNumber = Number(value);

    if (!pageNumber || isNaN(pageNumber) || pageNumber < 1) {
      return setError('Enter a valid page number');
    }

    if (pageNumber > totalPage) {
      return setError(`Page ${pageNumber} does not exist`);
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(pageNumber));

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });

    setError('');
  };

  if (totalPage <= 1) return null;

  return (
    <div className={cn('hidden items-center gap-3 lg:flex', className)}>
      <Label className="whitespace-nowrap">{label}</Label>

      <Input
        type="number"
        min={1}
        max={totalPage}
        className="w-20"
        value={value}
        onChange={(e) => handlePageChange(e.target.value)}
        disabled={isPending}
      />

      <Button
        variant="outline"
        size="sm"
        onClick={handleGoToPage}
        disabled={!value || isPending}
      >
        Go
      </Button>

      {error && (
        <p className="text-xs whitespace-nowrap text-red-500">{error}</p>
      )}
    </div>
  );
};

export default GoToPage;
