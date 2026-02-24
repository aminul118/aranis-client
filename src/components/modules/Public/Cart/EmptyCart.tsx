'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border-border bg-card/50 flex w-full max-w-md flex-col items-center rounded-3xl border p-12"
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
          <ShoppingBag size={40} />
        </div>
        <h1 className="text-foreground mb-4 text-3xl font-bold">
          Your bag is empty
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Looks like you haven't added anything to your bag yet. Start exploring
          our latest collections to find your signature style.
        </p>
        <Button
          asChild
          size="lg"
          className="rounded-full bg-blue-600 px-8 py-6 font-bold hover:bg-blue-700"
        >
          <Link href="/">
            Shop Now <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default EmptyCart;
