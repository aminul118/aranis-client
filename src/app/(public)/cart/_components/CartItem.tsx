'use client';

import Image from '@/components/common/SafeImage';
import { ICartItem } from '@/types';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface CartItemProps {
  item: ICartItem;
  onUpdateQuantity: (
    id: string,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string,
  ) => void;
  onRemove: (id: string, selectedColor?: string, selectedSize?: string) => void;
  onUpdateSize?: (
    id: string,
    newSize: string,
    selectedColor?: string,
    oldSize?: string,
  ) => void;
  onUpdateColor?: (
    id: string,
    newColor: string,
    selectedSize?: string,
    oldColor?: string,
  ) => void;
}

const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
  onUpdateSize,
  onUpdateColor,
}: CartItemProps) => {
  const selectedVariant = item.variants?.find(
    (v) => v.color === item.selectedColor,
  );

  const imageSrc =
    selectedVariant?.thumbnails?.[0] &&
    typeof selectedVariant.thumbnails[0] === 'string' &&
    selectedVariant.thumbnails[0] !== '[]' &&
    selectedVariant.thumbnails[0] !== ''
      ? selectedVariant.thumbnails[0]
      : item.thumbnails?.[0] &&
          typeof item.thumbnails[0] === 'string' &&
          item.thumbnails[0] !== '[]' &&
          item.thumbnails[0] !== ''
        ? item.thumbnails[0]
        : '';

  const availableColors = Array.from(
    new Set(
      [item.color, ...(item.variants?.map((v) => v.color) || [])].filter(
        Boolean,
      ),
    ),
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group border-border bg-card/40 relative flex flex-col gap-6 overflow-hidden rounded-[32px] border p-5 backdrop-blur-xl transition-all sm:flex-row sm:items-center ${
        item.isStockOut
          ? 'opacity-70 grayscale-[0.2]'
          : 'hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5'
      }`}
    >
      {item.isStockOut && (
        <div className="pointer-events-none absolute inset-0 z-0 bg-red-500/5" />
      )}
      {/* Product Image */}
      <Link
        href={`/products/${item.slug || item._id}`}
        className="bg-muted relative mx-auto h-32 w-32 shrink-0 overflow-hidden rounded-2xl sm:mx-0"
      >
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {item.isStockOut ? (
          <div className="absolute top-2 left-2 z-10 rounded-full bg-red-600 px-2.5 py-1 text-[9px] font-black text-white uppercase shadow-lg shadow-red-500/20">
            Out of Stock
          </div>
        ) : item.salePrice && item.salePrice > 0 ? (
          <div className="absolute top-2 left-2 z-10 rounded-full bg-red-500 px-2.5 py-1 text-[9px] font-black text-white uppercase shadow-lg shadow-red-500/20">
            Sale
          </div>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col justify-center py-1 text-center sm:text-left">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="space-y-1">
            <Link href={`/products/${item.slug || item._id}`}>
              <h3 className="text-foreground text-xl font-black tracking-tight transition-colors group-hover:text-blue-600 hover:text-blue-600">
                {item.name}
              </h3>
            </Link>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              {item.sizes && item.sizes.length > 0 ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground/50 text-[10px] font-black tracking-wider uppercase">
                    Size:
                  </span>
                  <select
                    value={item.selectedSize || ''}
                    onChange={(e) =>
                      onUpdateSize &&
                      onUpdateSize(
                        item._id as string,
                        e.target.value,
                        item.selectedColor,
                        item.selectedSize,
                      )
                    }
                    className="cursor-pointer rounded-lg border border-black/5 bg-black/[0.03] px-2 py-1 text-xs font-black text-zinc-800 transition-all hover:bg-black/[0.05] focus:outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:bg-white/[0.08]"
                  >
                    {item.sizes.map((size) => (
                      <option
                        key={size}
                        value={size}
                        className="bg-background text-foreground font-medium"
                      >
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                item.selectedSize && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground/50 text-[10px] font-black tracking-wider uppercase">
                      Size:
                    </span>
                    <span className="rounded-lg border border-black/5 bg-black/[0.03] px-2.5 py-1 text-xs font-bold text-zinc-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                      {item.selectedSize}
                    </span>
                  </div>
                )
              )}

              {availableColors.length > 1 ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground/50 text-[10px] font-black tracking-wider uppercase">
                    Color:
                  </span>
                  <select
                    value={item.selectedColor || ''}
                    onChange={(e) =>
                      onUpdateColor &&
                      onUpdateColor(
                        item._id as string,
                        e.target.value,
                        item.selectedSize,
                        item.selectedColor,
                      )
                    }
                    className="cursor-pointer rounded-lg border border-black/5 bg-black/[0.03] px-2 py-1 text-xs font-black text-zinc-800 transition-all hover:bg-black/[0.05] focus:outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:bg-white/[0.08]"
                  >
                    {availableColors.map((color) => (
                      <option
                        key={color}
                        value={color}
                        className="bg-background text-foreground font-medium"
                      >
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                item.selectedColor && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground/50 text-[10px] font-black tracking-wider uppercase">
                      Color:
                    </span>
                    <span className="rounded-lg border border-black/5 bg-black/[0.03] px-2.5 py-1 text-xs font-bold text-zinc-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                      {item.selectedColor}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
          <button
            onClick={() =>
              onRemove(
                item._id as string,
                item.selectedColor,
                item.selectedSize,
              )
            }
            className="text-muted-foreground/30 absolute top-4 right-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all hover:bg-red-500/10 hover:text-red-500 active:scale-90 sm:static"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex justify-start">
            <div className="bg-muted/30 border-border flex items-center gap-4 rounded-full border p-1 backdrop-blur-sm">
              <button
                onClick={() =>
                  onUpdateQuantity(
                    item._id as string,
                    item.quantity - 1,
                    item.selectedColor,
                    item.selectedSize,
                  )
                }
                disabled={item.quantity <= 1 || item.isStockOut}
                className="text-muted-foreground hover:bg-background hover:text-foreground flex h-8 w-8 items-center justify-center rounded-full shadow-xs transition-all disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Minus size={14} />
              </button>
              <span className="text-foreground min-w-[20px] text-center text-sm font-black">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  onUpdateQuantity(
                    item._id as string,
                    item.quantity + 1,
                    item.selectedColor,
                    item.selectedSize,
                  )
                }
                disabled={
                  item.quantity >= 20 ||
                  item.isStockOut ||
                  (item.stock !== undefined && item.quantity >= item.stock)
                }
                className="text-muted-foreground hover:bg-background hover:text-foreground flex h-8 w-8 items-center justify-center rounded-full shadow-xs transition-all disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex flex-col items-end">
            <div className="flex items-baseline gap-2">
              {(item.salePrice ?? 0) > 0 && (
                <span className="text-muted-foreground/40 text-sm font-medium line-through">
                  ৳{(item.price * item.quantity).toLocaleString()}
                </span>
              )}
              <span className="text-foreground text-2xl font-black tracking-tighter">
                {item.isStockOut ? (
                  <span className="text-lg text-red-500">Not Available</span>
                ) : (
                  <>
                    ৳
                    {(
                      (item.salePrice && item.salePrice > 0
                        ? item.salePrice
                        : item.price) * item.quantity
                    ).toLocaleString()}
                  </>
                )}
              </span>
            </div>
            <p className="text-muted-foreground/40 text-[10px] font-bold tracking-wider uppercase">
              Total Price
            </p>
          </div>
        </div>

        {/* Insufficient Stock Warning */}
        {!item.isStockOut &&
          item.stock !== undefined &&
          item.quantity > item.stock && (
            <div className="mt-4 rounded-lg border border-orange-500/30 bg-orange-500/10 p-2.5 text-center sm:text-left">
              <p className="text-xs font-bold text-orange-600 dark:text-orange-400">
                Only {item.stock} left in stock! Please reduce your quantity to
                proceed.
              </p>
            </div>
          )}
      </div>
    </motion.div>
  );
};

export default CartItem;
