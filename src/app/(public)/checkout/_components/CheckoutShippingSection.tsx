'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { IUser } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, MapPin, Plus, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CheckoutShippingSectionProps {
  user: IUser | null;
  shippingLocation: 'inside' | 'outside';
  setShippingLocation: (loc: 'inside' | 'outside') => void;
  addressInput: string;
  setAddressInput: (val: string) => void;
  phoneInput: string;
  setPhoneInput: (val: string) => void;
  guestInfo: {
    firstName: string;
    lastName: string;
    emailOrPhone: string;
    address: string;
    phone: string;
  };
  setGuestInfo: (val: any) => void;
  guestMethod: 'email' | 'phone';
  setGuestMethod: (val: 'email' | 'phone') => void;
  isDeliveryFree: boolean;
  deliverySettings: {
    insideDhaka: number;
    outsideDhaka: number;
    freeDeliveryThreshold: number;
  };
  phoneError?: string;
}

export default function CheckoutShippingSection({
  user,
  shippingLocation,
  setShippingLocation,
  addressInput,
  setAddressInput,
  phoneInput,
  setPhoneInput,
  guestInfo,
  setGuestInfo,
  guestMethod,
  setGuestMethod,
  isDeliveryFree,
  deliverySettings,
  phoneError,
}: CheckoutShippingSectionProps) {
  const hasSavedAddresses = user?.addresses && user.addresses.length > 0;
  const [showCustomAddress, setShowCustomAddress] =
    useState(!hasSavedAddresses);

  // Auto-select the first saved address if none is selected and the custom form is hidden
  useEffect(() => {
    if (hasSavedAddresses && !showCustomAddress && !addressInput) {
      setAddressInput(user.addresses[0].address);
    }
  }, [
    hasSavedAddresses,
    showCustomAddress,
    addressInput,
    setAddressInput,
    user,
  ]);

  // Auto-fill phone if user has it
  useEffect(() => {
    if (user?.phone && !phoneInput) {
      setPhoneInput(user.phone);
    }
  }, [user, phoneInput, setPhoneInput]);

  return (
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
          value={shippingLocation}
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
              className={`flex cursor-pointer flex-col items-center justify-between rounded-2xl border-2 p-4 transition-all ${
                shippingLocation === 'inside'
                  ? 'border-blue-600 bg-blue-500/5 text-blue-600'
                  : 'border-border bg-card hover:bg-muted/50 text-muted-foreground'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-sm font-bold">Inside Dhaka</span>
                {!isDeliveryFree && (
                  <span className="text-sm font-black">
                    ৳{deliverySettings.insideDhaka}
                  </span>
                )}
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
              className={`flex cursor-pointer flex-col items-center justify-between rounded-2xl border-2 p-4 transition-all ${
                shippingLocation === 'outside'
                  ? 'border-blue-600 bg-blue-500/5 text-blue-600'
                  : 'border-border bg-card hover:bg-muted/50 text-muted-foreground'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-sm font-bold">Outside Dhaka</span>
                {!isDeliveryFree && (
                  <span className="text-sm font-black">
                    ৳{deliverySettings.outsideDhaka}
                  </span>
                )}
              </div>
            </label>
          </div>
        </RadioGroup>
      </div>

      {user ? (
        <div className="space-y-6">
          {/* Customer Details Card */}
          <div className="rounded-2xl border border-blue-500/10 bg-blue-500/5 p-5">
            <h3 className="mb-3 text-xs font-black tracking-widest text-blue-600 uppercase">
              Customer Account Info
            </h3>
            <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
              <div>
                <span className="text-muted-foreground mb-0.5 block">Name</span>
                <span className="text-foreground font-bold">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              {user.email && (
                <div>
                  <span className="text-muted-foreground mb-0.5 block">
                    Email Address
                  </span>
                  <span className="text-foreground font-bold">
                    {user.email}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Saved Addresses */}
          {hasSavedAddresses && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                  Select a Saved Address
                </label>
                {!showCustomAddress && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomAddress(true);
                      setAddressInput('');
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 transition-all hover:text-blue-700 hover:underline"
                  >
                    <Plus size={14} /> Add New Address
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {user.addresses.map((addr, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      setAddressInput(addr.address);
                      setShowCustomAddress(false);
                    }}
                    className={`flex flex-col items-start gap-2 rounded-2xl border-2 p-4 transition-all ${
                      addressInput === addr.address && !showCustomAddress
                        ? 'border-blue-600 bg-blue-500/5 shadow-md shadow-blue-500/10'
                        : 'border-border bg-card hover:bg-muted/30 hover:border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${addressInput === addr.address && !showCustomAddress ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'}`}
                      >
                        <MapPin size={12} />
                      </div>
                      <span className="text-sm font-bold tracking-tight">
                        {addr.title}
                      </span>
                    </div>
                    <p className="text-muted-foreground ml-8 line-clamp-2 text-left text-xs leading-relaxed">
                      {addr.address}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Address Input */}
          <AnimatePresence>
            {showCustomAddress && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <label className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  {hasSavedAddresses && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomAddress(false);
                        setAddressInput(user.addresses[0].address);
                      }}
                      className="text-muted-foreground hover:text-foreground text-xs font-bold transition-all hover:underline"
                    >
                      Cancel
                    </button>
                  )}
                </div>
                <textarea
                  placeholder="House #, Street, City"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="bg-muted/30 border-border text-foreground focus:bg-card min-h-[100px] w-full rounded-xl border-2 p-4 transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phone Number Input */}
          <div className="space-y-2">
            <label className="text-muted-foreground text-xs font-black tracking-widest uppercase">
              Confirm Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={user?.phone || phoneInput}
                onChange={(e) => {
                  if (!user?.phone) setPhoneInput(e.target.value);
                }}
                readOnly={!!user?.phone}
                placeholder="01XXXXXXXXX"
                className={`w-full rounded-xl border p-4 transition-all outline-none ${
                  phoneError
                    ? 'border-red-500 bg-red-500/5 focus:border-red-500'
                    : user?.phone
                      ? 'bg-muted/50 border-border/50 text-muted-foreground cursor-not-allowed'
                      : 'bg-muted/10 border-border text-foreground focus:border-blue-500/50'
                }`}
              />
              {phoneError && (
                <p className="absolute -bottom-5 left-0 mt-1 text-xs text-red-500">
                  {phoneError}
                </p>
              )}
              {user?.phone && (
                <div className="text-muted-foreground absolute top-1/2 right-4 flex -translate-y-1/2 items-center gap-2">
                  <span className="rounded-md bg-green-500/10 px-2 py-1 text-[10px] font-bold tracking-wider text-green-600 uppercase">
                    Verified
                  </span>
                  <Lock size={16} />
                </div>
              )}
            </div>
            {!user?.phone && (
              <p className="text-muted-foreground text-[10px] italic">
                * Please provide a valid phone number. We will save this to your
                account for future orders and updates.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="border-border border-b pb-4">
            <h3 className="text-lg font-bold">Checkout as Guest</h3>
            <p className="text-muted-foreground text-xs">
              Enter your details below to create an account and complete your
              order.
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
                value={guestInfo.firstName}
                className="bg-muted/50 border-border text-foreground w-full rounded-xl border p-4 transition-all outline-none focus:border-blue-500/50"
                onChange={(e) =>
                  setGuestInfo({ ...guestInfo, firstName: e.target.value })
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
                value={guestInfo.lastName}
                className="bg-muted/50 border-border text-foreground w-full rounded-xl border p-4 transition-all outline-none focus:border-blue-500/50"
                onChange={(e) =>
                  setGuestInfo({ ...guestInfo, lastName: e.target.value })
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
                  value={guestInfo.emailOrPhone}
                  className={`w-full rounded-xl border p-4 transition-all outline-none ${
                    phoneError
                      ? 'border-red-500 bg-red-500/5 focus:border-red-500'
                      : 'bg-muted/50 border-border text-foreground focus:border-blue-500/50'
                  }`}
                  onChange={(e) =>
                    setGuestInfo({
                      ...guestInfo,
                      emailOrPhone: e.target.value,
                      phone: e.target.value,
                    })
                  }
                />
                {phoneError && (
                  <p className="mt-1 text-xs text-red-500">{phoneError}</p>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-muted-foreground text-xs font-black tracking-widest uppercase">
              Delivery Address
            </label>
            <textarea
              placeholder="House #, Street, City"
              value={guestInfo.address}
              className="bg-muted/50 border-border text-foreground min-h-[80px] w-full rounded-xl border p-4 transition-all outline-none focus:border-blue-500/50"
              onChange={(e) =>
                setGuestInfo({ ...guestInfo, address: e.target.value })
              }
            />
          </div>
          <p className="text-muted-foreground text-[10px] italic">
            * An OTP will be sent to verify your contact info and create your
            account.
          </p>
        </div>
      )}
    </motion.section>
  );
}
