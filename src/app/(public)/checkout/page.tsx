'use client';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, CreditCard, Home, MapPin, Phone, ShieldCheck, ShieldAlert, Truck } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getMe, updateUser } from '@/services/user/users';
import { createOrder } from '@/services/order/order';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { IUser, Role } from '@/types';
import Image from 'next/image';

const CheckoutPage = () => {
    const { cart, total, subtotal, discount, clearCart } = useCart();
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState<'COD' | 'CARD'>('COD');
    const [submitting, setSubmitting] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [addressInput, setAddressInput] = useState('');
    const [phoneInput, setPhoneInput] = useState('');

    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await getMe();
                if (data) {
                    setUser(data);
                    setAddressInput(data.address || '');
                    setPhoneInput(data.phone || '');
                } else {
                    router.push('/login?redirect=/checkout');
                }
            } catch (error) {
                router.push('/login?redirect=/checkout');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [router]);

    const handleUpdateAddress = async () => {
        if (!user?._id) return;
        try {
            const res = await updateUser(user._id, { address: addressInput, phone: phoneInput });
            if (res.success) {
                setUser({ ...user, address: addressInput, phone: phoneInput });
                setIsEditingAddress(false);
                toast.success('Shipping information updated');
            }
        } catch (error) {
            toast.error('Failed to update information');
        }
    };

    const handlePlaceOrder = async () => {
        // Double-check: admins cannot place orders
        if (user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN) {
            toast.error('Admin accounts cannot place orders.');
            return;
        }

        if (!user?.address || !user?.phone) {
            toast.error('Please provide shipping address and phone number');
            setIsEditingAddress(true);
            return;
        }

        setSubmitting(true);
        try {
            const orderPayload = {
                items: cart.map(item => ({
                    product: item._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalPrice: total,
                shippingAddress: user.address,
                paymentMethod
            };

            const res = await createOrder(orderPayload);
            if (res.success) {
                toast.success('Order placed successfully!');
                clearCart();
                router.push('/user/dashboard');
            } else {
                toast.error(res.message || 'Failed to place order');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (cart.length === 0) {
        router.push('/cart');
        return null;
    }

    // Block admin and super admin from placing orders
    const isAdmin = user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN;
    if (isAdmin) {
        return (
            <div className="min-h-screen bg-background pt-32 pb-24 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-lg w-full mx-4 text-center"
                >
                    {/* Icon */}
                    <div className="mx-auto mb-8 relative w-24 h-24">
                        <div className="absolute inset-0 rounded-full bg-amber-500/10 animate-ping" />
                        <div className="relative w-24 h-24 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center">
                            <ShieldAlert className="h-10 w-10 text-amber-500" />
                        </div>
                    </div>

                    {/* Message */}
                    <h1 className="text-3xl font-black tracking-tighter mb-3">
                        Admin Account <span className="text-amber-500">Detected</span>
                    </h1>
                    <p className="text-muted-foreground leading-relaxed mb-2">
                        You are logged in as <span className="font-bold text-foreground">{user?.role}</span>.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-8">
                        Admin and Super Admin accounts are <span className="font-bold text-amber-500">not permitted</span> to place orders on the platform. Please use a regular customer account to shop.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button asChild className="rounded-full px-8 bg-amber-500 hover:bg-amber-600 text-white font-bold">
                            <Link href="/admin">Go to Dashboard</Link>
                        </Button>
                        <Button asChild variant="outline" className="rounded-full px-8">
                            <Link href="/">Back to Homepage</Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-32 pb-24">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex items-center gap-4 mb-12">
                    <Button asChild variant="ghost" size="sm" className="rounded-full">
                        <Link href="/cart"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Bag</Link>
                    </Button>
                    <h1 className="text-4xl font-black text-foreground tracking-tighter">Finalize <span className="text-blue-600">Order</span></h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Shipping Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card/50 border border-border rounded-3xl p-8"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                                        <Truck size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold">Shipping Information</h2>
                                </div>
                                {!isEditingAddress && (
                                    <Button variant="link" onClick={() => setIsEditingAddress(true)} className="text-blue-500 font-bold">
                                        Edit
                                    </Button>
                                )}
                            </div>

                            {isEditingAddress ? (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Detailed Address</label>
                                        <textarea
                                            value={addressInput}
                                            onChange={(e) => setAddressInput(e.target.value)}
                                            placeholder="House #, Street, City, ZIP"
                                            className="w-full p-4 rounded-xl bg-muted/50 border border-border focus:border-blue-500/50 outline-none transition-all min-h-[100px]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Phone Number</label>
                                        <input
                                            type="text"
                                            value={phoneInput}
                                            onChange={(e) => setPhoneInput(e.target.value)}
                                            placeholder="+880 1XXX XXXXXX"
                                            className="w-full p-4 rounded-xl bg-muted/50 border border-border focus:border-blue-500/50 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <Button onClick={handleUpdateAddress} className="rounded-full px-8 bg-blue-600 hover:bg-blue-700">Save Information</Button>
                                        <Button variant="ghost" onClick={() => setIsEditingAddress(false)} className="rounded-full">Cancel</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                                        <MapPin className="text-blue-500 shrink-0" size={20} />
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Target Address</p>
                                            <p className="font-bold text-foreground leading-relaxed italic">{user?.address || "No address provided"}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                                        <Phone className="text-blue-500 shrink-0" size={20} />
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Callback Line</p>
                                            <p className="font-bold text-foreground leading-relaxed italic">{user?.phone || "No phone provided"}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.section>

                        {/* Payment Method Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-card/50 border border-border rounded-3xl p-8"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                                    <CreditCard size={20} />
                                </div>
                                <h2 className="text-xl font-bold">Select Payment Flow</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setPaymentMethod('COD')}
                                    className={`flex flex-col items-start gap-4 p-6 rounded-2xl border-2 transition-all ${paymentMethod === 'COD' ? 'border-blue-600 bg-blue-500/5' : 'border-border hover:border-blue-500/30 bg-muted/20'}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'COD' ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'}`}>
                                        <Home size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-foreground">Cash on Delivery</p>
                                        <p className="text-xs text-muted-foreground">Pay at your doorstep</p>
                                    </div>
                                    {paymentMethod === 'COD' && <CheckCircle2 className="absolute top-4 right-4 text-blue-600" size={20} />}
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('CARD')}
                                    className={`flex flex-col items-start gap-4 p-6 rounded-2xl border-2 transition-all opacity-50 cursor-not-allowed ${paymentMethod === 'CARD' ? 'border-blue-600 bg-blue-500/5' : 'border-border bg-muted/20'}`}
                                    disabled
                                >
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted text-muted-foreground">
                                        <CreditCard size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-foreground">Card Payment</p>
                                        <p className="text-xs text-muted-foreground italic underline">Coming Soon</p>
                                    </div>
                                </button>
                            </div>
                        </motion.section>

                        <div className="flex items-center gap-4 p-6 bg-blue-500/5 rounded-2xl border border-blue-500/20">
                            <ShieldCheck className="text-blue-500" size={24} />
                            <div>
                                <h4 className="font-bold text-sm">Protected Transaction</h4>
                                <p className="text-xs text-muted-foreground">Your order is secured by Lumiere's elite encryption protocols</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-card/50 border border-border rounded-3xl p-8 shadow-2xl shadow-blue-500/5"
                        >
                            <h3 className="text-2xl font-bold mb-8">Summary</h3>

                            <div className="space-y-4 mb-8">
                                {cart.map(item => (
                                    <div key={item._id} className="flex justify-between items-center py-3 border-b border-border/30 last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted relative">
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm leading-tight max-w-[150px] truncate">{item.name}</p>
                                                <p className="text-xs text-muted-foreground italic">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="flex justify-between text-muted-foreground text-sm">
                                    <span>Subtotal</span>
                                    <span className="text-foreground font-bold">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground text-sm">
                                    <span>Shipping</span>
                                    <span className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">Lumiere Prime Free</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-blue-500 text-sm font-bold">
                                        <span>Discount</span>
                                        <span>-${discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="h-px bg-border pt-2" />
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-xl font-black italic tracking-tighter">Total Due</span>
                                    <span className="text-3xl font-black text-foreground tracking-tighter">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handlePlaceOrder}
                                disabled={submitting}
                                className="w-full mt-10 rounded-full py-8 text-xl font-black bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                            >
                                {submitting ? "Authenticating Order..." : "Confirm & Place Order"}
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
