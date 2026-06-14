'use client';

import OrderStatusStepper from '@/app/(public)/dashboard/orders/_components/OrderStatusStepper';
import Image from '@/components/common/SafeImage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrderStatus } from '@/services/order/order.types';
import { IProduct } from '@/types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  RefreshCcw,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react';
import Link from 'next/link';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Pending':
      return <Clock className="h-4 w-4" />;
    case 'Processing':
      return <Package className="h-4 w-4" />;
    case 'Shipped':
      return <Truck className="h-4 w-4" />;
    case 'Courier':
      return <Truck className="h-4 w-4" />;
    case 'Delivered':
      return <CheckCircle2 className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'Processing':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'Shipped':
      return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    case 'Courier':
      return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
    case 'Delivered':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'Cancelled':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'Rejected':
      return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

interface OrderCardProps {
  order: any;
  idx: number;
  onOrderAgain: (order: any) => void;
  onWriteReview: (order: any) => void;
}

export default function OrderCard({
  order,
  idx,
  onOrderAgain,
  onWriteReview,
}: OrderCardProps) {
  const isDelivered = order.status === OrderStatus.DELIVERED;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="bg-card/50 border-border group overflow-hidden rounded-3xl border transition-all hover:border-blue-500/20"
    >
      {/* Order Header */}
      <div className="border-border/50 bg-muted/20 flex flex-col justify-between gap-6 border-b p-6 md:flex-row md:items-center md:p-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <p className="text-muted-foreground text-xs font-black tracking-widest uppercase">
              Order ID
            </p>
            <Badge
              variant="outline"
              className="bg-background font-mono text-[10px]"
            >
              #{order._id.slice(-8).toUpperCase()}
            </Badge>
          </div>
          <div className="text-foreground flex items-center gap-2 font-bold italic">
            <Calendar className="h-4 w-4 text-blue-500" />
            {format(new Date(order.createdAt), 'MMMM dd, yyyy')}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Badge
            className={`flex items-center gap-2 rounded-full border px-4 py-1.5 font-bold ${getStatusColor(
              order.status,
            )}`}
          >
            {getStatusIcon(order.status)}
            {order.status}
          </Badge>
          <p className="text-foreground text-2xl font-black tracking-tighter">
            ৳{order.totalPrice.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="space-y-6 p-6 md:p-8">
        {/* Status Stepper */}
        <div className="bg-muted/30 border-border/50 rounded-2xl border p-4">
          <p className="text-muted-foreground mb-4 text-[10px] font-black tracking-widest uppercase">
            Order Progress
          </p>
          <OrderStatusStepper currentStatus={order.status as OrderStatus} />
        </div>

        {/* Order Items */}
        <div className="flex flex-col gap-4">
          {order.items.map((item: any, itemIdx: number) => {
            let imageSrc = item.product?.thumbnails?.[0];
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
                key={`${
                  item.product?._id || item._id || itemIdx
                }_${item.color || ''}_${item.size || ''}`}
                className="flex items-center gap-6"
              >
                <div className="bg-muted border-border/50 relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={item.product?.name || 'Product'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-muted-foreground bg-muted/50 flex h-full w-full items-center justify-center">
                      <ShoppingBag size={24} />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-foreground truncate font-bold">
                    {item.product?.name || 'Product Unavailable'}
                  </h4>
                  <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                    Qty: {item.quantity} • ৳{item.price.toFixed(2)}
                    {item.size && ` • Size: ${item.size}`}
                    {item.color && ` • Color: ${item.color}`}
                  </p>
                </div>
                {item.product && (
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="group/btn shrink-0 rounded-full"
                  >
                    <Link
                      href={`/products/${
                        (item.product as IProduct).slug || item.product._id
                      }`}
                    >
                      View
                    </Link>
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Order Footer */}
        <div className="border-border/30 flex flex-col items-start justify-between gap-4 border-t pt-6 md:flex-row md:items-center">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <div>
              <p className="text-muted-foreground mb-1 text-[10px] font-black tracking-widest uppercase">
                Shipping To
              </p>
              <p className="text-foreground max-w-sm text-sm font-medium">
                {order.shippingAddress}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="shrink-0 gap-2 rounded-full border-blue-500/50 px-6 font-bold text-blue-600 hover:bg-blue-50"
            >
              <Link href={`/track-order?id=${order._id}`}>
                <Truck className="h-4 w-4" />
                Detailed Tracking
              </Link>
            </Button>

            <Button
              onClick={() => onOrderAgain(order)}
              variant="outline"
              className="shrink-0 gap-2 rounded-full border-emerald-500/50 px-6 font-bold text-emerald-600 hover:bg-emerald-50"
            >
              <RefreshCcw className="h-4 w-4" />
              Order Again
            </Button>

            {/* Review button — only when delivered */}
            {isDelivered && (
              <Button
                onClick={() => onWriteReview(order)}
                className="shrink-0 gap-2 rounded-full bg-amber-500 px-6 font-bold text-white hover:bg-amber-600"
              >
                <Star className="h-4 w-4" />
                Write a Review
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
