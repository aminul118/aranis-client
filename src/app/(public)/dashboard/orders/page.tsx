'use client';

import WriteReviewModal from '@/app/(public)/dashboard/orders/_components/WriteReviewModal';
import AppSearching from '@/components/common/searching/AppSearching';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCartOptional } from '@/context/CartContext';
import { getMyOrders } from '@/services/order/order';
import { AnimatePresence } from 'framer-motion';
import { ArrowRight, Package, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { logger } from '../../../../lib/logger';
import OrderCard from './_components/OrderCard';
import OrderListSkeleton from './_components/OrderListSkeleton';

const UserOrdersPage = () => {
  const router = useRouter();
  const cartContext = useCartOptional();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  const [reviewOrder, setReviewOrder] = useState<any | null>(null);

  const handleOrderAgain = (order: any) => {
    let addedCount = 0;
    order.items.forEach((item: any) => {
      if (
        item.product &&
        cartContext &&
        !item.product.isDeleted &&
        (item.product.stock ?? 0) > 0
      ) {
        cartContext.addToCart(item.product, item.color, item.size);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      toast.success(`${addedCount} available item(s) added to cart!`);
      router.push('/cart');
    } else {
      toast.error('No items available to reorder');
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        if (res.success) setOrders(res.data || []);
      } catch (error) {
        logger.error('Failed to fetch orders', error);
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

  const reviewItems = reviewOrder
    ? (Array.from(
        new Map(
          reviewOrder.items
            .filter((item: any) => item.product)
            .map((item: any) => [
              item.product._id,
              {
                productId: item.product._id,
                productName: item.product.name,
                productImage: item.product.thumbnails?.[0] || '',
              },
            ]),
        ).values(),
      ) as any[])
    : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-6 flex animate-pulse flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-full rounded-lg md:w-80" />
        </div>
        <OrderListSkeleton />
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full flex-col gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-[#0a0a0a]">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-100 pb-4 md:flex-row md:items-center dark:border-white/10">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              My Orders
            </h2>
          </div>
          <div className="relative w-full md:w-80">
            <AppSearching
              placeholder="Search by Order ID or Product..."
              className="w-full"
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
              {filteredOrders.map((order, idx) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  idx={idx}
                  onOrderAgain={handleOrderAgain}
                  onWriteReview={setReviewOrder}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <WriteReviewModal
        open={!!reviewOrder}
        onClose={() => setReviewOrder(null)}
        items={reviewItems}
      />
    </>
  );
};
export default UserOrdersPage;
