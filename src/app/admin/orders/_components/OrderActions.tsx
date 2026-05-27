'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/context/UserContext';
import useActionHandler from '@/hooks/useActionHandler';
import { updateOrderStatus } from '@/services/order/order';
import { IOrder, OrderStatus } from '@/services/order/order.types';
import { Role } from '@/types';
import { EllipsisIcon, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

const OrderActions = ({ order }: { order: IOrder }) => {
  const router = useRouter();
  const { user } = useUser();
  const { executePost } = useActionHandler();

  const isSuperAdmin = user?.role === Role.SUPER_ADMIN;

  const handleStatusUpdate = async (status: OrderStatus) => {
    await executePost({
      action: () => updateOrderStatus(order._id as string, status),
      success: {
        onSuccess: () => {
          router.refresh();
        },
        loadingText: 'Updating status...',
        message: 'Order status updated successfully',
      },
    });
  };

  const sensitiveStatuses = [
    OrderStatus.REJECTED,
    OrderStatus.CANCELLED,
    OrderStatus.RETURNED,
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="border border-white/10 shadow-none"
            aria-label="Actions"
          >
            <EllipsisIcon size={16} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push(`/admin/orders/${order._id}`)}
        >
          View Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.values(OrderStatus).map((status) => {
          const isSensitive = sensitiveStatuses.includes(status);
          if (isSensitive && !isSuperAdmin) return null;

          return (
            <DropdownMenuItem
              key={status}
              className="flex cursor-pointer items-center justify-between"
              onClick={() => handleStatusUpdate(status)}
              disabled={order.status === status}
            >
              <span>{status}</span>
              {order.status === status && (
                <RefreshCcw className="text-primary h-3 w-3 animate-spin" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrderActions;
