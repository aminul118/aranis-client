'use client';

import { Input } from '@/components/ui/input';
import { useTransition } from '@/context/useTransition';
import useDebounce from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { CircleXIcon, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';

interface Props {
  placeholder?: string;
  paramName?: string;
  className?: string;
}

const SearchFilter = ({
  placeholder = 'Search...',
  paramName = 'search',
  className,
}: Props) => {
  const id = useId();
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const { startTransition } = useTransition();

  const [value, setValue] = useState(searchParams.get(paramName) || '');

  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValue = searchParams.get(paramName) || '';

    if (debouncedValue === currentValue) return;

    if (debouncedValue) {
      params.set(paramName, debouncedValue);
      params.set('page', '1');
    } else {
      params.delete(paramName);
      params.delete('page');
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }, [debouncedValue, paramName, router, searchParams]);

  const handleClearInput = () => {
    setValue('');
    inputRef.current?.focus();
  };

  return (
    <div>
      <div className="relative">
        <Search
          size={20}
          className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
        />

        <Input
          id={id}
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={cn('h-9 w-sm pe-9 pl-10', className)}
        />

        {value && (
          <button
            type="button"
            onClick={handleClearInput}
            className="text-muted-foreground absolute inset-y-0 end-0 flex w-9 items-center justify-center hover:text-red-500"
          >
            <CircleXIcon size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
