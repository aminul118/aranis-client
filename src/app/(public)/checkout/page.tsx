'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import { verifyOTP } from '@/services/auth/otp/verifyOTP';
import { registerWithOTP } from '@/services/auth/register';
import { createOrder } from '@/services/order/order';
import { getMe } from '@/services/user/users';
import { IUser, Role } from '@/types';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Home,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Truck,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const CheckoutPage = () => {
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
  const [isEditingAddress, setIsEditingAddress] = useState(false);
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
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [shippingLocation, setShippingLocation] = useState<
    'inside' | 'outside'
  >('inside');

  const shippingCharge = shippingLocation === 'inside' ? 70 : 150;
  const finalTotal = total + shippingCharge;

  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

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

  const handleUpdateAddress = async () => {
    if (!user?._id) return;
    try {
      // We'll update this to handle the new addresses array later
      // For now, just a placeholder that matches the UI logic
      toast.info('Address management moved to profile/checkout selection');
      setIsEditingAddress(false);
    } catch (error) {
      toast.error('Failed to update information');
    }
  };

  const handlePlaceOrder = async () => {
    if (user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN) {
      toast.error('Admin accounts cannot place orders.');
      return;
    }

    if (!user) {
      // Guest checkout flow
      // For phone method: emailOrPhone IS the phone. For email method: need separate phone field.
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
          setShowOTPModal(true);
          setResendTimer(60);
          toast.success(`Verification code sent to your ${guestMethod}`);
        } else {
          toast.error(res.message || 'Failed to initiate guest registration');
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
  ) => {
    try {
      const orderPayload = {
        items: cart.map((item) => ({
          product: item._id as string,
          quantity: item.quantity,
          price:
            item.salePrice && item.salePrice > 0 ? item.salePrice : item.price,
          color: item.selectedColor,
          size: item.selectedSize,
        })),
        totalPrice: finalTotal,
        subTotal: subtotal,
        discount: discount,
        shippingCharge,
        couponCode: couponCode,
        shippingAddress,
        contactPhone: contactPhone || phoneInput,
        paymentMethod,
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

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter 6-digit OTP');
      return;
    }
    setSubmitting(true);
    try {
      const res = await verifyOTP({ identifier: guestInfo.emailOrPhone, otp });
      if (res.success && res.user) {
        setUser(res.user);
        setShowOTPModal(false);
        toast.success('Account verified! Finalizing order...');
        // For phone-verified guests, phone = emailOrPhone; for email guests, phone = guestInfo.phone
        const contactPhone =
          guestMethod === 'phone' ? guestInfo.emailOrPhone : guestInfo.phone;
        await executeOrderPlacement(guestInfo.address, contactPhone);
      } else {
        toast.error(res.message || 'Invalid OTP');
        setSubmitting(false);
      }
    } catch (error) {
      toast.error('Verification failed');
      setSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    setSubmitting(true);
    try {
      const payload = {
        firstName: guestInfo.firstName,
        lastName: guestInfo.lastName,
        email: guestMethod === 'email' ? guestInfo.emailOrPhone : undefined,
        phone: guestMethod === 'phone' ? guestInfo.emailOrPhone : undefined,
      };
      const res = await registerWithOTP(payload);
      if (res.success) {
        setResendTimer(60);
        setOtp('');
        toast.success('New code sent!');
      } else {
        toast.error(res.message || 'Failed to resend code');
      }
    } catch (error) {
      toast.error('Resend failed');
    } finally {
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
            {/* Shipping Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card/50 border-border rounded-3xl border p-8"
            >
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                  <Truck size={20} />
                </div>
                <h2 className="text-xl font-bold">Shipping Information</h2>
              </div>

              {/* Delivery Location Selection */}
              <div className="mb-8 space-y-4">
                <label className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                  Select Delivery Location
                </label>
                <RadioGroup
                  defaultValue="inside"
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                  onValueChange={(val) =>
                    setShippingLocation(val as 'inside' | 'outside')
                  }
                >
                  <div>
                    <RadioGroupItem
                      value="inside"
                      id="inside-dhaka"
                      className="peer sr-only"
                    />
                    <label
                      htmlFor="inside-dhaka"
                      className={`flex cursor-pointer flex-col items-center justify-between rounded-2xl border-2 p-4 transition-all ${shippingLocation === 'inside' ? 'border-blue-600 bg-blue-500/5 text-blue-600' : 'border-border bg-card hover:bg-muted/50 text-muted-foreground'}`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="text-sm font-bold">Inside Dhaka</span>
                        <span className="text-sm font-black">৳70</span>
                      </div>
                    </label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="outside"
                      id="outside-dhaka"
                      className="peer sr-only"
                    />
                    <label
                      htmlFor="outside-dhaka"
                      className={`flex cursor-pointer flex-col items-center justify-between rounded-2xl border-2 p-4 transition-all ${shippingLocation === 'outside' ? 'border-blue-600 bg-blue-500/5 text-blue-600' : 'border-border bg-card hover:bg-muted/50 text-muted-foreground'}`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="text-sm font-bold">Outside Dhaka</span>
                        <span className="text-sm font-black">৳150</span>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </div>

              {user ? (
                <div className="space-y-6">
                  <p className="text-muted-foreground mb-4 text-sm">
                    Choose from your saved addresses (Up to 4)
                  </p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {user.addresses && user.addresses.length > 0 ? (
                      user.addresses.map((addr, idx) => (
                        <button
                          key={idx}
                          onClick={() => setAddressInput(addr.address)}
                          className={`flex flex-col items-start gap-2 rounded-2xl border-2 p-4 transition-all ${addressInput === addr.address ? 'border-blue-600 bg-blue-500/5' : 'border-border bg-muted/20 hover:border-blue-500/30'}`}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin
                              size={16}
                              className={
                                addressInput === addr.address
                                  ? 'text-blue-600'
                                  : 'text-muted-foreground'
                              }
                            />
                            <span className="text-sm font-bold tracking-tight">
                              {addr.title}
                            </span>
                          </div>
                          <p className="text-muted-foreground line-clamp-2 text-left text-xs">
                            {addr.address}
                          </p>
                        </button>
                      ))
                    ) : (
                      <div className="col-span-full rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-600 italic">
                        No addresses found. Please add one in your profile.
                      </div>
                    )}
                  </div>
                  <div className="mt-6 space-y-2">
                    <label className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                      Confirm Phone Number
                    </label>
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="+880 1XXX XXXXXX"
                      className="bg-muted/50 border-border w-full rounded-xl border p-4 transition-all outline-none focus:border-blue-500/50"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="border-border border-b pb-4">
                    <h3 className="text-lg font-bold">Checkout as Guest</h3>
                    <p className="text-muted-foreground text-xs">
                      Enter your details below to create an account and complete
                      your order.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                        First Name
                      </label>
                      <input
                        type="text"
                        placeholder="John"
                        className="bg-muted/50 border-border w-full rounded-xl border p-4 transition-all outline-none focus:border-blue-500/50"
                        onChange={(e) =>
                          setGuestInfo({
                            ...guestInfo,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                        Last Name
                      </label>
                      <input
                        type="text"
                        placeholder="Doe"
                        className="bg-muted/50 border-border w-full rounded-xl border p-4 transition-all outline-none focus:border-blue-500/50"
                        onChange={(e) =>
                          setGuestInfo({
                            ...guestInfo,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-1">
                      <div className="space-y-2">
                        <label className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                          Contact Phone Number (for Verification & Delivery){' '}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="01XXXXXXXXX"
                          className="bg-muted/50 border-border w-full rounded-xl border p-4 transition-all outline-none focus:border-blue-500/50"
                          onChange={(e) =>
                            setGuestInfo({
                              ...guestInfo,
                              emailOrPhone: e.target.value,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                      Delivery Address
                    </label>
                    <textarea
                      placeholder="House #, Street, City"
                      className="bg-muted/50 border-border min-h-[80px] w-full rounded-xl border p-4 transition-all outline-none focus:border-blue-500/50"
                      onChange={(e) =>
                        setGuestInfo({ ...guestInfo, address: e.target.value })
                      }
                    />
                  </div>
                  <p className="text-muted-foreground text-[10px] italic">
                    * An OTP will be sent to verify your contact info and create
                    your account.
                  </p>
                </div>
              )}
            </motion.section>

            {/* Payment Method Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card/50 border-border rounded-3xl border p-8"
            >
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-xl font-bold">Select Payment Flow</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <button
                  onClick={() => setPaymentMethod('COD')}
                  className={`flex flex-col items-start gap-4 rounded-2xl border-2 p-6 transition-all ${paymentMethod === 'COD' ? 'border-blue-600 bg-blue-500/5' : 'border-border bg-muted/20 hover:border-blue-500/30'}`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${paymentMethod === 'COD' ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'}`}
                  >
                    <Home size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-foreground font-black">
                      Cash on Delivery
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Pay at your doorstep
                    </p>
                  </div>
                  {paymentMethod === 'COD' && (
                    <CheckCircle2
                      className="absolute top-4 right-4 text-blue-600"
                      size={20}
                    />
                  )}
                </button>

                <button
                  onClick={() => setPaymentMethod('CARD')}
                  className={`flex cursor-not-allowed flex-col items-start gap-4 rounded-2xl border-2 p-6 opacity-50 transition-all ${paymentMethod === 'CARD' ? 'border-blue-600 bg-blue-500/5' : 'border-border bg-muted/20'}`}
                  disabled
                >
                  <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-full">
                    <CreditCard size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-foreground font-black">Card Payment</p>
                    <p className="text-muted-foreground text-xs italic underline">
                      Coming Soon
                    </p>
                  </div>
                </button>
              </div>
            </motion.section>

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

              <div className="mb-8 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="group border-border/30 flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-muted relative h-14 w-14 overflow-hidden rounded-xl">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="max-w-[150px] truncate text-sm font-black tracking-tight">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="bg-muted/50 text-muted-foreground/60 rounded-md px-2 py-0.5 text-[10px] font-black uppercase">
                            Qty: {item.quantity}
                          </span>
                          {item.selectedSize && (
                            <span className="text-muted-foreground/40 text-[10px] font-bold">
                              Size: {item.selectedSize}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-black">
                      ৳
                      {(
                        (item.salePrice && item.salePrice > 0
                          ? item.salePrice
                          : item.price) * item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

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

      {/* OTP Verification Modal */}
      <Dialog open={showOTPModal} onOpenChange={setShowOTPModal}>
        <DialogContent className="border-border bg-card/40 max-w-[400px] overflow-hidden rounded-[40px] p-10 backdrop-blur-3xl">
          <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />

          <DialogHeader className="relative z-10">
            <DialogTitle className="text-center text-3xl font-black tracking-tighter uppercase italic">
              Verify <span className="text-blue-600">Identity</span>
            </DialogTitle>
            <p className="text-muted-foreground/60 mt-4 text-center text-sm leading-relaxed font-medium">
              We've sent a 6-digit code to <br />
              <span className="text-foreground font-black tracking-tight">
                {guestInfo.emailOrPhone}
              </span>
            </p>
          </DialogHeader>

          <div className="relative z-10 flex flex-col items-center gap-10 py-8">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(val) => setOtp(val)}
              className="gap-3"
            >
              <InputOTPGroup className="gap-2">
                <InputOTPSlot
                  index={0}
                  className="border-border bg-background/50 focus:bg-background h-14 w-12 rounded-xl border-2 text-xl font-black transition-all focus:border-blue-600"
                />
                <InputOTPSlot
                  index={1}
                  className="border-border bg-background/50 focus:bg-background h-14 w-12 rounded-xl border-2 text-xl font-black transition-all focus:border-blue-600"
                />
                <InputOTPSlot
                  index={2}
                  className="border-border bg-background/50 focus:bg-background h-14 w-12 rounded-xl border-2 text-xl font-black transition-all focus:border-blue-600"
                />
              </InputOTPGroup>
              <InputOTPSeparator className="text-muted-foreground/20" />
              <InputOTPGroup className="gap-2">
                <InputOTPSlot
                  index={3}
                  className="border-border bg-background/50 focus:bg-background h-14 w-12 rounded-xl border-2 text-xl font-black transition-all focus:border-blue-600"
                />
                <InputOTPSlot
                  index={4}
                  className="border-border bg-background/50 focus:bg-background h-14 w-12 rounded-xl border-2 text-xl font-black transition-all focus:border-blue-600"
                />
                <InputOTPSlot
                  index={5}
                  className="border-border bg-background/50 focus:bg-background h-14 w-12 rounded-xl border-2 text-xl font-black transition-all focus:border-blue-600"
                />
              </InputOTPGroup>
            </InputOTP>

            <div className="w-full space-y-6">
              <Button
                onClick={handleVerifyOTP}
                disabled={submitting || otp.length !== 6}
                className="h-16 w-full rounded-full bg-linear-to-r from-blue-600 to-indigo-700 text-base font-black tracking-widest text-white uppercase shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.02] hover:shadow-blue-500/40 active:scale-95 disabled:opacity-50"
              >
                {submitting ? 'Verifying...' : 'Verify & Place Order'}
              </Button>

              <div className="flex flex-col items-center gap-3">
                <p className="text-muted-foreground/40 text-[10px] font-black tracking-widest uppercase">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResendOTP}
                  disabled={submitting || resendTimer > 0}
                  className={cn(
                    'text-sm font-black tracking-tighter uppercase italic transition-all',
                    resendTimer > 0
                      ? 'text-muted-foreground/40 cursor-not-allowed'
                      : 'text-blue-600 hover:scale-105 hover:text-blue-700 active:scale-95',
                  )}
                >
                  {resendTimer > 0
                    ? `Resend in ${resendTimer}s`
                    : 'Resend Code Now'}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutPage;
