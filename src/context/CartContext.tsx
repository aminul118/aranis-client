'use client';

import { ICartItem, IProduct } from '@/types';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface CartContextType {
    cart: ICartItem[];
    addToCart: (product: IProduct) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    subtotal: number;
    discount: number;
    total: number;
    couponCode: string | null;
    applyCoupon: (code: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<ICartItem[]>([]);
    const [couponCode, setCouponCode] = useState<string | null>(null);

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('lumiere_cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage
    useEffect(() => {
        localStorage.setItem('lumiere_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: IProduct) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item._id === product._id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart((prevCart) => prevCart.filter((item) => item._id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return;
        setCart((prevCart) =>
            prevCart.map((item) => (item._id === id ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => {
        setCart([]);
        setCouponCode(null);
    };

    const applyCoupon = (code: string) => {
        if (code.toUpperCase() === 'LUMIERE10') {
            setCouponCode('LUMIERE10');
        } else {
            setCouponCode(null);
        }
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = couponCode === 'LUMIERE10' ? subtotal * 0.1 : 0;
    const total = subtotal - discount;

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                subtotal,
                discount,
                total,
                couponCode,
                applyCoupon,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
