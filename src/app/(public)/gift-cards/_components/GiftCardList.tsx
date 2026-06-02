'use client';

import { useCart } from '@/context/CartContext';
import { IGiftCard } from '@/services/giftcard/giftcard';
import { IProduct } from '@/types';
import { ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import EmptyGiftCards from './EmptyGiftCards';
import GiftCardHEader from './GiftCardHEader';

export default function GiftCardList({
  giftCards,
}: {
  giftCards: IGiftCard[];
}) {
  const { addToCart } = useCart();

  const handleAddToCart = (giftCard: IGiftCard) => {
    const salePrice =
      giftCard.discountPercentage > 0
        ? giftCard.price * (1 - giftCard.discountPercentage / 100)
        : giftCard.price;

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
    } as IProduct;

    addToCart(mappedProduct);
    toast.success('Gift Card added to cart');
  };

  if (giftCards.length === 0) {
    return <EmptyGiftCards />;
  }

  return (
    <div>
      <GiftCardHEader />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {giftCards.map((card) => {
          const salePrice =
            card.discountPercentage > 0
              ? card.price * (1 - card.discountPercentage / 100)
              : card.price;

          return (
            <div
              key={card._id}
              className="group bg-card relative flex flex-col overflow-hidden rounded-3xl border transition-all hover:shadow-xl hover:shadow-blue-500/10"
            >
              <Link
                href={`/gift-cards/${card.slug || card._id}`}
                className="relative aspect-[16/9] w-full overflow-hidden"
              >
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {card.discountPercentage > 0 && (
                  <div className="absolute top-4 right-4 rounded-full bg-red-500 px-3 py-1 text-xs font-black text-white">
                    -{card.discountPercentage}%
                  </div>
                )}
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <Link href={`/gift-cards/${card.slug || card._id}`}>
                  <h3 className="text-xl font-bold transition-colors group-hover:text-blue-600">
                    {card.name}
                  </h3>
                </Link>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black">
                    ৳{salePrice.toFixed(2)}
                  </span>
                  {card.discountPercentage > 0 && (
                    <span className="text-muted-foreground text-sm font-medium line-through">
                      ৳{card.price.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => handleAddToCart(card)}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-95"
                  >
                    <ShoppingBag size={18} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
