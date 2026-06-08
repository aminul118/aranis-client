import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ShieldAlert, Tag, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import CheckoutCartItems from './CheckoutCartItems';

interface CheckoutOrderSummaryProps {
  cart: any[];
  subtotal: number;
  discount: number;
  shippingCharge: number;
  finalTotal: number;
  couponCode: string | null;
  applyCoupon: (coupon: any) => void;
  handlePlaceOrder: () => void;
  submitting: boolean;
}

export default function CheckoutOrderSummary({
  cart,
  subtotal,
  discount,
  shippingCharge,
  finalTotal,
  couponCode,
  applyCoupon,
  handlePlaceOrder,
  submitting,
}: CheckoutOrderSummaryProps) {
  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    try {
      const { validateCoupon } = await import('@/services/coupon/coupon');
      const res = await validateCoupon(couponInput);
      if (res.success && res.data) {
        applyCoupon(res.data);
        toast.success(`${res.data.discount}% Discount Applied!`);
        setCouponInput('');
      } else {
        toast.error(res.message || 'Invalid Coupon Code');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to apply coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="border-border bg-card/40 hover:border-primary/20 relative overflow-hidden rounded-[40px] border p-8 backdrop-blur-2xl transition-all"
    >
      <div className="bg-primary/5 absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl" />

      <h3 className="mb-8 text-2xl font-black tracking-tighter uppercase italic">
        Order Summary
      </h3>

      {cart.some((item) => item.isStockOut) && (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
          <div className="flex items-start gap-3 text-red-500">
            <ShieldAlert size={20} className="mt-0.5 shrink-0" />
            <p className="text-sm leading-relaxed font-bold">
              One or more items in your cart are currently out of stock. Please
              review your cart and remove them before proceeding.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="mt-4 w-full border-red-500/20 text-red-500 hover:bg-red-500/10"
          >
            <Link href="/cart">Review Cart</Link>
          </Button>
        </div>
      )}

      <CheckoutCartItems cart={cart} />

      {/* Coupon Section */}
      <div className="mb-10 space-y-4">
        <p className="text-muted-foreground/60 text-[10px] font-black tracking-widest uppercase">
          Promotion Code
        </p>
        {couponCode ? (
          <div className="border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 flex items-center justify-between rounded-2xl border px-4 py-4 text-sm font-bold transition-all">
            <span className="flex items-center gap-2">
              <Tag size={16} className="animate-bounce" /> {couponCode}
            </span>
            <button
              onClick={() => applyCoupon(null)}
              className="text-primary/40 hover:text-destructive transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="relative flex gap-2">
            <input
              type="text"
              placeholder="ENTER CODE"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              className="border-border bg-muted/50 text-foreground focus:bg-background focus:border-primary/50 w-full rounded-2xl border px-5 py-4 text-xs font-black tracking-widest transition-all focus:outline-none"
            />
            <button
              onClick={handleApplyCoupon}
              disabled={isApplyingCoupon}
              className="bg-primary text-primary-foreground hover:bg-primary/90 absolute top-2 right-2 bottom-2 rounded-xl px-6 text-[10px] font-black transition-all active:scale-95 disabled:opacity-50"
            >
              {isApplyingCoupon ? '...' : 'APPLY'}
            </button>
          </div>
        )}
      </div>

      <div className="border-border/30 space-y-4 border-t pt-8">
        <div className="text-muted-foreground flex justify-between text-sm font-medium">
          <span>Subtotal</span>
          <span className="text-foreground font-black">
            ৳{subtotal.toLocaleString()}
          </span>
        </div>
        <div className="text-muted-foreground flex justify-between text-sm font-medium">
          <span>Delivery Charge</span>
          <span
            className={`font-black ${shippingCharge === 0 ? 'text-emerald-500' : 'text-primary'}`}
          >
            {shippingCharge === 0 ? 'Free' : `+৳${shippingCharge}`}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm font-black text-emerald-500">
            <span>Voucher Discount</span>
            <span>-৳{discount.toLocaleString()}</span>
          </div>
        )}

        <div className="via-border/40 h-px w-full bg-linear-to-r from-transparent to-transparent pt-2" />

        <div className="flex items-baseline justify-between pt-2">
          <span className="text-lg font-black tracking-tighter uppercase italic">
            Total Due
          </span>
          <span className="text-primary text-4xl font-black tracking-tighter">
            ৳{finalTotal.toLocaleString()}
          </span>
        </div>
      </div>

      <Button
        onClick={handlePlaceOrder}
        disabled={
          submitting ||
          cart.some(
            (item) =>
              item.isStockOut ||
              (item.stock !== undefined && item.quantity > item.stock),
          )
        }
        className="shadow-primary/25 hover:shadow-primary/40 mt-10 h-16 w-full rounded-full text-lg font-black tracking-widest uppercase shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
      >
        {submitting ? 'Processing...' : 'Complete Order'}
      </Button>
    </motion.div>
  );
}
