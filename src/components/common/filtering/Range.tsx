'use client';

import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const numberFmt = new Intl.NumberFormat('en-US');

interface RangeProps {
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

const Range = ({ min = 0, max = 100_000, step = 1, className }: RangeProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // internal state for slider/input values
  const [value, setValue] = useState([min, max]);

  // sync state with URL whenever searchParams change
  useEffect(() => {
    const filterPrice = searchParams.get('filter_price');
    if (filterPrice) {
      const [low, high] = filterPrice.split('-').map((n) => parseInt(n, 10));
      if (!isNaN(low) && !isNaN(high)) {
        setValue([low, high]);
        return;
      }
    }
    setValue([min, max]); // reset if no filter_price
  }, [searchParams, min, max]);

  // update URL whenever value changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (value[0] === min && value[1] === max) {
      params.delete('filter_price');
    } else {
      params.set('filter_price', `${value[0]}-${value[1]}`);
    }

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : '?', { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // manual input change
  const handleInputChange = (index: 0 | 1, newValue: string) => {
    let num = parseInt(newValue.replace(/\D/g, ''), 10);
    if (isNaN(num)) num = index === 0 ? min : max;

    num = Math.max(min, Math.min(max, num));
    const newRange: [number, number] = [...value] as [number, number];
    newRange[index] = num;

    if (newRange[0] > newRange[1]) {
      if (index === 0) newRange[1] = newRange[0];
      else newRange[0] = newRange[1];
    }
    setValue(newRange);
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Slider */}
      <div>
        <Slider
          value={value}
          onValueChange={(v) => setValue(v as [number, number])}
          max={max}
          min={min}
          step={step}
          className="w-full"
        />
      </div>

      {/* Inputs */}
      <div className="mt-4 grid grid-cols-2 gap-6">
        <Input
          type="text"
          value={numberFmt.format(value[0])}
          onChange={(e) => handleInputChange(0, e.target.value)}
          className="text-center text-xl font-semibold"
        />
        <Input
          type="text"
          value={numberFmt.format(value[1])}
          onChange={(e) => handleInputChange(1, e.target.value)}
          className="text-center text-xl font-semibold"
        />
      </div>
    </div>
  );
};

export default Range;
