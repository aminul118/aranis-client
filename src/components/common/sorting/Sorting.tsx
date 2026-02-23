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
import { ArrowDownUp } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface SortOption {
  name: string;
  value: string;
}

interface SortByProps {
  label?: string;
  sortOptions?: SortOption[];
  labelInSelect?: boolean;
  className?: string;
}

const Sorting = ({
  label = 'Sort By :',
  labelInSelect,
  className,
  sortOptions = [
    { name: 'Ascending', value: '-createdAt' },
    { name: 'Descending', value: 'createdAt' },
  ],
}: SortByProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isPending, startTransition } = useTransition();

  const currentSorting = searchParams.get('sort') || 'default';

  const handleSortChange = (newValue: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newValue === 'default') {
      params.delete('sort');
    } else {
      params.set('sort', newValue);
      params.set('page', '1'); // reset page on sort
    }

    startTransition(() => {
      const queryString = params.toString();
      router.push(queryString ? `?${queryString}` : '?');
    });
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-2 md:flex-row md:items-center',
        className,
      )}
    >
      {!labelInSelect && <Label className="whitespace-nowrap">{label}</Label>}

      <Select
        onValueChange={handleSortChange}
        value={currentSorting}
        disabled={isPending}
      >
        <SelectTrigger className="w-full">
          {labelInSelect ? (
            <span className="flex items-center gap-1">
              <ArrowDownUp className="h-4 w-4" />
              {label}
              <SelectValue placeholder="Default" />
            </span>
          ) : (
            <SelectValue placeholder="Default" />
          )}
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectItem value="default">Default</SelectItem>
            {sortOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="capitalize"
              >
                {option.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Sorting;
