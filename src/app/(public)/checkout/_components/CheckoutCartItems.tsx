'use client';

import Image from '@/components/common/SafeImage';

interface CartItem {
  _id?: string;
  name: string;
  thumbnails?: string[];
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  price: number;
  salePrice?: number;
}

interface CheckoutCartItemsProps {
  cart: CartItem[];
}

export default function CheckoutCartItems({ cart }: CheckoutCartItemsProps) {
  return (
    <div className="mb-8 space-y-4">
      {cart.map((item) => (
        <div
          key={`${item._id}_${item.selectedColor || ''}_${item.selectedSize || ''}`}
          className="group border-border/30 flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
        >
          <div className="flex items-center gap-4">
            <div className="bg-muted relative h-14 w-14 overflow-hidden rounded-xl">
              <Image
                src={item.thumbnails?.[0] || ''}
                alt={item.name}
                fill
                className="object-cover transition-transform group-hover:scale-110"
              />
            </div>
            <div className="space-y-1">
              <p className="max-w-[150px] truncate text-sm font-black tracking-tight">
                {item.name}
              </p>
              <div className="flex items-center gap-2">
                <span className="bg-muted/50 text-muted-foreground/60 rounded-md px-2 py-0.5 text-[10px] font-black uppercase">
                  Qty: {item.quantity}
                </span>
                {item.selectedSize && (
                  <span className="text-muted-foreground/40 text-[10px] font-bold">
                    Size: {item.selectedSize}
                  </span>
                )}
                {item.selectedColor && (
                  <span className="text-muted-foreground/40 text-[10px] font-bold">
                    Color: {item.selectedColor}
                  </span>
                )}
              </div>
            </div>
          </div>
          <p className="text-sm font-black">
            ৳
            {(
              (item.salePrice && item.salePrice > 0
                ? item.salePrice
                : item.price) * item.quantity
            ).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
