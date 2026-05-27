import Container from '@/components/ui/Container';
import { getGiftCards } from '@/services/giftcard/giftcard';
import { Metadata } from 'next';
import GiftCardList from './_components/GiftCardList';

export default async function GiftCardsPage() {
  const { data } = await getGiftCards({ status: 'active' });

  return (
    <Container className="py-20 lg:py-32">
      <GiftCardList giftCards={data || []} />
    </Container>
  );
}

export const metadata: Metadata = {
  title: 'Gift Cards | Aranis',
  description: 'Purchase an Aranis Gift Card for your loved ones.',
};
