'use client';

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
    ArrowLeft
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { IProduct } from '@/types';

const OrderDetailsView = ({ order }: { order: IOrder }) => {
    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.DELIVERED: return 'bg-green-500/10 text-green-500 border-green-500/20';
            case OrderStatus.PROCESSING: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case OrderStatus.SHIPPED: return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case OrderStatus.CANCELLED: return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
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
                        <Badge variant="outline" className={`${getStatusColor(order.status)} font-bold px-3 py-1 rounded-full border`}>
                            {order.status}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Calendar size={14} />
                        <span>Placed on {new Date(order.createdAt!).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(order.createdAt!).toLocaleTimeString('en-US', { timeStyle: 'short' })}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-full font-bold">Download Invoice</Button>
                    <Button className="rounded-full bg-blue-600 hover:bg-blue-700 font-bold">Print Receipt</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Customer Details */}
                <Card className="lg:col-span-1 border-border/40 shadow-xl shadow-black/5 bg-background/50 backdrop-blur-sm overflow-hidden group">
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
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Customer ID: {order.user?._id?.slice(-6)}</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border/40">
                            <div className="flex items-start gap-3">
                                <Mail className="text-muted-foreground mt-1" size={16} />
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-0.5">Email Address</p>
                                    <p className="text-sm font-medium truncate">{order.user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="text-muted-foreground mt-1" size={16} />
                                <div>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-0.5">Phone Number</p>
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
                                Ordered Products
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border/40 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            <th className="px-6 py-4 text-left">Product</th>
                                            <th className="px-6 py-4 text-center">Quantity</th>
                                            <th className="px-6 py-4 text-right">Price</th>
                                            <th className="px-6 py-4 text-right">Total</th>
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
                                                    <td className="px-6 py-4 text-center font-bold text-sm">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-sm">
                                                        ${item.price.toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-black text-blue-500 text-sm">
                                                        ${(item.quantity * item.price).toFixed(2)}
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
                                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Shipping Method</p>
                                            <p className="font-bold">Standard Delivery (Free)</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-bold">${order.totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span className="text-green-500 font-bold">FREE</span>
                                    </div>
                                    <div className="pt-3 border-t border-border/40 flex justify-between items-center">
                                        <span className="font-black uppercase tracking-widest text-sm">Grand Total</span>
                                        <span className="text-2xl font-black text-blue-500">${order.totalPrice.toFixed(2)}</span>
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
