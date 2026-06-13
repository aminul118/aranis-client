'use client';

import { useUser } from '@/context/UserContext';
import {
  addToCartService,
  clearCartService,
  getMyCart,
  removeFromCartService,
  updateCartColorService,
  updateCartQuantityService,
  updateCartSizeService,
} from '@/services/cart/cart';
import { ICoupon } from '@/services/coupon/coupon';
import { getProducts } from '@/services/product/product';
import { ICartItem, IProduct } from '@/types';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { logger } from '../lib/logger';

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

const GUEST_CART_KEY = 'aranis_guest_cart';
const OLD_CART_KEY = 'Aranis_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const [cart, setCart] = useState<ICartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  const fetchServerCart = async () => {
    if (!user) return;
    try {
      const res = await getMyCart();
      if (res?.success && res.data) {
        const mappedCart: ICartItem[] = res.data
          .filter((item: any) => item && item.product)
          .map((item: any) => ({
            ...item.product,
            _id: item.product._id, // use product id as the main _id for frontend mapping
            cartItemId: item._id, // store backend cart doc id
            quantity: item.quantity,
            selectedColor: item.selectedColor,
            selectedSize: item.selectedSize,
            stock: item.product.stock,
          }));
        setCart(mappedCart);
      } else {
        setCart([]);
      }
    } catch (error) {
      logger.error('Failed to fetch server cart', error);
      setCart([]);
    }
  };

  const syncCart = async (localItems: ICartItem[]) => {
    try {
      const res = await getMyCart();
      const serverItems = res?.data || [];
      const serverIdentifiers = new Set(
        serverItems
          .filter((item: any) => item && item.product)
          .map(
            (item: any) =>
              `${item.product._id}-${item.selectedColor || ''}-${item.selectedSize || ''}`,
          ),
      );

      for (const item of localItems) {
        if (item && item._id) {
          const identifier = `${item._id}-${item.selectedColor || ''}-${item.selectedSize || ''}`;
          if (!serverIdentifiers.has(identifier)) {
            await addToCartService({
              product: item._id,
              quantity: item.quantity,
              selectedColor: item.selectedColor,
              selectedSize: item.selectedSize,
            });
          }
        }
      }
      localStorage.removeItem(GUEST_CART_KEY);
      localStorage.removeItem(OLD_CART_KEY);
      await fetchServerCart();
      toast.success('Your cart has been synced!');
    } catch (error) {
      logger.error('Failed to sync cart', error);
      localStorage.removeItem(GUEST_CART_KEY);
      localStorage.removeItem(OLD_CART_KEY);
      await fetchServerCart();
    }
  };

  useEffect(() => {
    // Migration for old cart key
    const oldCartData = localStorage.getItem(OLD_CART_KEY);
    if (oldCartData) {
      localStorage.setItem(GUEST_CART_KEY, oldCartData);
      localStorage.removeItem(OLD_CART_KEY);
    }

    if (user) {
      const localData = localStorage.getItem(GUEST_CART_KEY);
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          const localItems = (Array.isArray(parsed) ? parsed : []).filter(
            (item) => item && item._id,
          );
          if (localItems.length > 0) {
            syncCart(localItems);
          } else {
            fetchServerCart();
          }
        } catch {
          fetchServerCart();
        }
      } else {
        fetchServerCart();
      }
    } else {
      const localData = localStorage.getItem(GUEST_CART_KEY);
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          setCart(Array.isArray(parsed) ? parsed : []);
        } catch {
          setCart([]);
        }
      } else {
        setCart([]);
      }
    }
  }, [user]);

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
            if (!item.isStockOut) {
              hasChanges = true;
              return { ...item, isStockOut: true };
            }
            return item;
          }

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
            }
          } else if (item.selectedSize) {
            const sizeObj = liveProduct.sizeStock?.find(
              (s) => s.size === item.selectedSize,
            );
            currentStock = sizeObj ? sizeObj.stock : liveProduct.stock;
          }

          const isStockOut = currentStock < 1;

          if (
            item.isStockOut !== isStockOut ||
            item.price !== liveProduct.price ||
            item.salePrice !== liveProduct.salePrice ||
            item.stock !== currentStock
          ) {
            hasChanges = true;
            return {
              ...item,
              isStockOut,
              price: liveProduct.price,
              salePrice: liveProduct.salePrice,
              stock: currentStock,
              variants: liveProduct.variants,
              sizeStock: liveProduct.sizeStock,
            };
          }

          return item;
        });

        return hasChanges ? newCart : prevCart;
      });
    } catch (error) {
      logger.error('Failed to validate cart stock:', error);
    }
  };

  useEffect(() => {
    if (cart.length > 0) {
      validateCartStock();
    }
  }, [cart.length]);

  const addToCart = async (
    product: IProduct,
    selectedColor?: string,
    selectedSize?: string,
  ) => {
    let initialStock = product.stock;
    if (selectedColor) {
      const variant = product.variants?.find((v) => v.color === selectedColor);
      if (variant && selectedSize) {
        const sizeObj = variant.sizes?.find((s) => s.size === selectedSize);
        initialStock = sizeObj ? sizeObj.stock : 0;
      }
    } else if (selectedSize) {
      const sizeObj = product.sizeStock?.find((s) => s.size === selectedSize);
      initialStock = sizeObj ? sizeObj.stock : product.stock;
    }

    const existingItem = cart.find(
      (item) =>
        item._id === product._id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize,
    );

    const originalCart = [...cart];
    let newQuantity = 1;
    let newCartForGuest: ICartItem[] = [];

    if (existingItem) {
      newQuantity = existingItem.quantity + 1;
      if (newQuantity > existingItem.stock) {
        toast.error(`Only ${existingItem.stock} left in stock!`);
        return;
      }
      newCartForGuest = cart.map((item) =>
        item._id === product._id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
          ? { ...item, quantity: Math.min(newQuantity, 20) }
          : item,
      );
      setCart(newCartForGuest);
    } else {
      newCartForGuest = [
        ...cart,
        {
          ...product,
          quantity: 1,
          selectedColor,
          selectedSize,
          stock: initialStock,
        },
      ];
      setCart(newCartForGuest);
    }

    if (!user) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCartForGuest));
    } else {
      try {
        const res = await addToCartService({
          product: product._id as string,
          quantity: 1,
          selectedColor,
          selectedSize,
        });
        if (!res.success) {
          setCart(originalCart);
          toast.error(res.message || 'Failed to add to cart');
        } else {
          // Re-fetch to get correct cartItemId
          if (!existingItem) {
            fetchServerCart();
          }
        }
      } catch (error) {
        setCart(originalCart);
        toast.error('Something went wrong adding to cart');
      }
    }
  };

  const removeFromCart = async (
    id: string,
    selectedColor?: string,
    selectedSize?: string,
  ) => {
    const targetItem = cart.find(
      (item) =>
        item._id === id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize,
    );

    const originalCart = [...cart];
    const newCart = cart.filter(
      (item) =>
        !(
          item._id === id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
        ),
    );
    setCart(newCart);

    if (!user) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart));
    } else if (targetItem?.cartItemId) {
      try {
        const res = await removeFromCartService(targetItem.cartItemId);
        if (!res.success) {
          setCart(originalCart);
          toast.error('Failed to remove item');
        }
      } catch (error) {
        setCart(originalCart);
        toast.error('Something went wrong');
      }
    }
  };

  const updateQuantity = async (
    id: string,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string,
  ) => {
    if (quantity < 1) return;
    const originalCart = [...cart];
    const targetItem = cart.find(
      (item) =>
        item._id === id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize,
    );

    if (targetItem && quantity > targetItem.stock) {
      toast.error(`Only ${targetItem.stock} left in stock!`);
      return;
    }

    const newCart = cart.map((item) =>
      item._id === id &&
      item.selectedColor === selectedColor &&
      item.selectedSize === selectedSize
        ? { ...item, quantity }
        : item,
    );
    setCart(newCart);

    if (!user) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart));
    } else if (targetItem?.cartItemId) {
      try {
        const res = await updateCartQuantityService(
          targetItem.cartItemId,
          quantity,
        );
        if (!res.success) {
          setCart(originalCart);
          toast.error('Failed to update quantity');
        }
      } catch (error) {
        setCart(originalCart);
        toast.error('Something went wrong');
      }
    }
  };

  const updateSize = async (
    id: string,
    newSize: string,
    selectedColor?: string,
    oldSize?: string,
  ) => {
    const targetItem = cart.find(
      (item) =>
        item._id === id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === oldSize,
    );
    if (!targetItem) return;

    const existingItemWithNewSize = cart.find(
      (item) =>
        item._id === id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === newSize,
    );

    const originalCart = [...cart];
    let newCart = [...cart];

    if (existingItemWithNewSize) {
      newCart = cart
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
      newCart = cart.map((item) =>
        item._id === id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === oldSize
          ? { ...item, selectedSize: newSize }
          : item,
      );
    }

    setCart(newCart);

    if (!user) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart));
    } else if (targetItem.cartItemId) {
      try {
        const res = await updateCartSizeService(targetItem.cartItemId, newSize);
        if (!res.success) {
          setCart(originalCart);
          toast.error('Failed to update size');
        } else {
          // Re-fetch to merge ids if needed
          if (existingItemWithNewSize) {
            fetchServerCart();
          }
        }
      } catch (error) {
        setCart(originalCart);
        toast.error('Something went wrong');
      }
    }
  };

  const updateColor = async (
    id: string,
    newColor: string,
    selectedSize?: string,
    oldColor?: string,
  ) => {
    const targetItem = cart.find(
      (item) =>
        item._id === id &&
        item.selectedColor === oldColor &&
        item.selectedSize === selectedSize,
    );
    if (!targetItem) return;

    const existingItemWithNewColor = cart.find(
      (item) =>
        item._id === id &&
        item.selectedColor === newColor &&
        item.selectedSize === selectedSize,
    );

    const originalCart = [...cart];
    let newCart = [...cart];

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
      newCart = cart
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
      newCart = cart.map((item) =>
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

    setCart(newCart);

    if (!user) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart));
    } else if (targetItem.cartItemId) {
      try {
        const res = await updateCartColorService(
          targetItem.cartItemId,
          newColor,
        );
        if (!res.success) {
          setCart(originalCart);
          toast.error('Failed to update color');
        } else {
          // Re-fetch to merge ids if needed
          if (existingItemWithNewColor) {
            fetchServerCart();
          }
        }
      } catch (error) {
        setCart(originalCart);
        toast.error('Something went wrong');
      }
    }
  };

  const clearCart = async () => {
    const originalCart = [...cart];
    setCart([]);
    setCouponCode(null);
    setDiscountPercent(0);

    if (!user) {
      localStorage.removeItem(GUEST_CART_KEY);
    } else {
      try {
        const res = await clearCartService();
        if (!res.success) {
          setCart(originalCart);
          toast.error('Failed to clear cart');
        }
      } catch (error) {
        setCart(originalCart);
        toast.error('Something went wrong');
      }
    }
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
