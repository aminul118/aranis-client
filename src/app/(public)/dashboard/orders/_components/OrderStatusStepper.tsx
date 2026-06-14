'use client';

import { cn } from '@/lib/utils';
import { OrderStatus } from '@/services/order/order.types';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  PackageCheck,
  Truck,
  XCircle,
} from 'lucide-react';

interface Props {
  currentStatus: OrderStatus;
}

const STEPS = [
  {
    key: OrderStatus.PENDING,
    label: 'Order Placed',
    sub: 'Your order is confirmed',
    icon: Clock,
    color: 'text-amber-500',
    ring: 'ring-amber-500/30',
    bg: 'bg-amber-500',
    bgLight: 'bg-amber-500/10',
  },
  {
    key: OrderStatus.PROCESSING,
    label: 'Processing',
    sub: 'Being prepared for shipment',
    icon: PackageCheck,
    color: 'text-blue-500',
    ring: 'ring-blue-500/30',
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-500/10',
  },
  {
    key: OrderStatus.SHIPPED,
    label: 'Shipped',
    sub: 'On the way to you',
    icon: Truck,
    color: 'text-purple-500',
    ring: 'ring-purple-500/30',
    bg: 'bg-purple-500',
    bgLight: 'bg-purple-500/10',
  },
  {
    key: OrderStatus.COURIER,
    label: 'With Courier',
    sub: 'Out for delivery',
    icon: Truck,
    color: 'text-indigo-500',
    ring: 'ring-indigo-500/30',
    bg: 'bg-indigo-500',
    bgLight: 'bg-indigo-500/10',
  },
  {
    key: OrderStatus.DELIVERED,
    label: 'Delivered',
    sub: 'Successfully delivered!',
    icon: CheckCircle2,
    color: 'text-emerald-500',
    ring: 'ring-emerald-500/30',
    bg: 'bg-emerald-500',
    bgLight: 'bg-emerald-500/10',
  },
];

const STATUS_ORDER = [
  OrderStatus.PENDING,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.COURIER,
  OrderStatus.DELIVERED,
];

const OrderStatusStepper = ({ currentStatus }: Props) => {
  const isCancelled = currentStatus === OrderStatus.CANCELLED;
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);

  if (isCancelled) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
          <XCircle className="h-6 w-6 text-red-500" />
        </div>
        <div>
          <p className="text-lg font-black text-red-500">Order Cancelled</p>
          <p className="text-muted-foreground text-sm">
            This order has been cancelled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Mobile: vertical list */}
      <div className="flex flex-col gap-0 md:hidden">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx <= currentIdx;
          const isActive = idx === currentIdx;
          const isLast = idx === STEPS.length - 1;

          return (
            <div key={step.key} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={cn(
                    'relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                    isDone
                      ? `${step.bg} border-transparent`
                      : 'bg-muted border-border',
                    isActive && `ring-4 ${step.ring}`,
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4',
                      isDone ? 'text-white' : 'text-muted-foreground',
                    )}
                  />
                  {isActive && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-20" />
                  )}
                </motion.div>
                {!isLast && (
                  <div
                    className={cn(
                      'mt-1 h-8 w-0.5',
                      isDone && idx < currentIdx ? `${step.bg}` : 'bg-border',
                    )}
                  />
                )}
              </div>
              <div className="pt-1.5 pb-6">
                <p
                  className={cn(
                    'text-sm font-bold',
                    isDone ? step.color : 'text-muted-foreground',
                  )}
                >
                  {step.label}
                </p>
                <p className="text-muted-foreground text-xs">{step.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: horizontal stepper */}
      <div className="hidden items-center md:flex">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx <= currentIdx;
          const isActive = idx === currentIdx;
          const isLast = idx === STEPS.length - 1;

          return (
            <div key={step.key} className="flex flex-1 items-center">
              <div className="flex flex-shrink-0 flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isActive ? 1.15 : 1 }}
                  className={cn(
                    'relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all',
                    isDone
                      ? `${step.bg} border-transparent shadow-lg`
                      : 'bg-muted border-border',
                    isActive && `ring-4 ${step.ring}`,
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5',
                      isDone ? 'text-white' : 'text-muted-foreground',
                    )}
                  />
                  {isActive && (
                    <span
                      className={cn(
                        'absolute inset-0 animate-ping rounded-full opacity-20',
                        step.bg,
                      )}
                    />
                  )}
                </motion.div>
                <p
                  className={cn(
                    'mt-2 text-center text-xs font-bold',
                    isDone ? step.color : 'text-muted-foreground',
                  )}
                >
                  {step.label}
                </p>
                <p className="text-muted-foreground max-w-[80px] text-center text-[10px]">
                  {step.sub}
                </p>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'mx-2 h-0.5 flex-1 transition-all duration-700',
                    idx < currentIdx ? `${step.bg}` : 'bg-border',
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusStepper;
