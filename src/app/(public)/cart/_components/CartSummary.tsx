'use client';

import { Button } from '@/components/ui/button';
import { validateCoupon } from '@/services/coupon/coupon';
import { ArrowRight, Tag, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

interface CartSummaryProps {
  subtotal: number;
  discount: number;
  discountPercent: number;
  total: number;
  couponCode: string | null;
  onApplyCoupon: (coupon: any) => void;
}

const CartSummary = ({
  subtotal,
  discount,
  discountPercent,
  total,
  couponCode,
  onApplyCoupon,
}: CartSummaryProps) => {
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;

    try {
      const res = await validateCoupon(couponInput);
      if (res.success && res.data) {
        onApplyCoupon(res.data);
        toast.success(`${res.data.discount}% Discount Applied!`);
        setCouponInput('');
      } else {
        toast.error(res.message || 'Invalid Coupon Code');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to apply coupon');
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:sticky lg:top-32">
      <div className="border-border bg-card/40 relative overflow-hidden rounded-[40px] border p-8 backdrop-blur-2xl transition-all hover:border-blue-500/20">
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl" />

        <h2 className="text-foreground mb-8 text-3xl font-black tracking-tighter">
          Summary
        </h2>

        <div className="mb-8 space-y-4">
          <div className="text-muted-foreground flex items-center justify-between text-sm">
            <span>Subtotal</span>
            <span className="text-foreground font-bold">
              ৳{subtotal.toLocaleString()}
            </span>
          </div>

          {couponCode && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-blue-500">
                <Tag size={14} />
                <span className="font-bold">Discount ({discountPercent}%)</span>
              </div>
              <span className="font-black text-blue-600">
                -৳{discount.toLocaleString()}
              </span>
            </div>
          )}

          <div className="via-border h-px w-full bg-linear-to-r from-transparent to-transparent" />

          <div className="text-foreground flex items-baseline justify-between">
            <span className="text-lg font-black tracking-tighter uppercase">
              Order Total
            </span>
            <span className="text-4xl font-black tracking-tighter text-blue-600">
              ৳{total.toLocaleString()}
            </span>
          </div>
          <p className="text-muted-foreground/60 text-center text-[10px] font-medium italic">
            * Shipping and taxes calculated at checkout
          </p>
        </div>

        {/* Coupon Section */}
        <div className="mb-10">
          <p className="text-muted-foreground/60 mb-3 text-[10px] font-black tracking-widest uppercase">
            Have a promo code?
          </p>
          {couponCode ? (
            <div className="group flex items-center justify-between rounded-2xl border border-blue-500/20 bg-blue-500/5 px-4 py-4 text-sm font-bold text-blue-600 transition-all hover:bg-blue-500/10">
              <span className="flex items-center gap-2">
                <Tag size={16} className="animate-bounce" /> {couponCode}
              </span>
              <button
                onClick={() => onApplyCoupon(null)}
                className="text-blue-500/40 transition-colors hover:text-red-500"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className="relative flex gap-2">
              <input
                type="text"
                placeholder="Enter Code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="border-border bg-muted/50 text-foreground focus:bg-background w-full rounded-2xl border px-5 py-4 text-sm font-bold transition-all focus:border-blue-500/50 focus:outline-none"
              />
              <button
                onClick={handleApplyCoupon}
                className="absolute top-2 right-2 bottom-2 rounded-xl bg-blue-600 px-6 text-xs font-black text-white transition-all hover:bg-blue-700 active:scale-95"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        <Button
          asChild
          className="h-16 w-full rounded-full bg-linear-to-r from-blue-600 to-indigo-700 text-lg font-black tracking-tighter shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.02] hover:shadow-blue-500/40 active:scale-95"
        >
          <Link href="/checkout">
            Checkout Now <ArrowRight className="ml-2 h-6 w-6" />
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-center gap-6 px-4 opacity-40 grayscale transition-all hover:opacity-100 hover:grayscale-0">
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-600">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span className="text-[10px] font-black uppercase">Secure</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <span className="text-[10px] font-black uppercase">Verified</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
