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
import { toast } from 'sonner';

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

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      handleTrackAuto(id);
    }
  }, [searchParams]);

  const handleTrackAuto = async (id: string) => {
    try {
      setLoading(true);
      const res = await trackOrder(id.trim());
      if (res.success) {
        setOrder(res.data!);
      } else {
        toast.error('Order not found. Please check your Order ID.');
        setOrder(null);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    try {
      setLoading(true);
      const res = await trackOrder(orderId.trim());
      if (res.success) {
        setOrder(res.data!);
      } else {
        toast.error('Order not found. Please check your Order ID.');
        setOrder(null);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = steps.findIndex((s) => s.status === order?.status);

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-black tracking-tighter uppercase md:text-6xl">
            Track Your Order
          </h1>
          <p className="text-muted-foreground mx-auto max-w-md">
            Enter your order ID to see the current status and estimated delivery
            progress.
          </p>
        </div>

        <Card className="bg-card/40 border-none shadow-2xl backdrop-blur-md">
          <CardContent className="p-8">
            <form
              onSubmit={handleTrack}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search
                  className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2"
                  size={20}
                />
                <Input
                  placeholder="Enter your Order ID (e.g. 6625...)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="h-14 rounded-2xl pl-12 text-lg"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-14 rounded-2xl bg-blue-600 px-8 text-lg font-bold text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700"
              >
                {loading ? 'Tracking...' : 'Track Now'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
              className="mt-12 space-y-8"
            >
              {/* Progress Tracker */}
              <Card className="bg-card/40 overflow-hidden border-none shadow-2xl backdrop-blur-md">
                <CardHeader className="border-border/50 bg-muted/20 border-b pb-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <CardTitle className="text-muted-foreground text-sm font-black tracking-widest uppercase">
                        Order #{order._id}
                      </CardTitle>
                      <p className="mt-1 text-2xl font-bold">
                        Status:{' '}
                        <span className="text-blue-500">{order.status}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                        Order Date
                      </p>
                      <p className="font-bold">
                        {new Date(order.createdAt!).toLocaleDateString(
                          'en-US',
                          { dateStyle: 'long' },
                        )}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-10">
                  <div className="relative flex justify-between">
                    {/* Background Line */}
                    <div className="bg-muted/30 absolute top-6 left-0 h-1 w-full" />
                    {/* Active Line */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                      }}
                      className="absolute top-6 left-0 h-1 bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
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
                          <div
                            className={cn(
                              'flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500',
                              isCompleted
                                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30'
                                : 'bg-muted text-muted-foreground',
                              isCurrent && 'scale-110 ring-4 ring-blue-500/20',
                            )}
                          >
                            <Icon size={24} />
                          </div>
                          <p
                            className={cn(
                              'mt-4 max-w-[80px] text-center text-[10px] font-black tracking-widest uppercase',
                              isCompleted
                                ? 'text-foreground'
                                : 'text-muted-foreground',
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

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Items */}
                <Card className="bg-card/40 border-none shadow-2xl backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ShoppingBag size={20} className="text-blue-500" /> Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="border-border relative h-16 w-14 overflow-hidden rounded-xl border">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold">{item.product.name}</p>
                          <p className="text-muted-foreground text-sm">
                            Qty: {item.quantity} × ৳{item.price}
                          </p>
                        </div>
                        <p className="font-bold">
                          ৳{item.quantity * item.price}
                        </p>
                      </div>
                    ))}
                    <div className="border-border mt-4 border-t pt-4">
                      <div className="flex justify-between text-lg font-black">
                        <span>Total</span>
                        <span className="text-blue-500">
                          ৳{order.totalPrice}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping & Payment */}
                <Card className="bg-card/40 border-none shadow-2xl backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin size={20} className="text-blue-500" /> Delivery
                      Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="text-muted-foreground mb-2 text-xs font-black tracking-widest uppercase">
                        Shipping Address
                      </p>
                      <p className="bg-muted/30 rounded-xl p-4 font-medium italic">
                        {order.shippingAddress}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-muted-foreground mb-1 text-xs font-black tracking-widest uppercase">
                          Payment Method
                        </p>
                        <p className="font-bold">{order.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1 text-xs font-black tracking-widest uppercase">
                          Payment Status
                        </p>
                        <Badge
                          className={cn(
                            'rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase',
                            order.paymentStatus === 'Paid'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : 'bg-red-500/10 text-red-600',
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
