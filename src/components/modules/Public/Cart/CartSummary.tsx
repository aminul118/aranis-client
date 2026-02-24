'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Tag, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

interface CartSummaryProps {
  subtotal: number;
  discount: number;
  total: number;
  couponCode: string | null;
  onApplyCoupon: (code: string) => void;
}

const CartSummary = ({
  subtotal,
  discount,
  total,
  couponCode,
  onApplyCoupon,
}: CartSummaryProps) => {
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = () => {
    if (couponInput.toUpperCase() === 'LUMIERE10') {
      onApplyCoupon(couponInput);
      toast.success('10% Discount Applied!');
      setCouponInput('');
    } else {
      toast.error('Invalid Coupon Code');
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:sticky lg:top-32">
      <div className="border-border bg-card/50 rounded-3xl border p-8">
        <h2 className="text-foreground mb-6 text-2xl font-bold">Summary</h2>

        <div className="mb-8 flex flex-col gap-4">
          <div className="text-muted-foreground flex justify-between">
            <span>Subtotal</span>
            <span className="text-foreground font-medium">
              ৳{subtotal.toFixed(2)}
            </span>
          </div>
          <div className="text-muted-foreground flex justify-between">
            <span>Shipping</span>
            <span className="font-medium text-emerald-500">Free</span>
          </div>

          {couponCode && (
            <div className="text-muted-foreground flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-blue-500" />
                <span>Discount (10%)</span>
              </div>
              <span className="font-medium text-blue-500">
                -৳{discount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="bg-border my-2 h-px" />

          <div className="text-foreground flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>৳{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Coupon Section */}
        <div className="mb-8">
          <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
            Promotion Code
          </p>
          {couponCode ? (
            <div className="flex items-center justify-between rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-sm font-bold text-blue-500">
              <span className="flex items-center gap-2">
                <Tag size={14} /> {couponCode}
              </span>
              <button
                onClick={() => onApplyCoupon('')}
                className="text-blue-500/50 hover:text-blue-500"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="LUMIERE10"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="border-border bg-muted text-foreground flex-1 rounded-xl border px-4 py-3 text-sm transition-colors focus:border-blue-500/50 focus:outline-none"
              />
              <Button
                onClick={handleApplyCoupon}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl px-6 font-bold"
              >
                Apply
              </Button>
            </div>
          )}
        </div>

        <Button
          asChild
          className="shadow-primary/20 w-full rounded-full py-7 text-lg font-bold shadow-xl transition-all"
        >
          <Link href="/checkout">
            Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>

      <div className="px-4 text-center">
        <p className="text-muted-foreground flex items-center justify-center gap-2 text-xs">
          Secure Payment Guaranteed
        </p>
      </div>
    </div>
  );
};

export default CartSummary;
