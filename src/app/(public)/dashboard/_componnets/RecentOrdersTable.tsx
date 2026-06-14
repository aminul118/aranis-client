import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { IOrder } from '@/services/order/order.types';
import { format } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const RecentOrdersTable = ({ orders }: { orders: IOrder[] }) => {
  // Take only the top 3 most recent orders to show on dashboard home
  const recentOrders = orders?.slice(0, 3) || [];

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-bold text-slate-800 dark:text-slate-100">
        Recent Orders
      </h2>

      {recentOrders.length === 0 ? (
        <Card className="group relative overflow-hidden rounded-2xl border border-dashed border-gray-200 bg-white shadow-sm transition-all dark:border-white/10 dark:bg-black">
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <span className="text-2xl opacity-50">📦</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300">
              No recent orders
            </h3>
            <p className="mt-1 mb-4 text-sm text-slate-500">
              Looks like you haven't placed any orders yet.
            </p>
            <Link href="/shop">
              <Button>Start Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <Card
              key={order._id}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white pt-0 shadow-sm transition-all hover:border-blue-500/20 hover:shadow-md dark:border-white/10 dark:bg-black"
            >
              <CardHeader className="flex flex-col justify-between gap-4 border-b border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:px-6 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="flex flex-col">
                  <p>
                    {' '}
                    Invoice No:{' '}
                    <span className="text-lg font-bold text-slate-500">
                      {order.orderNumber || order._id}
                    </span>
                  </p>

                  <span className="mt-0.5 text-xs text-slate-400">
                    Order Date:{' '}
                    {order.createdAt
                      ? format(
                          new Date(order.createdAt),
                          'do MMMM yyyy, h:mm a',
                        )
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex w-full items-center justify-between gap-6 sm:w-auto sm:justify-end">
                  <div className="text-sm">
                    <span className="text-slate-500">Payment Status: </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Just show the first item as a summary preview like the screenshot */}
                {order.items && order.items[0] && (
                  <div className="flex items-center justify-between p-4 transition-colors hover:bg-slate-50 sm:p-6 dark:hover:bg-slate-900/20">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-slate-100 sm:h-20 sm:w-20 dark:bg-slate-800">
                        {typeof order.items[0].product !== 'string' &&
                        order.items[0].product?.thumbnails?.[0] ? (
                          <Image
                            src={order.items[0].product.thumbnails[0]}
                            alt={order.items[0].product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl opacity-20">
                            📦
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <h4 className="line-clamp-1 text-sm font-bold text-slate-800 uppercase sm:text-base dark:text-slate-100">
                          {typeof order.items[0].product !== 'string'
                            ? order.items[0].product?.name
                            : 'Product Item'}
                        </h4>
                        <div className="mt-1 text-xs text-slate-500 sm:text-sm">
                          {order.items[0].size &&
                            `Size : ${order.items[0].size}`}
                          {order.items[0].color && order.items[0].size && ', '}
                          {order.items[0].color &&
                            `Color : ${order.items[0].color}`}
                        </div>
                        <div className="mt-2 text-xs text-slate-400">
                          Seller Product SKU:{' '}
                          <span className="font-medium text-slate-600 dark:text-slate-300">
                            {typeof order.items[0].product !== 'string'
                              ? order.items[0].product?.sku
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4 sm:flex-row sm:items-center sm:gap-12">
                      <div className="text-sm whitespace-nowrap text-slate-600 dark:text-slate-300">
                        <span className="text-slate-400">
                          {order.items[0].quantity} X{' '}
                        </span>
                        <span className="font-bold">
                          ৳ {order.items[0].price}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="default"
                          className="border-transparent bg-emerald-500 text-white hover:bg-emerald-600"
                        >
                          {order.status || 'Delivered'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50"
                        >
                          <MessageCircle size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {order.items && order.items.length > 1 && (
                  <div className="border-t border-slate-100 bg-slate-50 p-2 text-center text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900/30">
                    + {order.items.length - 1} more items in this order
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentOrdersTable;
