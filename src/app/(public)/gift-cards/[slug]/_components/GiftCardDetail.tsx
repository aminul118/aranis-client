'use client';

import HtmlContent from '@/components/rich-text/core/html-content';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { IGiftCard } from '@/services/giftcard/giftcard';
import { IProduct } from '@/types';
import { CheckCircle, Clock } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function GiftCardDetail({ giftCard }: { giftCard: IGiftCard }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const salePrice =
    giftCard.discountPercentage > 0
      ? giftCard.price * (1 - giftCard.discountPercentage / 100)
      : giftCard.price;

  const handleAddToCart = (redirect: boolean = false) => {
    setIsAdding(true);

    const mappedProduct: IProduct = {
      _id: giftCard._id,
      name: giftCard.name,
      category: 'Gift Card',
      subCategory: '',
      type: 'giftcard',
      price: giftCard.price,
      thumbnails: [giftCard.image],
      description: giftCard.description,
      details: giftCard.description,
      color: '',
      sizes: [],
      featured: false,
      slug: `giftcard-${giftCard._id}`,
      stock: 1000,
      buyPrice: giftCard.price,
      salePrice: salePrice,
      discountPercentage: giftCard.discountPercentage,
      isOffer: giftCard.discountPercentage > 0,
      itemType: 'GiftCard' as any,
      seo: {
        title: giftCard.name,
        description: '',
        keywords: '',
      },
    } as unknown as IProduct;

    addToCart(mappedProduct);

    if (redirect) {
      router.push('/checkout');
    } else {
      toast.success('Gift Card added to cart');
      setIsAdding(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
      {/* Image Section */}
      <div className="bg-card relative aspect-[4/3] w-full overflow-hidden rounded-3xl border shadow-2xl">
        <Image
          src={giftCard.image}
          alt={giftCard.name}
          fill
          className="object-cover"
          priority
        />
        {giftCard.discountPercentage > 0 && (
          <div className="absolute top-6 left-6 rounded-full bg-red-500 px-4 py-2 text-sm font-black tracking-widest text-white">
            SAVE {giftCard.discountPercentage}%
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="flex flex-col justify-center space-y-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter md:text-5xl">
            {giftCard.name}
          </h1>
          <div className="mt-4 flex items-baseline gap-4">
            <span className="text-5xl font-black text-blue-600">
              ৳{salePrice.toFixed(2)}
            </span>
            {giftCard.discountPercentage > 0 && (
              <span className="text-muted-foreground text-xl font-bold line-through">
                ৳{giftCard.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <div className="prose prose-sm dark:prose-invert">
          <HtmlContent
            content={giftCard.description}
            className="text-muted-foreground text-lg leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 rounded-2xl border p-4">
            <CheckCircle className="text-emerald-500" size={24} />
            <div>
              <p className="text-muted-foreground text-xs font-bold uppercase">
                Status
              </p>
              <p className="font-bold capitalize">{giftCard.status}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border p-4">
            <Clock className="text-blue-500" size={24} />
            <div>
              <p className="text-muted-foreground text-xs font-bold uppercase">
                Validity
              </p>
              <p className="font-bold">{giftCard.validityDays} Days</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 sm:flex-row">
          <Button
            onClick={() => handleAddToCart(false)}
            disabled={isAdding || giftCard.status !== 'active'}
            className="bg-card hover:bg-muted text-foreground h-14 flex-1 rounded-full border text-base font-bold transition-all active:scale-95"
          >
            Add to Cart
          </Button>
          <Button
            onClick={() => handleAddToCart(true)}
            disabled={isAdding || giftCard.status !== 'active'}
            className="h-14 flex-1 rounded-full bg-blue-600 text-base font-bold text-white transition-all hover:bg-blue-700 active:scale-95"
          >
            Buy Now
          </Button>
        </div>

        {giftCard.status !== 'active' && (
          <p className="text-center text-sm font-bold text-red-500">
            This gift card is currently unavailable.
          </p>
        )}
      </div>
    </div>
  );
}
