'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50/80 text-blue-400 dark:bg-blue-900/20"
        >
          <ShoppingBag size={48} strokeWidth={1.5} />
        </motion.div>

        <h1 className="text-foreground mb-3 text-3xl font-bold tracking-tight">
          Your bag feels a bit light
        </h1>

        <p className="text-muted-foreground mb-10 max-w-[280px] text-base leading-relaxed">
          Looks like you haven't picked anything yet. Let's find something
          special!
        </p>

        <Button
          asChild
          className="h-14 rounded-2xl bg-blue-600 px-10 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-95"
        >
          <Link href="/">Go Shopping</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default EmptyCart;
