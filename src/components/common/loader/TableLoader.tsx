'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TableLoaderProps {
  className?: string;
  text?: string;
}

const TableLoader = ({ className, text = 'Updating...' }: TableLoaderProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 p-6 transition-all duration-300',
        className,
      )}
    >
      <div className="relative flex items-center justify-center">
        {/* Modern Sleek Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 rounded-full border-t-2 border-r-2 border-blue-500 border-b-transparent border-l-transparent shadow-[0_0_15px_-3px_rgba(59,130,246,0.4)]"
        />

        {/* Inner Gradient Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute h-8 w-8 rounded-full border-b-2 border-l-2 border-indigo-500 border-t-transparent border-r-transparent opacity-40"
        />

        {/* Center Point */}
        <div className="absolute h-1.5 w-1.5 animate-pulse rounded-full bg-sky-500" />
      </div>

      {text && (
        <div className="ml-1 flex flex-col items-center gap-1.5">
          <p className="text-foreground/80 text-sm font-black tracking-widest uppercase italic">
            {text}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="h-1 w-1 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.15s]" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-sky-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export default TableLoader;
