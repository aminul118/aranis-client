'use client';

import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const EmptyCart = () => {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center px-4 text-center">
      <div className="bg-muted mb-6 flex h-20 w-20 items-center justify-center rounded-full">
        <ShoppingBag className="text-muted-foreground h-10 w-10 opacity-50" />
      </div>
      <h3 className="text-foreground text-2xl font-black tracking-tight">
        Your cart is empty
      </h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">
        Looks like you haven't picked anything yet. Let's find something
        special!
      </p>
      <Button
        asChild
        className="mt-6 h-12 rounded-xl px-8 text-sm font-bold transition-all active:scale-95"
      >
        <Link href="/shop">Go Shopping</Link>
      </Button>
    </div>
  );
};

export default EmptyCart;
