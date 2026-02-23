'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTransition } from '@/context/useTransition';

import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

interface PageLimitProps {
  label?: string;
  pageNumbers?: number[];
  className?: string;
}

const PageLimit = ({
  label = 'Show :',
  className,
  pageNumbers = [10, 20, 30, 40, 50],
}: PageLimitProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { startTransition, isPending } = useTransition();

  // current limit or fallback
  const limit = searchParams.get('limit') ?? '10';

  const handlePageLimitChange = (newLimit: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('limit', newLimit);
    params.set('page', '1'); // reset page when limit changes

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-2 md:flex-row md:items-center',
        className,
      )}
    >
      <Label className="whitespace-nowrap">{label}</Label>

      <Select
        onValueChange={handlePageLimitChange}
        value={limit}
        disabled={isPending}
      >
        <SelectTrigger className="w-full md:w-20">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {pageNumbers.map((page) => (
              <SelectItem key={page} value={page.toString()}>
                {page}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PageLimit;
