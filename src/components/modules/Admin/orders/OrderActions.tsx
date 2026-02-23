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
import useActionHandler from '@/hooks/useActionHandler';
import { IOrder, OrderStatus } from '@/services/order/order.types';
import { updateOrderStatus } from '@/services/order/order';
import { EllipsisIcon, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

const OrderActions = ({ order }: { order: IOrder }) => {
    const router = useRouter();
    const { executePost } = useActionHandler();

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

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex justify-end">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="shadow-none border border-white/10"
                        aria-label="Actions"
                    >
                        <EllipsisIcon size={16} aria-hidden="true" />
                    </Button>
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="min-w-48">
                <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.values(OrderStatus).map((status) => (
                    <DropdownMenuItem
                        key={status}
                        className="cursor-pointer flex items-center justify-between"
                        onClick={() => handleStatusUpdate(status)}
                        disabled={order.status === status}
                    >
                        <span>{status}</span>
                        {order.status === status && <RefreshCcw className="h-3 w-3 animate-spin text-primary" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default OrderActions;
