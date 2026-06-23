'use client';

import Image from '@/components/common/SafeImage';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ContinueShoppingButton from './ContinueShoppingButton';

interface WishlistItemCardProps {
  item: any;
  handleDecrement: (id: string, currentQty: number) => void;
  handleIncrement: (id: string, currentQty: number) => void;
  removeFromWishlist: (id: string) => void;
  addToCart: (
    product: any,
    selectedColor?: string,
    selectedSize?: string,
  ) => void;
}

const WishlistItemCard = ({
  item,
  handleDecrement,
  handleIncrement,
  removeFromWishlist,
  addToCart,
}: WishlistItemCardProps) => {
  const product = item.product;
  const currentPrice = product.salePrice || product.price;
  const qty = item.quantity || 1;

  const getInitialVariantIndex = () => {
    if (!item.selectedColor || item.selectedColor === product.color) return -1;
    const idx = product.variants?.findIndex(
      (v: any) => v.color === item.selectedColor,
    );
    return idx !== undefined && idx !== -1 ? idx : -1;
  };

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(
    getInitialVariantIndex(),
  );
  const [selectedSize, setSelectedSize] = useState(
    item.selectedSize || product.sizes?.[0] || '',
  );

  // Helper to get stock for a size given variant index
  const getStockForSize = (size: string, variantIndex: number) => {
    if (variantIndex >= 0 && product.variants) {
      const variant = product.variants[variantIndex];
      return variant.sizes?.find((s: any) => s.size === size)?.stock ?? 0;
    }
    return (
      product.sizeStock?.find((s: any) => s.size === size)?.stock ??
      (product.stock > 0 ? 99 : 0)
    );
  };

  // Auto-select first in-stock size when variant index changes
  useEffect(() => {
    const stock = getStockForSize(selectedSize, selectedVariantIndex);
    if (stock <= 0) {
      const firstInStock = (product.sizes || []).find(
        (size: string) => getStockForSize(size, selectedVariantIndex) > 0,
      );
      if (firstInStock) {
        setSelectedSize(firstInStock);
      }
    }
  }, [selectedVariantIndex]);

  // Determine thumbnail and color
  const selectedColor =
    selectedVariantIndex === -1
      ? product.color
      : product.variants?.[selectedVariantIndex].color;

  const previewImage =
    selectedVariantIndex >= 0 &&
    product.variants?.[selectedVariantIndex].thumbnails?.[0]
      ? product.variants[selectedVariantIndex].thumbnails[0]
      : product.thumbnails?.[0] || '/placeholder.jpg';

  return (
    <div className="group border-border bg-card/40 relative flex flex-col gap-6 overflow-hidden rounded-[32px] border p-5 backdrop-blur-xl transition-all hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5 sm:flex-row sm:items-center">
      <Link
        href={`/products/${product.slug || product._id}`}
        className="bg-muted relative mx-auto h-32 w-32 shrink-0 overflow-hidden rounded-2xl sm:mx-0"
      >
        <Image
          src={previewImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 128px, 128px"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {product.salePrice && product.salePrice < product.price && (
          <div className="absolute top-2 left-2 rounded-full bg-red-500 px-2 py-0.5 text-[8px] font-black text-white uppercase">
            Sale
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-center py-1 text-center sm:text-left">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="space-y-1">
            <Link
              href={`/products/${product.slug || product._id}`}
              className="text-foreground group-hover:text-primary line-clamp-1 text-xl font-black tracking-tight transition-colors"
            >
              {product.name}
            </Link>

            {/* Color and Size Selector */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
              {/* Color Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground/50 text-[10px] font-black tracking-wider uppercase">
                    Color:
                  </span>
                  <select
                    value={selectedVariantIndex.toString()}
                    onChange={(e) =>
                      setSelectedVariantIndex(parseInt(e.target.value))
                    }
                    className="cursor-pointer rounded-lg border border-black/5 bg-black/[0.03] px-2 py-1 text-xs font-black text-zinc-800 transition-all hover:bg-black/[0.05] focus:outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:bg-white/[0.08]"
                  >
                    <option
                      value="-1"
                      className="bg-background text-foreground font-medium"
                    >
                      {product.color}
                    </option>
                    {product.variants.map((v: any, idx: number) => (
                      <option
                        key={idx}
                        value={idx.toString()}
                        className="bg-background text-foreground font-medium"
                      >
                        {v.color}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground/50 text-[10px] font-black tracking-wider uppercase">
                    Size:
                  </span>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="cursor-pointer rounded-lg border border-black/5 bg-black/[0.03] px-2 py-1 text-xs font-black text-zinc-800 transition-all hover:bg-black/[0.05] focus:outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:bg-white/[0.08]"
                  >
                    {product.sizes.map((size: string) => {
                      const stock = getStockForSize(size, selectedVariantIndex);
                      const isOutOfStock = stock <= 0;
                      return (
                        <option
                          key={size}
                          value={size}
                          disabled={isOutOfStock}
                          className="bg-background text-foreground font-medium disabled:opacity-50"
                        >
                          {size} {isOutOfStock ? '(Out of stock)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => removeFromWishlist(item._id)}
            className="text-muted-foreground/30 absolute top-4 right-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all hover:bg-red-500/10 hover:text-red-500 active:scale-90 sm:static"
            title="Remove"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex justify-start">
            <div className="bg-muted/30 border-border flex items-center gap-4 rounded-full border p-1 backdrop-blur-sm">
              <button
                onClick={() => handleDecrement(item._id, qty)}
                disabled={qty <= 1}
                className="text-muted-foreground hover:bg-background hover:text-foreground flex h-8 w-8 items-center justify-center rounded-full transition-all disabled:opacity-30"
              >
                <Minus size={14} />
              </button>
              <span className="text-foreground min-w-[20px] text-center text-sm font-black">
                {qty}
              </span>
              <button
                onClick={() => handleIncrement(item._id, qty)}
                disabled={qty >= 20}
                className="text-muted-foreground hover:bg-background hover:text-foreground flex h-8 w-8 items-center justify-center rounded-full transition-all disabled:opacity-30"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Add to Bag & Pricing */}
          <div className="flex flex-col items-end gap-4 sm:flex-row sm:items-center sm:gap-6">
            <button
              onClick={() => {
                addToCart(product, selectedColor, selectedSize);
                toast.success(
                  `"${product.name}" (${selectedColor} - ${selectedSize}) added to cart`,
                );
              }}
              className="bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/40 flex h-10 items-center gap-2 rounded-full px-6 text-xs font-black tracking-widest uppercase shadow-lg transition-all active:scale-95"
            >
              <ShoppingBag size={14} />
              <span>Add to Bag</span>
            </button>

            <div className="flex flex-col items-end">
              <p className="text-foreground text-xl font-black tracking-tighter">
                ৳{(currentPrice * qty).toLocaleString()}
              </p>
              <p className="text-muted-foreground/40 text-[10px] font-bold tracking-widest uppercase">
                Subtotal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WishlistContent() {
  const { wishlist, wishlistCount, updateQuantity, removeFromWishlist } =
    useWishlist();
  const { addToCart } = useCart();

  if (wishlistCount === 0) {
    return (
      <div className="bg-background flex min-h-[60vh] flex-col items-center justify-center px-4 pt-20 text-center">
        <div className="bg-muted mb-6 flex h-20 w-20 items-center justify-center rounded-full">
          <Heart className="text-muted-foreground h-10 w-10 opacity-50" />
        </div>
        <h3 className="text-foreground text-2xl font-black tracking-tight">
          Nothing here yet
        </h3>
        <p className="text-muted-foreground mt-2 max-w-sm text-sm">
          Tap the heart on any item to save it here for later!
        </p>
        <Link
          href="/shop"
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 flex h-12 items-center justify-center rounded-xl px-8 text-sm font-bold transition-all active:scale-95"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  const handleDecrement = (id: string, currentQty: number) => {
    if (currentQty > 1) {
      updateQuantity(id, currentQty - 1);
    }
  };

  const handleIncrement = (id: string, currentQty: number) => {
    updateQuantity(id, currentQty + 1);
  };

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-2">
            <h1 className="flex items-center gap-4 text-5xl font-black tracking-tighter uppercase">
              My Wishlist
              <span className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full text-sm font-black tracking-normal backdrop-blur-sm">
                {wishlistCount}
              </span>
            </h1>
            <p className="text-muted-foreground/60 text-lg font-medium">
              Items you've saved to buy later.
            </p>
          </div>
          <ContinueShoppingButton />
        </div>

        <div className="flex flex-col gap-6">
          {wishlist
            .filter((item) => item && item.product)
            .map((item) => (
              <WishlistItemCard
                key={item._id}
                item={item}
                handleDecrement={handleDecrement}
                handleIncrement={handleIncrement}
                removeFromWishlist={removeFromWishlist}
                addToCart={addToCart}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
