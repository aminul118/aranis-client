'use client';

import OrderStatusStepper from '@/components/modules/User/orders/OrderStatusStepper';
import WriteReviewModal from '@/components/modules/User/orders/WriteReviewModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/context/CartContext';
import { getMyOrders } from '@/services/order/order';
import { OrderStatus } from '@/services/order/order.types';
import { IProduct } from '@/types';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  RefreshCcw,
  Search,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

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

import OrderListSkeleton from './_components/OrderListSkeleton';

const UserOrdersPage = () => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewOrder, setReviewOrder] = useState<any | null>(null);

  const handleOrderAgain = (order: any) => {
    order.items.forEach((item: any) => {
      if (item.product) {
        addToCart({
          ...item.product,
          quantity: item.quantity,
        });
      }
    });
    toast.success('Items added to cart!');
    router.push('/cart');
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        if (res.success) setOrders(res.data || []);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item: any) =>
        item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  if (loading) {
    return (
      <div className="min-h-screen py-10">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-12 flex animate-pulse flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="space-y-4">
              <Skeleton className="h-12 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-12 w-full rounded-full md:w-80" />
          </div>
          <OrderListSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-foreground mb-2 text-4xl font-black tracking-tighter">
              My <span className="text-blue-600">Orders</span>
            </h1>
            <p className="text-muted-foreground">
              Track your purchases and leave reviews
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order ID or Product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-muted/50 border-border w-full rounded-full border py-3 pr-6 pl-12 text-sm transition-all focus:border-blue-500/50 focus:outline-none"
            />
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-card/30 border-border rounded-3xl border border-dashed py-24 text-center">
            <div className="bg-muted text-muted-foreground mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
              <ShoppingBag size={32} />
            </div>
            <h3 className="mb-2 text-xl font-bold">No orders found</h3>
            <p className="text-muted-foreground mb-8">
              You haven&apos;t placed any orders that match your search.
            </p>
            <Button
              asChild
              className="rounded-full bg-blue-600 px-8 hover:bg-blue-700"
            >
              <Link href="/shop">
                Start Shopping <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order, idx) => {
                const isDelivered = order.status === OrderStatus.DELIVERED;
                const reviewItems = order.items
                  .filter((item: any) => item.product)
                  .map((item: any) => ({
                    productId: item.product._id,
                    productName: item.product.name,
                    productImage: item.product.image,
                  }));

                return (
                  <motion.div
                    key={order._id}
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
                          className={`flex items-center gap-2 rounded-full border px-4 py-1.5 font-bold ${getStatusColor(order.status)}`}
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
                      {/* ── STATUS STEPPER ── */}
                      <div className="bg-muted/30 border-border/50 rounded-2xl border p-4">
                        <p className="text-muted-foreground mb-4 text-[10px] font-black tracking-widest uppercase">
                          Order Progress
                        </p>
                        <OrderStatusStepper
                          currentStatus={order.status as OrderStatus}
                        />
                      </div>

                      {/* Items */}
                      <div className="flex flex-col gap-4">
                        {order.items.map((item: any, itemIdx: number) => (
                          <div
                            key={item.product?._id || item._id || itemIdx}
                            className="flex items-center gap-6"
                          >
                            <div className="bg-muted border-border/50 relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border">
                              {item.product?.image ? (
                                <Image
                                  src={item.product.image}
                                  alt={item.product.name}
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
                                  href={`/products/${(item.product as IProduct).slug || item.product._id}`}
                                >
                                  View
                                </Link>
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
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
                            onClick={() => handleOrderAgain(order)}
                            variant="outline"
                            className="shrink-0 gap-2 rounded-full border-emerald-500/50 px-6 font-bold text-emerald-600 hover:bg-emerald-50"
                          >
                            <RefreshCcw className="h-4 w-4" />
                            Order Again
                          </Button>

                          {/* Review button — only when delivered */}
                          {isDelivered && (
                            <Button
                              onClick={() => setReviewOrder(order)}
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
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <WriteReviewModal
        open={!!reviewOrder}
        onClose={() => setReviewOrder(null)}
        items={
          reviewOrder
            ? reviewOrder.items
                .filter((item: any) => item.product)
                .map((item: any) => ({
                  productId: item.product._id,
                  productName: item.product.name,
                  productImage: item.product.image,
                }))
            : []
        }
      />
    </div>
  );
};

export default UserOrdersPage;
