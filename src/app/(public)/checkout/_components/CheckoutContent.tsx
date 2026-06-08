'use client';

import ErrorAlertModal from '@/components/common/error/ErrorAlertModal';
import { useCart } from '@/context/CartContext';
import { registerWithOTP } from '@/services/auth/register';
import {
  getDeliveryCharge,
  IDeliveryCharge,
} from '@/services/delivery-charge/delivery-charge';
import { createOrder } from '@/services/order/order';
import { getMe } from '@/services/user/users';
import { IUser, Role } from '@/types';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import CheckoutAdminBlocked from './CheckoutAdminBlocked';
import CheckoutOrderSuccess from './CheckoutOrderSuccess';
import CheckoutOrderSummary from './CheckoutOrderSummary';
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
    validateCartStock,
  } = useCart();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestMethod, setGuestMethod] = useState<'email' | 'phone'>('phone');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'CARD'>('COD');
  const [submitting, setSubmitting] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showRateLimitModal, setShowRateLimitModal] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    emailOrPhone: '',
    address: '',
    phone: '',
  });
  const [shippingLocation, setShippingLocation] = useState<
    'inside' | 'outside'
  >('inside');
  const [deliverySettings, setDeliverySettings] = useState<IDeliveryCharge>({
    insideDhaka: 70,
    outsideDhaka: 150,
    freeDeliveryThreshold: 0,
  });

  // Calculate dynamic shipping charge based on settings
  const shippingCharge =
    deliverySettings.freeDeliveryThreshold > 0 &&
    total >= deliverySettings.freeDeliveryThreshold
      ? 0
      : shippingLocation === 'inside'
        ? deliverySettings.insideDhaka
        : deliverySettings.outsideDhaka;

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
    const fetchDeliverySettings = async () => {
      try {
        const res = await getDeliveryCharge();
        if (res.success && res.data) {
          setDeliverySettings(res.data);
        }
      } catch (e) {
        console.error('Failed to load delivery settings', e);
      }
    };
    fetchUser();
    fetchDeliverySettings();
    // Re-validate cart stock on checkout mount
    validateCartStock();
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

          // Place order immediately!
          const targetAddress = pendingData.guestInfo?.address || addressInput;
          const targetPhone = restoredPhone || phoneInput;

          setSubmitting(true);
          executeOrderPlacement(
            targetAddress,
            targetPhone,
            pendingData.shippingLocation,
            pendingData.paymentMethod,
          );
        }
      } catch (err) {
        console.error('Error parsing pending order data', err);
      }
    }
  }, [user, loading]);

  const handlePlaceOrder = async () => {
    const hasStockOut = cart.some((item) => item.isStockOut);
    if (hasStockOut) {
      toast.error(
        'Please remove out of stock items from your cart to proceed.',
      );
      return;
    }

    const hasInsufficientStock = cart.some(
      (item) => item.stock !== undefined && item.quantity > item.stock,
    );
    if (hasInsufficientStock) {
      toast.error(
        'Some items in your cart exceed available stock. Please reduce their quantity.',
      );
      return;
    }

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

      const guestPhoneDigits = guestContactPhone.replace(/\D/g, '');
      const guestLocalPart = guestPhoneDigits.startsWith('88')
        ? guestPhoneDigits.substring(2)
        : guestPhoneDigits;
      if (
        !guestContactPhone.includes('@') &&
        /[0-9]/.test(guestContactPhone) &&
        guestLocalPart.length > 11
      ) {
        setPhoneError('Phone number cannot exceed 11 digits');
        return;
      }
      setPhoneError('');
      setSubmitting(true);
      try {
        const payload = {
          firstName: guestInfo.firstName,
          lastName: guestInfo.lastName,
          email: guestInfo.email || undefined,
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
          if (res.message?.includes('Maximum OTP requests reached')) {
            setShowRateLimitModal(true);
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

    const phoneInputDigits = phoneInput.replace(/\D/g, '');
    const phoneLocalPart = phoneInputDigits.startsWith('88')
      ? phoneInputDigits.substring(2)
      : phoneInputDigits;
    if (
      !phoneInput.includes('@') &&
      /[0-9]/.test(phoneInput) &&
      phoneLocalPart.length > 11
    ) {
      setPhoneError('Phone number cannot exceed 11 digits');
      return;
    }
    setPhoneError('');

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

      const activeShippingCharge =
        deliverySettings.freeDeliveryThreshold > 0 &&
        total >= deliverySettings.freeDeliveryThreshold
          ? 0
          : activeLocation === 'inside'
            ? deliverySettings.insideDhaka
            : deliverySettings.outsideDhaka;

      const activeTotalPrice = total + activeShippingCharge;

      const orderPayload = {
        items: cart.map((item) => ({
          itemType: (item as any).itemType || 'Product',
          product: item._id as string,
          quantity: item.quantity,
          price:
            item.salePrice && item.salePrice > 0 ? item.salePrice : item.price,
          color: item.selectedColor || undefined,
          size: item.selectedSize || undefined,
        })),
        totalPrice: activeTotalPrice,
        subTotal: subtotal,
        discount: discount,
        shippingCharge: activeShippingCharge,
        couponCode: couponCode || undefined,
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"></div>
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
    return <CheckoutAdminBlocked user={user} />;
  }

  if (isSuccess) {
    return <CheckoutOrderSuccess />;
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
              Secure <span className="text-primary">Checkout</span>
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
              setPhoneInput={(val) => {
                setPhoneInput(val);
                setPhoneError('');
              }}
              guestInfo={guestInfo}
              setGuestInfo={(val) => {
                setGuestInfo(val);
                setPhoneError('');
              }}
              guestMethod={guestMethod}
              setGuestMethod={setGuestMethod}
              isDeliveryFree={shippingCharge === 0}
              deliverySettings={deliverySettings}
              phoneError={phoneError}
            />

            {/* Payment Section */}
            <CheckoutPaymentSection
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />

            <div className="border-primary/20 bg-primary/5 flex items-center gap-4 rounded-2xl border p-6">
              <ShieldCheck className="text-primary" size={24} />
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
            <CheckoutOrderSummary
              cart={cart}
              subtotal={subtotal}
              discount={discount}
              shippingCharge={shippingCharge}
              finalTotal={finalTotal}
              couponCode={couponCode}
              applyCoupon={applyCoupon}
              handlePlaceOrder={handlePlaceOrder}
              submitting={submitting}
            />
          </div>
        </div>
      </div>

      <ErrorAlertModal
        isOpen={showRateLimitModal}
        setIsOpen={setShowRateLimitModal}
        title="Action Blocked"
        description="Maximum OTP requests reached for today. Please try again after 24 hours to secure your account."
      />
    </div>
  );
}
