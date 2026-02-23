'use client';

import { OrderStatus } from '@/services/order/order.types';
import { CheckCircle2, Clock, PackageCheck, Truck, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
    OrderStatus.DELIVERED,
];

const OrderStatusStepper = ({ currentStatus }: Props) => {
    const isCancelled = currentStatus === OrderStatus.CANCELLED;
    const currentIdx = STATUS_ORDER.indexOf(currentStatus);

    if (isCancelled) {
        return (
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-red-500/5 border border-red-500/20">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <XCircle className="text-red-500 h-6 w-6" />
                </div>
                <div>
                    <p className="font-black text-red-500 text-lg">Order Cancelled</p>
                    <p className="text-sm text-muted-foreground">This order has been cancelled.</p>
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
                                        'relative w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                                        isDone
                                            ? `${step.bg} border-transparent`
                                            : 'bg-muted border-border',
                                        isActive && `ring-4 ${step.ring}`
                                    )}
                                >
                                    <Icon className={cn('h-4 w-4', isDone ? 'text-white' : 'text-muted-foreground')} />
                                    {isActive && (
                                        <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-current" />
                                    )}
                                </motion.div>
                                {!isLast && (
                                    <div className={cn('w-0.5 h-8 mt-1', isDone && idx < currentIdx ? `${step.bg}` : 'bg-border')} />
                                )}
                            </div>
                            <div className="pb-6 pt-1.5">
                                <p className={cn('font-bold text-sm', isDone ? step.color : 'text-muted-foreground')}>
                                    {step.label}
                                </p>
                                <p className="text-xs text-muted-foreground">{step.sub}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Desktop: horizontal stepper */}
            <div className="hidden md:flex items-center">
                {STEPS.map((step, idx) => {
                    const Icon = step.icon;
                    const isDone = idx <= currentIdx;
                    const isActive = idx === currentIdx;
                    const isLast = idx === STEPS.length - 1;

                    return (
                        <div key={step.key} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-shrink-0">
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: isActive ? 1.15 : 1 }}
                                    className={cn(
                                        'relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all',
                                        isDone
                                            ? `${step.bg} border-transparent shadow-lg`
                                            : 'bg-muted border-border',
                                        isActive && `ring-4 ${step.ring}`
                                    )}
                                >
                                    <Icon className={cn('h-5 w-5', isDone ? 'text-white' : 'text-muted-foreground')} />
                                    {isActive && (
                                        <span className={cn('absolute inset-0 rounded-full animate-ping opacity-20', step.bg)} />
                                    )}
                                </motion.div>
                                <p className={cn('text-xs font-bold mt-2 text-center', isDone ? step.color : 'text-muted-foreground')}>
                                    {step.label}
                                </p>
                                <p className="text-[10px] text-muted-foreground text-center max-w-[80px]">{step.sub}</p>
                            </div>
                            {!isLast && (
                                <div className={cn('flex-1 h-0.5 mx-2 transition-all duration-700', idx < currentIdx ? `${step.bg}` : 'bg-border')} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderStatusStepper;
