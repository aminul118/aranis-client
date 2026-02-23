'use client';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Tag, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';

const CartPage = () => {
    const {
        cart,
        removeFromCart,
        updateQuantity,
        subtotal,
        discount,
        total,
        couponCode,
        applyCoupon
    } = useCart();

    const [couponInput, setCouponInput] = useState('');

    const handleApplyCoupon = () => {
        if (couponInput.toUpperCase() === 'LUMIERE10') {
            applyCoupon(couponInput);
            toast.success('10% Discount Applied!');
            setCouponInput('');
        } else {
            toast.error('Invalid Coupon Code');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-background pt-32 pb-16 flex flex-col items-center justify-center text-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card/50 p-12 rounded-3xl border border-border flex flex-col items-center max-w-md w-full"
                >
                    <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 text-blue-500">
                        <ShoppingBag size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-4">Your bag is empty</h1>
                    <p className="text-muted-foreground mb-8 leading-relaxed">
                        Looks like you haven't added anything to your bag yet.
                        Start exploring our latest collections to find your signature style.
                    </p>
                    <Button asChild size="lg" className="rounded-full px-8 py-6 font-bold bg-blue-600 hover:bg-blue-700">
                        <Link href="/">Shop Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-32 pb-24">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-foreground mb-12 flex items-center gap-4">
                    Shopping Bag <span className="text-muted-foreground text-lg font-normal">({cart.length} items)</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <AnimatePresence mode="popLayout">
                            {cart.map((item) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex flex-col sm:flex-row gap-6 p-6 bg-card/50 border border-border rounded-3xl group hover:border-blue-500/20 transition-colors"
                                >
                                    <div className="relative w-full sm:w-32 aspect-square rounded-2xl overflow-hidden bg-muted shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between pt-2 pb-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-blue-500 transition-colors">
                                                    {item.name}
                                                </h3>
                                                <p className="text-muted-foreground text-sm mb-4">{item.category}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="text-muted-foreground hover:text-red-500 transition-colors p-2"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-4 bg-muted/50 rounded-full border border-border p-1">
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-foreground font-bold text-sm w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <p className="text-xl font-bold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:sticky lg:top-32 flex flex-col gap-6">
                        <div className="bg-card/50 border border-border rounded-3xl p-8">
                            <h2 className="text-2xl font-bold text-foreground mb-6">Summary</h2>

                            <div className="flex flex-col gap-4 mb-8">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span className="text-foreground font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Shipping</span>
                                    <span className="text-emerald-500 font-medium">Free</span>
                                </div>

                                {couponCode && (
                                    <div className="flex justify-between text-muted-foreground items-center">
                                        <div className="flex items-center gap-2">
                                            <Tag size={14} className="text-blue-500" />
                                            <span>Discount (10%)</span>
                                        </div>
                                        <span className="text-blue-500 font-medium">-${discount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="h-px bg-border my-2" />

                                <div className="flex justify-between text-foreground text-xl font-bold">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Coupon Section */}
                            <div className="mb-8">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 font-semibold">Promotion Code</p>
                                {couponCode ? (
                                    <div className="flex items-center justify-between bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3 text-blue-500 text-sm font-bold">
                                        <span className="flex items-center gap-2"><Tag size={14} /> {couponCode}</span>
                                        <button onClick={() => applyCoupon('')} className="text-blue-500/50 hover:text-blue-500"><X size={16} /></button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="LOUMIERE10"
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value)}
                                            className="bg-muted border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-blue-500/50 flex-1 transition-colors"
                                        />
                                        <Button
                                            onClick={handleApplyCoupon}
                                            className="rounded-xl px-6 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold"
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <Button asChild className="w-full rounded-full py-7 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl transition-all">
                                <Link href="/checkout">
                                    Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>

                        <div className="text-center px-4">
                            <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                                Secure Payment Guaranteed
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
