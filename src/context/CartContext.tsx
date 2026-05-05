'use client';

import { ICoupon } from '@/services/coupon/coupon';
import { ICartItem, IProduct } from '@/types';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface CartContextType {
  cart: ICartItem[];
  addToCart: (
    product: IProduct,
    selectedColor?: string,
    selectedSize?: string,
  ) => void;
  removeFromCart: (
    id: string,
    selectedColor?: string,
    selectedSize?: string,
  ) => void;
  updateQuantity: (
    id: string,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string,
  ) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  discountPercent: number;
  total: number;
  couponCode: string | null;
  applyCoupon: (coupon: ICoupon | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<ICartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('Aranis_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('Aranis_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (
    product: IProduct,
    selectedColor?: string,
    selectedSize?: string,
  ) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) =>
          item._id === product._id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize,
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prevCart,
        { ...product, quantity: 1, selectedColor, selectedSize },
      ];
    });
  };

  const removeFromCart = (
    id: string,
    selectedColor?: string,
    selectedSize?: string,
  ) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item._id === id &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          ),
      ),
    );
  };

  const updateQuantity = (
    id: string,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string,
  ) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode(null);
    setDiscountPercent(0);
  };

  const applyCoupon = (coupon: ICoupon | null) => {
    if (coupon) {
      setCouponCode(coupon.code);
      setDiscountPercent(coupon.discount);
    } else {
      setCouponCode(null);
      setDiscountPercent(0);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      (item.salePrice && item.salePrice > 0 ? item.salePrice : item.price) *
        item.quantity,
    0,
  );
  const discount = (subtotal * discountPercent) / 100;
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
        discountPercent,
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
