'use client';

import Image from '@/components/common/SafeImage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IOrder } from '@/services/order/order.types';
import { ShoppingBag } from 'lucide-react';

interface OrderItemsCardProps {
  order: IOrder;
}

export default function OrderItemsCard({ order }: OrderItemsCardProps) {
  return (
    <Card className="border-border/50 bg-card/80 text-card-foreground border shadow-2xl backdrop-blur-xl">
      <CardHeader className="p-6 pb-0 md:p-8">
        <CardTitle className="flex items-center gap-3 text-xl font-black italic">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <ShoppingBag size={20} />
          </div>
          Order Items
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6 md:p-8">
        {order.items.map((item: any, idx: number) => {
          let imageSrc = item.product?.thumbnails?.[0] || item.product?.image;
          if (item.color && item.product?.variants?.length > 0) {
            const variant = item.product.variants.find(
              (v: any) => v.color === item.color,
            );
            if (variant?.thumbnails?.[0]) {
              imageSrc = variant.thumbnails[0];
            }
          }

          return (
            <div
              key={idx}
              className="group flex items-center gap-5 transition-all hover:translate-x-2"
            >
              <div className="border-border relative h-20 w-16 overflow-hidden rounded-2xl border bg-black/5 shadow-xl dark:bg-white/5">
                {imageSrc && (
                  <Image
                    src={imageSrc}
                    alt={item.product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="text-card-foreground text-lg leading-tight font-black">
                  {item.product.name}
                </p>
                <p className="text-muted-foreground mt-1 text-sm font-bold opacity-60">
                  {item.quantity} × ৳{item.price}
                  {item.size && ` • Size: ${item.size}`}
                  {item.color && ` • Color: ${item.color}`}
                </p>
              </div>
              <p className="text-xl font-black text-blue-500">
                ৳{item.quantity * item.price}
              </p>
            </div>
          );
        })}
        <div className="border-border mt-6 border-t pt-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-muted-foreground text-[10px] font-black tracking-widest uppercase opacity-60">
                Total Amount
              </p>
              <p className="text-card-foreground text-4xl font-black tracking-tighter">
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
