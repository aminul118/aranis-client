'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IOrder } from '@/services/order/order.types';
import { MapPin } from 'lucide-react';

interface DeliveryDetailsCardProps {
  order: IOrder;
}

export default function DeliveryDetailsCard({
  order,
}: DeliveryDetailsCardProps) {
  return (
    <Card className="border-border/50 border-none bg-[#151722]/80 shadow-2xl backdrop-blur-xl">
      <CardHeader className="p-6 pb-0 md:p-8">
        <CardTitle className="flex items-center gap-3 text-xl font-black italic">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <MapPin size={20} />
          </div>
          Delivery Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-6 md:p-8">
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
