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
import {
  Ban,
  Check,
  CheckCircle2,
  Clock,
  EllipsisIcon,
  Eye,
  Loader2,
  Package,
  RefreshCcw,
  Truck,
  Undo2,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return <Clock size={14} className="mr-2 text-amber-500" />;
    case OrderStatus.PROCESSING:
      return <Loader2 size={14} className="mr-2 animate-spin text-blue-500" />;
    case OrderStatus.SHIPPED:
      return <Truck size={14} className="mr-2 text-purple-500" />;
    case OrderStatus.COURIER:
      return <Package size={14} className="mr-2 text-indigo-500" />;
    case OrderStatus.DELIVERED:
      return <CheckCircle2 size={14} className="mr-2 text-emerald-500" />;
    case OrderStatus.CANCELLED:
      return <XCircle size={14} className="mr-2 text-red-500" />;
    case OrderStatus.REJECTED:
      return <Ban size={14} className="mr-2 text-red-600" />;
    case OrderStatus.RETURNED:
      return <Undo2 size={14} className="mr-2 text-orange-500" />;
    default:
      return <Check size={14} className="mr-2 text-gray-500" />;
  }
};

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
          className="flex cursor-pointer items-center"
          onClick={() => router.push(`/admin/orders/${order._id}`)}
        >
          <Eye size={14} className="mr-2 text-blue-500" /> View Details
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
              <div className="flex items-center">
                {getStatusIcon(status)}
                <span>{status}</span>
              </div>
              {order.status === status && (
                <RefreshCcw className="text-primary ml-2 h-3 w-3 animate-spin" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrderActions;
