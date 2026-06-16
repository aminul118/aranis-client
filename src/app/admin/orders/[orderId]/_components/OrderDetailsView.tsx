'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useUser } from '@/context/UserContext';
import { cn } from '@/lib/utils';
import { updateOrderStatus } from '@/services/order/order';
import { IOrder, OrderStatus } from '@/services/order/order.types';
import { IProduct, Role } from '@/types';
import {
  ArrowLeft,
  Ban,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  Truck,
  Undo2,
  User,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import GetStatusBadge from '../../_components/getStatusBadge';
import OrderPrint from './OrderPrint';

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
  [OrderStatus.REJECTED]: {
    color: 'text-rose-600',
    bg: 'bg-rose-500/10 border-rose-500/20',
    label: 'Rejected',
  },
  [OrderStatus.RETURNED]: {
    color: 'text-slate-600',
    bg: 'bg-slate-500/10 border-slate-500/20',
    label: 'Returned',
  },
};

const getStatusIcon = (status: OrderStatus, size = 14) => {
  switch (status) {
    case OrderStatus.PENDING:
      return <Clock size={size} />;
    case OrderStatus.PROCESSING:
      return <Loader2 size={size} className="animate-spin" />;
    case OrderStatus.SHIPPED:
      return <Truck size={size} />;
    case OrderStatus.COURIER:
      return <Package size={size} />;
    case OrderStatus.DELIVERED:
      return <CheckCircle2 size={size} />;
    case OrderStatus.CANCELLED:
      return <XCircle size={size} />;
    case OrderStatus.REJECTED:
      return <Ban size={size} />;
    case OrderStatus.RETURNED:
      return <Undo2 size={size} />;
    default:
      return null;
  }
};

const ALL_STATUSES = Object.values(OrderStatus);

const OrderDetailsView = ({ order }: { order: IOrder }) => {
  const router = useRouter();
  const { user } = useUser();
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const [updating, setUpdating] = useState(false);

  const cfg = STATUS_CONFIG[currentStatus];
  const isSuperAdmin = user?.role === Role.SUPER_ADMIN;

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

  const sensitiveStatuses = [
    OrderStatus.REJECTED,
    OrderStatus.CANCELLED,
    OrderStatus.RETURNED,
  ];

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
                #{order.orderNumber || order._id?.slice(-6).toUpperCase()}
              </span>
            </h1>
            <div className="origin-left scale-110">
              {GetStatusBadge(currentStatus)}
            </div>
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
          {order.trackingNumber && (
            <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm font-bold">
              <Truck size={14} />
              <span>Tracking Number: {order.trackingNumber}</span>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          className="group self-start rounded-full border-blue-500/30 font-bold text-blue-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 md:self-auto dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
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
              const isSensitive = sensitiveStatuses.includes(s);

              if (isSensitive && !isSuperAdmin) return null;

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
                  ) : (
                    getStatusIcon(s)
                  )}
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
              {order.contactPhone && (
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 text-emerald-500" size={16} />
                  <div>
                    <p className="text-muted-foreground mb-0.5 text-[10px] font-black tracking-widest uppercase">
                      Courier Contact Phone
                    </p>
                    <a
                      href={`tel:${order.contactPhone}`}
                      className="text-sm font-bold text-emerald-600 hover:underline"
                    >
                      {order.contactPhone}
                    </a>
                  </div>
                </div>
              )}
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
                      let imageSrc =
                        product?.thumbnails?.[0] ||
                        (product as any)?.image ||
                        '/placeholder.jpg';
                      if (item.color && product?.variants?.length) {
                        const variant = product.variants.find(
                          (v: any) => v.color === item.color,
                        );
                        if (variant?.thumbnails?.[0]) {
                          imageSrc = variant.thumbnails[0];
                        }
                      }

                      let variantSoldCount = 0;
                      let variantStock = 0;
                      let sizeStock = 0;

                      if (item.color === product?.color) {
                        const variantSoldCountSum =
                          product?.variants?.reduce(
                            (acc: number, v: any) => acc + (v.soldCount || 0),
                            0,
                          ) || 0;
                        variantSoldCount = Math.max(
                          0,
                          (product?.soldCount || 0) - variantSoldCountSum,
                        );
                        variantStock =
                          product?.sizeStock?.reduce(
                            (sum: number, sizeObj: any) =>
                              sum + (Number(sizeObj.stock) || 0),
                            0,
                          ) || 0;
                        if (item.size) {
                          const sizeObj = product?.sizeStock?.find(
                            (s: any) => s.size === item.size,
                          );
                          sizeStock = sizeObj?.stock || 0;
                        }
                      } else if (item.color && product?.variants?.length) {
                        const variant = product.variants.find(
                          (v: any) => v.color === item.color,
                        );
                        if (variant) {
                          variantSoldCount = variant.soldCount || 0;
                          variantStock =
                            variant.sizes?.reduce(
                              (sum: number, sizeObj: any) =>
                                sum + (Number(sizeObj.stock) || 0),
                              0,
                            ) || 0;
                          if (item.size) {
                            const sizeObj = variant.sizes?.find(
                              (s: any) => s.size === item.size,
                            );
                            sizeStock = sizeObj?.stock || 0;
                          }
                        }
                      }

                      return (
                        <tr
                          key={index}
                          className="group hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <Link
                                href={`/admin/products/${product?._id}`}
                                className="bg-muted border-border/50 relative block h-12 w-12 shrink-0 overflow-hidden rounded-lg border"
                              >
                                <Image
                                  src={imageSrc}
                                  alt={product?.name || 'Product Deleted'}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </Link>
                              <div className="min-w-0">
                                <Link
                                  href={`/admin/products/${product?._id}`}
                                  className="text-foreground truncate text-sm font-bold transition-colors hover:text-blue-500"
                                >
                                  {product?.name || 'Product Deleted'}
                                </Link>
                                <div className="text-muted-foreground mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase">
                                  <span>{product?.category || 'N/A'}</span>
                                  {item.color && (
                                    <>
                                      <span>•</span>
                                      <Popover>
                                        <PopoverTrigger className="bg-muted text-foreground hover:bg-muted/80 cursor-pointer rounded px-1.5 py-0.5 font-black transition-colors">
                                          {item.color}
                                        </PopoverTrigger>
                                        <PopoverContent
                                          className="w-auto p-4"
                                          side="top"
                                        >
                                          <div className="space-y-2">
                                            <h4 className="mb-3 leading-none font-medium">
                                              Variant Details: {item.color}
                                            </h4>
                                            <div className="flex gap-4 text-sm">
                                              <div className="flex flex-col gap-1">
                                                <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                                                  Total Stock
                                                </span>
                                                <span className="font-medium">
                                                  {variantStock}
                                                </span>
                                              </div>
                                              <div className="flex flex-col gap-1">
                                                <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                                                  Total Sold
                                                </span>
                                                <span className="font-medium">
                                                  {variantSoldCount}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </PopoverContent>
                                      </Popover>
                                    </>
                                  )}
                                  {item.size && (
                                    <>
                                      <span>•</span>
                                      <Popover>
                                        <PopoverTrigger className="bg-muted text-foreground hover:bg-muted/80 cursor-pointer rounded px-1.5 py-0.5 font-black transition-colors">
                                          Size: {item.size}
                                        </PopoverTrigger>
                                        <PopoverContent
                                          className="w-auto p-4"
                                          side="top"
                                        >
                                          <div className="space-y-2">
                                            <h4 className="mb-3 leading-none font-medium">
                                              Size Details: {item.size}
                                            </h4>
                                            <div className="flex gap-4 text-sm">
                                              <div className="flex flex-col gap-1">
                                                <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                                                  Available Stock
                                                </span>
                                                <span className="font-medium">
                                                  {sizeStock}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </PopoverContent>
                                      </Popover>
                                    </>
                                  )}
                                </div>
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
                    <span className="font-bold text-blue-500">
                      ৳{(order.shippingCharge || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-border/40 flex items-center justify-between border-t pt-3">
                    <span className="text-sm font-black tracking-widest uppercase">
                      Grand Total
                    </span>
                    <span className="text-xl font-black tracking-tighter">
                      ৳{order.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── PRINT ONLY INVOICE COMPONENT ── */}
      <OrderPrint order={order} />
    </div>
  );
};

export default OrderDetailsView;
