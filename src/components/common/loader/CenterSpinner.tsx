'use client';

import icons from '@/constants/icons';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Props {
  className?: string;
}

const CenterSpinner = ({ className }: Props) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-6',
        className,
      )}
    >
      <div className="relative flex items-center justify-center">
        {/* Outer Rotating Gradient Ring */}
        <div className="absolute h-24 w-24 animate-[spin_3s_linear_infinite] rounded-full border-2 border-transparent border-t-blue-500 border-r-cyan-500" />

        {/* Inner Pulsing Glow */}
        <div className="absolute h-16 w-16 animate-pulse rounded-full bg-blue-500/20 blur-xl" />

        {/* Logo in Center */}
        <div className="border-border bg-card relative z-10 flex h-16 w-16 items-center justify-center rounded-full border shadow-2xl">
          <Image
            src={icons.logo}
            height={32}
            width={32}
            alt="Loading..."
            className="animate-pulse"
          />
        </div>
      </div>

      {/* Modern Text with Gradient */}
      <div className="flex flex-col items-center gap-2">
        <h3 className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-lg font-bold tracking-widest text-transparent uppercase">
          Aranis
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" />
        </div>
      </div>
    </div>
  );
};

export default CenterSpinner;
