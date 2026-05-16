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
  const imageSrc =
    item.thumbnails?.[0] &&
    typeof item.thumbnails[0] === 'string' &&
    item.thumbnails[0] !== '[]' &&
    item.thumbnails[0] !== ''
      ? item.thumbnails[0]
      : 'https://placehold.co/600x800?text=No+Image';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group border-border bg-card/40 relative flex flex-col gap-6 overflow-hidden rounded-[32px] border p-5 backdrop-blur-xl transition-all hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5 sm:flex-row"
    >
      {/* Product Image */}
      <div className="bg-muted relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-2xl sm:w-32">
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {item.salePrice && item.salePrice > 0 && (
          <div className="absolute top-2 left-2 rounded-full bg-red-500 px-2.5 py-1 text-[9px] font-black text-white uppercase shadow-lg shadow-red-500/20">
            Sale
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between py-1">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-foreground text-xl font-black tracking-tight transition-colors group-hover:text-blue-600">
              {item.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground/60 text-xs font-bold tracking-widest uppercase">
                {item.category}
              </span>
              {(item.selectedColor || item.selectedSize) && (
                <div className="flex gap-2">
                  <span className="bg-border h-4 w-px" />
                  <span className="text-muted-foreground/80 text-[10px] font-bold">
                    {item.selectedSize}{' '}
                    {item.selectedColor && `• ${item.selectedColor}`}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => onRemove(item._id as string)}
            className="text-muted-foreground/30 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all hover:bg-red-500/10 hover:text-red-500 active:scale-90"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 sm:mt-0">
          {/* Quantity Controls */}
          <div className="bg-muted/30 border-border flex items-center gap-4 rounded-full border p-1 backdrop-blur-sm">
            <button
              onClick={() =>
                onUpdateQuantity(item._id as string, item.quantity - 1)
              }
              disabled={item.quantity <= 1}
              className="text-muted-foreground hover:bg-background hover:text-foreground flex h-8 w-8 items-center justify-center rounded-full shadow-xs transition-all disabled:opacity-30"
            >
              <Minus size={14} />
            </button>
            <span className="text-foreground min-w-[20px] text-center text-sm font-black">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                onUpdateQuantity(item._id as string, item.quantity + 1)
              }
              className="text-muted-foreground hover:bg-background hover:text-foreground flex h-8 w-8 items-center justify-center rounded-full shadow-xs transition-all"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Pricing */}
          <div className="flex flex-col items-end">
            <div className="flex items-baseline gap-2">
              {item.salePrice && item.salePrice > 0 && (
                <span className="text-muted-foreground/40 text-sm font-medium line-through">
                  ৳{(item.price * item.quantity).toLocaleString()}
                </span>
              )}
              <span className="text-foreground text-2xl font-black tracking-tighter">
                ৳
                {(
                  (item.salePrice && item.salePrice > 0
                    ? item.salePrice
                    : item.price) * item.quantity
                ).toLocaleString()}
              </span>
            </div>
            <p className="text-muted-foreground/40 text-[10px] font-bold tracking-wider uppercase">
              Total Price
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
