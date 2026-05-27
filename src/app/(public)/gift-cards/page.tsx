import { getGiftCards } from '@/services/giftcard/giftcard';
import { Metadata } from 'next';
import GiftCardList from './_components/GiftCardList';

export default async function GiftCardsPage() {
  const { data } = await getGiftCards({ status: 'active' });

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4">
        <GiftCardList giftCards={data || []} />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Gift Cards | Aranis',
  description: 'Purchase an Aranis Gift Card for your loved ones.',
};
