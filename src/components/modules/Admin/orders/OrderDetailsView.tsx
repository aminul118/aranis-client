'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { updateOrderStatus } from '@/services/order/order';
import { IOrder, OrderStatus } from '@/services/order/order.types';
import { IProduct } from '@/types';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  CreditCard,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const STATUS_CONFIG: Record<
  OrderStatus,
  { color: string; bg: string; label: string }
> = {
  [OrderStatus.PENDING]: {
    color: 'text-amber-500',
    bg: 'bg-amber-500/10 border-amber-500/20',
    label: 'Pending',
  },
  [OrderStatus.PROCESSING]: {
    color: 'text-blue-500',
    bg: 'bg-blue-500/10 border-blue-500/20',
    label: 'Processing',
  },
  [OrderStatus.SHIPPED]: {
    color: 'text-purple-500',
    bg: 'bg-purple-500/10 border-purple-500/20',
    label: 'Shipped',
  },
  [OrderStatus.COURIER]: {
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
    label: 'Courier',
  },
  [OrderStatus.DELIVERED]: {
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    label: 'Delivered',
  },
  [OrderStatus.CANCELLED]: {
    color: 'text-red-500',
    bg: 'bg-red-500/10 border-red-500/20',
    label: 'Cancelled',
  },
};

const ALL_STATUSES = [
  OrderStatus.PENDING,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.COURIER,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
];

const OrderDetailsView = ({ order }: { order: IOrder }) => {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const [updating, setUpdating] = useState(false);

  const cfg = STATUS_CONFIG[currentStatus];

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (newStatus === currentStatus) return;
    setUpdating(true);
    try {
      const res = await updateOrderStatus(order._id!, newStatus);
      if (res.success) {
        setCurrentStatus(newStatus);
        toast.success(`Order status updated to ${newStatus}`);
        router.refresh();
      } else {
        toast.error(res.message || 'Failed to update status');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground group mb-2 -ml-2"
          >
            <Link href="/admin/orders">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Orders
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-foreground text-3xl font-black tracking-tight">
              Order{' '}
              <span className="text-blue-500">
                #{order._id?.slice(-6).toUpperCase()}
              </span>
            </h1>
            <Badge
              variant="outline"
              className={`${cfg.bg} ${cfg.color} rounded-full border px-3 py-1 font-bold`}
            >
              {currentStatus}
            </Badge>
          </div>
          <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
            <Calendar size={14} />
            <span>
              Placed on{' '}
              {new Date(order.createdAt!).toLocaleDateString('en-US', {
                dateStyle: 'long',
              })}
            </span>
            <span className="mx-2">•</span>
            <span>
              {new Date(order.createdAt!).toLocaleTimeString('en-US', {
                timeStyle: 'short',
              })}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          className="group self-start rounded-full border-blue-500/30 font-bold text-blue-600 hover:border-blue-500 hover:bg-blue-50 md:self-auto"
          onClick={() => window.print()}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Print Invoice
        </Button>
      </div>

      {/* ── STATUS CHANGE PANEL ── */}
      <Card className="border-blue-500/20 bg-blue-500/5 shadow-xl shadow-blue-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-blue-600">
            <Package size={18} />
            Update Order Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 text-sm">
            Current status:{' '}
            <span className={cn('font-bold', cfg.color)}>{currentStatus}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_STATUSES.map((s) => {
              const sCfg = STATUS_CONFIG[s];
              const isActive = s === currentStatus;
              return (
                <button
                  key={s}
                  disabled={updating || isActive}
                  onClick={() => handleStatusChange(s)}
                  className={cn(
                    'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all',
                    isActive
                      ? `${sCfg.bg} ${sCfg.color} cursor-default`
                      : 'border-border bg-background hover:bg-muted/60 text-muted-foreground hover:text-foreground hover:border-blue-500/30',
                  )}
                >
                  {updating && isActive ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : isActive ? (
                    <CheckCircle2 size={14} />
                  ) : null}
                  {sCfg.label}
                </button>
              );
            })}
          </div>
          {updating && (
            <p className="text-muted-foreground mt-3 flex items-center gap-2 text-sm">
              <Loader2 size={14} className="animate-spin" /> Updating status...
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Customer Details */}
        <Card className="border-border/40 bg-background/50 group relative overflow-hidden shadow-xl shadow-black/5 backdrop-blur-sm lg:col-span-1">
          <div className="absolute top-0 left-0 h-full w-1 bg-blue-500 transition-all group-hover:w-2" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="text-blue-500" size={18} />
              Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-500">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-foreground font-black">
                  {order.user?.fullName}
                </h3>
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  ID: {order.user?._id?.slice(-6)}
                </p>
              </div>
            </div>

            <div className="border-border/40 space-y-4 border-t pt-4">
              <div className="flex items-start gap-3">
                <Mail className="text-muted-foreground mt-1" size={16} />
                <div className="min-w-0">
                  <p className="text-muted-foreground mb-0.5 text-[10px] font-black tracking-widest uppercase">
                    Email
                  </p>
                  <p className="truncate text-sm font-medium">
                    {order.user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-muted-foreground mt-1" size={16} />
                <div>
                  <p className="text-muted-foreground mb-0.5 text-[10px] font-black tracking-widest uppercase">
                    Phone
                  </p>
                  <p className="text-sm font-medium">
                    {order.user?.phone || 'Not provided'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 shrink-0 text-blue-500" size={16} />
                <div>
                  <p className="text-muted-foreground mb-0.5 text-[10px] font-black tracking-widest uppercase">
                    Shipping Address
                  </p>
                  <p className="text-sm leading-relaxed font-bold">
                    {order.shippingAddress}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary & Items */}
        <div className="space-y-8 lg:col-span-2">
          {/* Items List */}
          <Card className="border-border/40 bg-background/50 overflow-hidden shadow-xl shadow-black/5 backdrop-blur-sm">
            <CardHeader className="border-border/40 bg-muted/20 border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingBag className="text-blue-500" size={18} />
                Ordered Products ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-border/40 text-muted-foreground border-b text-[10px] font-black tracking-widest uppercase">
                      <th className="px-6 py-4 text-left">Product</th>
                      <th className="px-6 py-4 text-center">Qty</th>
                      <th className="px-6 py-4 text-right">Unit Price</th>
                      <th className="px-6 py-4 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-border/40 divide-y">
                    {order.items.map((item, index) => {
                      const product = item.product as IProduct;
                      return (
                        <tr
                          key={index}
                          className="group hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="bg-muted border-border/50 relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-foreground truncate text-sm font-bold">
                                  {product.name}
                                </p>
                                <p className="text-muted-foreground text-[10px] tracking-widest uppercase">
                                  {product.category}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-sm font-bold">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 text-right text-sm">
                            ৳{item.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-black text-blue-500">
                            ৳{(item.quantity * item.price).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card className="border-border/40 bg-background border-t-4 border-t-blue-500 shadow-xl shadow-black/5">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="bg-muted/30 border-border/40 flex items-center gap-3 rounded-xl border p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                        Payment Method
                      </p>
                      <p className="font-bold">
                        {order.paymentMethod || 'Cash on Delivery'}
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted/30 border-border/40 flex items-center gap-3 rounded-xl border p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                        Shipping
                      </p>
                      <p className="font-bold">Standard (Free)</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-bold">
                      ৳{order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-bold text-green-500">FREE</span>
                  </div>
                  <div className="border-border/40 flex items-center justify-between border-t pt-3">
                    <span className="text-sm font-black tracking-widest uppercase">
                      Grand Total
                    </span>
                    <span className="text-2xl font-black text-blue-500">
                      ৳{order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── PRINT ONLY INVOICE COMPONENT ── */}
      <div className="fixed inset-0 z-[9999] hidden bg-white p-10 font-sans leading-relaxed text-black print:block">
        <style
          dangerouslySetInnerHTML={{
            __html: `
                    @media print {
                        body * { visibility: hidden; }
                        .print-area, .print-area * { visibility: visible; }
                        .print-area { position: absolute; left: 0; top: 0; width: 100%; }
                        @page { margin: 1cm; }
                    }
                `,
          }}
        />

        <div className="print-area space-y-8">
          {/* Invoice Header */}
          <div className="flex items-start justify-between border-b-4 border-blue-600 pb-8">
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-blue-600 uppercase">
                Aranis
              </h1>
              <p className="text-sm font-bold tracking-widest text-gray-500 uppercase">
                Premium E-commerce
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-black">INVOICE</h2>
              <p className="font-bold text-blue-600">
                #{order._id?.slice(-8).toUpperCase()}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
              </p>
            </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-2">
              <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                Bill To
              </p>
              <div className="text-lg font-bold">{order.user?.fullName}</div>
              <div className="text-sm text-gray-500">{order.user?.email}</div>
              <div className="text-sm text-gray-500">{order.user?.phone}</div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                Ship To
              </p>
              <div className="text-sm leading-relaxed font-bold">
                {order.shippingAddress}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <span className="font-bold text-gray-700">Payment:</span>{' '}
                {order.paymentMethod}
              </div>
            </div>
          </div>

          {/* Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                <th className="w-16 py-4 text-left">Image</th>
                <th className="py-4 text-left">Description</th>
                <th className="w-24 py-4 text-center">Price</th>
                <th className="w-20 py-4 text-center">Qty</th>
                <th className="w-32 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {order.items.map((item, idx) => {
                const product = item.product as IProduct;
                return (
                  <tr key={idx}>
                    <td className="py-6">
                      <div className="relative h-12 w-12 overflow-hidden rounded border border-gray-100">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-6">
                      <div className="font-black text-gray-800">
                        {product.name}
                      </div>
                      <div className="text-[10px] tracking-widest text-gray-400 uppercase">
                        {product.category}
                      </div>
                    </td>
                    <td className="py-6 text-center text-sm">
                      ৳{item.price.toFixed(2)}
                    </td>
                    <td className="py-6 text-center text-sm font-bold">
                      {item.quantity}
                    </td>
                    <td className="py-6 text-right font-black tracking-tight">
                      ৳{(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end border-t-2 border-gray-100 pt-8">
            <div className="w-72 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                  Subtotal
                </span>
                <span className="font-bold text-gray-800">
                  ৳{order.totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                  Shipping
                </span>
                <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">
                  Free
                </span>
              </div>
              <div className="flex items-center justify-between border-t-2 border-blue-600 pt-4">
                <span className="text-sm font-black tracking-widest text-blue-600 uppercase">
                  Grand Total
                </span>
                <span className="text-2xl font-black tracking-tighter text-blue-600">
                  ৳{order.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="space-y-2 pt-24 text-center">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
              Thank you for shopping with Aranis
            </p>
            <p className="text-[10px] text-gray-300">
              This is a computer generated invoice and does not require a
              physical signature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsView;
