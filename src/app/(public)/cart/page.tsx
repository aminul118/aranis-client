'use client';

import CartItem from '@/components/modules/Public/Cart/CartItem';
import CartSummary from '@/components/modules/Public/Cart/CartSummary';
import EmptyCart from '@/components/modules/Public/Cart/EmptyCart';
import { useCart } from '@/context/CartContext';
import { AnimatePresence } from 'framer-motion';

const CartPage = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    total,
    couponCode,
    applyCoupon,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="bg-background min-h-screen pt-32 pb-16">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4">
        <h1 className="text-foreground mb-12 flex items-center gap-4 text-4xl font-bold">
          Shopping Bag{' '}
          <span className="text-muted-foreground text-lg font-normal">
            ({cart.length} items)
          </span>
        </h1>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Cart Items List */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <CartSummary
            subtotal={subtotal}
            discount={discount}
            total={total}
            couponCode={couponCode}
            onApplyCoupon={applyCoupon}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
