'use client';

import { ICartItem } from '@/types';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface CartItemProps {
  item: ICartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group border-border bg-card/50 flex flex-col gap-6 rounded-3xl border p-6 transition-colors hover:border-blue-500/20 sm:flex-row"
    >
      <div className="bg-muted relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl sm:w-32">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between pt-2 pb-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-foreground mb-1 text-xl font-bold transition-colors group-hover:text-blue-500">
              {item.name}
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">
              {item.category}
            </p>
          </div>
          <button
            onClick={() => onRemove(item._id as string)}
            className="text-muted-foreground p-2 transition-colors hover:text-red-500"
          >
            <Trash2 size={20} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="border-border bg-muted/50 flex items-center gap-4 rounded-full border p-1">
            <button
              onClick={() =>
                onUpdateQuantity(item._id as string, item.quantity - 1)
              }
              className="text-muted-foreground hover:bg-muted flex h-8 w-8 items-center justify-center rounded-full transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="text-foreground w-4 text-center text-sm font-bold">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                onUpdateQuantity(item._id as string, item.quantity + 1)
              }
              className="text-muted-foreground hover:bg-muted flex h-8 w-8 items-center justify-center rounded-full transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <p className="text-foreground text-xl font-bold">
            ৳{(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
