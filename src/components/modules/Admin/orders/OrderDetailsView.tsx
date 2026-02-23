'use client';

import { useState } from 'react';
import { IOrder, OrderStatus } from '@/services/order/order.types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Calendar,
    CreditCard,
    Mail,
    MapPin,
    Package,
    Phone,
    User,
    ShoppingBag,
    ArrowLeft,
    ChevronDown,
    Loader2,
    CheckCircle2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { IProduct } from '@/types';
import { updateOrderStatus } from '@/services/order/order';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<OrderStatus, { color: string; bg: string; label: string }> = {
    [OrderStatus.PENDING]: { color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20', label: 'Pending' },
    [OrderStatus.PROCESSING]: { color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Processing' },
    [OrderStatus.SHIPPED]: { color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20', label: 'Shipped' },
    [OrderStatus.DELIVERED]: { color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Delivered' },
    [OrderStatus.CANCELLED]: { color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20', label: 'Cancelled' },
};

const ALL_STATUSES = [
    OrderStatus.PENDING,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPED,
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
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2 text-muted-foreground hover:text-foreground group">
                        <Link href="/admin/orders">
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Orders
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black tracking-tight text-foreground">
                            Order <span className="text-blue-500">#{order._id?.slice(-6).toUpperCase()}</span>
                        </h1>
                        <Badge variant="outline" className={`${cfg.bg} ${cfg.color} font-bold px-3 py-1 rounded-full border`}>
                            {currentStatus}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Calendar size={14} />
                        <span>Placed on {new Date(order.createdAt!).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(order.createdAt!).toLocaleTimeString('en-US', { timeStyle: 'short' })}</span>
                    </div>
                </div>
                <Button variant="outline" className="rounded-full font-bold self-start md:self-auto">Download Invoice</Button>
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
                    <p className="text-sm text-muted-foreground mb-4">
                        Current status: <span className={cn('font-bold', cfg.color)}>{currentStatus}</span>
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
                                        'flex items-center gap-2 px-4 py-2 rounded-full border font-bold text-sm transition-all',
                                        isActive
                                            ? `${sCfg.bg} ${sCfg.color} cursor-default`
                                            : 'border-border bg-background hover:border-blue-500/30 hover:bg-muted/60 text-muted-foreground hover:text-foreground',
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
                        <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
                            <Loader2 size={14} className="animate-spin" /> Updating status...
                        </p>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Customer Details */}
                <Card className="lg:col-span-1 border-border/40 shadow-xl shadow-black/5 bg-background/50 backdrop-blur-sm overflow-hidden group relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 group-hover:w-2 transition-all" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <User className="text-blue-500" size={18} />
                            Customer Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-foreground">{order.user?.fullName}</h3>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                                    ID: {order.user?._id?.slice(-6)}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border/40">
                            <div className="flex items-start gap-3">
                                <Mail className="text-muted-foreground mt-1" size={16} />
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-0.5">Email</p>
                                    <p className="text-sm font-medium truncate">{order.user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="text-muted-foreground mt-1" size={16} />
                                <div>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-0.5">Phone</p>
                                    <p className="text-sm font-medium">{order.user?.phone || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="text-blue-500 mt-1 shrink-0" size={16} />
                                <div>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-0.5">Shipping Address</p>
                                    <p className="text-sm font-bold leading-relaxed">{order.shippingAddress}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Order Summary & Items */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Items List */}
                    <Card className="border-border/40 shadow-xl shadow-black/5 bg-background/50 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="border-b border-border/40 bg-muted/20">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ShoppingBag className="text-blue-500" size={18} />
                                Ordered Products ({order.items.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border/40 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            <th className="px-6 py-4 text-left">Product</th>
                                            <th className="px-6 py-4 text-center">Qty</th>
                                            <th className="px-6 py-4 text-right">Unit Price</th>
                                            <th className="px-6 py-4 text-right">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {order.items.map((item, index) => {
                                            const product = item.product as IProduct;
                                            return (
                                                <tr key={index} className="group hover:bg-muted/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted border border-border/50 shrink-0">
                                                                <Image
                                                                    src={product.image}
                                                                    alt={product.name}
                                                                    fill
                                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                                />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-bold text-foreground text-sm truncate">{product.name}</p>
                                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{product.category}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-bold text-sm">{item.quantity}</td>
                                                    <td className="px-6 py-4 text-right text-sm">৳{item.price.toFixed(2)}</td>
                                                    <td className="px-6 py-4 text-right font-black text-blue-500 text-sm">
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
                    <Card className="border-border/40 shadow-xl shadow-black/5 bg-background border-t-4 border-t-blue-500">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                            <CreditCard size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Payment Method</p>
                                            <p className="font-bold">{order.paymentMethod || 'Cash on Delivery'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Shipping</p>
                                            <p className="font-bold">Standard (Free)</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-bold">৳{order.totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span className="text-green-500 font-bold">FREE</span>
                                    </div>
                                    <div className="pt-3 border-t border-border/40 flex justify-between items-center">
                                        <span className="font-black uppercase tracking-widest text-sm">Grand Total</span>
                                        <span className="text-2xl font-black text-blue-500">৳{order.totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsView;
