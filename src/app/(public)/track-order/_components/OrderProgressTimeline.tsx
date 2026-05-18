'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IOrder } from '@/services/order/order.types';
import { motion } from 'framer-motion';
import { Check, Clock, Package, Truck } from 'lucide-react';

const steps = [
  { status: 'Pending', icon: Clock, label: 'Order Placed' },
  { status: 'Processing', icon: Package, label: 'Processing' },
  { status: 'Shipped', icon: Truck, label: 'On the Way' },
  { status: 'Courier', icon: Truck, label: 'With Courier' },
  { status: 'Delivered', icon: Check, label: 'Delivered' },
];

interface OrderProgressTimelineProps {
  order: IOrder;
}

export default function OrderProgressTimeline({
  order,
}: OrderProgressTimelineProps) {
  const currentStepIndex = steps.findIndex((s) => s.status === order.status);

  return (
    <Card className="border-border/50 overflow-hidden border-none bg-[#151722]/80 shadow-2xl backdrop-blur-xl">
      <CardHeader className="border-border/10 border-b bg-white/5 p-6 md:p-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-500 shadow-inner">
              <Package size={20} />
            </div>
            <div>
              <CardTitle className="text-muted-foreground text-xs font-black tracking-widest uppercase opacity-60">
                Order #{order._id?.slice(-8).toUpperCase() || 'N/A'}
              </CardTitle>
              <p className="mt-1 text-xl font-bold md:text-2xl">
                {order.status}
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-white/5 p-3 text-left sm:text-right">
            <p className="text-muted-foreground text-[10px] font-black tracking-widest uppercase opacity-60">
              Order Date
            </p>
            <p className="text-sm font-bold">
              {new Date(order.createdAt!).toLocaleDateString('en-US', {
                dateStyle: 'long',
              })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 md:p-12">
        <div className="relative">
          {/* Desktop Horizontal Stepper */}
          <div className="relative hidden justify-between md:flex">
            {/* Background Line */}
            <div className="absolute top-6 left-0 h-2 w-full rounded-full bg-white/5" />
            {/* Active Line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
              }}
              className="absolute top-6 left-0 h-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
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
                      'flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-700',
                      isCompleted
                        ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/40'
                        : 'text-muted-foreground border border-white/5 bg-[#1a1c2a]',
                      isCurrent &&
                        'ring-2 ring-blue-500/30 ring-offset-2 ring-offset-[#151722]',
                    )}
                  >
                    <Icon size={20} />
                  </motion.div>
                  <p
                    className={cn(
                      'mt-4 max-w-[100px] text-center text-[10px] font-black tracking-widest uppercase transition-colors duration-500',
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

          {/* Mobile Vertical Stepper */}
          <div className="relative flex flex-col gap-8 md:hidden">
            {/* Background Line */}
            <div className="absolute top-2 bottom-2 left-6 w-1 rounded-full bg-white/5" />
            {/* Active Line */}
            <motion.div
              initial={{ height: 0 }}
              animate={{
                height: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
              }}
              className="absolute top-2 left-6 w-1 animate-pulse rounded-full bg-gradient-to-b from-blue-600 to-indigo-500 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            />

            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div
                  key={step.status}
                  className="relative z-10 flex items-center gap-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={cn(
                      'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-700',
                      isCompleted
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'text-muted-foreground border border-white/5 bg-[#1a1c2a]',
                      isCurrent &&
                        'ring-2 ring-blue-500/30 ring-offset-2 ring-offset-[#151722]',
                    )}
                  >
                    <Icon size={20} />
                  </motion.div>
                  <div className="flex flex-col">
                    <span
                      className={cn(
                        'text-xs font-black tracking-widest uppercase transition-colors duration-500',
                        isCompleted
                          ? 'text-white'
                          : 'text-muted-foreground opacity-40',
                      )}
                    >
                      {step.label}
                    </span>
                    {isCurrent && (
                      <span className="mt-0.5 animate-pulse text-[10px] font-bold text-blue-500 uppercase">
                        Current Status
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
