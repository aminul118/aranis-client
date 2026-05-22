'use client';

import CartItem from '@/components/modules/Public/Cart/CartItem';
import CartSummary from '@/components/modules/Public/Cart/CartSummary';
import EmptyCart from '@/components/modules/Public/Cart/EmptyCart';
import { useCart } from '@/context/CartContext';
import { AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CartContent() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    updateSize,
    updateColor,
    subtotal,
    discount,
    discountPercent,
    total,
    couponCode,
    applyCoupon,
  } = useCart();

  const [isLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-32 pb-16">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-background min-h-screen pt-32 pb-16">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-2">
            <h1 className="flex items-center gap-4 text-5xl font-black tracking-tighter uppercase italic">
              Shopping Bag
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/10 text-sm font-black tracking-normal text-blue-600 backdrop-blur-sm">
                {cart.length}
              </span>
            </h1>
            <p className="text-muted-foreground/60 text-lg font-medium">
              Review your selection and proceed to secure checkout.
            </p>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-3 rounded-full border border-blue-600/20 bg-blue-600/5 px-8 py-3 text-sm font-black tracking-widest text-blue-600 uppercase transition-all hover:bg-blue-600 hover:text-white"
          >
            Continue Shopping{' '}
            <ShoppingBag
              size={18}
              className="transition-transform group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Cart Items List */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <CartItem
                  key={`${item._id}_${item.selectedColor || ''}_${item.selectedSize || ''}`}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                  onUpdateSize={updateSize}
                  onUpdateColor={updateColor}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <CartSummary
            subtotal={subtotal}
            discount={discount}
            discountPercent={discountPercent}
            total={total}
            couponCode={couponCode}
            onApplyCoupon={applyCoupon}
          />
        </div>
      </div>
    </div>
  );
}
