'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { registerWithOTP } from '@/services/auth/register';
import { createOrder } from '@/services/order/order';
import { getMe } from '@/services/user/users';
import { IUser, Role } from '@/types';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Tag,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import CheckoutCartItems from './CheckoutCartItems';
import CheckoutPaymentSection from './CheckoutPaymentSection';
import CheckoutShippingSection from './CheckoutShippingSection';

export default function CheckoutContent() {
  const {
    cart,
    total,
    subtotal,
    discount,
    couponCode,
    applyCoupon,
    clearCart,
  } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestMethod, setGuestMethod] = useState<'email' | 'phone'>('phone');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'CARD'>('COD');
  const [submitting, setSubmitting] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    emailOrPhone: '',
    address: '',
    phone: '',
  });
  const [shippingLocation, setShippingLocation] = useState<
    'inside' | 'outside'
  >('inside');

  const shippingCharge = shippingLocation === 'inside' ? 70 : 150;
  const finalTotal = total + shippingCharge;

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getMe();
        if (data) {
          setUser(data);
          if (data.addresses && data.addresses.length > 0) {
            setAddressInput(data.addresses[0].address);
          }
          setPhoneInput(data.phone || '');
        }
      } catch (error) {
        // Guest user - stay on page
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const pendingOrderStr = localStorage.getItem('checkout_guest_info');
    if (pendingOrderStr && user && !loading) {
      try {
        const pendingData = JSON.parse(pendingOrderStr);
        if (pendingData.isPlacingPendingOrder) {
          // Restore form inputs
          if (pendingData.guestInfo?.address) {
            setAddressInput(pendingData.guestInfo.address);
          }
          const restoredPhone =
            pendingData.guestInfo?.phone || pendingData.guestInfo?.emailOrPhone;
          if (restoredPhone) {
            setPhoneInput(restoredPhone);
          }
          if (pendingData.paymentMethod) {
            setPaymentMethod(pendingData.paymentMethod);
          }
          if (pendingData.shippingLocation) {
            setShippingLocation(pendingData.shippingLocation);
          }

          // Clear localStorage so we don't restore it repeatedly
          localStorage.removeItem('checkout_guest_info');
          toast.success(
            'Account verified! You can now review and complete your order.',
          );
        }
      } catch (err) {
        console.error('Error parsing pending order data', err);
      }
    }
  }, [user, loading]);

  const handlePlaceOrder = async () => {
    if (user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN) {
      toast.error('Admin accounts cannot place orders.');
      return;
    }

    if (!user) {
      // Guest checkout flow
      const guestContactPhone =
        guestMethod === 'phone' ? guestInfo.emailOrPhone : guestInfo.phone;

      if (
        !guestInfo.firstName ||
        !guestInfo.lastName ||
        !guestInfo.emailOrPhone ||
        !guestInfo.address ||
        !guestContactPhone
      ) {
        toast.error(
          guestMethod === 'phone'
            ? 'Please fill in all required fields including your phone number'
            : 'Please fill in all fields. A phone number is required for courier contact.',
        );
        return;
      }
      setSubmitting(true);
      try {
        const payload = {
          firstName: guestInfo.firstName,
          lastName: guestInfo.lastName,
          email: guestMethod === 'email' ? guestInfo.emailOrPhone : undefined,
          phone:
            guestMethod === 'phone' ? guestInfo.emailOrPhone : guestInfo.phone,
          addresses: [{ title: 'Home', address: guestInfo.address }],
        };

        const res = await registerWithOTP(payload);
        if (res.success) {
          localStorage.setItem(
            'checkout_guest_info',
            JSON.stringify({
              guestInfo,
              guestMethod,
              paymentMethod,
              shippingLocation,
              isPlacingPendingOrder: true,
            }),
          );
          toast.success(`Verification code sent to your ${guestMethod}`);
          router.push(
            `/verify?identifier=${encodeURIComponent(guestInfo.emailOrPhone)}&redirect=checkout`,
          );
        } else {
          const isAlreadyRegistered =
            res.message?.toLowerCase().includes('exist') ||
            res.message?.toLowerCase().includes('register') ||
            res.message?.toLowerCase().includes('already');

          if (isAlreadyRegistered) {
            toast.error(
              'This account is already registered. Please login to place your order.',
              {
                duration: 5000,
              },
            );
            setTimeout(() => {
              router.push('/login?redirect=checkout');
            }, 2000);
          } else {
            toast.error(res.message || 'Failed to initiate guest registration');
          }
        }
      } catch (error) {
        toast.error('Registration failed');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!addressInput || !phoneInput) {
      toast.error(
        'Please provide a shipping address and phone number for delivery contact',
      );
      return;
    }

    setSubmitting(true);
    await executeOrderPlacement(addressInput, phoneInput);
  };

  const executeOrderPlacement = async (
    shippingAddress: string,
    contactPhone?: string,
    overrideShippingLocation?: 'inside' | 'outside',
    overridePaymentMethod?: 'COD' | 'CARD',
  ) => {
    try {
      const activeLocation = overrideShippingLocation || shippingLocation;
      const activePaymentMethod = overridePaymentMethod || paymentMethod;
      const activeShippingCharge = activeLocation === 'inside' ? 70 : 150;
      const activeTotalPrice = total + activeShippingCharge;

      const orderPayload = {
        items: cart.map((item) => ({
          product: item._id as string,
          quantity: item.quantity,
          price:
            item.salePrice && item.salePrice > 0 ? item.salePrice : item.price,
          color: item.selectedColor,
          size: item.selectedSize,
        })),
        totalPrice: activeTotalPrice,
        subTotal: subtotal,
        discount: discount,
        shippingCharge: activeShippingCharge,
        couponCode: couponCode,
        shippingAddress,
        contactPhone: contactPhone || phoneInput,
        paymentMethod: activePaymentMethod,
      };

      const res = await createOrder(orderPayload);
      if (res.success) {
        setIsSuccess(true);
        clearCart();
        toast.success('Order placed successfully!', {
          description: 'Redirecting to your orders...',
          duration: 5000,
        });

        // Short delay to let the user see the success state
        setTimeout(() => {
          router.push('/user/orders');
        }, 3000);
      } else {
        toast.error(res.message || 'Failed to place order');
        setSubmitting(false);
      }
    } catch (error) {
      toast.error('Something went wrong during order placement');
      setSubmitting(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (cart.length === 0 && !isSuccess) {
    router.push('/cart');
    return null;
  }

  // Block admin and super admin from placing orders
  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN;
  if (isAdmin) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-4 w-full max-w-lg text-center"
        >
          {/* Icon */}
          <div className="relative mx-auto mb-8 h-24 w-24">
            <div className="absolute inset-0 animate-ping rounded-full bg-amber-500/10" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-amber-500/30 bg-amber-500/10">
              <ShieldAlert className="h-10 w-10 text-amber-500" />
            </div>
          </div>

          {/* Message */}
          <h1 className="mb-3 text-3xl font-black tracking-tighter">
            Admin Account <span className="text-amber-500">Detected</span>
          </h1>
          <p className="text-muted-foreground mb-2 leading-relaxed">
            You are logged in as{' '}
            <span className="text-foreground font-bold">{user?.role}</span>.
          </p>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Admin and Super Admin accounts are{' '}
            <span className="font-bold text-amber-500">not permitted</span> to
            place orders on the platform. Please use a regular customer account
            to shop.
          </p>

          {/* Actions */}
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="rounded-full bg-amber-500 px-8 font-bold text-white hover:bg-amber-600"
            >
              <Link href="/admin">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-8">
              <Link href="/">Back to Homepage</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-card/40 mx-4 w-full max-w-xl overflow-hidden rounded-[48px] border border-emerald-500/10 p-12 text-center shadow-2xl shadow-emerald-500/10 backdrop-blur-3xl"
        >
          <div className="relative mx-auto mb-10 h-32 w-32">
            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/40">
              <CheckCircle2 className="h-16 w-16" />
            </div>
          </div>
          <h1 className="mb-4 text-5xl font-black tracking-tighter uppercase italic">
            Order <span className="text-emerald-500">Confirmed</span>
          </h1>
          <p className="text-muted-foreground/60 mb-10 text-lg leading-relaxed font-medium">
            Thank you for shopping with Aranis. Your order has been placed
            successfully and is now being processed. We'll notify you when it's
            shipped!
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              className="h-14 rounded-full bg-emerald-500 px-10 text-base font-black tracking-widest text-white uppercase shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 hover:bg-emerald-600 active:scale-95"
            >
              <Link href="/user/orders">View Your Orders</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-border bg-card/50 hover:bg-muted h-14 rounded-full px-10 text-base font-black tracking-widest uppercase transition-all active:scale-95"
            >
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-16 flex flex-col items-start gap-4 md:flex-row md:items-center">
          <Link
            href="/cart"
            className="bg-card/50 border-border hover:bg-muted flex h-12 w-12 items-center justify-center rounded-full border transition-all active:scale-90"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-foreground text-5xl font-black tracking-tighter uppercase italic">
              Secure <span className="text-blue-600">Checkout</span>
            </h1>
            <p className="text-muted-foreground/60 text-sm font-medium">
              Complete your order with Aranis elite protection
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Left Column: Details */}
          <div className="space-y-8 lg:col-span-7">
            {/* Shipping Information */}
            <CheckoutShippingSection
              user={user}
              shippingLocation={shippingLocation}
              setShippingLocation={setShippingLocation}
              addressInput={addressInput}
              setAddressInput={setAddressInput}
              phoneInput={phoneInput}
              setPhoneInput={setPhoneInput}
              guestInfo={guestInfo}
              setGuestInfo={setGuestInfo}
              guestMethod={guestMethod}
              setGuestMethod={setGuestMethod}
            />

            {/* Payment Section */}
            <CheckoutPaymentSection
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />

            <div className="flex items-center gap-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
              <ShieldCheck className="text-blue-500" size={24} />
              <div>
                <h4 className="text-sm font-bold">Protected Transaction</h4>
                <p className="text-muted-foreground text-xs">
                  Your order is secured by Aranis's elite encryption protocols
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="space-y-6 lg:sticky lg:top-32 lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border-border bg-card/40 relative overflow-hidden rounded-[40px] border p-8 backdrop-blur-2xl transition-all hover:border-blue-500/20"
            >
              <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl" />

              <h3 className="mb-8 text-2xl font-black tracking-tighter uppercase italic">
                Order Summary
              </h3>

              <CheckoutCartItems cart={cart} />

              {/* Coupon Section */}
              <div className="mb-10 space-y-4">
                <p className="text-muted-foreground/60 text-[10px] font-black tracking-widest uppercase">
                  Promotion Code
                </p>
                {couponCode ? (
                  <div className="flex items-center justify-between rounded-2xl border border-blue-500/20 bg-blue-500/5 px-4 py-4 text-sm font-bold text-blue-600 transition-all hover:bg-blue-500/10">
                    <span className="flex items-center gap-2">
                      <Tag size={16} className="animate-bounce" /> {couponCode}
                    </span>
                    <button
                      onClick={() => applyCoupon(null)}
                      className="text-blue-500/40 transition-colors hover:text-red-500"
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
                      onChange={(e) =>
                        setCouponInput(e.target.value.toUpperCase())
                      }
                      className="border-border bg-muted/50 text-foreground focus:bg-background w-full rounded-2xl border px-5 py-4 text-xs font-black tracking-widest transition-all focus:border-blue-500/50 focus:outline-none"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon}
                      className="absolute top-2 right-2 bottom-2 rounded-xl bg-blue-600 px-6 text-[10px] font-black text-white transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
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
                  <span className="font-black text-blue-600">
                    +৳{shippingCharge}
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
                  <span className="text-4xl font-black tracking-tighter text-blue-600">
                    ৳{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="mt-10 h-16 w-full rounded-full bg-linear-to-r from-blue-600 to-indigo-700 text-lg font-black tracking-widest uppercase shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.02] hover:shadow-blue-500/40 active:scale-95 disabled:opacity-50"
              >
                {submitting ? 'Processing...' : 'Complete Order'}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
