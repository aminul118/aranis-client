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
  Mail,
  MapPin,
  Phone as PhoneIcon,
  ShieldAlert,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const CheckoutPage = () => {
  const { cart, total, subtotal, discount, clearCart } = useCart();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestMethod, setGuestMethod] = useState<'email' | 'phone'>('email');
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
  });
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getMe();
        if (data) {
          setUser(data);
          // For now, default to the first address if available
          if (data.addresses && data.addresses.length > 0) {
            setAddressInput(data.addresses[0].address);
          }
          setPhoneInput(data.phone || '');
        }
      } catch (error) {
        // User is not logged in, which is fine for guest checkout
        console.log('Guest checkout mode');
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
      if (
        !guestInfo.firstName ||
        !guestInfo.lastName ||
        !guestInfo.emailOrPhone ||
        !guestInfo.address
      ) {
        toast.error('Please fill in all details for guest checkout');
        return;
      }
      setSubmitting(true);
      try {
        const payload = {
          firstName: guestInfo.firstName,
          lastName: guestInfo.lastName,
          email: guestMethod === 'email' ? guestInfo.emailOrPhone : undefined,
          phone: guestMethod === 'phone' ? guestInfo.emailOrPhone : undefined,
          addresses: [{ title: 'Home', address: guestInfo.address }],
        };

        const res = await registerWithOTP(payload);
        if (res.success) {
          setShowOTPModal(true);
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
      toast.error('Please provide shipping address and phone number');
      return;
    }

    setSubmitting(true);
    await executeOrderPlacement(addressInput);
  };

  const executeOrderPlacement = async (shippingAddress: string) => {
    try {
      const orderPayload = {
        items: cart.map((item) => ({
          product: item._id as string,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: total,
        shippingAddress,
        paymentMethod,
      };

      const res = await createOrder(orderPayload);
      if (res.success) {
        toast.success('Order placed successfully!');
        setIsSuccess(true);
        clearCart();
        router.push('/user/orders');
      } else {
        toast.error(res.message || 'Failed to place order');
      }
    } catch (error) {
      toast.error('Something went wrong during order placement');
    } finally {
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
        await executeOrderPlacement(guestInfo.address);
      } else {
        toast.error(res.message || 'Invalid OTP');
        setSubmitting(false);
      }
    } catch (error) {
      toast.error('Verification failed');
      setSubmitting(false);
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

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-12 flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link href="/cart">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bag
            </Link>
          </Button>
          <h1 className="text-foreground text-4xl font-black tracking-tighter">
            Finalize <span className="text-blue-600">Order</span>
          </h1>
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
                <div className="space-y-4">
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
                    <label className="text-muted-foreground mb-2 block text-xs font-black tracking-widest uppercase">
                      Verify with
                    </label>
                    <RadioGroup
                      defaultValue="email"
                      className="mb-6 grid grid-cols-2 gap-4"
                      onValueChange={(val) =>
                        setGuestMethod(val as 'email' | 'phone')
                      }
                    >
                      <div>
                        <RadioGroupItem
                          value="email"
                          id="guest-email"
                          className="peer sr-only"
                        />
                        <label
                          htmlFor="guest-email"
                          className={`flex cursor-pointer flex-col items-center justify-between rounded-2xl border-2 p-4 transition-all ${guestMethod === 'email' ? 'border-blue-600 bg-blue-500/5 text-blue-600' : 'border-border bg-card hover:bg-muted/50 text-muted-foreground'}`}
                        >
                          <Mail className="mb-2 h-5 w-5" />
                          <span className="text-xs font-bold">Email</span>
                        </label>
                      </div>
                      <div>
                        <RadioGroupItem
                          value="phone"
                          id="guest-phone"
                          className="peer sr-only"
                        />
                        <label
                          htmlFor="guest-phone"
                          className={`flex cursor-pointer flex-col items-center justify-between rounded-2xl border-2 p-4 transition-all ${guestMethod === 'phone' ? 'border-blue-600 bg-blue-500/5 text-blue-600' : 'border-border bg-card hover:bg-muted/50 text-muted-foreground'}`}
                        >
                          <PhoneIcon className="mb-2 h-5 w-5" />
                          <span className="text-xs font-bold">Phone</span>
                        </label>
                      </div>
                    </RadioGroup>

                    <div className="space-y-2">
                      <label className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                        {guestMethod === 'email'
                          ? 'Email Address'
                          : 'Phone Number'}
                      </label>
                      <input
                        type={guestMethod === 'email' ? 'email' : 'tel'}
                        placeholder={
                          guestMethod === 'email'
                            ? 'you@example.com'
                            : '01XXXXXXXXX'
                        }
                        className="bg-muted/50 border-border w-full rounded-xl border p-4 transition-all outline-none focus:border-blue-500/50"
                        onChange={(e) =>
                          setGuestInfo({
                            ...guestInfo,
                            emailOrPhone: e.target.value,
                          })
                        }
                      />
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
                  Your order is secured by Lumiere's elite encryption protocols
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="space-y-6 lg:sticky lg:top-32 lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card/50 border-border rounded-3xl border p-8 shadow-2xl shadow-blue-500/5"
            >
              <h3 className="mb-8 text-2xl font-bold">Summary</h3>

              <div className="mb-8 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="border-border/30 flex items-center justify-between border-b py-3 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-muted relative h-12 w-12 overflow-hidden rounded-lg">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="max-w-[150px] truncate text-sm leading-tight font-bold">
                          {item.name}
                        </p>
                        <p className="text-muted-foreground text-xs italic">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-bold">
                      ৳{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4">
                <div className="text-muted-foreground flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="text-foreground font-bold">
                    ৳{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="text-muted-foreground flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">
                    Lumiere Prime Free
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm font-bold text-blue-500">
                    <span>Discount</span>
                    <span>-৳{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="bg-border h-px pt-2" />
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xl font-black tracking-tighter italic">
                    Total Due
                  </span>
                  <span className="text-foreground text-3xl font-black tracking-tighter">
                    ৳{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="mt-10 w-full rounded-full bg-blue-600 py-8 text-xl font-black shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95"
              >
                {submitting
                  ? 'Authenticating Order...'
                  : 'Confirm & Place Order'}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <Dialog open={showOTPModal} onOpenChange={setShowOTPModal}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              Verify Your Identity
            </DialogTitle>
            <p className="text-muted-foreground mt-2 text-center text-sm">
              Enter the 6-digit code sent to{' '}
              <span className="text-foreground font-bold">
                {guestInfo.emailOrPhone}
              </span>{' '}
              to finalize your order.
            </p>
          </DialogHeader>
          <div className="flex flex-col items-center gap-8 py-6">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(val) => setOtp(val)}
              className="gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <Button
              onClick={handleVerifyOTP}
              disabled={submitting || otp.length !== 6}
              className="w-full rounded-full bg-blue-600 py-6 font-bold hover:bg-blue-700"
            >
              {submitting ? 'Verifying...' : 'Verify & Place Order'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutPage;
