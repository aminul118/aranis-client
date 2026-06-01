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
  updateSize: (
    id: string,
    newSize: string,
    selectedColor?: string,
    oldSize?: string,
  ) => void;
  updateColor: (
    id: string,
    newColor: string,
    selectedSize?: string,
    oldColor?: string,
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
          item._id === product._id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
            ? { ...item, quantity: Math.min(item.quantity + 1, 20) }
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
    const finalQuantity = Math.min(quantity, 20);
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
          ? { ...item, quantity: finalQuantity }
          : item,
      ),
    );
  };

  const updateSize = (
    id: string,
    newSize: string,
    selectedColor?: string,
    oldSize?: string,
  ) => {
    setCart((prevCart) => {
      const targetItem = prevCart.find(
        (item) =>
          item._id === id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === oldSize,
      );
      if (!targetItem) return prevCart;

      const existingItemWithNewSize = prevCart.find(
        (item) =>
          item._id === id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === newSize,
      );

      if (existingItemWithNewSize) {
        return prevCart
          .map((item) =>
            item._id === id &&
            item.selectedColor === selectedColor &&
            item.selectedSize === newSize
              ? { ...item, quantity: item.quantity + targetItem.quantity }
              : item,
          )
          .filter(
            (item) =>
              !(
                item._id === id &&
                item.selectedColor === selectedColor &&
                item.selectedSize === oldSize
              ),
          );
      } else {
        return prevCart.map((item) =>
          item._id === id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === oldSize
            ? { ...item, selectedSize: newSize }
            : item,
        );
      }
    });
  };

  const updateColor = (
    id: string,
    newColor: string,
    selectedSize?: string,
    oldColor?: string,
  ) => {
    setCart((prevCart) => {
      const targetItem = prevCart.find(
        (item) =>
          item._id === id &&
          item.selectedColor === oldColor &&
          item.selectedSize === selectedSize,
      );
      if (!targetItem) return prevCart;

      const existingItemWithNewColor = prevCart.find(
        (item) =>
          item._id === id &&
          item.selectedColor === newColor &&
          item.selectedSize === selectedSize,
      );

      let updatedThumbnails = targetItem.thumbnails;
      if (newColor !== targetItem.color && targetItem.variants) {
        const matchingVariant = targetItem.variants.find(
          (v) => v.color === newColor,
        );
        if (
          matchingVariant &&
          matchingVariant.thumbnails &&
          matchingVariant.thumbnails.length > 0
        ) {
          updatedThumbnails = matchingVariant.thumbnails;
        }
      }

      if (existingItemWithNewColor) {
        return prevCart
          .map((item) =>
            item._id === id &&
            item.selectedColor === newColor &&
            item.selectedSize === selectedSize
              ? { ...item, quantity: item.quantity + targetItem.quantity }
              : item,
          )
          .filter(
            (item) =>
              !(
                item._id === id &&
                item.selectedColor === oldColor &&
                item.selectedSize === selectedSize
              ),
          );
      } else {
        return prevCart.map((item) =>
          item._id === id &&
          item.selectedColor === oldColor &&
          item.selectedSize === selectedSize
            ? {
                ...item,
                selectedColor: newColor,
                thumbnails: updatedThumbnails,
              }
            : item,
        );
      }
    });
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
        updateSize,
        updateColor,
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

export const useCartOptional = () => {
  return useContext(CartContext);
};
