'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { IUser } from '@/types';
import { motion } from 'framer-motion';
import { MapPin, Truck } from 'lucide-react';

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
}: CheckoutShippingSectionProps) {
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
              className={`flex cursor-pointer flex-col items-center justify-between rounded-2xl border-2 p-4 transition-all ${
                shippingLocation === 'outside'
                  ? 'border-blue-600 bg-blue-500/5 text-blue-600'
                  : 'border-border bg-card hover:bg-muted/50 text-muted-foreground'
              }`}
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
              <div>
                <span className="text-muted-foreground mb-0.5 block">
                  Email / Phone
                </span>
                <span className="text-foreground font-bold">
                  {user.email || user.phone || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Saved Addresses (Optional Selector) */}
          <div className="space-y-3">
            <label className="text-muted-foreground text-xs font-black tracking-widest uppercase">
              Choose from Saved Addresses (Optional)
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {user.addresses && user.addresses.length > 0 ? (
                user.addresses.map((addr, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setAddressInput(addr.address)}
                    className={`flex flex-col items-start gap-2 rounded-2xl border-2 p-4 transition-all ${
                      addressInput === addr.address
                        ? 'border-blue-600 bg-blue-500/5'
                        : 'border-border bg-card hover:border-blue-500/30'
                    }`}
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
                <div className="col-span-full rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-600 italic">
                  No saved addresses found. You can enter your delivery address
                  below.
                </div>
              )}
            </div>
          </div>

          {/* Delivery Address Input */}
          <div className="space-y-2">
            <label className="text-muted-foreground text-xs font-black tracking-widest uppercase">
              Delivery Address <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="House #, Street, City"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              className="bg-muted/50 border-border text-foreground min-h-[80px] w-full rounded-xl border p-4 transition-all outline-none focus:border-blue-500/50"
            />
          </div>

          {/* Phone Number Input */}
          <div className="space-y-2">
            <label className="text-muted-foreground text-xs font-black tracking-widest uppercase">
              Confirm Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="bg-muted/50 border-border text-foreground w-full rounded-xl border p-4 transition-all outline-none focus:border-blue-500/50"
            />
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
                  className="bg-muted/50 border-border text-foreground w-full rounded-xl border p-4 transition-all outline-none focus:border-blue-500/50"
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
