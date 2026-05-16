'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { trackOrder } from '@/services/order/order';
import { IOrder } from '@/services/order/order.types';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  Clock,
  MapPin,
  Package,
  Search,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const steps = [
  { status: 'Pending', icon: Clock, label: 'Order Placed' },
  { status: 'Processing', icon: Package, label: 'Processing' },
  { status: 'Shipped', icon: Truck, label: 'On the Way' },
  { status: 'Courier', icon: Truck, label: 'With Courier' },
  { status: 'Delivered', icon: Check, label: 'Delivered' },
];

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: 'error' | 'success';
  } | null>(null);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      handleTrackAuto(id);
    }
  }, [searchParams]);

  const handleTrackAuto = async (id: string) => {
    try {
      setLoading(true);
      setMessage(null);
      const res = await trackOrder(id.trim());
      if (res.success) {
        setOrder(res.data!);
        setMessage({
          text: 'Order found! Tracking details updated.',
          type: 'success',
        });
      } else {
        setMessage({
          text: "Oops! We couldn't find that order ID. Please double check.",
          type: 'error',
        });
        setOrder(null);
      }
    } catch (error) {
      setMessage({
        text: 'Something went wrong. Please try again later.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    try {
      setLoading(true);
      setMessage(null);
      const res = await trackOrder(orderId.trim());
      if (res.success) {
        setOrder(res.data!);
        setMessage({
          text: 'Order found! Scroll down for details.',
          type: 'success',
        });
      } else {
        setMessage({
          text: "Oops! We couldn't find that order ID. Please double check.",
          type: 'error',
        });
        setOrder(null);
      }
    } catch (error) {
      setMessage({
        text: 'Something went wrong. Please try again later.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = steps.findIndex((s) => s.status === order?.status);

  return (
    <div className="bg-background relative min-h-screen overflow-hidden px-4 pt-32 pb-20">
      {/* Background Orbs for "Cute/Premium" Look */}
      <div className="absolute top-0 left-1/4 -z-10 h-64 w-64 animate-pulse rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 -z-10 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl delay-700" />

      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-5xl font-black tracking-tight text-white md:text-7xl"
          >
            Track Your <span className="text-blue-500">Journey</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mx-auto max-w-lg text-lg"
          >
            Enter your Order ID to see where your premium pieces are in their
            journey to your doorstep.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border/50 overflow-hidden border-none bg-[#151722]/80 shadow-2xl backdrop-blur-xl">
            <CardContent className="p-10">
              <form onSubmit={handleTrack} className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative flex-1">
                    <Search
                      className="text-muted-foreground absolute top-1/2 left-5 -translate-y-1/2"
                      size={22}
                    />
                    <Input
                      placeholder="Enter your Order ID (e.g. 6625...)"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="border-border/50 h-16 rounded-[2rem] bg-white/5 pl-14 text-lg transition-all focus:bg-white/10 focus:ring-blue-500/20"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-16 rounded-[2rem] bg-blue-600 px-10 text-lg font-black text-white shadow-xl shadow-blue-500/20 transition-all hover:scale-105 hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                        Tracking...
                      </span>
                    ) : (
                      'Track Now'
                    )}
                  </Button>
                </div>

                {/* Message Below the Field */}
                <AnimatePresence>
                  {message && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={cn(
                        'px-6 text-sm font-bold tracking-wide',
                        message.type === 'error'
                          ? 'text-red-400'
                          : 'text-emerald-400',
                      )}
                    >
                      {message.text}
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence mode="wait">
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
              className="mt-16 space-y-12"
            >
              {/* Progress Tracker */}
              <Card className="border-border/50 overflow-hidden border-none bg-[#151722]/80 shadow-2xl backdrop-blur-xl">
                <CardHeader className="border-border/10 border-b bg-white/5 p-8">
                  <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-500 shadow-inner">
                        <Package size={32} />
                      </div>
                      <div>
                        <CardTitle className="text-muted-foreground text-xs font-black tracking-widest uppercase opacity-60">
                          Order #{order._id?.slice(-8).toUpperCase() || 'N/A'}
                        </CardTitle>
                        <p className="mt-1 text-3xl font-black">
                          {order.status}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-4 text-right">
                      <p className="text-muted-foreground text-[10px] font-black tracking-widest uppercase opacity-60">
                        Order Date
                      </p>
                      <p className="text-sm font-bold">
                        {new Date(order.createdAt!).toLocaleDateString(
                          'en-US',
                          { dateStyle: 'long' },
                        )}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-12">
                  <div className="relative flex justify-between">
                    {/* Background Line */}
                    <div className="absolute top-8 left-0 h-2 w-full rounded-full bg-white/5" />
                    {/* Active Line */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                      }}
                      className="absolute top-8 left-0 h-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                    />

                    {steps.map((step, index) => {
                      const Icon = step.icon;
                      const isCompleted = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;

                      return (
                        <div
                          key={step.status}
                          className="relative z-10 flex flex-col items-center"
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className={cn(
                              'flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-700',
                              isCompleted
                                ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/40'
                                : 'text-muted-foreground border border-white/5 bg-[#1a1c2a]',
                              isCurrent &&
                                'ring-4 ring-blue-500/30 ring-offset-4 ring-offset-[#151722]',
                            )}
                          >
                            <Icon size={28} />
                          </motion.div>
                          <p
                            className={cn(
                              'mt-5 max-w-[100px] text-center text-[10px] font-black tracking-widest uppercase transition-colors duration-500',
                              isCompleted
                                ? 'text-white'
                                : 'text-muted-foreground opacity-40',
                            )}
                          >
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                {/* Items */}
                <Card className="border-border/50 border-none bg-[#151722]/80 shadow-2xl backdrop-blur-xl">
                  <CardHeader className="p-8 pb-0">
                    <CardTitle className="flex items-center gap-3 text-xl font-black italic">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                        <ShoppingBag size={20} />
                      </div>
                      Order Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-8">
                    {order.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="group flex items-center gap-5 transition-all hover:translate-x-2"
                      >
                        <div className="relative h-20 w-16 overflow-hidden rounded-2xl border border-white/5 bg-white/5 shadow-xl">
                          <Image
                            src={item.product.thumbnails?.[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-lg leading-tight font-black">
                            {item.product.name}
                          </p>
                          <p className="text-muted-foreground mt-1 text-sm font-bold opacity-60">
                            {item.quantity} × ৳{item.price}
                          </p>
                        </div>
                        <p className="text-xl font-black text-blue-500">
                          ৳{item.quantity * item.price}
                        </p>
                      </div>
                    ))}
                    <div className="mt-6 border-t border-white/5 pt-8">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-muted-foreground text-[10px] font-black tracking-widest uppercase opacity-60">
                            Total Amount
                          </p>
                          <p className="text-4xl font-black tracking-tighter text-white">
                            ৳{order.totalPrice}
                          </p>
                        </div>
                        <Badge className="mb-2 rounded-xl border border-blue-500/20 bg-blue-600/10 px-4 py-2 text-blue-500">
                          Incl. Shipping
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping & Payment */}
                <Card className="border-border/50 border-none bg-[#151722]/80 shadow-2xl backdrop-blur-xl">
                  <CardHeader className="p-8 pb-0">
                    <CardTitle className="flex items-center gap-3 text-xl font-black italic">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                        <MapPin size={20} />
                      </div>
                      Delivery Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8 p-8">
                    <div>
                      <p className="text-muted-foreground mb-3 text-[10px] font-black tracking-widest uppercase opacity-60">
                        Shipping Destination
                      </p>
                      <div className="rounded-2xl border border-white/5 bg-white/5 p-6 shadow-inner transition-all hover:bg-white/10">
                        <p className="text-lg leading-relaxed font-bold text-white/90 italic">
                          {order.shippingAddress}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
                        <p className="text-muted-foreground mb-2 text-[10px] font-black tracking-widest uppercase opacity-60">
                          Payment
                        </p>
                        <p className="text-lg font-black text-white">
                          {order.paymentMethod}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
                        <p className="text-muted-foreground mb-2 text-[10px] font-black tracking-widest uppercase opacity-60">
                          Status
                        </p>
                        <Badge
                          className={cn(
                            'rounded-xl border px-4 py-2 text-[10px] font-black tracking-widest uppercase',
                            order.paymentStatus === 'Paid'
                              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                              : 'border-red-500/20 bg-red-500/10 text-red-400',
                          )}
                        >
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        className,
      )}
    >
      {children}
    </span>
  );
}
