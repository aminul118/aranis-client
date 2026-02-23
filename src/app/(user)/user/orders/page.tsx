'use client';

import { useEffect, useState } from 'react';
import { getMyOrders } from '@/services/order/order';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Package,
    Truck,
    CheckCircle2,
    Clock,
    ShoppingBag,
    ArrowRight,
    MapPin,
    Calendar,
    Search,
    Star,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { OrderStatus } from '@/services/order/order.types';
import { IProduct } from '@/types';
import OrderStatusStepper from '@/components/modules/User/orders/OrderStatusStepper';
import WriteReviewModal from '@/components/modules/User/orders/WriteReviewModal';

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'Pending': return <Clock className="h-4 w-4" />;
        case 'Processing': return <Package className="h-4 w-4" />;
        case 'Shipped': return <Truck className="h-4 w-4" />;
        case 'Delivered': return <CheckCircle2 className="h-4 w-4" />;
        default: return <Clock className="h-4 w-4" />;
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        case 'Processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        case 'Shipped': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
        case 'Delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
        default: return 'bg-muted text-muted-foreground';
    }
};

const UserOrdersPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [reviewOrder, setReviewOrder] = useState<any | null>(null);

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

    const filteredOrders = orders.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item: any) => item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2">My <span className="text-blue-600">Orders</span></h1>
                        <p className="text-muted-foreground">Track your purchases and leave reviews</p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-muted/50 border border-border rounded-full py-3 pl-12 pr-6 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                        />
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="text-center py-24 bg-card/30 border border-dashed border-border rounded-3xl">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
                            <ShoppingBag size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No orders found</h3>
                        <p className="text-muted-foreground mb-8">You haven&apos;t placed any orders that match your search.</p>
                        <Button asChild className="rounded-full px-8 bg-blue-600 hover:bg-blue-700">
                            <Link href="/shop">Start Shopping <ArrowRight className="ml-2 h-4 w-4" /></Link>
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
                                        className="bg-card/50 border border-border rounded-3xl overflow-hidden group hover:border-blue-500/20 transition-all"
                                    >
                                        {/* Order Header */}
                                        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 bg-muted/20">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Order ID</p>
                                                    <Badge variant="outline" className="font-mono text-[10px] bg-background">
                                                        #{order._id.slice(-8).toUpperCase()}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2 text-foreground font-bold italic">
                                                    <Calendar className="h-4 w-4 text-blue-500" />
                                                    {format(new Date(order.createdAt), 'MMMM dd, yyyy')}
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4">
                                                <Badge className={`px-4 py-1.5 rounded-full border flex items-center gap-2 font-bold ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status}
                                                </Badge>
                                                <p className="text-2xl font-black text-foreground tracking-tighter">৳{order.totalPrice.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        <div className="p-6 md:p-8 space-y-6">
                                            {/* ── STATUS STEPPER ── */}
                                            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">
                                                    Order Progress
                                                </p>
                                                <OrderStatusStepper currentStatus={order.status as OrderStatus} />
                                            </div>

                                            {/* Items */}
                                            <div className="flex flex-col gap-4">
                                                {order.items.map((item: any, itemIdx: number) => (
                                                    <div key={item.product?._id || item._id || itemIdx} className="flex items-center gap-6">
                                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/50">
                                                            {item.product?.image ? (
                                                                <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">
                                                                    <ShoppingBag size={24} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-foreground truncate">
                                                                {item.product?.name || 'Product Unavailable'}
                                                            </h4>
                                                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                                                                Qty: {item.quantity} • ৳{item.price.toFixed(2)}
                                                            </p>
                                                        </div>
                                                        {item.product && (
                                                            <Button asChild size="sm" variant="ghost" className="rounded-full group/btn shrink-0">
                                                                <Link href={`/products/${(item.product as IProduct).slug || item.product._id}`}>
                                                                    View
                                                                </Link>
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Footer */}
                                            <div className="pt-6 border-t border-border/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="text-blue-500 h-5 w-5 shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Shipping To</p>
                                                        <p className="text-sm font-medium text-foreground max-w-sm">{order.shippingAddress}</p>
                                                    </div>
                                                </div>

                                                {/* Review button — only when delivered */}
                                                {isDelivered && (
                                                    <Button
                                                        onClick={() => setReviewOrder(order)}
                                                        className="rounded-full px-6 bg-amber-500 hover:bg-amber-600 text-white font-bold gap-2 shrink-0"
                                                    >
                                                        <Star className="h-4 w-4" />
                                                        Write a Review
                                                    </Button>
                                                )}
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
                items={reviewOrder
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
