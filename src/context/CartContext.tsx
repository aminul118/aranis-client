'use client';

import { ICoupon } from '@/services/coupon/coupon';
import { getProducts } from '@/services/product/product';
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
  validateCartStock: () => Promise<void>;
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

  const validateCartStock = async () => {
    if (cart.length === 0) return;

    try {
      const productIds = Array.from(new Set(cart.map((item) => item._id)));
      const idsQuery = productIds.join(',');

      const response = await getProducts({ _id: idsQuery, limit: '100' });
      const latestProducts = response.data || [];

      setCart((prevCart) => {
        let hasChanges = false;
        const newCart = prevCart.map((item) => {
          const liveProduct = latestProducts.find((p) => p._id === item._id);

          if (!liveProduct) {
            // Product might have been deleted
            if (!item.isStockOut) {
              hasChanges = true;
              return { ...item, isStockOut: true };
            }
            return item;
          }

          // Check variant and size stock
          let currentStock = liveProduct.stock;

          if (item.selectedColor) {
            const variant = liveProduct.variants?.find(
              (v) => v.color === item.selectedColor,
            );
            if (variant && item.selectedSize) {
              const sizeObj = variant.sizes?.find(
                (s) => s.size === item.selectedSize,
              );
              currentStock = sizeObj ? sizeObj.stock : 0;
            } else if (variant) {
              // Assuming variant stock is sum of sizes if sizes exist, else we can't easily tell. Fallback to global.
            }
          } else if (item.selectedSize) {
            const sizeObj = liveProduct.sizeStock?.find(
              (s) => s.size === item.selectedSize,
            );
            currentStock = sizeObj ? sizeObj.stock : liveProduct.stock;
          }

          const isStockOut = currentStock < 1 || currentStock < item.quantity;

          if (
            item.isStockOut !== isStockOut ||
            item.price !== liveProduct.price ||
            item.salePrice !== liveProduct.salePrice
          ) {
            hasChanges = true;
            return {
              ...item,
              isStockOut,
              price: liveProduct.price,
              salePrice: liveProduct.salePrice,
              stock: liveProduct.stock,
              variants: liveProduct.variants,
              sizeStock: liveProduct.sizeStock,
            };
          }

          return item;
        });

        return hasChanges ? newCart : prevCart;
      });
    } catch (error) {
      console.error('Failed to validate cart stock:', error);
    }
  };

  // Run validation when cart mounts or changes (debounced by doing it in a separate effect that watches just the length to avoid infinite loops if cart updates self)
  useEffect(() => {
    if (cart.length > 0) {
      validateCartStock();
    }
  }, [cart.length]);

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
        validateCartStock,
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
