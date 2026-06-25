'use client';

import { Badge } from '@/components/ui/badge';
import { IOrder, PaymentStatus } from '@/services/order/order.types';
import { Download, FileText } from 'lucide-react';
import { useState } from 'react';
import UserOrderPrint from './UserOrderPrint';

interface Props {
  initialOrders: IOrder[];
}

const InvoicesContent = ({ initialOrders }: Props) => {
  const [selectedOrderForPrint, setSelectedOrderForPrint] =
    useState<IOrder | null>(null);

  const handlePrint = (order: IOrder) => {
    setSelectedOrderForPrint(order);
    // Use a small timeout to allow the DOM to update with the print component
    setTimeout(() => {
      window.print();
    }, 100);
  };

  if (!initialOrders || initialOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm dark:border-white/10 dark:bg-[#0a0a0a]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400">
          <FileText className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
          No Invoices Found
        </h3>
        <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
          You haven't made any orders yet. Once you do, your invoices will
          appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-[#0a0a0a]">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-white/10">
        <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          My Invoices
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-bold tracking-widest text-gray-500 uppercase dark:border-white/10 dark:text-gray-400">
              <th className="py-4 font-semibold">Invoice ID</th>
              <th className="py-4 font-semibold">Date</th>
              <th className="py-4 font-semibold">Amount</th>
              <th className="py-4 font-semibold">Payment Status</th>
              <th className="py-4 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/10">
            {initialOrders.map((order) => (
              <tr
                key={order._id}
                className="transition-colors hover:bg-gray-50/50 dark:hover:bg-white/5"
              >
                <td className="py-4">
                  <div className="font-bold text-blue-600 dark:text-blue-400">
                    #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
                  </div>
                </td>
                <td className="py-4 text-gray-600 dark:text-gray-300">
                  {new Date(order.createdAt || '').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="py-4 font-bold text-gray-900 dark:text-white">
                  ৳{(order.totalPrice + (order.shippingCharge || 0)).toFixed(2)}
                </td>
                <td className="py-4">
                  <Badge
                    variant="outline"
                    className={`border-0 ${
                      order.paymentStatus === PaymentStatus.PAID
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                    }`}
                  >
                    {order.paymentStatus}
                  </Badge>
                </td>
                <td className="py-4 text-right">
                  <button
                    onClick={() => handlePrint(order)}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                    title="Download / Print Invoice"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Render the print component if an order is selected */}
      {selectedOrderForPrint && (
        <UserOrderPrint order={selectedOrderForPrint} />
      )}
    </div>
  );
};

export default InvoicesContent;
